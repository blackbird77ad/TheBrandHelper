import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID  = 'service_3vfxg4e';
const EMAILJS_TEMPLATE_ID = 'template_uvbqmun';
const EMAILJS_PUBLIC_KEY  = '0VeNb5hN21304FM3_';
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw_PrDQAe5o4TPxrpFdJfwg_BEghxmpBHJ5j1AwEQBxbTaJSscVUSwUl3URqYqgn1RlZQ/exec';

const WHATSAPP = "https://wa.me/233501657205";
const PHONE1   = "+233 50 165 7205";
const PHONE2   = "+233 54 493 0276";
const EMAIL    = "davida@thebrandhelper.com";
const EMAIL2   = "blackbird77ad@gmail.com";
const CALENDLY = "https://calendly.com/blackbird77ad/free-consultation";

const ALL_SERVICES = [
  "Website Design & Development",
  "Website Management",
  "Ads Management (Facebook / Instagram / Google)",
  "Brand Strategy",
  "Business Email Setup",
  "Consulting & Coaching",
  "AI Tools & Automation",
  "Technical Writing",
  "Translation & Transcription",
  "Customer Support Setup",
  "Project & Technical Support",
  "Not sure — advise me",
];

const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-800 transition-all bg-white";

// ── Quick Inquiry Form ─────────────────────────────────────────────────────
function InquiryForm() {
  const [name,       setName]       = useState('');
  const [email,      setEmail]      = useState('');
  const [phone,      setPhone]      = useState('');
  const [service,    setService]    = useState('');
  const [message,    setMessage]    = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);

  const buildMessage = () => [
    `New Inquiry — The BrandHelper`,
    ``,
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Phone:   ${phone}`,
    `Service: ${service || 'Not specified'}`,
    ``,
    `Message:`,
    message,
  ].join('\n');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !message) return;
    setSubmitting(true);

    const payload = {
      to_email:     'davida@thebrandhelper.com',
      to_name:      'The BrandHelper Team',
      from_name:    name || 'New Inquiry',
      reply_to:     email || 'noreply@thebrandhelper.com',
      subject:      `New Inquiry — ${service || 'General'} (${name})`,
      form_type:    'Quick Inquiry',
      client_name:  name,
      email,
      phone,
      service:      service || 'Not specified',
      message,
      full_brief:   buildMessage(),
      submitted_at: new Date().toLocaleString('en-GB', { timeZone: 'Africa/Accra' }),
    };

    // EmailJS
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, payload, EMAILJS_PUBLIC_KEY);
    } catch (e) { console.warn('EmailJS:', e); }

    // Google Sheet
    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (e) { console.warn('Sheets:', e); }

    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) return (
    <div className="flex flex-col gap-4">
      {/* Success state */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
        <div className="text-4xl mb-3">✅</div>
        <p className="font-extrabold text-green-800 text-lg mb-1">Message received!</p>
        <p className="text-green-600 text-sm leading-relaxed">
          Your inquiry has been logged and our team has been notified. Send it to us on WhatsApp too for a faster reply.
        </p>
      </div>

      {/* WhatsApp as next step */}
      <a
        href={`${WHATSAPP}?text=${encodeURIComponent(buildMessage())}`}
        target="_blank" rel="noopener noreferrer"
        className="w-full py-4 rounded-2xl bg-green-500 text-white font-extrabold text-base text-center block hover:bg-green-600 transition-all"
      >
        💬 Send on WhatsApp for Faster Reply
      </a>
      <a
        href={CALENDLY} target="_blank" rel="noopener noreferrer"
        className="w-full py-4 rounded-2xl bg-black text-white font-extrabold text-base text-center block hover:opacity-90 transition-all"
      >
        📅 Book a Free Consultation Call
      </a>
      <button
        onClick={() => setSubmitted(false)}
        className="w-full py-3 rounded-2xl border-2 border-gray-200 font-bold text-sm text-gray-500 hover:border-gray-400 transition-all"
      >
        Send another message
      </button>

      <p className="text-center text-gray-400 text-xs">
        We reply within a few hours · {PHONE1}
      </p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-bold mb-2">Your name <span className="text-red-500">*</span></label>
          <input className={inputClass} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Kofi Mensah" required />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">Email address</label>
          <input type="email" className={inputClass} value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-bold mb-2">Phone / WhatsApp</label>
          <input className={inputClass} value={phone} onChange={e => setPhone(e.target.value)} placeholder="+233 xx xxx xxxx" />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">Service you're interested in</label>
          <select className={inputClass} value={service} onChange={e => setService(e.target.value)}>
            <option value="">Select a service...</option>
            {ALL_SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-bold mb-2">Your message <span className="text-red-500">*</span></label>
        <textarea
          className={`${inputClass} resize-none`} rows={4}
          value={message} onChange={e => setMessage(e.target.value)} required
          placeholder="Tell us about your project, what you need, or any questions you have..."
        />
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <p className="text-xs text-blue-700">
          💡 For a website project, use the <Link to="/contact/requirements" className="font-bold underline">Full Project Brief</Link> — it covers everything and takes 5 minutes.
          For a pricing estimate, use the <Link to="/contact/calc" className="font-bold underline">Pricing Calculator</Link>.
        </p>
      </div>

      <button
        type="submit"
        disabled={!name || !message || submitting}
        className="w-full py-4 rounded-2xl bg-red-600 text-white font-extrabold text-base hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Sending...
          </span>
        ) : '🚀 Send Inquiry'}
      </button>

      <p className="text-center text-gray-400 text-xs">
        Or reach us directly: <a href={`tel:${PHONE1}`} className="font-bold text-black hover:text-red-600">{PHONE1}</a>
        {' · '}
        <a href={`mailto:${EMAIL}`} className="font-bold text-black hover:text-red-600">{EMAIL}</a>
      </p>
    </form>
  );
}

// ── Tab config ─────────────────────────────────────────────────────────────
const TABS = [
  { key: "inquiry",      label: "Quick Inquiry",     desc: "General questions or service enquiries" },
  { key: "requirements", label: "Project Brief",     desc: "Start a website project — 5 mins"       },
  { key: "calc",         label: "Pricing Calculator", desc: "Get an instant website estimate"        },
];

// ── Lazy imports of the other two forms ───────────────────────────────────
import ClientRequirements from "./ClientRequirements";
import WebsiteCalc from "./WebsiteCalc";

export default function Contact() {
  const { tab }      = useParams();
  const navigate     = useNavigate();
  const activeTab    = TABS.find(t => t.key === tab)?.key || "inquiry";

  const setTab = (key) => navigate(`/contact/${key}`, { replace: true });

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [activeTab]);

  return (
    <div className="bg-white text-black min-h-screen">
      <Helmet>
        <title>Contact | The Brand Helper</title>
        <meta name="description" content="Get in touch with The Brand Helper. Start a project, get a quote, or send a quick inquiry." />
      </Helmet>

      {/* ── Hero ── */}
      <section className="bg-black text-white py-16 md:py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-4">Get In Touch</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-5 leading-tight">Let's Work Together</h1>
          <p className="text-gray-300 text-base md:text-lg max-w-2xl mb-8">
            Choose how you'd like to reach us. For a new website project, the <strong>Project Brief</strong> gives us everything we need to scope and quote properly.
          </p>
          {/* Direct contact bar */}
          <div className="flex flex-wrap gap-4">
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-green-400 transition">
              <span className="text-green-400">💬</span> {PHONE1}
            </a>
            <a href={`mailto:${EMAIL}`}
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition">
              <span>📧</span> {EMAIL}
            </a>
            <a href={`tel:${PHONE2}`}
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition">
              <span>📞</span> {PHONE2}
            </a>
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-red-400 transition">
              <span>📅</span> Book a free call
            </a>
          </div>
        </div>
      </section>

      {/* ── Tabs ── */}
      <div className="border-b border-gray-100 sticky top-0 z-40 bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex overflow-x-auto">
            {TABS.map(({ key, label, desc }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex flex-col items-start py-4 px-5 md:px-7 border-b-2 transition-all whitespace-nowrap shrink-0
                  ${activeTab === key ? 'border-red-600 text-black' : 'border-transparent text-gray-400 hover:text-gray-700'}`}
              >
                <span className="text-sm font-bold">{label}</span>
                <span className="text-xs mt-0.5 hidden md:block text-gray-400">{desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="max-w-5xl mx-auto px-6 py-10 md:py-14">

        {activeTab === "inquiry" && (
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Quick Inquiry</h2>
            <p className="text-gray-500 mb-8 text-sm md:text-base">
              General questions, partnership enquiries, or not sure where to start? Drop us a message — we reply quickly.
            </p>
            <InquiryForm />
          </div>
        )}

        {activeTab === "requirements" && (
          <div className="-mx-6">
            <ClientRequirements />
          </div>
        )}

        {activeTab === "calc" && (
          <div className="-mx-6">
            <WebsiteCalc />
          </div>
        )}

      </div>

      {/* ── Direct contact cards — only on inquiry tab ── */}
      {activeTab === "inquiry" && (
        <section className="py-12 md:py-16 bg-[#F5F5F5] px-6">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-xl font-semibold mb-6 text-center">Prefer to reach us directly?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { emoji: "💬", label: "WhatsApp",           sub: PHONE1,            href: WHATSAPP,           bg: "bg-green-50  border-green-200  text-green-800"  },
                { emoji: "📧", label: "Email",              sub: EMAIL,             href: `mailto:${EMAIL}`,  bg: "bg-blue-50   border-blue-200   text-blue-800"   },
                { emoji: "📞", label: "Call Us",            sub: PHONE2,            href: `tel:${PHONE2}`,    bg: "bg-purple-50 border-purple-200 text-purple-800" },
                { emoji: "📅", label: "Free Consultation",  sub: "Book on Calendly", href: CALENDLY,          bg: "bg-red-50    border-red-200    text-red-800"    },
              ].map(({ emoji, label, sub, href, bg }) => (
                <a key={label} href={href} target={href.startsWith('http') ? "_blank" : undefined} rel="noopener noreferrer"
                  className={`flex items-center gap-3 p-4 rounded-2xl border ${bg} hover:opacity-80 transition`}>
                  <span className="text-2xl">{emoji}</span>
                  <div>
                    <div className="font-bold text-sm">{label}</div>
                    <div className="text-xs opacity-70 mt-0.5 break-all">{sub}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}