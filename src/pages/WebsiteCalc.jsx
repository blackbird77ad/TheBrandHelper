import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import emailjs from '@emailjs/browser';

// ─── CREDENTIALS ──────────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = 'service_3vfxg4e';
const EMAILJS_TEMPLATE_ID = 'template_uvbqmun';
const EMAILJS_PUBLIC_KEY  = '0VeNb5hN21304FM3_';
const APPS_SCRIPT_URL     = 'https://script.google.com/macros/s/AKfycbxtjhLmlWKHa4FvDEWRYEbmTVbBUo1-4oKN2zFzZEEwhbZt4l6SX6wDgtwbMdyEvbNh1Q/exec';
// ──────────────────────────────────────────────────────────────────────────────

const INDUSTRIES = [
  { key: 'food',         emoji: '🍽️', label: 'Food & Restaurant',     sub: 'Menu, catering, delivery'      },
  { key: 'travel',       emoji: '✈️', label: 'Travel & Tourism',       sub: 'Booking, tours, destinations'  },
  { key: 'fashion',      emoji: '👗', label: 'Fashion & Beauty',        sub: 'Clothing, hair, beauty'        },
  { key: 'entrepreneur', emoji: '💼', label: 'Entrepreneur / Startup',  sub: 'New business, launch'          },
  { key: 'consultancy',  emoji: '🧠', label: 'Consultancy / Coaching',  sub: 'Services, sessions, bookings'  },
  { key: 'brand',        emoji: '✨', label: 'Brand / Creative',        sub: 'Portfolio, branding'           },
  { key: 'health',       emoji: '💊', label: 'Health & Wellness',       sub: 'Clinic, fitness, pharmacy'     },
  { key: 'education',    emoji: '📚', label: 'Education / Training',    sub: 'Courses, academy, skills'      },
  { key: 'real_estate',  emoji: '🏠', label: 'Real Estate',             sub: 'Listings, agents, rentals'     },
  { key: 'nonprofit',    emoji: '❤️', label: 'NGO / Non-Profit',        sub: 'Charity, community'            },
  { key: 'retail',       emoji: '🛒', label: 'Retail / Online Shop',    sub: 'Products, catalogue'           },
  { key: 'other',        emoji: '🌐', label: 'Something Else',          sub: 'Tell us when we chat'          },
];

const TIERS = [
  {
    key: 'simple', emoji: '🌱', label: 'Simple Website', range: [300, 500],
    sub: '3–6 pages · No accounts or payments',
    desc: 'A beautiful, professional website that tells your story. People can find you online, read about you, see your work, and contact you. It works perfectly on phones, tablets and computers. Think of it like a digital brochure — clean, fast, and impressive.',
    good: ['You just want to be found online', 'You want people to contact you', 'You are just starting out', 'Budget-friendly option'],
    includes: ['Up to 6 pages', 'Mobile-friendly design', 'Contact form', 'Your photos and text', 'Fast loading'],
    note: 'No logins, no payments, no database — purely beautiful frontend. Payment and backend features are available as extras (see next step).', color: 'green',
  },
  {
    key: 'intermediate', emoji: '🚀', label: 'Intermediate Website', range: [450, 650],
    sub: '6–15 pages · Backend + basic integrations',
    desc: 'Everything in Simple, plus a backend that stores and manages data. You can update content yourself, receive orders or booking requests, and connect services like payment or email. Great for a growing business that needs more than just a static page.',
    good: ['You need to update content yourself', 'You want to receive bookings or orders', 'You need a contact form that saves data', 'You want a small admin area'],
    includes: ['Everything in Simple', 'Backend (data storage)', 'Admin panel', 'Email notifications', 'One payment or API integration'],
    note: 'Stripe or other payment setup requires client to create their own account — we connect it at no extra charge.', color: 'blue',
  },
  {
    key: 'complex', emoji: '⚡', label: 'Full Web Platform', range: [550, 1000],
    sub: 'Full system · Accounts, payments, dashboard',
    desc: 'A complete system where everything works together. Customers create accounts, place orders, make payments — and you manage everything from your own private dashboard. Like a full food ordering platform or a booking system. Built for businesses ready to operate fully online.',
    good: ['You need customer accounts', 'You want full order or booking management', 'You need a private admin dashboard', 'You want everything automated'],
    includes: ['Everything in Intermediate', 'User login / accounts', 'Full admin dashboard', 'Multiple integrations', 'Cloud storage'],
    note: 'All features available. We build it, you own it.', color: 'purple',
  },
];

const FEATURES = {
  simple: {
    included: [
      { key: 'pages',   label: 'Up to 6 pages',          sub: 'Home, About, Services, Contact, etc.', price: 0 },
      { key: 'mobile',  label: 'Mobile-friendly design', sub: 'Works on all phones and screens',       price: 0 },
      { key: 'contact', label: 'Contact form',           sub: 'Visitors can send you a message',       price: 0 },
      { key: 'photos',  label: 'Your photos & branding', sub: 'We use your images and colours',        price: 0 },
    ],
    addons: [
      { key: 'seo',      label: '🔍 Google visibility (SEO)', sub: 'Help people find you on Google',        price: 60,  explain: 'When someone searches "hair salon in Accra" on Google, SEO is what helps your site show up. Without it, your site may be live but invisible in search results.' },
      { key: 'domain',   label: '🏷 Domain + hosting setup',  sub: 'yourname.com — SSL secured',            price: 50,  explain: 'Your website address on the internet (e.g. mybusiness.com) plus the server that hosts it. We set everything up for you. This cost is INCLUDED in the price.' },
      { key: 'gallery',  label: '🖼 Photo gallery',           sub: 'Showcase your work or products',        price: 40,  explain: 'A visual section on your site where you can display photos of your work, products, or portfolio. Looks great and helps customers see what you offer.' },
      { key: 'social',   label: '📱 Social media links',      sub: 'Instagram, Facebook, TikTok etc.',      price: 20,  explain: 'Links to all your social media pages so visitors can follow you easily from your website.' },
      { key: 'whatsapp', label: '💬 WhatsApp chat button',    sub: 'Customers tap to message you directly', price: 30,  explain: 'A floating WhatsApp button on your site. Visitors tap it and it opens a WhatsApp chat directly to your number. Very popular with customers.' },
    ],
    extras: [
      { key: 'payment', label: '💳 Accept payments',       sub: 'Requires backend — moves to Intermediate', price: 130, explain: 'To accept payments online, your site needs a backend (a server) to process transactions securely. Adding this moves your project to the Intermediate tier.' },
      { key: 'auth',    label: '🔐 User accounts (login)', sub: 'Requires backend — moves to Intermediate', price: 120, explain: 'Letting users create accounts and log in requires a backend to store their data securely. This feature is available in the Intermediate or Complex tier.' },
      { key: 'admin',   label: '🗂 Admin dashboard',       sub: 'Requires backend — moves to Intermediate', price: 130, explain: 'An admin area where you can manage content, orders, or users requires a backend. Available in Intermediate or Complex tier.' },
    ],
  },
  intermediate: {
    included: [
      { key: 'all_simple',  label: 'Everything in Simple',  sub: 'All Simple features included',  price: 0 },
      { key: 'backend',     label: '🔧 Backend engine',      sub: 'Stores and manages your data',  price: 0 },
      { key: 'admin',       label: '🗂 Basic admin panel',   sub: 'Manage your content privately', price: 0 },
      { key: 'email_notif', label: '📧 Email notifications', sub: 'Auto-emails when things happen', price: 0 },
    ],
    addons: [
      { key: 'payment', label: '💳 Payment integration',      sub: 'Accept card, bank, mobile money',      price: 130, explain: 'Let customers pay directly on your website. You create a free Stripe account, add us as developer, and we connect everything. Your money goes straight to you. Stripe charges ~1.5–3% per transaction separately.' },
      { key: 'auth',    label: '🔐 User accounts',            sub: 'Customers can sign up and log in',     price: 120, explain: 'Customers create their own account — like signing up for an app. Once logged in, they can see their order history, saved details, and more.' },
      { key: 'booking', label: '📅 Booking / appointment',    sub: 'Customers book sessions or slots',     price: 100, explain: 'A calendar or booking system where customers can pick a date and time for a service or appointment. Great for consultants, clinics, trainers.' },
      { key: 'seo',     label: '🔍 Google visibility (SEO)',  sub: 'Help people find you on Google',       price: 80,  explain: 'SEO setup makes sure Google understands what your site is about so it shows your website to the right people in search results.' },
      { key: 'domain',  label: '🏷 Domain + hosting setup',  sub: 'yourname.com — SSL secured',           price: 50,  explain: 'Your website address and hosting setup — fully included in your quote.' },
    ],
    extras: [
      { key: 'storage',  label: '☁️ File / photo upload',      sub: 'Users or you can upload media', price: 80,  explain: 'Lets people upload photos, documents, or files to your website. For example, customers uploading proof of payment or you uploading product images from your phone.' },
      { key: 'realtime', label: '⚡ Live / real-time updates', sub: 'Chat, live notifications',      price: 150, explain: 'Things update instantly without refreshing — like a live chat, real-time order status, or live notifications. More advanced and adds to cost.' },
    ],
  },
  complex: {
    included: [
      { key: 'all_inter',  label: 'Everything in Intermediate', sub: 'All Intermediate features',      price: 0 },
      { key: 'full_auth',  label: '🔐 Full user accounts',      sub: 'Sign up, log in, profiles',      price: 0 },
      { key: 'full_admin', label: '🗂 Full admin dashboard',     sub: 'Manage orders, users, content', price: 0 },
      { key: 'storage',    label: '☁️ Cloud file storage',       sub: 'Upload and store media',         price: 0 },
      { key: 'payment',    label: '💳 Payment integration',      sub: 'Accept payments online',         price: 0 },
    ],
    addons: [
      { key: 'realtime',   label: '⚡ Live / real-time features', sub: 'Chat, live notifications, updates', price: 150, explain: 'Things update instantly without refreshing the page — like a live chat, real-time order tracking, or instant notifications.' },
      { key: 'multi_lang', label: '🌍 Multiple languages',        sub: 'Site in 2 or more languages',       price: 120, explain: 'Your website in more than one language — for example English and French. Great if you serve customers in different countries.' },
      { key: 'seo',        label: '🔍 Advanced SEO',              sub: 'Deep search optimisation',          price: 100, explain: 'Advanced SEO work beyond basics — structured data, page speed, keyword strategy, and monthly reporting.' },
      { key: 'domain',     label: '🏷 Domain + hosting setup',    sub: 'yourname.com — SSL secured',        price: 50,  explain: 'Full domain and hosting setup included in your quote.' },
    ],
    extras: [],
  },
};

const TIMELINES = [
  { key: 'patient',  emoji: '🌿', label: 'I can wait',     sub: '6–8 weeks', note: 'Save 20% — best value',     mult: 0.80, badge: '−20%',    color: 'green' },
  { key: 'standard', emoji: '⏳', label: 'Normal pace',    sub: '3–5 weeks', note: 'Standard pricing',          mult: 1.00, badge: 'Standard', color: 'gray'  },
  { key: 'express',  emoji: '⚡', label: 'I need it fast', sub: '1–2 weeks', note: '30% extra — priority work', mult: 1.30, badge: '+30%',     color: 'red'   },
];

const STEPS = ['Your Business', 'Website Size', 'Features', 'Timeline', 'Your Quote'];
const fmt   = n => '$' + Math.round(n).toLocaleString();

const StuckHelper = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
    <div className="bg-white rounded-3xl p-7 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
      <div className="text-2xl mb-1">😊 No worries!</div>
      <p className="text-gray-600 text-sm leading-relaxed mb-5">Totally fine to feel unsure — let us walk you through everything personally.</p>
      <div className="flex flex-col gap-3">
        <a href="https://wa.me/233501657205" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-2xl bg-green-50 border border-green-200 hover:bg-green-100 transition-all">
          <span className="text-2xl">💬</span>
          <div><div className="font-bold text-sm text-green-800">WhatsApp Us</div><div className="text-xs text-green-600">+233 50 165 7205 — fast reply</div></div>
        </a>
        <a href="mailto:davida@thebrandhelper.com" className="flex items-center gap-3 p-4 rounded-2xl bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-all">
          <span className="text-2xl">📧</span>
          <div><div className="font-bold text-sm text-blue-800">Send an Email</div><div className="text-xs text-blue-600">davida@thebrandhelper.com</div></div>
        </a>
        <a href="tel:+233501657205" className="flex items-center gap-3 p-4 rounded-2xl bg-purple-50 border border-purple-200 hover:bg-purple-100 transition-all">
          <span className="text-2xl">📞</span>
          <div><div className="font-bold text-sm text-purple-800">Call Us</div><div className="text-xs text-purple-600">+233 50 165 7205</div></div>
        </a>
        <a href="https://calendly.com/blackbird77ad/free-consultation" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 hover:bg-red-100 transition-all">
          <span className="text-2xl">📅</span>
          <div><div className="font-bold text-sm text-red-800">Book a Free Session</div><div className="text-xs text-red-600">Go through everything with an expert</div></div>
        </a>
      </div>
      <button onClick={onClose} className="w-full mt-4 py-3 rounded-2xl border-2 border-gray-200 font-bold text-sm text-gray-500 hover:border-gray-400 transition-all">
        Continue on my own →
      </button>
    </div>
  </div>
);

const ExplainModal = ({ feature, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
    <div className="bg-white rounded-3xl p-7 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
      <div className="text-xl font-extrabold mb-3">{feature.label}</div>
      <p className="text-gray-600 text-sm leading-relaxed mb-6">{feature.explain}</p>
      <button onClick={onClose} className="w-full py-3 rounded-2xl bg-black text-white font-bold text-sm">Got it ✓</button>
    </div>
  </div>
);

export default function WebsiteCalc() {
  const [step,       setStep]       = useState(0);
  const [industry,   setIndustry]   = useState('');
  const [tier,       setTier]       = useState('');
  const [addons,     setAddons]     = useState([]);
  const [extras,     setExtras]     = useState([]);
  const [timeline,   setTimeline]   = useState('standard');
  const [showStuck,  setShowStuck]  = useState(false);
  const [explain,    setExplain]    = useState(null);
  const [copied,     setCopied]     = useState(false);
  // ── new submit state ──
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [step]);

  const tierData     = TIERS.find(t => t.key === tier) || TIERS[0];
  const tierFeatures = FEATURES[tier] || FEATURES.simple;
  const tl           = TIMELINES.find(t => t.key === timeline);
  const baseMin      = tierData.range[0];
  const baseMax      = tierData.range[1];
  const addonsSum    = addons.reduce((s, k) => { const f = tierFeatures.addons?.find(x => x.key === k); return s + (f?.price || 0); }, 0);
  const extrasSum    = extras.reduce((s, k) => { const f = tierFeatures.extras?.find(x => x.key === k); return s + (f?.price || 0); }, 0);
  const withinMin    = Math.round((baseMin + addonsSum) * tl.mult);
  const withinMax    = Math.round((baseMax + addonsSum) * tl.mult);
  const extrasTotal  = Math.round(extrasSum * tl.mult);
  const finalMin     = withinMin;
  const finalMax     = withinMax + extrasTotal;

  const toggleAddon = key => setAddons(a => a.includes(key) ? a.filter(k => k !== key) : [...a, key]);
  const toggleExtra = key => setExtras(a => a.includes(key) ? a.filter(k => k !== key) : [...a, key]);
  const canNext = (step === 0 && industry) || (step === 1 && tier) || step === 2 || step === 3;

  const buildQuote = () => {
    const ind    = INDUSTRIES.find(i => i.key === industry);
    const aLines = addons.map(k => `  • ${tierFeatures.addons?.find(f => f.key === k)?.label}`).join('\n');
    const eLines = extras.map(k => `  • ${tierFeatures.extras?.find(f => f.key === k)?.label} (extra)`).join('\n');
    return [
      `Website Quote — The BrandHelper`,
      ``,
      `Industry:  ${ind?.emoji} ${ind?.label}`,
      `Size:      ${tierData.emoji} ${tierData.label}`,
      `Timeline:  ${tl?.emoji} ${tl?.label} (${tl?.sub})`,
      aLines ? `\nAdd-ons:\n${aLines}` : '',
      eLines ? `\nExtras:\n${eLines}` : '',
      ``,
      extras.length
        ? `Estimate:  ${fmt(withinMin)}–${fmt(withinMax)} + extras ${fmt(extrasTotal)}\nTotal range: ${fmt(finalMin)}–${fmt(finalMax)} USD`
        : `Estimate:  ${fmt(finalMin)}–${fmt(finalMax)} USD`,
      ``,
      `✅ Includes: domain, hosting, cloud storage & database`,
      `💡 30% deposit to start — pay by bank, card, or mobile money`,
      ``,
      `Book a free call: https://calendly.com/blackbird77ad/free-consultation`,
      `WhatsApp: +233 50 165 7205`,
    ].filter(Boolean).join('\n');
  };

  // ── SINGLE SUBMIT: Sheet + EmailJS → then reveal WhatsApp ────────────────
  const handleSubmit = async () => {
    setSubmitting(true);
    const ind     = INDUSTRIES.find(i => i.key === industry);
    const payload = {
      form_type:    'Calc Quote',
      client_name:  'Website Calculator Lead',
      industry:     ind ? `${ind.emoji} ${ind.label}` : industry,
      tier:         `${tierData.emoji} ${tierData.label}`,
      timeline:     `${tl?.emoji} ${tl?.label} (${tl?.sub})`,
      estimate:     `${fmt(finalMin)}–${fmt(finalMax)} USD`,
      addons:       addons.map(k => tierFeatures.addons?.find(f => f.key === k)?.label).filter(Boolean).join(', ') || 'None',
      extras:       extras.map(k => tierFeatures.extras?.find(f => f.key === k)?.label).filter(Boolean).join(', ') || 'None',
      full_brief:   buildQuote(),
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

  const copyQuote = () => {
    navigator.clipboard.writeText(buildQuote()).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
  };

  const StuckBtn = () => (
    <button onClick={() => setShowStuck(true)}
      className="w-full mt-4 py-3 rounded-2xl border border-dashed border-gray-300 text-gray-400 font-bold text-sm hover:border-gray-500 hover:text-gray-600 transition-all flex items-center justify-center gap-2">
      😕 Feeling stuck? Talk to us →
    </button>
  );

  return (
    <div className="min-h-screen bg-white text-black">
      <Helmet><title>Website Pricing Calculator | The BrandHelper</title></Helmet>
      {showStuck && <StuckHelper onClose={() => setShowStuck(false)} />}
      {explain   && <ExplainModal feature={explain} onClose={() => setExplain(null)} />}

      <div className="bg-black text-white px-6 py-10 text-center">
        <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-2">Free Instant Estimate</p>
        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-3">How much will your website cost?</h1>
        <p className="text-gray-400 text-base max-w-lg mx-auto">Answer a few simple questions — no tech knowledge needed. Takes less than 2 minutes.</p>
      </div>

      <div className="bg-gray-50 border-b border-gray-100 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <button onClick={() => i < step && setStep(i)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 border-2 transition-all
                    ${i < step ? 'bg-red-600 border-red-600 text-white cursor-pointer' : i === step ? 'bg-black border-black text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                  {i < step ? '✓' : i + 1}
                </button>
                {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-0.5 ${i < step ? 'bg-red-600' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
          <div className="text-center text-sm font-bold mt-2 text-black">{STEPS[step]}</div>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-8">

        {/* STEP 0 — Industry */}
        {step === 0 && (
          <div>
            <h2 className="text-2xl font-extrabold mb-1">What kind of business do you have?</h2>
            <p className="text-gray-500 text-sm mb-6">Pick the one that fits best.</p>
            <div className="grid grid-cols-2 gap-3">
              {INDUSTRIES.map(ind => (
                <button key={ind.key} onClick={() => setIndustry(ind.key)}
                  className={`text-left p-4 rounded-2xl border-2 transition-all ${industry === ind.key ? 'border-red-600 bg-red-50' : 'border-gray-100 hover:border-gray-300 bg-white'}`}>
                  <div className="text-2xl mb-1">{ind.emoji}</div>
                  <div className="font-bold text-sm leading-tight">{ind.label}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{ind.sub}</div>
                </button>
              ))}
            </div>
            <StuckBtn />
          </div>
        )}

        {/* STEP 1 — Tier */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-extrabold mb-1">How big does your website need to be?</h2>
            <p className="text-gray-500 text-sm mb-6">Read each option carefully.</p>
            <div className="flex flex-col gap-5">
              {TIERS.map(t => (
                <button key={t.key} onClick={() => { setTier(t.key); setAddons([]); setExtras([]); }}
                  className={`text-left p-5 rounded-2xl border-2 transition-all ${tier === t.key ? 'border-red-600 bg-red-50' : 'border-gray-100 hover:border-gray-300 bg-white'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-extrabold text-lg">{t.emoji} {t.label}</div>
                    <div className="text-red-600 font-extrabold text-sm">{fmt(t.range[0])}–{fmt(t.range[1])}</div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">{t.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {t.good.map(g => <span key={g} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">✓ {g}</span>)}
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-gray-100">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">What's included</div>
                    <div className="flex flex-wrap gap-1">
                      {t.includes.map(inc => <span key={inc} className="text-xs text-gray-600 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">{inc}</span>)}
                    </div>
                  </div>
                  {t.note && <div className="mt-3 text-xs text-gray-400 italic">{t.note}</div>}
                </button>
              ))}
            </div>
            <StuckBtn />
          </div>
        )}

        {/* STEP 2 — Features */}
        {step === 2 && tier && (
          <div>
            <h2 className="text-2xl font-extrabold mb-1">Customise your website</h2>
            <p className="text-gray-500 text-sm mb-1">Everything in your tier is already included. Add extras below.</p>
            <div className="flex items-center gap-2 mb-6 bg-green-50 border border-green-100 rounded-xl px-4 py-2">
              <span className="text-green-600 text-sm font-bold">✅ Base range:</span>
              <span className="text-green-700 text-sm font-extrabold">{fmt(tierData.range[0])} – {fmt(tierData.range[1])}</span>
            </div>
            <div className="mb-5">
              <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Already included</div>
              <div className="flex flex-col gap-2">
                {tierFeatures.included.map(f => (
                  <div key={f.key} className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-100">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0"><span className="text-white text-xs font-bold">✓</span></div>
                    <div className="flex-1"><div className="font-bold text-sm text-green-800">{f.label}</div><div className="text-xs text-green-600">{f.sub}</div></div>
                    <span className="text-green-600 text-xs font-bold">Included</span>
                  </div>
                ))}
              </div>
            </div>
            {tierFeatures.addons?.length > 0 && (
              <div className="mb-5">
                <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Optional add-ons — within {fmt(tierData.range[0])}–{fmt(tierData.range[1])} range</div>
                <div className="flex flex-col gap-3">
                  {tierFeatures.addons.map(f => {
                    const on = addons.includes(f.key);
                    return (
                      <div key={f.key} className={`rounded-2xl border-2 transition-all ${on ? 'border-red-600 bg-red-50' : 'border-gray-100 bg-white'}`}>
                        <div className="flex items-start gap-3 p-4">
                          <button onClick={() => toggleAddon(f.key)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${on ? 'bg-red-600 border-red-600 text-white' : 'border-gray-300'}`}>
                            {on && <span className="text-xs font-bold">✓</span>}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-sm">{f.label}</div>
                            <div className="text-gray-500 text-xs mt-0.5">{f.sub}</div>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                            <span className="text-red-600 font-extrabold text-sm">{f.price === 0 ? 'Free' : `+${fmt(f.price)}`}</span>
                            {f.explain && <button onClick={() => setExplain(f)} className="text-xs text-blue-500 underline">ℹ️ What's this?</button>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {tierFeatures.extras?.length > 0 && (
              <div className="mb-5">
                <div className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-2">⚠️ Extras — beyond {fmt(tierData.range[1])} range</div>
                <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl mb-3">
                  <p className="text-xs text-orange-700">Adding these increases cost beyond the stated range — that's fine if you need them.</p>
                </div>
                <div className="flex flex-col gap-3">
                  {tierFeatures.extras.map(f => {
                    const on = extras.includes(f.key);
                    return (
                      <div key={f.key} className={`rounded-2xl border-2 transition-all ${on ? 'border-orange-400 bg-orange-50' : 'border-gray-100 bg-white'}`}>
                        <div className="flex items-start gap-3 p-4">
                          <button onClick={() => toggleExtra(f.key)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${on ? 'bg-orange-400 border-orange-400 text-white' : 'border-gray-300'}`}>
                            {on && <span className="text-xs font-bold">✓</span>}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-sm">{f.label}</div>
                            <div className="text-gray-500 text-xs mt-0.5">{f.sub}</div>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                            <span className="text-orange-500 font-extrabold text-sm">+{fmt(f.price)}</span>
                            {f.explain && <button onClick={() => setExplain(f)} className="text-xs text-blue-500 underline">ℹ️ What's this?</button>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="bg-black text-white rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-400 mb-0.5">Current estimate</div>
                <div className="text-xl font-extrabold">{fmt(baseMin + addonsSum)} – {fmt(baseMax + addonsSum + extrasSum)}</div>
              </div>
              {extras.length > 0 && (
                <div className="text-right">
                  <div className="text-xs text-orange-400 font-bold">⚠️ Includes extras</div>
                  <div className="text-xs text-gray-400">+{fmt(extrasSum)} beyond range</div>
                </div>
              )}
            </div>
            <StuckBtn />
          </div>
        )}

        {/* STEP 3 — Timeline */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-extrabold mb-1">How soon do you need it?</h2>
            <p className="text-gray-500 text-sm mb-6">If you can wait, you save money.</p>
            <div className="flex flex-col gap-4 mb-5">
              {TIMELINES.map(t => (
                <button key={t.key} onClick={() => setTimeline(t.key)}
                  className={`text-left p-5 rounded-2xl border-2 transition-all ${timeline === t.key ? 'border-red-600 bg-red-50' : 'border-gray-100 hover:border-gray-300 bg-white'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-lg">{t.emoji} {t.label}</div>
                      <div className="text-gray-500 text-sm mt-0.5">{t.sub}</div>
                      <div className="text-gray-400 text-xs mt-1">{t.note}</div>
                    </div>
                    <span className={`text-sm font-extrabold px-3 py-1 rounded-full ${t.color === 'green' ? 'bg-green-100 text-green-700' : t.color === 'red' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                      {t.badge}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
              <p className="text-sm font-bold text-yellow-800 mb-1">📅 Free progress meeting — always included</p>
              <p className="text-xs text-yellow-700">We show you what has been built before finishing. We just need you available when we schedule it.</p>
            </div>
            <StuckBtn />
          </div>
        )}

        {/* STEP 4 — Quote */}
        {step === 4 && (
          <div>
            <h2 className="text-2xl font-extrabold mb-1">Your estimate is ready! 🎉</h2>
            <p className="text-gray-500 text-sm mb-6">This is a starting range — we confirm the exact price on a free call.</p>

            {/* Price card */}
            <div className="bg-black text-white rounded-3xl p-7 text-center mb-5">
              <div className="text-gray-400 text-xs uppercase tracking-widest mb-2">Estimated investment</div>
              <div className="text-4xl md:text-5xl font-extrabold mb-1">{fmt(finalMin)} – {fmt(finalMax)}</div>
              <div className="text-gray-400 text-sm">USD · ~15% below typical market rates</div>
              {extras.length > 0 && (
                <div className="mt-3 bg-orange-500 bg-opacity-20 rounded-xl p-2 text-xs text-orange-300">
                  ⚠️ Includes {fmt(extrasTotal)} in extras beyond base range
                </div>
              )}
            </div>

            {/* Breakdown */}
            <div className="border border-gray-100 rounded-2xl overflow-hidden mb-5">
              <div className="px-5 py-3 bg-gray-50 text-xs font-bold uppercase tracking-widest text-gray-400">Breakdown</div>
              <div className="px-5 py-3 flex justify-between border-t border-gray-100 text-sm">
                <span className="text-gray-600">{tierData.emoji} {tierData.label} (base)</span>
                <span className="font-bold">{fmt(baseMin)}–{fmt(baseMax)}</span>
              </div>
              {addons.map(k => { const f = tierFeatures.addons?.find(x => x.key === k); return f ? (
                <div key={k} className="px-5 py-3 flex justify-between border-t border-gray-100 text-sm">
                  <span className="text-gray-600">{f.label}</span>
                  <span className="font-bold text-green-600">+{fmt(f.price)}</span>
                </div>
              ) : null; })}
              {extras.map(k => { const f = tierFeatures.extras?.find(x => x.key === k); return f ? (
                <div key={k} className="px-5 py-3 flex justify-between border-t border-gray-100 text-sm">
                  <span className="text-gray-600">{f.label} <span className="text-orange-400 text-xs">(extra)</span></span>
                  <span className="font-bold text-orange-500">+{fmt(f.price)}</span>
                </div>
              ) : null; })}
              {tl?.mult !== 1 && (
                <div className="px-5 py-3 flex justify-between border-t border-gray-100 text-sm">
                  <span className="text-gray-600">{tl.emoji} Timeline ({tl.sub})</span>
                  <span className={`font-bold ${tl.mult > 1 ? 'text-red-600' : 'text-green-600'}`}>{tl.mult > 1 ? '+' : '−'}{Math.round(Math.abs(tl.mult - 1) * 100)}%</span>
                </div>
              )}
              <div className="px-5 py-3 border-t border-gray-100 bg-green-50">
                <p className="text-xs text-green-700"><span className="font-bold">✅ Included:</span> Domain · Hosting · Cloud storage · Database</p>
              </div>
              <div className="px-5 py-3 border-t border-gray-100 bg-blue-50">
                <p className="text-xs text-blue-700"><span className="font-bold">ℹ️ Payments:</span> You set up your own Stripe account — we connect it. Stripe fees (~1.5–3%) are separate.</p>
              </div>
              <div className="px-5 py-3 border-t border-gray-100 bg-yellow-50">
                <p className="text-xs text-yellow-700"><span className="font-bold">💡 Professional email</span> costs a little extra — or we guide you to set it up free.</p>
              </div>
            </div>

            {/* Payment terms */}
            <div className="bg-gray-50 rounded-2xl p-5 mb-6">
              <div className="font-bold text-sm mb-3">💰 How payment works</div>
              <div className="flex flex-col gap-2">
                {['30% deposit to start — sent via Payoneer invoice', 'No Payoneer account needed — pay by bank, card, or mobile money. No extra charges.', 'Remaining balance paid when your site is ready and you approve it'].map((t, i) => (
                  <div key={i} className="flex gap-3 text-xs text-gray-600">
                    <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── SUBMIT FLOW ── */}
            {!submitted ? (
              <div className="flex flex-col gap-3">
                {/* PRIMARY: Single submit button */}
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full py-4 rounded-2xl bg-red-600 text-white font-extrabold text-base hover:bg-red-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Submitting...
                    </span>
                  ) : '🚀 Submit Quote & Get Started'}
                </button>
                <button onClick={copyQuote}
                  className="w-full py-3 rounded-2xl border-2 border-black font-bold text-sm hover:bg-black hover:text-white transition-all">
                  {copied ? '✓ Copied!' : '📋 Copy Quote Summary'}
                </button>
                <button onClick={() => setStep(2)}
                  className="w-full py-3 rounded-2xl border border-gray-200 text-gray-500 font-bold text-sm hover:border-gray-400 transition-all">
                  ← Edit Features
                </button>
              </div>
            ) : (
              /* ── POST-SUBMIT STATE: WhatsApp as next step ── */
              <div className="flex flex-col gap-3">
                <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
                  <div className="text-3xl mb-2">✅</div>
                  <p className="font-extrabold text-green-800 text-base mb-1">Quote received! We'll be in touch soon.</p>
                  <p className="text-green-600 text-sm">Your estimate has been logged and we've been notified. Next step — send it to us on WhatsApp so we can confirm and schedule a call.</p>
                </div>

                <a
                  href={`https://wa.me/233501657205?text=${encodeURIComponent(buildQuote())}`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full py-4 rounded-2xl bg-green-500 text-white font-extrabold text-base text-center block hover:bg-green-600 transition-all"
                >
                  💬 Send Quote on WhatsApp
                </a>
                <a
                  href="https://calendly.com/blackbird77ad/free-consultation"
                  target="_blank" rel="noopener noreferrer"
                  className="w-full py-4 rounded-2xl bg-black text-white font-extrabold text-base text-center block hover:opacity-90 transition-all"
                >
                  📅 Book a Free Call
                </a>
                <button onClick={copyQuote}
                  className="w-full py-3 rounded-2xl border-2 border-black font-bold text-sm hover:bg-black hover:text-white transition-all">
                  {copied ? '✓ Copied!' : '📋 Copy Quote'}
                </button>
                <button onClick={() => { setStep(0); setIndustry(''); setTier(''); setAddons([]); setExtras([]); setTimeline('standard'); setSubmitted(false); }}
                  className="w-full py-3 rounded-2xl text-gray-400 font-bold text-sm hover:text-black transition-all">
                  Start Over
                </button>

                <p className="text-center text-gray-400 text-xs mt-2">
                  We reply within a few hours on WhatsApp · +233 50 165 7205
                </p>
              </div>
            )}

            <StuckBtn />
          </div>
        )}

        {/* Nav */}
        {step < 4 && (
          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)}
                className="flex-1 py-4 rounded-2xl border-2 border-gray-200 font-bold text-base hover:border-black transition-all">
                ← Back
              </button>
            )}
            <button onClick={() => canNext && setStep(s => s + 1)} disabled={!canNext}
              className={`flex-1 py-4 rounded-2xl font-extrabold text-base text-white transition-all
                ${canNext ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
              {step === 3 ? 'See my quote →' : 'Continue →'}
            </button>
          </div>
        )}
        {step === 2 && (
          <button onClick={() => setStep(3)}
            className="w-full mt-3 py-3 rounded-2xl text-gray-400 font-bold text-sm border border-dashed border-gray-200 hover:border-gray-400 transition-all">
            Skip — decide on the call →
          </button>
        )}
      </div>
    </div>
  );
}