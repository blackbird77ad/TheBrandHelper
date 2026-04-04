// ── CSV Import ────────────────────────────────────────────────────────────────
function parseCSV(text) {
  const lines = text.trim().split("\n").filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map(h => h.replace(/["\'\r]/g, "").trim().toLowerCase().replace(/ \*/g, ""));
  return lines.slice(1).map(line => {
    const vals = [];
    let cur = "", inQ = false;
    for (const ch of line) {
      if (ch === '"') { inQ = !inQ; continue; }
      if (ch === "," && !inQ) { vals.push(cur.trim()); cur = ""; continue; }
      cur += ch;
    }
    vals.push(cur.trim());
    const obj = {};
    headers.forEach((h, i) => { if (h) obj[h] = vals[i] || ""; });
    return obj;
  }).filter(r => r.business_name);
}

/**
 * ProspectTab.jsx — Google Maps Lead Research + CRM Tracking
 * Place in: src/components/ProspectTab.jsx
 * Import and add as a tab in Admin.jsx
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import * as api from "../utils/api";

// ── Constants ─────────────────────────────────────────────────────────────────
const COUNTRIES = ["Ghana","USA","UK","Germany","Dubai / UAE","Canada","Australia","South Africa","Nigeria","Kenya","Other"];

const NICHES = [
  "Oil and Gas","Construction","Real Estate","Law Firm","Accounting / Finance",
  "Insurance","Healthcare / Clinic","Hotel / Hospitality","Consulting",
  "HR Consulting","Logistics / Freight","Security","Cleaning / Laundry",
  "Event Planning","Wedding","Catering / Food","Interior Design","Architecture",
  "Engineering","Travel Agency","Driving School","Immigration Consulting",
  "Restaurant","Bakery","Fashion / Clothing","Beauty / Salon","Spa / Wellness",
  "Pharmacy","Electronics","Furniture","Supermarket / Retail","Gym / Fitness",
  "Photography","Printing / Branding","School","University / College",
  "Vocational Training","Tutoring","Daycare / Nursery","Other",
];

const WEBSITE_STATUS = [
  { value: "no_website",   label: "No website",    color: "bg-red-100 text-red-700"    },
  { value: "has_website",  label: "Has website",   color: "bg-green-100 text-green-700"},
  { value: "coming_soon",  label: "Coming soon",   color: "bg-yellow-100 text-yellow-700"},
  { value: "broken",       label: "Broken site",   color: "bg-orange-100 text-orange-700"},
  { value: "unknown",      label: "Unknown",       color: "bg-gray-100 text-gray-500"  },
];

const OUTREACH_STATUS = [
  { value: "not_contacted",  label: "Not contacted",  color: "bg-gray-100 text-gray-500"    },
  { value: "contacted",      label: "Contacted",      color: "bg-blue-100 text-blue-700"    },
  { value: "replied",        label: "Replied",        color: "bg-yellow-100 text-yellow-700"},
  { value: "call_booked",    label: "Call booked",    color: "bg-purple-100 text-purple-700"},
  { value: "proposal_sent",  label: "Proposal sent",  color: "bg-indigo-100 text-indigo-700"},
  { value: "converted",      label: "Converted ✓",   color: "bg-green-100 text-green-700"  },
  { value: "not_interested", label: "Not interested", color: "bg-red-100 text-red-600"      },
  { value: "no_response",    label: "No response",    color: "bg-gray-100 text-gray-400"    },
];

const TAGS = [
  { value: "this_week",  label: "This week",  color: "bg-red-600 text-white"         },
  { value: "this_month", label: "This month", color: "bg-blue-600 text-white"        },
  { value: "this_year",  label: "This year",  color: "bg-gray-600 text-white"        },
  { value: "backlog",    label: "Backlog",    color: "bg-gray-200 text-gray-600"     },
  { value: "",           label: "No tag",     color: "bg-gray-100 text-gray-400"     },
];

const CHANNELS = ["whatsapp","email","call","in_person","linkedin",""];

const KEYWORDS = {
  "Oil and Gas":       ["oil company","petroleum company","energy company","oil and gas services","LPG company","lubricants supplier","fuel supplier","upstream oil","downstream petroleum"],
  "Construction":      ["construction company","building contractor","civil engineering","road construction","property developer","building firm"],
  "Real Estate":       ["real estate developer","property developer","estate agency","property management","real estate agent","apartment developer"],
  "Law Firm":          ["law firm","solicitor","legal services","lawyer","barrister","corporate law"],
  "Accounting / Finance":["accounting firm","audit firm","tax consultant","chartered accountant","bookkeeping service","financial advisory"],
  "Insurance":         ["insurance company","insurance broker","life insurance","general insurance","health insurance broker"],
  "Healthcare / Clinic":["clinic","hospital","dental clinic","medical laboratory","optician","physiotherapy","specialist hospital","fertility clinic","pharmacy"],
  "Hotel / Hospitality":["hotel","guesthouse","serviced apartment","lodge","resort","boutique hotel","short stay apartment"],
  "Consulting":        ["consulting firm","management consultant","business consultant","advisory firm","strategy consulting"],
  "HR Consulting":     ["HR consulting","recruitment agency","staffing company","human resource firm","talent acquisition","payroll service"],
  "Logistics / Freight":["logistics company","courier service","delivery company","freight company","shipping company","cargo company","clearing agent"],
  "Security":          ["security company","security guard company","private security firm","CCTV installation"],
  "Cleaning / Laundry":["cleaning company","cleaning service","laundry service","commercial cleaning","post construction cleaning"],
  "Event Planning":    ["event planner","event management company","event organiser","corporate events"],
  "Catering / Food":   ["catering company","catering service","food service","corporate catering","event catering","food delivery"],
  "Interior Design":   ["interior decorator","interior designer","home decorator","interior design firm","luxury interior"],
  "Architecture":      ["architect","architectural firm","building design","quantity surveyor","structural engineer"],
  "Logistics / Freight":["logistics company","courier service","delivery company","freight company"],
  "Restaurant":        ["restaurant","chop bar","eatery","food court","canteen","fast food","fine dining","takeaway"],
  "Fashion / Clothing":["fashion brand","clothing boutique","clothing store","fashion designer","African print","boutique"],
  "Beauty / Salon":    ["beauty salon","hair salon","nail salon","barbershop","hair vendor","natural hair salon","lash studio"],
  "Photography":       ["photography studio","photographer","videographer","content creator","wedding photographer"],
  "Printing / Branding":["printing company","print shop","signage company","branding company","digital printing","branded merchandise"],
  "School":            ["private school","international school","secondary school","preparatory school","boarding school"],
};

const LOCATIONS = {
  "Ghana":       ["Accra Ghana","Osu Accra Ghana","East Legon Accra Ghana","Cantonments Accra Ghana","Airport Residential Accra","Spintex Accra Ghana","Labone Accra Ghana","Tema Ghana","Kumasi Ghana","Takoradi Ghana"],
  "USA":         ["New York USA","Los Angeles USA","Houston USA","Atlanta USA","Washington DC USA","Chicago USA","Dallas USA","Miami USA"],
  "UK":          ["London UK","Manchester UK","Birmingham UK","Leeds UK","Glasgow UK","Bristol UK"],
  "Germany":     ["Berlin Germany","Munich Germany","Hamburg Germany","Frankfurt Germany","Cologne Germany","Dusseldorf Germany"],
  "Dubai / UAE": ["Dubai UAE","Abu Dhabi UAE","Sharjah UAE","Dubai Business Bay","Dubai Downtown","Dubai Marina"],
  "Canada":      ["Toronto Canada","Vancouver Canada","Calgary Canada","Ottawa Canada","Montreal Canada"],
  "Australia":   ["Sydney Australia","Melbourne Australia","Brisbane Australia","Perth Australia"],
  "South Africa":["Johannesburg South Africa","Cape Town South Africa","Durban South Africa","Pretoria South Africa"],
  "Nigeria":     ["Lagos Nigeria","Abuja Nigeria","Port Harcourt Nigeria","Ibadan Nigeria"],
  "Kenya":       ["Nairobi Kenya","Mombasa Kenya"],
};

const inp = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-800 transition-all bg-white";
const sel = `${inp} cursor-pointer`;

function Badge({ value, options }) {
  const opt = options.find(o => o.value === value) || options[0];
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${opt?.color || "bg-gray-100 text-gray-500"}`}>{opt?.label || value}</span>;
}

function waLink(phone) {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.startsWith("0") ? "233" + digits.slice(1) : digits;
  return `https://wa.me/${normalized}`;
}

// ── CSV export ────────────────────────────────────────────────────────────────
function exportCSV(prospects) {
  const headers = ["Business Name","Niche","Country","Location","What They Do","Phone","Email","Website","Google Rating","Reviews","Website Status","Outreach Status","Tag","Estimated Value","Comment","Maps URL"];
  const rows = prospects.map(p => [
    p.business_name, p.niche, p.country, p.location, p.what_they_do,
    p.phone, p.email, p.website, p.google_rating, p.google_reviews,
    p.website_status, p.outreach_status, p.tag, p.estimated_value,
    p.comment, p.maps_url,
  ].map(v => `"${String(v || "").replace(/"/g, '""')}"`));

  const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = `TBH_Prospects_${new Date().toISOString().slice(0,10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
}

// ── WhatsApp bulk export ──────────────────────────────────────────────────────
function exportWhatsApp(prospects) {
  const lines = prospects.filter(p => p.phone).map(p =>
    `*${p.business_name}*\n${p.niche || ""} · ${p.location || ""}\n${waLink(p.phone)}`
  );
  const text = lines.join("\n\n");
  const blob = new Blob([text], { type: "text/plain" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = "TBH_WhatsApp_Contacts.txt";
  a.click(); URL.revokeObjectURL(url);
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
export default function ProspectTab({ onError }) {
  const [view,       setView]       = useState("list");   // list | search | add | detail
  const [prospects,  setProspects]  = useState([]);
  const [selected,   setSelected]   = useState([]);       // ids for bulk actions
  const [loading,    setLoading]    = useState(false);
  const [detail,     setDetail]     = useState(null);
  const [filters,    setFilters]    = useState({ status: "", tag: "", country: "", website: "", search: "" });
  const [saving,     setSaving]     = useState(false);
  const [form,       setForm]       = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status)  params.status         = filters.status;
      if (filters.tag)     params.tag            = filters.tag;
      if (filters.country) params.country        = filters.country;
      if (filters.website) params.website_status = filters.website;
      const res = await api.getProspects(Object.keys(params).length ? params : undefined);
      setProspects(res.data);
    } catch (e) { onError(e.message); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const EMPTY_FORM = {
    business_name:"", niche:"", country:"Ghana", location:"", address:"", what_they_do:"",
    phone:"", email:"", website:"", maps_url:"", social:"",
    google_rating:"", google_reviews:0, website_status:"unknown",
    google_added:"", estimated_value:"",
    outreach_status:"not_contacted", outreach_channel:"", outreach_date:"",
    follow_up_date:"", outcome:"", comment:"", tag:"this_week", source_keyword:"",
  };

  const openAdd  = ()     => { setForm(EMPTY_FORM); setView("add"); };
  const fileInputRef = useRef(null);

  const handleCSVImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const rows = parseCSV(text);
    if (rows.length === 0) { onError("No valid rows found in CSV"); return; }
    setLoading(true);
    try {
      const res = await api.bulkImportProspects(rows);
      await load();
      alert(`Imported ${res.data.inserted} prospects successfully!`);
    } catch(err) { onError(err.message); }
    finally { setLoading(false); e.target.value = ""; }
  };
  const openEdit = (p)    => { setForm({...p, outreach_date: p.outreach_date ? p.outreach_date.slice(0,10) : "", follow_up_date: p.follow_up_date ? p.follow_up_date.slice(0,10) : ""}); setView("add"); };
  const setF     = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const saveProspect = async () => {
    if (!form.business_name) return;
    setSaving(true);
    try {
      if (form._id) await api.updateProspect(form._id, form);
      else          await api.createProspect(form);
      await load();
      setView("list");
    } catch (e) { onError(e.message); }
    finally { setSaving(false); }
  };

  const deleteProspect = async (id) => {
    try { await api.deleteProspect(id); await load(); setDetail(null); setView("list"); }
    catch (e) { onError(e.message); }
  };

  const convertToLead = async (id) => {
    try {
      await api.convertProspect(id);
      await load();
      onError(""); // clear errors
      alert("Converted to lead! Check the Leads tab.");
    } catch (e) { onError(e.message); }
  };

  const updateStatus = async (id, field, value) => {
    try {
      await api.updateProspect(id, { [field]: value });
      setProspects(p => p.map(x => x._id === id ? { ...x, [field]: value } : x));
      if (detail?._id === id) setDetail(d => ({ ...d, [field]: value }));
    } catch (e) { onError(e.message); }
  };

  // Filtered + searched list
  const filtered = prospects.filter(p => {
    if (!filters.search) return true;
    const q = filters.search.toLowerCase();
    return `${p.business_name} ${p.niche} ${p.location} ${p.country} ${p.phone}`.toLowerCase().includes(q);
  });

  const allSelected  = filtered.length > 0 && selected.length === filtered.length;
  const toggleAll    = () => setSelected(allSelected ? [] : filtered.map(p => p._id));
  const toggleOne    = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const selectedData = prospects.filter(p => selected.includes(p._id));

  // ── Stats row ────────────────────────────────────────────────────────────────
  const stats = {
    total:         prospects.length,
    no_website:    prospects.filter(p => p.website_status === "no_website").length,
    not_contacted: prospects.filter(p => p.outreach_status === "not_contacted").length,
    this_week:     prospects.filter(p => p.tag === "this_week").length,
    converted:     prospects.filter(p => p.outreach_status === "converted").length,
  };

  // ── VIEWS ─────────────────────────────────────────────────────────────────────

  if (view === "search") return <SearchView onBack={() => setView("list")} onAdd={async (p) => { try { await api.createProspect(p); await load(); } catch(e){ onError(e.message); } }} onError={onError} />;

  if (view === "add") return <ProspectForm form={form} setF={setF} onSave={saveProspect} onCancel={() => setView("list")} saving={saving} isEdit={!!form._id} />;

  if (detail) return <ProspectDetail prospect={detail} onBack={() => setDetail(null)} onEdit={() => { openEdit(detail); }} onDelete={() => deleteProspect(detail._id)} onConvert={() => convertToLead(detail._id)} onUpdateStatus={updateStatus} onError={onError} onReload={load} />;

  // ── LIST VIEW ─────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-extrabold">Prospect Research</h2>
          <p className="text-xs text-gray-400 mt-0.5">Find, track, and convert businesses found on Google Maps and beyond</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setView("search")}
            className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition">
            Search Google Maps
          </button>
          <button onClick={openAdd}
            className="px-4 py-2 border border-gray-200 text-xs font-bold rounded-xl hover:border-black transition">
            + Add Manually
          </button>
          <button onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 border border-gray-200 text-xs font-bold rounded-xl hover:border-black transition">
            Import CSV
          </button>
          <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleCSVImport} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
        {[
          { label: "Total prospects", value: stats.total,         color: "text-black"        },
          { label: "No website",      value: stats.no_website,    color: "text-red-600"      },
          { label: "Not contacted",   value: stats.not_contacted, color: "text-gray-500"     },
          { label: "This week",       value: stats.this_week,     color: "text-blue-600"     },
          { label: "Converted",       value: stats.converted,     color: "text-green-600"    },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-4 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-40">
          <p className="text-xs text-gray-400 mb-1">Search</p>
          <input className={inp} placeholder="Business name, location..." value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))} />
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Country</p>
          <select className={sel} value={filters.country} onChange={e => setFilters(f => ({ ...f, country: e.target.value }))}>
            <option value="">All countries</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Website</p>
          <select className={sel} value={filters.website} onChange={e => setFilters(f => ({ ...f, website: e.target.value }))}>
            <option value="">All</option>
            {WEBSITE_STATUS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Outreach</p>
          <select className={sel} value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
            <option value="">All</option>
            {OUTREACH_STATUS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Tag</p>
          <select className={sel} value={filters.tag} onChange={e => setFilters(f => ({ ...f, tag: e.target.value }))}>
            <option value="">All</option>
            {TAGS.filter(t => t.value).map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <button onClick={load} className="px-4 py-2.5 border border-gray-200 text-xs font-bold rounded-xl hover:border-black transition">↻</button>
      </div>

      {/* Bulk actions */}
      {selected.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl px-4 py-3 mb-4 flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-blue-700">{selected.length} selected</span>
          <button onClick={() => exportCSV(selectedData)}
            className="px-3 py-1.5 bg-white border border-blue-200 text-blue-700 text-xs font-bold rounded-lg hover:bg-blue-100 transition">
            Export CSV
          </button>
          <button onClick={() => exportWhatsApp(selectedData)}
            className="px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-lg hover:bg-green-600 transition">
            Export WhatsApp contacts
          </button>
          <button onClick={() => {
            TAGS.filter(t => t.value).forEach(t => {});
          }}>
          </button>
          {TAGS.filter(t => t.value).map(t => (
            <button key={t.value} onClick={async () => {
              try { await Promise.all(selected.map(id => api.updateProspect(id, { tag: t.value }))); await load(); setSelected([]); }
              catch(e) { onError(e.message); }
            }} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${t.color}`}>
              Tag: {t.label}
            </button>
          ))}
          <button onClick={() => setSelected([])} className="ml-auto text-xs text-gray-400 hover:text-black font-bold transition">✕ Clear</button>
        </div>
      )}

      {/* Export all */}
      <div className="flex gap-2 mb-4 justify-end flex-wrap">
        <button onClick={() => exportCSV(filtered)} className="text-xs text-gray-400 hover:text-black font-bold transition">
          Export {filtered.length} as CSV
        </button>
        <button onClick={() => exportWhatsApp(filtered)} className="text-xs text-green-600 hover:text-green-800 font-bold transition">
          Export WhatsApp list
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-2xl p-10 text-center text-gray-400">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-gray-300">
          <p className="text-5xl mb-3">🔍</p>
          <p className="text-gray-400 font-semibold">No prospects yet</p>
          <p className="text-gray-300 text-sm mt-1">Use Search Google Maps to find businesses or add manually</p>
          <div className="flex gap-3 justify-center mt-5">
            <button onClick={() => setView("search")} className="px-5 py-2.5 bg-red-600 text-white text-xs font-bold rounded-xl">Search Google Maps</button>
            <button onClick={openAdd} className="px-5 py-2.5 border border-gray-200 text-xs font-bold rounded-xl">Add Manually</button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="p-3 w-8"><input type="checkbox" checked={allSelected} onChange={toggleAll} className="w-4 h-4 accent-red-600"/></th>
                  <th className="p-3 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Business</th>
                  <th className="p-3 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Location</th>
                  <th className="p-3 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Website</th>
                  <th className="p-3 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Outreach</th>
                  <th className="p-3 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Tag</th>
                  <th className="p-3 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Value</th>
                  <th className="p-3 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p._id} className={`border-b border-gray-50 hover:bg-gray-50 transition ${i % 2 === 0 ? "" : "bg-gray-50/30"}`}>
                    <td className="p-3"><input type="checkbox" checked={selected.includes(p._id)} onChange={() => toggleOne(p._id)} className="w-4 h-4 accent-red-600"/></td>
                    <td className="p-3 cursor-pointer" onClick={() => setDetail(p)}>
                      <p className="font-semibold text-sm text-black hover:text-red-600 transition">{p.business_name}</p>
                      <p className="text-xs text-gray-400">{p.niche}</p>
                      {p.google_rating && <p className="text-xs text-yellow-600 font-bold">★ {p.google_rating} ({p.google_reviews})</p>}
                    </td>
                    <td className="p-3">
                      <p className="text-xs text-gray-600">{p.country}</p>
                      <p className="text-xs text-gray-400">{p.location}</p>
                    </td>
                    <td className="p-3">
                      <select className="text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none bg-white cursor-pointer"
                        value={p.website_status} onChange={e => updateStatus(p._id, "website_status", e.target.value)}>
                        {WEBSITE_STATUS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                      {p.website && <a href={p.website.startsWith("http") ? p.website : `https://${p.website}`} target="_blank" rel="noopener noreferrer" className="block text-xs text-blue-500 hover:underline mt-0.5 truncate max-w-24">↗ View site</a>}
                    </td>
                    <td className="p-3">
                      <select className="text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none bg-white cursor-pointer"
                        value={p.outreach_status} onChange={e => updateStatus(p._id, "outreach_status", e.target.value)}>
                        {OUTREACH_STATUS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </td>
                    <td className="p-3">
                      <select className="text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none bg-white cursor-pointer"
                        value={p.tag} onChange={e => updateStatus(p._id, "tag", e.target.value)}>
                        {TAGS.map(t => <option key={t.value} value={t.value}>{t.label || "No tag"}</option>)}
                      </select>
                    </td>
                    <td className="p-3 text-xs font-bold text-green-600">{p.estimated_value || "—"}</td>
                    <td className="p-3">
                      <div className="flex gap-1.5 flex-wrap">
                        {p.phone && (
                          <a href={waLink(p.phone)} target="_blank" rel="noopener noreferrer"
                            className="text-xs bg-green-50 text-green-600 px-2.5 py-1 rounded-lg font-bold hover:bg-green-100 transition">WA</a>
                        )}
                        {p.phone && (
                          <a href={`tel:${p.phone}`} className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg font-bold hover:bg-blue-100 transition">Call</a>
                        )}
                        <button onClick={() => openEdit(p)} className="text-xs border border-gray-200 px-2.5 py-1 rounded-lg font-bold hover:border-black transition">Edit</button>
                        <button onClick={() => convertToLead(p._id)} className="text-xs bg-green-500 text-white px-2.5 py-1 rounded-lg font-bold hover:bg-green-600 transition">→ Lead</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SEARCH VIEW — Google Maps search generator + quick add
// ══════════════════════════════════════════════════════════════════════════════
function SearchView({ onBack, onAdd, onError }) {
  const [niche,      setNiche]     = useState("");
  const [country,    setCountry]   = useState("Ghana");
  const [customLoc,  setCustomLoc] = useState("");
  const [results,    setResults]   = useState([]);
  const [adding,     setAdding]    = useState({});

  const locations = LOCATIONS[country] || [];

  const generate = () => {
    const keywords = KEYWORDS[niche] || [niche.toLowerCase()];
    const loc = customLoc || country;
    const searches = keywords.map(kw => ({
      query: `${kw} ${loc}`,
      url:   `https://www.google.com/maps/search/${encodeURIComponent(`${kw} ${loc}`)}`,
    }));
    setResults(searches);
  };

  const quickAdd = async (query, mapsUrl) => {
    const name = prompt(`Business name found:\n(from search: "${query}")`);
    if (!name) return;
    const phone = prompt("Phone number (or leave blank):") || "";
    const loc   = customLoc || country;
    setAdding(a => ({ ...a, [query]: true }));
    try {
      await onAdd({
        business_name:  name,
        niche:          niche,
        country:        country,
        location:       loc,
        phone:          phone,
        website_status: "unknown",
        outreach_status:"not_contacted",
        tag:            "this_week",
        maps_url:       mapsUrl,
        source_keyword: query,
      });
      alert(`"${name}" added to prospects!`);
    } catch (e) { onError(e.message); }
    finally { setAdding(a => ({ ...a, [query]: false })); }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-xs font-bold text-gray-400 hover:text-black transition">← Back</button>
        <h2 className="text-xl font-extrabold">Search Google Maps</h2>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-xs font-bold text-gray-500 mb-1.5">Industry / Niche</p>
            <select className={sel} value={niche} onChange={e => setNiche(e.target.value)}>
              <option value="">-- Select niche --</option>
              {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 mb-1.5">Country / Market</p>
            <select className={sel} value={country} onChange={e => { setCountry(e.target.value); setCustomLoc(""); }}>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 mb-1.5">Specific Location (optional)</p>
            <div className="flex gap-2">
              <select className={sel} value={customLoc} onChange={e => setCustomLoc(e.target.value)}>
                <option value="">Use country only</option>
                {locations.map(l => <option key={l} value={l}>{l.split(" ")[0]}</option>)}
              </select>
            </div>
          </div>
        </div>
        <button onClick={generate} disabled={!niche}
          className="px-6 py-2.5 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition disabled:opacity-40">
          Generate search strings →
        </button>
      </div>

      {results.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
            {results.length} searches for {niche} in {customLoc || country}
          </p>
          <p className="text-xs text-gray-400 mb-4">Click to open Google Maps. Find a business without a website — come back and click Add to save it.</p>
          <div className="flex flex-col gap-3">
            {results.map(({ query, url }) => (
              <div key={query} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:border-gray-300 transition">
                <a href={url} target="_blank" rel="noopener noreferrer"
                  className="flex-1 text-sm text-blue-600 hover:underline font-medium">
                  {query} ↗
                </a>
                <button
                  onClick={() => { navigator.clipboard.writeText(query); }}
                  className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg font-bold hover:border-gray-400 transition">
                  Copy
                </button>
                <button onClick={() => quickAdd(query, url)}
                  disabled={adding[query]}
                  className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-red-700 transition disabled:opacity-40">
                  {adding[query] ? "Adding..." : "+ Add prospect"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PROSPECT FORM
// ══════════════════════════════════════════════════════════════════════════════
function ProspectForm({ form, setF, onSave, onCancel, saving, isEdit }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onCancel} className="text-xs font-bold text-gray-400 hover:text-black transition">← Back</button>
        <h2 className="text-xl font-extrabold">{isEdit ? "Edit Prospect" : "Add Prospect"}</h2>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col gap-5">

          {/* Business Info */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Business Info</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Business Name *</label><input className={inp} value={form.business_name} onChange={e => setF("business_name", e.target.value)} placeholder="e.g. Kofi's Catering"/></div>
              <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Niche</label>
                <select className={sel} value={form.niche} onChange={e => setF("niche", e.target.value)}>
                  <option value="">Select niche...</option>
                  {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Country</label>
                <select className={sel} value={form.country} onChange={e => setF("country", e.target.value)}>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Location / Area</label><input className={inp} value={form.location} onChange={e => setF("location", e.target.value)} placeholder="e.g. Osu, Accra"/></div>
              <div className="sm:col-span-2"><label className="block text-xs font-bold text-gray-600 mb-1.5">What They Sell / Do</label><input className={inp} value={form.what_they_do} onChange={e => setF("what_they_do", e.target.value)} placeholder="e.g. Catering for events and offices"/></div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Contact</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Phone / WhatsApp</label><input className={inp} value={form.phone} onChange={e => setF("phone", e.target.value)} placeholder="+233 xx xxx xxxx"/></div>
              <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Email</label><input className={inp} type="email" value={form.email} onChange={e => setF("email", e.target.value)}/></div>
              <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Website URL</label><input className={inp} value={form.website} onChange={e => setF("website", e.target.value)} placeholder="https://..."/></div>
              <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Google Maps URL</label><input className={inp} value={form.maps_url} onChange={e => setF("maps_url", e.target.value)} placeholder="https://maps.google.com/..."/></div>
            </div>
          </div>

          {/* Research data */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Research Data</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Google Rating</label><input className={inp} type="number" step="0.1" min="0" max="5" value={form.google_rating} onChange={e => setF("google_rating", e.target.value)} placeholder="4.5"/></div>
              <div><label className="block text-xs font-bold text-gray-600 mb-1.5">No. of Reviews</label><input className={inp} type="number" value={form.google_reviews} onChange={e => setF("google_reviews", e.target.value)}/></div>
              <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Website Status</label>
                <select className={sel} value={form.website_status} onChange={e => setF("website_status", e.target.value)}>
                  {WEBSITE_STATUS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Est. Project Value</label><input className={inp} value={form.estimated_value} onChange={e => setF("estimated_value", e.target.value)} placeholder="$300–$600"/></div>
              <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Added to Google</label><input className={inp} value={form.google_added} onChange={e => setF("google_added", e.target.value)} placeholder="e.g. Jan 2022"/></div>
            </div>
          </div>

          {/* Outreach */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Outreach Tracking</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Outreach Status</label>
                <select className={sel} value={form.outreach_status} onChange={e => setF("outreach_status", e.target.value)}>
                  {OUTREACH_STATUS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Channel Used</label>
                <select className={sel} value={form.outreach_channel} onChange={e => setF("outreach_channel", e.target.value)}>
                  <option value="">Not set</option>
                  {CHANNELS.filter(Boolean).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Date Contacted</label><input className={inp} type="date" value={form.outreach_date} onChange={e => setF("outreach_date", e.target.value)}/></div>
              <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Follow-up Date</label><input className={inp} type="date" value={form.follow_up_date} onChange={e => setF("follow_up_date", e.target.value)}/></div>
              <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Tag</label>
                <select className={sel} value={form.tag} onChange={e => setF("tag", e.target.value)}>
                  {TAGS.map(t => <option key={t.value || "none"} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Outcome</label><input className={inp} value={form.outcome} onChange={e => setF("outcome", e.target.value)} placeholder="e.g. Interested, asked for quote"/></div>
              <div className="sm:col-span-2"><label className="block text-xs font-bold text-gray-600 mb-1.5">Comment / Notes</label><textarea className={`${inp} resize-none`} rows={3} value={form.comment} onChange={e => setF("comment", e.target.value)} placeholder="Any notes, what was said, context..."/></div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={onSave} disabled={!form.business_name || saving}
              className="px-6 py-3 bg-black text-white font-bold text-sm rounded-xl hover:bg-red-600 transition disabled:opacity-40">
              {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Prospect"}
            </button>
            <button onClick={onCancel} className="px-6 py-3 border border-gray-200 font-bold text-sm rounded-xl hover:border-gray-400 transition">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PROSPECT DETAIL VIEW
// ══════════════════════════════════════════════════════════════════════════════
function ProspectDetail({ prospect: p, onBack, onEdit, onDelete, onConvert, onUpdateStatus, onError, onReload }) {
  const [confirm, setConfirm] = useState(false);

  const waMsg = encodeURIComponent(
    `Hi, I came across ${p.business_name} on Google Maps.\n\n` +
    (p.website_status === "no_website"
      ? `I noticed your business doesn't have a website yet — which means customers who search Google for what you offer can't find you.\n\n`
      : `I checked your website and I think there's an opportunity to improve it.\n\n`) +
    `I build professional websites for ${p.niche || "businesses"} in ${p.country}.\n\nWould you be open to a quick call this week?`
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-xs font-bold text-gray-400 hover:text-black transition">← Back</button>
          <h2 className="text-xl font-extrabold">{p.business_name}</h2>
        </div>
        <div className="flex gap-2 flex-wrap">
          {p.outreach_status !== "converted" && (
            <button onClick={onConvert} className="px-4 py-2 bg-green-500 text-white text-xs font-bold rounded-xl hover:bg-green-600 transition">
              Convert to Lead →
            </button>
          )}
          <button onClick={onEdit} className="px-4 py-2 border border-gray-200 text-xs font-bold rounded-xl hover:border-black transition">Edit</button>
          {confirm
            ? <><button onClick={onDelete} className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl">Confirm delete</button><button onClick={() => setConfirm(false)} className="px-4 py-2 border border-gray-200 text-xs font-bold rounded-xl">Cancel</button></>
            : <button onClick={() => setConfirm(true)} className="px-4 py-2 border border-red-200 text-red-500 text-xs font-bold rounded-xl hover:bg-red-50 transition">Delete</button>
          }
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left — business info */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Business</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[["Niche", p.niche], ["Country", p.country], ["Location", p.location], ["What they do", p.what_they_do], ["Phone", p.phone], ["Email", p.email], ["Est. Value", p.estimated_value], ["Source keyword", p.source_keyword]].map(([k,v]) => v ? (
                <div key={k}><p className="text-xs font-bold text-gray-400 uppercase">{k}</p><p className="font-medium">{v}</p></div>
              ) : null)}
            </div>
            {p.google_rating && (
              <div className="mt-3 flex gap-4 text-sm">
                <span className="text-yellow-600 font-bold">★ {p.google_rating}</span>
                <span className="text-gray-400">({p.google_reviews} reviews)</span>
              </div>
            )}
            <div className="flex gap-2 flex-wrap mt-4">
              {p.phone && <a href={waLink(p.phone)} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-green-500 text-white text-xs font-bold rounded-xl hover:bg-green-600 transition">💬 WhatsApp</a>}
              {p.phone && <a href={`tel:${p.phone}`} className="px-4 py-2 bg-blue-500 text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition">📞 Call</a>}
              {p.website && <a href={p.website.startsWith("http") ? p.website : `https://${p.website}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-gray-200 text-xs font-bold rounded-xl hover:border-black transition">↗ Website</a>}
              {p.maps_url && <a href={p.maps_url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-gray-200 text-xs font-bold rounded-xl hover:border-black transition">📍 Maps</a>}
              {p.phone && <a href={`https://wa.me/${p.phone.replace(/\D/g,"")}?text=${waMsg}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-green-100 text-green-700 text-xs font-bold rounded-xl hover:bg-green-200 transition">Send pitch message</a>}
            </div>
          </div>

          {/* Comment */}
          {p.comment && (
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Notes</p>
              <p className="text-sm text-gray-600 leading-relaxed">{p.comment}</p>
            </div>
          )}
          {p.outcome && (
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Outcome</p>
              <p className="text-sm text-gray-600">{p.outcome}</p>
            </div>
          )}
        </div>

        {/* Right — status controls */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Status</p>
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-xs text-gray-500 mb-1.5">Website status</p>
                <Badge value={p.website_status} options={WEBSITE_STATUS} />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1.5">Outreach status</p>
                <Badge value={p.outreach_status} options={OUTREACH_STATUS} />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1.5">Tag</p>
                <Badge value={p.tag} options={TAGS} />
              </div>
              {p.outreach_date && <div><p className="text-xs text-gray-400">Contacted: {new Date(p.outreach_date).toLocaleDateString("en-GB")}</p></div>}
              {p.follow_up_date && <div><p className={`text-xs font-bold ${new Date(p.follow_up_date) < new Date() ? "text-red-500" : "text-yellow-600"}`}>Follow-up: {new Date(p.follow_up_date).toLocaleDateString("en-GB")}</p></div>}
            </div>
            <div className="mt-4 border-t pt-4">
              <p className="text-xs text-gray-400 mb-2">Update outreach</p>
              <div className="flex flex-wrap gap-1.5">
                {OUTREACH_STATUS.map(s => (
                  <button key={s.value} onClick={() => onUpdateStatus(p._id, "outreach_status", s.value)}
                    className={`text-xs px-2.5 py-1 rounded-full font-bold transition border ${p.outreach_status === s.value ? "bg-black text-white border-black" : "border-gray-200 text-gray-500 hover:border-gray-400"}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs text-gray-400 mb-2">Tag</p>
              <div className="flex flex-wrap gap-1.5">
                {TAGS.map(t => (
                  <button key={t.value || "none"} onClick={() => onUpdateStatus(p._id, "tag", t.value)}
                    className={`text-xs px-2.5 py-1 rounded-full font-bold transition border ${p.tag === t.value ? "bg-black text-white border-black" : "border-gray-200 text-gray-500 hover:border-gray-400"}`}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}