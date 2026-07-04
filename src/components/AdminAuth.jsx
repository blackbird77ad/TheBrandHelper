/**
 * AdminAuth.jsx — Server-backed PIN authentication
 * PIN hashes stored in MongoDB. Works on every device.
 * No localStorage for security data — only sessionStorage for active session.
 *
 * Flows:
 *   First visit (any device): Setup screen → set PIN + Master PIN → hashes sent to server
 *   Returning visit:          Login screen → enter PIN → server verifies → session starts
 *   Forgot PIN:               Enter Master PIN → server verifies → set new PIN
 *   Forgot Master PIN:        Emergency reset via ADMIN_SECRET (server-side wipe)
 *   Logout:                   Clears sessionStorage → back to login screen
 */

import React, { useState, useEffect } from "react";
import bcrypt from "bcryptjs";

const SESSION_KEY   = "tbh_admin_session";
const SALT_ROUNDS   = 10;
const MAX_ATTEMPTS  = 5;
const LOCKOUT_MS    = 15 * 60 * 1000;
const ATTEMPT_KEY   = "tbh_fail_count";
const LOCKOUT_KEY   = "tbh_lockout_until";

const BASE          = import.meta.env.VITE_API_URL || "http://localhost:4000";

// ── Session helpers (sessionStorage only — clears on tab close) ───────────────
const isSession  = () => sessionStorage.getItem(SESSION_KEY) === "1";
const startSession = () => sessionStorage.setItem(SESSION_KEY, "1");
const endSession   = () => sessionStorage.removeItem(SESSION_KEY);

// ── Lockout helpers (sessionStorage — resets when browser closes) ─────────────
function getAttempts()   { return parseInt(sessionStorage.getItem(ATTEMPT_KEY) || "0"); }
function addAttempt()    { sessionStorage.setItem(ATTEMPT_KEY, String(getAttempts() + 1)); }
function clearAttempts() { sessionStorage.removeItem(ATTEMPT_KEY); sessionStorage.removeItem(LOCKOUT_KEY); }
function isLockedOut()   {
  const until = sessionStorage.getItem(LOCKOUT_KEY);
  if (!until) return false;
  if (Date.now() < parseInt(until)) return true;
  clearAttempts(); return false;
}
function lockOut()       { sessionStorage.setItem(LOCKOUT_KEY, String(Date.now() + LOCKOUT_MS)); }
function getLockoutMins(){ return Math.ceil((parseInt(sessionStorage.getItem(LOCKOUT_KEY)||"0") - Date.now()) / 60000); }

// ── Server calls ──────────────────────────────────────────────────────────────
async function apiGet(path) {
  const r = await fetch(`${BASE}${path}`);
  return r.json();
}
async function apiPost(path, body) {
  const r = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return r.json();
}

// ── Tiny UI pieces ────────────────────────────────────────────────────────────
function BrandHeader({ sub }) {
  return (
    <div className="text-center mb-6">
      <p className="text-2xl font-extrabold tracking-tight">
        The Brand<span className="text-red-600">Helper</span>
      </p>
      <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest">{sub || "Admin Portal"}</p>
    </div>
  );
}

function PinDots({ length, error }) {
  return (
    <div className="flex gap-3 justify-center my-4">
      {[0,1,2,3,4,5].map(i => (
        <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all duration-150
          ${length > i
            ? error ? "bg-red-500 border-red-500" : "bg-black border-black"
            : "border-gray-300 bg-transparent"
          }`}
        />
      ))}
    </div>
  );
}

function NumPad({ onDigit, onDelete, onSubmit, label, disabled }) {
  const keys = [1,2,3,4,5,6,7,8,9,null,0,"⌫"];
  return (
    <div className="w-full">
      <p className="text-center text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">{label}</p>
      <div className="grid grid-cols-3 gap-2.5">
        {keys.map((k, i) => {
          if (k === null) return <div key={i} />;
          const isDel = k === "⌫";
          return (
            <button key={i} disabled={disabled}
              onClick={() => isDel ? onDelete() : onDigit(String(k))}
              className={`h-14 rounded-2xl text-lg font-bold transition active:scale-95
                ${isDel ? "bg-gray-100 text-gray-500 hover:bg-gray-200" : "bg-gray-50 text-black hover:bg-gray-100"}
                disabled:opacity-30 disabled:cursor-not-allowed`}>
              {k}
            </button>
          );
        })}
        <button disabled={disabled} onClick={onSubmit}
          className="col-span-3 h-12 rounded-2xl bg-black text-white font-extrabold text-sm
            hover:bg-red-600 transition active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed mt-1">
          {label}
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SETUP SCREEN — runs once on first ever visit across all devices
// ══════════════════════════════════════════════════════════════════════════════
function SetupScreen({ onDone }) {
  const STEPS = ["Set Admin PIN", "Confirm Admin PIN", "Set Master PIN", "Confirm Master PIN"];
  const [step,    setStep]    = useState(0);
  const [pins,    setPins]    = useState(["","","",""]);
  const [error,   setError]   = useState("");
  const [saving,  setSaving]  = useState(false);

  const current = pins[step];
  const setVal  = v => setPins(p => { const n=[...p]; n[step]=v; return n; });

  const handleDigit  = d => { if (current.length < 6) setVal(current + d); };
  const handleDelete = ()  => setVal(current.slice(0, -1));

  const handleNext = async () => {
    setError("");
    if (current.length < 4) { setError("Minimum 4 digits"); return; }

    // Confirm steps — check match
    if (step === 1 && current !== pins[0]) { setError("PINs don't match — try again"); setVal(""); return; }
    if (step === 3 && current !== pins[2]) { setError("Master PINs don't match — try again"); setVal(""); return; }

    if (step < 3) { setStep(s => s + 1); return; }

    // Final step — hash both and send to server
    setSaving(true);
    try {
      const [pin_hash, master_hash] = await Promise.all([
        bcrypt.hash(pins[0], SALT_ROUNDS),
        bcrypt.hash(pins[2], SALT_ROUNDS),
      ]);
      const res = await apiPost("/api/auth/setup", { pin_hash, master_hash });
      if (!res.success) { setError(res.error || "Setup failed"); setSaving(false); return; }
      startSession();
      onDone();
    } catch (e) {
      setError("Server error — is the server running?");
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 py-10">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
        <BrandHeader sub="First time setup" />

        {/* Progress */}
        <div className="flex gap-1.5 justify-center mb-6">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i <= step ? "bg-red-600 w-8" : "bg-gray-200 w-3"}`} />
          ))}
        </div>

        <PinDots length={current.length} error={!!error} />
        {error && <p className="text-red-500 text-xs text-center font-bold mb-3">{error}</p>}

        <NumPad
          onDigit={handleDigit}
          onDelete={handleDelete}
          onSubmit={handleNext}
          label={saving ? "Saving..." : step === 3 ? "Save & Unlock →" : "Next →"}
          disabled={saving}
        />

        <p className="text-xs text-gray-400 text-center mt-5 leading-relaxed">
          Admin PIN unlocks daily access. Master PIN resets the Admin PIN if forgotten.
          Both stored as secure hashes in your database — never in plaintext.
        </p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// LOGIN SCREEN
// ══════════════════════════════════════════════════════════════════════════════
function LoginScreen({ onUnlock }) {
  const [pin,        setPin]        = useState("");
  const [mode,       setMode]       = useState("pin"); // "pin" | "master"
  const [error,      setError]      = useState("");
  const [checking,   setChecking]   = useState(false);
  const [locked,     setLocked]     = useState(isLockedOut);

  // New PIN after master verify
  const [resetStep,  setResetStep]  = useState(0); // 0=off, 1=new, 2=confirm
  const [newPin,     setNewPin]     = useState("");
  const [newConf,    setNewConf]    = useState("");

  useEffect(() => {
    if (!locked) return;
    const id = setInterval(() => { if (!isLockedOut()) { setLocked(false); clearInterval(id); } }, 15000);
    return () => clearInterval(id);
  }, [locked]);

  const handleDigit  = d => { if (pin.length < 6) setPin(p => p + d); };
  const handleDelete = ()  => setPin(p => p.slice(0, -1));

  const attempt = async () => {
    if (locked || checking) return;
    if (pin.length < 4) { setError("Enter at least 4 digits"); return; }
    setChecking(true); setError("");
    try {
      const res = await apiPost("/api/auth/verify", { pin });
      if (res.success) {
        clearAttempts();
        if (res.type === "master") {
          // Master PIN — go to reset flow
          setResetStep(1); setPin(""); setChecking(false); return;
        }
        startSession();
        onUnlock();
      } else {
        addAttempt();
        const left = MAX_ATTEMPTS - getAttempts();
        if (left <= 0) { lockOut(); setLocked(true); setError(`Too many attempts. Locked ${getLockoutMins()} min.`); }
        else           { setError(`Incorrect PIN. ${left} attempt${left !== 1 ? "s" : ""} left.`); }
        setPin("");
      }
    } catch (e) { setError("Server unreachable — check connection"); }
    setChecking(false);
  };

  // ── New PIN reset flow after master verified ──────────────────────────────
  const newDigit  = d => {
    if (resetStep === 1 && newPin.length  < 6) setNewPin(p  => p + d);
    if (resetStep === 2 && newConf.length < 6) setNewConf(p => p + d);
  };
  const newDelete = () => {
    if (resetStep === 1) setNewPin(p  => p.slice(0,-1));
    if (resetStep === 2) setNewConf(p => p.slice(0,-1));
  };
  const newSubmit = async () => {
    setError("");
    const val = resetStep === 1 ? newPin : newConf;
    if (val.length < 4) { setError("Minimum 4 digits"); return; }
    if (resetStep === 1) { setResetStep(2); return; }
    if (newPin !== newConf) { setError("PINs don't match"); setNewConf(""); setResetStep(1); return; }
    setChecking(true);
    try {
      const new_pin_hash = await bcrypt.hash(newPin, SALT_ROUNDS);
      // Need to re-verify master to send reset — ask for master again inline
      // Actually we need the raw master PIN to send to server for verification
      // We stored it in a ref during verification — use a different approach:
      // Server /api/auth/reset-pin needs the raw master PIN for bcrypt compare
      // We don't have it anymore — use a one-time token approach instead
      // Simpler: store master PIN temporarily in memory during this flow
      setError("Use the reset flow below — enter master PIN again with new PIN");
      setResetStep(0); setNewPin(""); setNewConf(""); setChecking(false);
    } catch(e) { setError("Error"); setChecking(false); }
  };

  if (resetStep > 0) {
    return <ResetPinFlow onDone={() => { startSession(); onUnlock(); }} onCancel={() => { setResetStep(0); setMode("pin"); setPin(""); }} />;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 py-10">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
        <BrandHeader />

        {/* Mode toggle */}
        <div className="flex gap-2 justify-center mb-5">
          {[["pin","Admin PIN"],["master","Forgot PIN?"]].map(([m, label]) => (
            <button key={m} onClick={() => { setMode(m); setPin(""); setError(""); }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition
                ${mode === m ? "bg-black text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
              {label}
            </button>
          ))}
        </div>

        {locked ? (
          <div className="text-center py-8">
            <p className="text-5xl mb-3">🔒</p>
            <p className="text-red-600 font-extrabold">Locked</p>
            <p className="text-gray-400 text-sm mt-2">Too many failed attempts.</p>
            <p className="text-gray-400 text-sm">Try again in ~{getLockoutMins()} min.</p>
          </div>
        ) : (
          <>
            <PinDots length={pin.length} error={!!error} />
            {error && <p className="text-red-500 text-xs text-center font-bold mb-3">{error}</p>}
            <NumPad
              onDigit={handleDigit}
              onDelete={handleDelete}
              onSubmit={attempt}
              label={checking ? "Checking..." : mode === "master" ? "Verify Master →" : "Unlock →"}
              disabled={checking || locked}
            />
          </>
        )}
      </div>
    </div>
  );
}

// ── Reset PIN flow — enter master PIN + new PIN in one form ───────────────────
function ResetPinFlow({ onDone, onCancel }) {
  const STEPS = ["Enter Master PIN", "Set New Admin PIN", "Confirm New Admin PIN"];
  const [step,    setStep]    = useState(0);
  const [vals,    setVals]    = useState(["","",""]);
  const [error,   setError]   = useState("");
  const [saving,  setSaving]  = useState(false);

  const current = vals[step];
  const setVal  = v => setVals(p => { const n=[...p]; n[step]=v; return n; });
  const digit   = d => { if (current.length < 6) setVal(current + d); };
  const del     = ()  => setVal(current.slice(0,-1));

  const next = async () => {
    setError("");
    if (current.length < 4) { setError("Minimum 4 digits"); return; }
    if (step === 2 && current !== vals[1]) { setError("PINs don't match"); setVal(""); return; }
    if (step < 2)  { setStep(s => s+1); return; }

    // Step 2 done — send to server
    setSaving(true);
    try {
      const new_pin_hash = await bcrypt.hash(vals[1], SALT_ROUNDS);
      const res = await apiPost("/api/auth/reset-pin", {
        master_pin:  vals[0],
        new_pin_hash,
      });
      if (!res.success) { setError(res.error || "Reset failed"); setSaving(false); return; }
      clearAttempts();
      onDone();
    } catch(e) { setError("Server error"); setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 py-10">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
        <BrandHeader sub="Reset Admin PIN" />
        <div className="flex gap-1.5 justify-center mb-6">
          {STEPS.map((_,i) => <div key={i} className={`h-1.5 rounded-full transition-all ${i<=step?"bg-red-600 w-8":"bg-gray-200 w-3"}`}/>)}
        </div>
        <PinDots length={current.length} error={!!error} />
        {error && <p className="text-red-500 text-xs text-center font-bold mb-3">{error}</p>}
        <NumPad onDigit={digit} onDelete={del} onSubmit={next}
          label={saving ? "Saving..." : step === 2 ? "Save New PIN →" : "Next →"}
          disabled={saving}
        />
        <button onClick={onCancel} className="w-full mt-4 text-xs text-gray-400 hover:text-black font-bold transition">
          Cancel
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// LOGOUT BUTTON
// ══════════════════════════════════════════════════════════════════════════════
export function LogoutButton({ onLogout }) {
  const [confirm, setConfirm] = useState(false);
  if (confirm) return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-white/70">Log out?</span>
      <button onClick={() => { endSession(); onLogout(); }}
        className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition">
        Yes
      </button>
      <button onClick={() => setConfirm(false)}
        className="px-3 py-1.5 bg-white/10 text-white text-xs font-bold rounded-lg hover:bg-white/20 transition">
        No
      </button>
    </div>
  );
  return (
    <button onClick={() => setConfirm(true)}
      className="px-3 py-1.5 bg-white/10 text-white/70 text-xs font-bold rounded-lg hover:bg-white/20 hover:text-white transition">
      🔒 Logout
    </button>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN WRAPPER
// ══════════════════════════════════════════════════════════════════════════════
export default function AdminAuth({ children }) {
  const [status, setStatus] = useState("loading"); // loading | setup | locked | unlocked

  useEffect(() => {
    if (isSession()) { setStatus("unlocked"); return; }

    // Timeout after 6 seconds — fall through to login screen
    const timeout = setTimeout(() => setStatus("locked"), 6000);

    apiGet("/api/auth/status")
      .then(res => {
        clearTimeout(timeout);
        setStatus(res.configured ? "locked" : "setup");
      })
      .catch(() => {
        clearTimeout(timeout);
        setStatus("locked");
      });

    return () => clearTimeout(timeout);
  }, []);

  if (status === "loading") return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <p className="text-2xl font-extrabold text-white">
          The Brand<span className="text-red-600">Helper</span>
        </p>
        <p className="text-gray-500 text-xs mt-2 uppercase tracking-widest">Loading...</p>
      </div>
    </div>
  );

  if (status === "setup")    return <SetupScreen  onDone={()    => setStatus("unlocked")} />;
  if (status === "locked")   return <LoginScreen  onUnlock={()  => setStatus("unlocked")} />;
  return children({ onLogout: () => setStatus("locked") });
}