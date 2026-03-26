import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import emailjs from '@emailjs/browser';
import { submitLead } from '../utils/api';

const EMAILJS_SERVICE_ID  = 'service_3vfxg4e';
const EMAILJS_TEMPLATE_ID = 'template_uvbqmun';
const EMAILJS_PUBLIC_KEY  = '0VeNb5hN21304FM3_';
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw_PrDQAe5o4TPxrpFdJfwg_BEghxmpBHJ5j1AwEQBxbTaJSscVUSwUl3URqYqgn1RlZQ/exec';

const INDUSTRIES = [
  { key: 'food',         emoji: '🍽️', label: 'Food & Restaurant'     },
  { key: 'travel',       emoji: '✈️', label: 'Travel & Tourism'       },
  { key: 'fashion',      emoji: '👗', label: 'Fashion & Beauty'        },
  { key: 'entrepreneur', emoji: '💼', label: 'Entrepreneur / Startup'  },
  { key: 'consultancy',  emoji: '🧠', label: 'Consultancy / Coaching'  },
  { key: 'brand',        emoji: '✨', label: 'Brand / Creative'        },
  { key: 'health',       emoji: '💊', label: 'Health & Wellness'       },
  { key: 'education',    emoji: '📚', label: 'Education / Training'    },
  { key: 'real_estate',  emoji: '🏠', label: 'Real Estate'             },
  { key: 'nonprofit',    emoji: '❤️', label: 'NGO / Non-Profit'        },
  { key: 'retail',       emoji: '🛒', label: 'Retail / Online Shop'    },
  { key: 'other',        emoji: '🌐', label: 'Something Else'          },
];

const WHY_WEBSITE = [
  { key: 'customers',    label: '👥 Get more customers'            },
  { key: 'professional', label: '💼 Look more professional'        },
  { key: 'sell',         label: '🛒 Sell products online'          },
  { key: 'portfolio',    label: '🖼 Show my work / portfolio'      },
  { key: 'bookings',     label: '📅 Take bookings or appointments' },
  { key: 'whatsapp',     label: '📱 Replace WhatsApp ordering'     },
  { key: 'visibility',   label: '🔍 Be found on Google'            },
  { key: 'other',        label: '✏️ Other reason'                  },
];

const PAGES = ['Home', 'About', 'Services', 'Contact', 'Gallery', 'Blog', 'FAQ', 'Pricing', 'Testimonials', 'Team', 'Shop'];

const MOODS = ['😊 Friendly', '💼 Professional', '⚡ Bold & Strong', '🎨 Colourful', '🤍 Clean & Minimal', '💎 Luxury & Elegant', '🎉 Fun & Playful', '🏢 Corporate', '✏️ Other'];

const SOCIALS = [
  { key: 'instagram', label: 'Instagram',   placeholder: '@yourusername'             },
  { key: 'facebook',  label: 'Facebook',    placeholder: 'facebook.com/yourpage'     },
  { key: 'tiktok',    label: 'TikTok',      placeholder: '@yourtiktok'               },
  { key: 'linkedin',  label: 'LinkedIn',    placeholder: 'linkedin.com/in/you'       },
  { key: 'twitter',   label: 'X / Twitter', placeholder: '@yourhandle'               },
  { key: 'youtube',   label: 'YouTube',     placeholder: 'youtube.com/c/yourchannel' },
];

const STEPS = [
  { title: 'About You',          emoji: '👋' },
  { title: 'Your Website Goals', emoji: '🎯' },
  { title: 'Pages You Need',     emoji: '📄' },
  { title: 'Look & Feel',        emoji: '🎨' },
  { title: 'What You Have',      emoji: '📦' },
  { title: 'Budget & Timeline',  emoji: '💰' },
  { title: 'Review & Submit',    emoji: '✅' },
];

/* ── Tiny shared UI components ── */
const TIP = ({ children }) => (
  <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 mb-4">
    <p className="text-xs text-blue-700 leading-relaxed">💡 {children}</p>
  </div>
);
const Label = ({ children, required }) => (
  <label className="block text-sm font-bold text-gray-800 mb-2">
    {children}{required && <span className="text-red-500 ml-1">*</span>}
  </label>
);
const Input = (props) => (
  <input {...props} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-800 transition-all bg-white" />
);
const Textarea = (props) => (
  <textarea {...props} rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-800 transition-all bg-white resize-none" />
);
const CheckPill = ({ label, checked, onChange }) => (
  <button type="button" onClick={onChange}
    className={`px-4 py-2.5 rounded-2xl border-2 text-sm font-bold transition-all text-left ${checked ? 'border-red-600 bg-red-50 text-red-700' : 'border-gray-100 bg-white text-gray-600 hover:border-gray-300'}`}>
    {checked && <span className="mr-1">✓</span>}{label}
  </button>
);
const RadioCard = ({ label, sub, checked, onClick }) => (
  <button type="button" onClick={onClick}
    className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${checked ? 'border-red-600 bg-red-50' : 'border-gray-100 bg-white hover:border-gray-300'}`}>
    <div className="font-bold text-sm">{label}</div>
    {sub && <div className="text-xs text-gray-500 mt-0.5">{sub}</div>}
  </button>
);
const StuckModal = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
    <div className="bg-white rounded-3xl p-7 max-w-sm w-full" onClick={e => e.stopPropagation()}>
      <div className="text-2xl mb-1">😊 No worries!</div>
      <p className="text-gray-600 text-sm leading-relaxed mb-5">Fill in what you can — we'll go through the rest together.</p>
      <div className="flex flex-col gap-3">
        <a href="https://wa.me/233501657205" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-3 p-4 rounded-2xl bg-green-50 border border-green-200 hover:bg-green-100 transition-all">
          <span className="text-2xl">💬</span>
          <div><div className="font-bold text-sm text-green-800">WhatsApp</div><div className="text-xs text-green-600">+233 50 165 7205</div></div>
        </a>
        <a href="mailto:davida@thebrandhelper.com"
          className="flex items-center gap-3 p-4 rounded-2xl bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-all">
          <span className="text-2xl">📧</span>
          <div><div className="font-bold text-sm text-blue-800">Email</div><div className="text-xs text-blue-600">davida@thebrandhelper.com</div></div>
        </a>
        <a href="https://calendly.com/blackbird77ad/free-consultation" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 hover:bg-red-100 transition-all">
          <span className="text-2xl">📅</span>
          <div><div className="font-bold text-sm text-red-800">Book a Free Call</div><div className="text-xs text-red-600">Go through everything with us</div></div>
        </a>
      </div>
      <button onClick={onClose} className="w-full mt-4 py-3 rounded-2xl border-2 border-gray-200 font-bold text-sm text-gray-500">
        Continue filling the form →
      </button>
    </div>
  </div>
);

export default function ClientRequirements() {
  const [step,       setStep]       = useState(0);
  const [showStuck,  setShowStuck]  = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [copied,     setCopied]     = useState(false);

  // Step 0
  const [name,      setName]      = useState('');
  const [bizName,   setBizName]   = useState('');
  const [industry,  setIndustry]  = useState('');
  const [email,     setEmail]     = useState('');
  const [phone,     setPhone]     = useState('');
  const [socials,   setSocials]   = useState({});
  const [whyNeeds,  setWhyNeeds]  = useState([]);
  const [whyOther,  setWhyOther]  = useState('');
  // Step 1
  const [siteAbout,   setSiteAbout]   = useState('');
  const [hasWebsite,  setHasWebsite]  = useState('');
  const [existingUrl, setExistingUrl] = useState('');
  const [siteIssue,   setSiteIssue]   = useState('');
  // Step 2
  const [pages,       setPages]       = useState([]);
  const [otherPage,   setOtherPage]   = useState('');
  const [pageContent, setPageContent] = useState({});
  // Step 3
  const [moods,       setMoods]       = useState([]);
  const [moodOther,   setMoodOther]   = useState('');
  const [hasColors,   setHasColors]   = useState('');
  const [color1,      setColor1]      = useState('#c0392b');
  const [color2,      setColor2]      = useState('#e67e22');
  const [color3,      setColor3]      = useState('#1a1a1a');
  const [siteInspire, setSiteInspire] = useState(['', '', '']);
  // Step 4
  const [hasLogo,     setHasLogo]     = useState('');
  const [hasDomain,   setHasDomain]   = useState('');
  const [domainName,  setDomainName]  = useState('');
  const [hasProEmail, setHasProEmail] = useState('');
  const [hasPhotos,   setHasPhotos]   = useState('');
  const [driveLink,   setDriveLink]   = useState('');
  const [mediaNote,   setMediaNote]   = useState('');
  const [recording,   setRecording]   = useState('');
  const [extraNotes,  setExtraNotes]  = useState('');
  // Step 5
  const [tier,     setTier]     = useState('');
  const [budget,   setBudget]   = useState('');
  const [timeline, setTimeline] = useState('');

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [step]);

  const toggleArr = (arr, setArr, key) =>
    setArr(a => a.includes(key) ? a.filter(k => k !== key) : [...a, key]);

  const allPages = [...pages, ...(otherPage.trim() ? [otherPage.trim()] : [])];

  const buildSummary = () => {
    const ind = INDUSTRIES.find(i => i.key === industry);
    return [
      `PROJECT BRIEF — The BrandHelper`,
      `Submitted by: ${name}`,
      ``,
      `━━━ CONTACT ━━━`,
      `Name:       ${name}`,
      `Business:   ${bizName}`,
      `Industry:   ${ind?.emoji} ${ind?.label}`,
      `Email:      ${email}`,
      `Phone:      ${phone}`,
      Object.entries(socials).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join(' · '),
      ``,
      `━━━ WEBSITE GOALS ━━━`,
      whyNeeds.map(k => `• ${WHY_WEBSITE.find(w => w.key === k)?.label}`).join('\n'),
      whyOther ? `• Other: ${whyOther}` : '',
      `What it's about: ${siteAbout}`,
      hasWebsite === 'yes' ? `Existing site: ${existingUrl}` : `No existing website`,
      siteIssue ? `Issues: ${siteIssue}` : '',
      ``,
      `━━━ PAGES ━━━`,
      allPages.map(p => {
        const c = pageContent[p];
        return `• ${p} — ${c === 'have' ? 'Content ready' : c === 'write' ? 'Please write it' : 'Not sure'}`;
      }).join('\n'),
      ``,
      `━━━ LOOK & FEEL ━━━`,
      `Style: ${moods.join(', ')}${moodOther ? ', ' + moodOther : ''}`,
      hasColors === 'yes' ? `Colors: ${color1} · ${color2} · ${color3}` : hasColors === 'no' ? 'Colors: Choose for me' : 'Colors: Not sure',
      siteInspire.filter(Boolean).length ? `Inspired by: ${siteInspire.filter(Boolean).join(', ')}` : '',
      ``,
      `━━━ ASSETS ━━━`,
      `Logo:    ${hasLogo || 'Not answered'}`,
      `Domain:  ${hasDomain === 'yes' ? domainName || 'Yes' : hasDomain || 'Not answered'}`,
      `Email:   ${hasProEmail || 'Not answered'}`,
      `Photos:  ${hasPhotos || 'Not answered'}`,
      driveLink  ? `Drive:   ${driveLink}`   : '',
      mediaNote  ? `Notes:   ${mediaNote}`   : '',
      recording  ? `Recording: ${recording}` : '',
      extraNotes ? `Extra:   ${extraNotes}`  : '',
      ``,
      `━━━ BUDGET & TIMELINE ━━━`,
      `Tier:     ${tier     || 'Not answered'}`,
      `Budget:   ${budget   || 'Not answered'}`,
      `Timeline: ${timeline || 'Not answered'}`,
    ].filter(l => l !== null && l !== '').join('\n');
  };

  // ── SINGLE SUBMIT: Sheet + EmailJS → reveal WhatsApp ─────────────────────
  const handleSubmit = async () => {
    setSubmitting(true);
    const ind = INDUSTRIES.find(i => i.key === industry);
    const payload = {
      // ── EmailJS routing fields — REQUIRED for delivery ──
      to_email:     'davida@thebrandhelper.com',
      to_name:      'The BrandHelper Team',
      from_name:    name || 'New Lead',
      reply_to:     email || 'noreply@thebrandhelper.com',
      subject:      `New Project Brief — ${bizName || name}`,
      // ── Form data ──
      form_type:    'Project Requirements Brief',
      client_name:  name,
      business_name: bizName,
      industry:     ind ? `${ind.emoji} ${ind.label}` : '',
      email,
      phone,
      tier:         tier     || 'Not answered',
      budget:       budget   || 'Not answered',
      timeline:     timeline || 'Not answered',
      site_about:   siteAbout,
      pages:        allPages.join(', '),
      has_logo:     hasLogo,
      has_domain:   hasDomain === 'yes' ? domainName || 'Yes' : hasDomain,
      has_photos:   hasPhotos,
      full_brief:   buildSummary(),
      submitted_at: new Date().toLocaleString('en-GB', { timeZone: 'Africa/Accra' }),
    };

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, payload, EMAILJS_PUBLIC_KEY);
    } catch (e) { console.warn('EmailJS:', e); }

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (e) { console.warn('Sheets:', e); }

    // Server — stores lead in leads.json
    try { await submitLead(payload); } catch (e) { console.warn('Server:', e); }

    setSubmitting(false);
    setSubmitted(true);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(buildSummary()).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2500);
    });
  };

  const resetForm = () => {
    setStep(0); setName(''); setBizName(''); setIndustry(''); setEmail(''); setPhone('');
    setSocials({}); setWhyNeeds([]); setWhyOther(''); setSiteAbout(''); setHasWebsite('');
    setExistingUrl(''); setSiteIssue(''); setPages([]); setOtherPage(''); setPageContent({});
    setMoods([]); setMoodOther(''); setHasColors(''); setSiteInspire(['', '', '']);
    setHasLogo(''); setHasDomain(''); setDomainName(''); setHasProEmail(''); setHasPhotos('');
    setDriveLink(''); setMediaNote(''); setRecording(''); setExtraNotes('');
    setTier(''); setBudget(''); setTimeline(''); setSubmitted(false);
  };

  const canNext = [
    name && bizName && email && phone,
    siteAbout,
    pages.length > 0,
    moods.length > 0 || hasColors,
    hasLogo && hasPhotos && hasDomain && hasProEmail,
    tier && budget && timeline,
    true,
  ][step];

  const StuckBtn = () => (
    <button type="button" onClick={() => setShowStuck(true)}
      className="w-full mt-5 py-3 rounded-2xl border border-dashed border-gray-300 text-gray-400 font-bold text-sm hover:border-gray-500 hover:text-gray-600 transition-all flex items-center justify-center gap-2">
      😕 Not sure? Talk to us →
    </button>
  );

  return (
    <div className="min-h-screen bg-white text-black">
      <Helmet><title>Project Requirements | The BrandHelper</title></Helmet>
      {showStuck && <StuckModal onClose={() => setShowStuck(false)} />}

      <div className="bg-black text-white px-6 py-10 text-center">
        <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-2">Free — Takes 5 mins</p>
        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-3">Tell Us About Your Project</h1>
        <p className="text-gray-400 text-sm max-w-lg mx-auto">Fill this in so we understand exactly what you need. Don't worry about getting everything perfect — just share what you can.</p>
      </div>

      {/* Progress */}
      <div className="bg-gray-50 border-b border-gray-100 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center">
            {STEPS.map((s, i) => (
              <div key={s.title} className="flex items-center flex-1">
                <button onClick={() => i < step && setStep(i)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 border-2 transition-all
                    ${i < step ? 'bg-red-600 border-red-600 text-white cursor-pointer' : i === step ? 'bg-black border-black text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                  {i < step ? '✓' : i + 1}
                </button>
                {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-0.5 ${i < step ? 'bg-red-600' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
          <div className="text-center text-sm font-bold mt-2">{STEPS[step].emoji} {STEPS[step].title}</div>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-8">

        {/* ── STEP 0 ── */}
        {step === 0 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-2xl font-extrabold mb-1">Let's start with you 👋</h2>
            <p className="text-gray-500 text-sm">Fields marked <span className="text-red-500">*</span> are required.</p>
            <TIP>The more you share, the better we can tailor your solution!</TIP>
            <div><Label required>Your full name</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Abena Mensah" /></div>
            <div><Label required>Your business name</Label><Input value={bizName} onChange={e => setBizName(e.target.value)} placeholder="e.g. Abena's Kitchen" /></div>
            <div>
              <Label required>Industry</Label>
              <div className="grid grid-cols-2 gap-2">
                {INDUSTRIES.map(ind => (
                  <button key={ind.key} type="button" onClick={() => setIndustry(ind.key)}
                    className={`text-left px-3 py-2.5 rounded-xl border-2 text-sm transition-all ${industry === ind.key ? 'border-red-600 bg-red-50 font-bold' : 'border-gray-100 hover:border-gray-300'}`}>
                    {ind.emoji} {ind.label}
                  </button>
                ))}
              </div>
            </div>
            <div><Label required>Email address</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" /></div>
            <div><Label required>Phone / WhatsApp</Label><Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+233 xx xxx xxxx" /></div>
            <div>
              <Label>Social media <span className="text-gray-400 font-normal text-xs">(optional)</span></Label>
              <div className="flex flex-col gap-2">
                {SOCIALS.map(s => (
                  <div key={s.key} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 w-20 shrink-0">{s.label}</span>
                    <Input value={socials[s.key] || ''} onChange={e => setSocials(prev => ({ ...prev, [s.key]: e.target.value }))} placeholder={s.placeholder} />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label required>Why do you need a website?</Label>
              <TIP>Pick all that apply — no wrong answers!</TIP>
              <div className="flex flex-wrap gap-2">
                {WHY_WEBSITE.map(w => (
                  <CheckPill key={w.key} label={w.label} checked={whyNeeds.includes(w.key)} onChange={() => toggleArr(whyNeeds, setWhyNeeds, w.key)} />
                ))}
              </div>
              {whyNeeds.includes('other') && (
                <div className="mt-3"><Input value={whyOther} onChange={e => setWhyOther(e.target.value)} placeholder="Tell us more..." /></div>
              )}
            </div>
            <StuckBtn />
          </div>
        )}

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-2xl font-extrabold mb-1">About your website 🎯</h2>
            <TIP>Just tell us in your own words — like explaining it to a friend.</TIP>
            <div>
              <Label required>What is your website about?</Label>
              <Textarea value={siteAbout} onChange={e => setSiteAbout(e.target.value)} placeholder="e.g. I sell homemade soap. I want people to see my products and order from me..." />
            </div>
            <div>
              <Label>Do you already have a website?</Label>
              <div className="flex flex-col gap-2">
                {[{ key: 'yes', label: 'Yes, I have one' }, { key: 'no', label: 'No, this will be my first website' }].map(o => (
                  <RadioCard key={o.key} label={o.label} checked={hasWebsite === o.key} onClick={() => setHasWebsite(o.key)} />
                ))}
              </div>
              {hasWebsite === 'yes' && (
                <div className="mt-3 flex flex-col gap-2">
                  <Input value={existingUrl} onChange={e => setExistingUrl(e.target.value)} placeholder="Paste your website link" />
                  <Textarea value={siteIssue} onChange={e => setSiteIssue(e.target.value)} placeholder="What's wrong with it or what do you want to improve?" />
                </div>
              )}
            </div>
            <StuckBtn />
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-2xl font-extrabold mb-1">Pages you need 📄</h2>
            <TIP>Not sure which pages? Pick what sounds right — we'll advise on the call.</TIP>
            <div>
              <Label required>Which pages do you want?</Label>
              <div className="flex flex-wrap gap-2 mb-3">
                {PAGES.map(p => (
                  <CheckPill key={p} label={p} checked={pages.includes(p)} onChange={() => toggleArr(pages, setPages, p)} />
                ))}
              </div>
              <Input value={otherPage} onChange={e => setOtherPage(e.target.value)} placeholder="Any other page? Type here..." />
            </div>
            {allPages.length > 0 && (
              <div>
                <Label>Do you have content ready for each page?</Label>
                <p className="text-xs text-gray-400 mb-3">Content = text, photos, and info for each page.</p>
                <div className="flex flex-col gap-3">
                  {allPages.map(p => (
                    <div key={p} className="border border-gray-100 rounded-2xl p-4">
                      <div className="font-bold text-sm mb-3">📄 {p}</div>
                      <div className="flex flex-col gap-2">
                        {[
                          { key: 'have',   label: '✅ I have the content ready'       },
                          { key: 'write',  label: '✏️ Please write it for me'         },
                          { key: 'unsure', label: '🤷 Not sure — take over for me'    },
                        ].map(o => (
                          <RadioCard key={o.key} label={o.label} checked={pageContent[p] === o.key} onClick={() => setPageContent(prev => ({ ...prev, [p]: o.key }))} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <StuckBtn />
          </div>
        )}

        {/* ── STEP 3 ── */}
        {step === 3 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-2xl font-extrabold mb-1">Look & feel 🎨</h2>
            <TIP>Think about how you want visitors to feel when they land on your site.</TIP>
            <div>
              <Label>What style do you like?</Label>
              <div className="flex flex-wrap gap-2">
                {MOODS.map(m => (
                  <CheckPill key={m} label={m} checked={moods.includes(m)} onChange={() => toggleArr(moods, setMoods, m)} />
                ))}
              </div>
              {moods.includes('✏️ Other') && (
                <div className="mt-3"><Input value={moodOther} onChange={e => setMoodOther(e.target.value)} placeholder="Describe your style..." /></div>
              )}
            </div>
            <div>
              <Label>Brand colours?</Label>
              <div className="flex flex-col gap-2 mb-3">
                {[
                  { key: 'yes',    label: 'Yes — I have my colours',           sub: 'Pick them below'                    },
                  { key: 'no',     label: 'No — please choose for me',         sub: 'We pick what suits your brand'      },
                  { key: 'unsure', label: 'Not sure — use your best judgment', sub: 'We will advise on the call'         },
                ].map(o => <RadioCard key={o.key} label={o.label} sub={o.sub} checked={hasColors === o.key} onClick={() => setHasColors(o.key)} />)}
              </div>
              {hasColors === 'yes' && (
                <div className="flex gap-4 mt-2">
                  {[[color1, setColor1, 'Main'], [color2, setColor2, 'Second'], [color3, setColor3, 'Third']].map(([val, set, lbl]) => (
                    <div key={lbl} className="flex flex-col items-center gap-1">
                      <input type="color" value={val} onChange={e => set(e.target.value)} className="w-12 h-12 rounded-xl border border-gray-200 cursor-pointer" />
                      <span className="text-xs text-gray-500">{lbl}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <Label>Any websites you like? <span className="text-gray-400 font-normal text-xs">(optional)</span></Label>
              {siteInspire.map((url, i) => (
                <div key={i} className="mb-2">
                  <Input value={url} onChange={e => { const c = [...siteInspire]; c[i] = e.target.value; setSiteInspire(c); }} placeholder={`Website ${i + 1} — e.g. https://example.com`} />
                </div>
              ))}
            </div>
            <StuckBtn />
          </div>
        )}

        {/* ── STEP 4 ── */}
        {step === 4 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-2xl font-extrabold mb-1">What you already have 📦</h2>
            <TIP>Don't worry if you don't have everything — we can help.</TIP>
            <div>
              <Label required>Logo?</Label>
              <div className="flex flex-col gap-2">
                {[
                  { key: 'yes',    label: '✅ Yes, I have a logo ready'                                        },
                  { key: 'no',     label: '❌ No, I need one designed', sub: 'Logo design is an extra service' },
                  { key: 'unsure', label: '🤷 Not sure'                                                        },
                ].map(o => <RadioCard key={o.key} label={o.label} sub={o.sub} checked={hasLogo === o.key} onClick={() => setHasLogo(o.key)} />)}
              </div>
            </div>
            <div>
              <Label required>Domain name? <span className="text-gray-400 font-normal text-xs">(e.g. mybusiness.com)</span></Label>
              <div className="flex flex-col gap-2">
                {[
                  { key: 'yes',     label: '✅ Yes, I already have one'     },
                  { key: 'no',      label: '❌ No, I need one',              sub: 'Included in your quote'             },
                  { key: 'unknown', label: "❓ I don't know what this is",   sub: "We'll explain on our call"          },
                ].map(o => <RadioCard key={o.key} label={o.label} sub={o.sub} checked={hasDomain === o.key} onClick={() => setHasDomain(o.key)} />)}
              </div>
              {hasDomain === 'yes' && (
                <div className="mt-3"><Input value={domainName} onChange={e => setDomainName(e.target.value)} placeholder="e.g. mybusiness.com" /></div>
              )}
            </div>
            <div>
              <Label required>Professional email? <span className="text-gray-400 font-normal text-xs">(you@yourbusiness.com)</span></Label>
              <div className="flex flex-col gap-2">
                {[
                  { key: 'yes',     label: '✅ Yes'                                                                    },
                  { key: 'no',      label: '❌ No, I want one', sub: 'Small extra or we guide you to set it up free'   },
                  { key: 'unknown', label: "❓ I don't know what this is"                                               },
                ].map(o => <RadioCard key={o.key} label={o.label} sub={o.sub} checked={hasProEmail === o.key} onClick={() => setHasProEmail(o.key)} />)}
              </div>
            </div>
            <div>
              <Label required>Photos / images?</Label>
              <div className="flex flex-col gap-2">
                {[
                  { key: 'all',    label: '📸 Yes, all ready'                                                         },
                  { key: 'some',   label: '🖼 Some but not all'                                                       },
                  { key: 'none',   label: "❌ None yet",              sub: 'We can use stock photos or advise you'     },
                  { key: 'unsure', label: '🤷 Not sure'                                                                },
                ].map(o => <RadioCard key={o.key} label={o.label} sub={o.sub} checked={hasPhotos === o.key} onClick={() => setHasPhotos(o.key)} />)}
              </div>
              {(hasPhotos === 'all' || hasPhotos === 'some') && (
                <div className="mt-3 flex flex-col gap-2">
                  <Input value={driveLink} onChange={e => setDriveLink(e.target.value)} placeholder="Google Drive or Dropbox link to your photos" />
                  <Textarea value={mediaNote} onChange={e => setMediaNote(e.target.value)} placeholder="Any notes about the photos?" />
                </div>
              )}
            </div>
            <div>
              <Label>Voice or video note? <span className="text-gray-400 font-normal text-xs">(optional — very helpful!)</span></Label>
              <Input value={recording} onChange={e => setRecording(e.target.value)} placeholder="Loom, Drive, or YouTube link" />
            </div>
            <div>
              <Label>Anything else? <span className="text-gray-400 font-normal text-xs">(optional)</span></Label>
              <Textarea value={extraNotes} onChange={e => setExtraNotes(e.target.value)} placeholder="Anything at all — the more you share the better!" />
            </div>
            <StuckBtn />
          </div>
        )}

        {/* ── STEP 5 ── */}
        {step === 5 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-2xl font-extrabold mb-1">Budget & timeline 💰</h2>
            <div>
              <Label required>What kind of website do you think you need?</Label>
              <p className="text-xs text-gray-400 mb-3">Not sure? Use our <a href="/contact/calc" className="text-red-600 underline font-bold">pricing calculator</a> for a breakdown.</p>
              <div className="flex flex-col gap-2">
                {[
                  { key: 'simple',       label: '🌱 Simple Website',      sub: '$300–$500 · 3–6 pages, no accounts or payments'  },
                  { key: 'intermediate', label: '🚀 Intermediate Website', sub: '$450–$650 · Backend, admin, integrations'        },
                  { key: 'complex',      label: '⚡ Full Web Platform',    sub: '$550–$1000 · Accounts, payments, dashboard'      },
                  { key: 'unsure',       label: '🤷 Not sure — advise me', sub: 'We will recommend the right option'              },
                ].map(o => <RadioCard key={o.key} label={o.label} sub={o.sub} checked={tier === o.key} onClick={() => setTier(o.key)} />)}
              </div>
            </div>
            <div>
              <Label required>Budget range</Label>
              <div className="flex flex-col gap-2">
                {[
                  { key: 'under300',  label: 'Under $300'           },
                  { key: '300_500',   label: '$300 – $500'          },
                  { key: '500_700',   label: '$500 – $700'          },
                  { key: '700_1000',  label: '$700 – $1,000'        },
                  { key: 'above1000', label: 'Above $1,000'         },
                  { key: 'unsure',    label: 'Not sure — advise me' },
                ].map(o => <RadioCard key={o.key} label={o.label} checked={budget === o.key} onClick={() => setBudget(o.key)} />)}
              </div>
            </div>
            <div>
              <Label required>When do you need it?</Label>
              <div className="flex flex-col gap-2">
                {[
                  { key: 'patient',  label: '🌿 No rush',   sub: '6–8 weeks · saves 20%'          },
                  { key: 'standard', label: '⏳ Normal',     sub: '3–5 weeks · standard pricing'   },
                  { key: 'express',  label: '⚡ Urgently',   sub: '1–2 weeks · 30% priority extra' },
                  { key: 'unsure',   label: '🤷 Not sure'                                          },
                ].map(o => <RadioCard key={o.key} label={o.label} sub={o.sub} checked={timeline === o.key} onClick={() => setTimeline(o.key)} />)}
              </div>
            </div>
            <StuckBtn />
          </div>
        )}

        {/* ── STEP 6 — Review & Submit ── */}
        {step === 6 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-2xl font-extrabold mb-1">Review & Submit 🎉</h2>
            <p className="text-gray-500 text-sm">Here's a summary of your brief. Hit submit and we'll be in touch very soon.</p>

            {/* Summary card */}
            <div className="border border-gray-100 rounded-2xl overflow-hidden">
              <div className="bg-black text-white px-5 py-4">
                <div className="font-extrabold">Your Project Brief</div>
                <div className="text-gray-400 text-xs mt-0.5">Summary — full details sent to our team</div>
              </div>
              {[
                { label: 'Name',      value: name       },
                { label: 'Business',  value: bizName    },
                { label: 'Industry',  value: INDUSTRIES.find(i => i.key === industry)?.label },
                { label: 'Email',     value: email      },
                { label: 'Phone',     value: phone      },
                { label: 'Pages',     value: allPages.join(', ') || 'None selected' },
                { label: 'Style',     value: moods.slice(0, 3).join(', ') || 'Not set' },
                { label: 'Logo',      value: hasLogo    },
                { label: 'Domain',    value: hasDomain === 'yes' ? domainName || 'Yes' : hasDomain },
                { label: 'Photos',    value: hasPhotos  },
                { label: 'Tier',      value: tier       },
                { label: 'Budget',    value: budget     },
                { label: 'Timeline',  value: timeline   },
              ].filter(r => r.value).map((row, i) => (
                <div key={i} className="px-5 py-3 flex justify-between border-t border-gray-50 text-sm">
                  <span className="text-gray-400 shrink-0 mr-3">{row.label}</span>
                  <span className="font-bold text-right">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4">
              <p className="text-xs text-yellow-700">
                <span className="font-bold">Not sure about any section?</span> That's fine — just submit what you have and we'll fill in the gaps on our free call.
              </p>
            </div>

            {/* ── SUBMIT FLOW ── */}
            {!submitted ? (
              <div className="flex flex-col gap-3">
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
                      Submitting brief...
                    </span>
                  ) : '🚀 Submit My Project Brief'}
                </button>
                <button onClick={copyAll}
                  className="w-full py-3 rounded-2xl border-2 border-black font-bold text-sm hover:bg-black hover:text-white transition-all">
                  {copied ? '✓ Copied!' : '📋 Copy Brief Summary'}
                </button>
              </div>
            ) : (
              /* ── POST-SUBMIT: WhatsApp as next step ── */
              <div className="flex flex-col gap-3">
                <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
                  <div className="text-4xl mb-3">🎉</div>
                  <p className="font-extrabold text-green-800 text-lg mb-1">Brief received!</p>
                  <p className="text-green-600 text-sm leading-relaxed">
                    Your project brief has been logged and our team has been notified at <strong>davida@thebrandhelper.com</strong>. Next step — send it to us on WhatsApp so we can confirm and schedule your free consultation call.
                  </p>
                </div>

                {/* PRIMARY next action */}
                <a
                  href={`https://wa.me/233501657205?text=${encodeURIComponent(buildSummary())}`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full py-4 rounded-2xl bg-green-500 text-white font-extrabold text-base text-center block hover:bg-green-600 transition-all"
                >
                  💬 Send Brief on WhatsApp
                </a>
                <a
                  href="https://calendly.com/blackbird77ad/free-consultation"
                  target="_blank" rel="noopener noreferrer"
                  className="w-full py-4 rounded-2xl bg-black text-white font-extrabold text-base text-center block hover:opacity-90 transition-all"
                >
                  📅 Book Free Consultation Call
                </a>
                <button onClick={copyAll}
                  className="w-full py-3 rounded-2xl border-2 border-black font-bold text-sm hover:bg-black hover:text-white transition-all">
                  {copied ? '✓ Copied!' : '📋 Copy Full Brief'}
                </button>
                <button onClick={resetForm}
                  className="w-full py-3 rounded-2xl text-gray-400 font-bold text-sm hover:text-black transition-all">
                  Start Over
                </button>

                <p className="text-center text-gray-400 text-xs mt-1 leading-relaxed">
                  We reply within a few hours · WhatsApp: +233 50 165 7205 · Email: davida@thebrandhelper.com
                </p>
              </div>
            )}

            <StuckBtn />
          </div>
        )}

        {/* Nav */}
        {step < 6 && (
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
              {step === 5 ? 'Review my brief →' : 'Continue →'}
            </button>
          </div>
        )}
        {step < 6 && (
          <button onClick={() => setStep(s => s + 1)}
            className="w-full mt-3 py-3 rounded-2xl text-gray-400 font-bold text-sm border border-dashed border-gray-200 hover:border-gray-400 transition-all">
            Skip — I'll answer on the call →
          </button>
        )}
      </div>
    </div>
  );
}