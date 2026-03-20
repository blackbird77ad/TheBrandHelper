import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

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
  { key: 'customers',    label: '👥 Get more customers'           },
  { key: 'professional', label: '💼 Look more professional'       },
  { key: 'sell',         label: '🛒 Sell products online'         },
  { key: 'portfolio',    label: '🖼 Show my work / portfolio'     },
  { key: 'bookings',     label: '📅 Take bookings or appointments' },
  { key: 'whatsapp',     label: '📱 Replace WhatsApp ordering'    },
  { key: 'visibility',   label: '🔍 Be found on Google'           },
  { key: 'other',        label: '✏️ Other reason'                 },
];

const PAGES = [
  'Home', 'About', 'Services', 'Contact', 'Gallery',
  'Blog', 'FAQ', 'Pricing', 'Testimonials', 'Team', 'Shop',
];

const MOODS = [
  '😊 Friendly', '💼 Professional', '⚡ Bold & Strong',
  '🎨 Colourful', '🤍 Clean & Minimal', '💎 Luxury & Elegant',
  '🎉 Fun & Playful', '🏢 Corporate', '✏️ Other',
];

const SOCIALS = [
  { key: 'instagram',  label: 'Instagram',  placeholder: '@yourusername'          },
  { key: 'facebook',   label: 'Facebook',   placeholder: 'facebook.com/yourpage'  },
  { key: 'tiktok',     label: 'TikTok',     placeholder: '@yourtiktok'            },
  { key: 'linkedin',   label: 'LinkedIn',   placeholder: 'linkedin.com/in/you'    },
  { key: 'twitter',    label: 'X / Twitter',placeholder: '@yourhandle'            },
  { key: 'youtube',    label: 'YouTube',    placeholder: 'youtube.com/c/yourchannel'},
];

const STEPS = [
  { title: 'About You',          emoji: '👋' },
  { title: 'Your Website Goals', emoji: '🎯' },
  { title: 'Pages You Need',     emoji: '📄' },
  { title: 'Look & Feel',        emoji: '🎨' },
  { title: 'What You Have',      emoji: '📦' },
  { title: 'Budget & Timeline',  emoji: '💰' },
  { title: 'Review & Send',      emoji: '✅' },
];

const TIP = ({ children }) => (
  <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 mb-5">
    <p className="text-xs text-blue-700 leading-relaxed">💡 {children}</p>
  </div>
);

const Label = ({ children, required }) => (
  <label className="block text-sm font-bold text-gray-800 mb-2">
    {children}{required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

const Input = ({ ...props }) => (
  <input {...props} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-800 transition-all bg-white" />
);

const Textarea = ({ ...props }) => (
  <textarea {...props} rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-800 transition-all bg-white resize-none" />
);

const CheckPill = ({ label, checked, onChange }) => (
  <button type="button" onClick={onChange}
    className={`px-4 py-2.5 rounded-2xl border-2 text-sm font-bold transition-all text-left ${checked ? 'border-red-600 bg-red-50 text-red-700' : 'border-gray-100 bg-white text-gray-600 hover:border-gray-300'}`}>
    {checked && <span className="mr-1">✓</span>}{label}
  </button>
);

const RadioCard = ({ label, sub, checked, onClick, explain }) => (
  <button type="button" onClick={onClick}
    className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${checked ? 'border-red-600 bg-red-50' : 'border-gray-100 bg-white hover:border-gray-300'}`}>
    <div className="font-bold text-sm">{label}</div>
    {sub && <div className="text-xs text-gray-500 mt-0.5">{sub}</div>}
    {explain && <div className="text-xs text-blue-600 mt-1 italic">{explain}</div>}
  </button>
);

const StuckBtn = ({ onClick }) => (
  <button type="button" onClick={onClick}
    className="w-full mt-5 py-3 rounded-2xl border border-dashed border-gray-300 text-gray-400 font-bold text-sm hover:border-gray-500 hover:text-gray-600 transition-all flex items-center justify-center gap-2">
    😕 Not sure? Talk to us →
  </button>
);

const StuckModal = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
    <div className="bg-white rounded-3xl p-7 max-w-sm w-full" onClick={e => e.stopPropagation()}>
      <div className="text-2xl mb-1">😊 No worries at all!</div>
      <p className="text-gray-600 text-sm leading-relaxed mb-5">Fill in what you can and leave the rest — we will go through everything together. Or reach us directly:</p>
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
  const [step,      setStep]      = useState(0);
  const [showStuck, setShowStuck] = useState(false);
  const [copied,    setCopied]    = useState(false);

  // Step 1
  const [name,       setName]       = useState('');
  const [bizName,    setBizName]    = useState('');
  const [industry,   setIndustry]   = useState('');
  const [email,      setEmail]      = useState('');
  const [phone,      setPhone]      = useState('');
  const [socials,    setSocials]    = useState({});
  const [whyNeeds,   setWhyNeeds]   = useState([]);
  const [whyOther,   setWhyOther]   = useState('');

  // Step 2
  const [siteAbout,   setSiteAbout]   = useState('');
  const [hasWebsite,  setHasWebsite]  = useState('');
  const [existingUrl, setExistingUrl] = useState('');
  const [siteIssue,   setSiteIssue]   = useState('');

  // Step 3
  const [pages,      setPages]      = useState([]);
  const [otherPage,  setOtherPage]  = useState('');
  const [pageContent, setPageContent] = useState({});

  // Step 4
  const [moods,       setMoods]       = useState([]);
  const [moodOther,   setMoodOther]   = useState('');
  const [hasColors,   setHasColors]   = useState('');
  const [color1,      setColor1]      = useState('#c0392b');
  const [color2,      setColor2]      = useState('#e67e22');
  const [color3,      setColor3]      = useState('#1a1a1a');
  const [siteInspire, setSiteInspire] = useState(['', '', '']);

  // Step 5
  const [hasLogo,    setHasLogo]    = useState('');
  const [hasDomain,  setHasDomain]  = useState('');
  const [domainName, setDomainName] = useState('');
  const [hasProEmail,setHasProEmail]= useState('');
  const [hasPhotos,  setHasPhotos]  = useState('');
  const [driveLink,  setDriveLink]  = useState('');
  const [mediaNote,  setMediaNote]  = useState('');
  const [recording,  setRecording]  = useState('');
  const [extraNotes, setExtraNotes] = useState('');

  // Step 6
  const [tier,     setTier]     = useState('');
  const [budget,   setBudget]   = useState('');
  const [timeline, setTimeline] = useState('');

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [step]);

  const toggleArr = (arr, setArr, key) =>
    setArr(a => a.includes(key) ? a.filter(k => k !== key) : [...a, key]);

  const allPages = [...pages, ...(otherPage.trim() ? [otherPage.trim()] : [])];

  const buildSummary = () => {
    const ind = INDUSTRIES.find(i => i.key === industry);
    const lines = [
      `PROJECT BRIEF — The BrandHelper`,
      `Submitted by: ${name}`,
      ``,
      `━━━ ABOUT YOU ━━━`,
      `Name:       ${name}`,
      `Business:   ${bizName}`,
      `Industry:   ${ind?.emoji} ${ind?.label}`,
      `Email:      ${email}`,
      `Phone:      ${phone}`,
      Object.entries(socials).filter(([,v]) => v).map(([k, v]) => `${k}: ${v}`).join(' · '),
      ``,
      `━━━ WHY YOU NEED A WEBSITE ━━━`,
      whyNeeds.map(k => `• ${WHY_WEBSITE.find(w => w.key === k)?.label}`).join('\n'),
      whyOther ? `• Other: ${whyOther}` : '',
      ``,
      `━━━ ABOUT YOUR WEBSITE ━━━`,
      `What it's about: ${siteAbout}`,
      hasWebsite === 'yes' ? `Existing website: ${existingUrl}` : `No existing website`,
      siteIssue ? `Issues: ${siteIssue}` : '',
      ``,
      `━━━ PAGES NEEDED ━━━`,
      allPages.map(p => {
        const c = pageContent[p];
        return `• ${p} — ${c === 'have' ? 'I have the content' : c === 'write' ? 'Please write it for me' : 'Not sure / take over'}`;
      }).join('\n'),
      ``,
      `━━━ LOOK & FEEL ━━━`,
      `Style: ${moods.join(', ')}${moodOther ? ', ' + moodOther : ''}`,
      hasColors === 'yes' ? `Colors: ${color1} · ${color2} · ${color3}` : hasColors === 'no' ? 'Colors: Choose for me' : 'Colors: Not sure',
      siteInspire.filter(Boolean).length ? `Inspired by: ${siteInspire.filter(Boolean).join(', ')}` : '',
      ``,
      `━━━ WHAT YOU HAVE ━━━`,
      `Logo:            ${hasLogo || 'Not answered'}`,
      `Domain:          ${hasDomain === 'yes' ? domainName || 'Yes' : hasDomain || 'Not answered'}`,
      `Professional email: ${hasProEmail || 'Not answered'}`,
      `Photos/media:    ${hasPhotos || 'Not answered'}`,
      driveLink ? `Drive link:      ${driveLink}` : '',
      mediaNote ? `Media note:      ${mediaNote}` : '',
      recording  ? `Recording link:  ${recording}` : '',
      extraNotes ? `Extra notes:     ${extraNotes}` : '',
      ``,
      `━━━ BUDGET & TIMELINE ━━━`,
      `Tier:     ${tier || 'Not answered'}`,
      `Budget:   ${budget || 'Not answered'}`,
      `Timeline: ${timeline || 'Not answered'}`,
    ].filter(l => l !== null && l !== '').join('\n');
    return lines;
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(buildSummary());
    window.open(`https://wa.me/233501657205?text=${msg}`, '_blank');
  };

  const handleEmail = () => {
    const body = encodeURIComponent(buildSummary());
    window.open(`mailto:davida@thebrandhelper.com?subject=Project Brief — ${bizName || name}&body=${body}`);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(buildSummary()).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
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

  return (
    <div className="min-h-screen bg-white text-black">
      <Helmet><title>Client Requirements | The BrandHelper</title></Helmet>
      {showStuck && <StuckModal onClose={() => setShowStuck(false)} />}

      {/* Hero */}
      <div className="bg-black text-white px-6 py-10 text-center">
        <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-2">Free — Takes 5 mins</p>
        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-3">Client Requirements</h1>
        <p className="text-gray-400 text-sm max-w-lg mx-auto">Fill this in so we can understand exactly what you need and serve you better. You don't need to know everything — just share what you can!</p>
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

        {/* ── STEP 0 — About You ── */}
        {step === 0 && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-2xl font-extrabold mb-1">Let's start with you 👋</h2>
              <p className="text-gray-500 text-sm mb-5">Tell us who you are and how to reach you. Fields marked <span className="text-red-500">*</span> are required.</p>
            </div>

            <TIP>This helps us know who we are building for. The more you share, the better we can help you!</TIP>

            <div><Label required>Your full name</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Abena Mensah" /></div>
            <div><Label required>Your business name</Label><Input value={bizName} onChange={e => setBizName(e.target.value)} placeholder="e.g. Abena's Kitchen" /></div>

            <div>
              <Label required>What kind of business do you have?</Label>
              <div className="grid grid-cols-2 gap-2">
                {INDUSTRIES.map(ind => (
                  <button key={ind.key} type="button" onClick={() => setIndustry(ind.key)}
                    className={`text-left px-3 py-2.5 rounded-xl border-2 text-sm transition-all ${industry === ind.key ? 'border-red-600 bg-red-50 font-bold' : 'border-gray-100 hover:border-gray-300'}`}>
                    {ind.emoji} {ind.label}
                  </button>
                ))}
              </div>
            </div>

            <div><Label required>Your email address</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" /></div>
            <div><Label required>Your phone / WhatsApp number</Label><Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+233 xx xxx xxxx" /></div>

            <div>
              <Label>Your social media handles <span className="text-gray-400 font-normal text-xs">(fill in what you have)</span></Label>
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
              <TIP>There are no wrong answers here! This helps us understand what you are trying to achieve so we build the right online presence for you.</TIP>
              <div className="flex flex-wrap gap-2">
                {WHY_WEBSITE.map(w => (
                  <CheckPill key={w.key} label={w.label} checked={whyNeeds.includes(w.key)} onChange={() => toggleArr(whyNeeds, setWhyNeeds, w.key)} />
                ))}
              </div>
              {whyNeeds.includes('other') && (
                <div className="mt-3"><Input value={whyOther} onChange={e => setWhyOther(e.target.value)} placeholder="Tell us your other reason..." /></div>
              )}
            </div>

            <StuckBtn onClick={() => setShowStuck(true)} />
          </div>
        )}

        {/* ── STEP 1 — Goals ── */}
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-2xl font-extrabold mb-1">About your website 🎯</h2>
              <p className="text-gray-500 text-sm mb-5">Tell us what your website is about and what you want people to do when they visit.</p>
            </div>

            <TIP>Don't worry about getting this perfect. Just tell us in your own words — like you're explaining it to a friend.</TIP>

            <div>
              <Label required>What is your website about?</Label>
              <Textarea value={siteAbout} onChange={e => setSiteAbout(e.target.value)} placeholder="e.g. I sell homemade soap and shea butter products. I want people to see my products and order from me directly..." />
            </div>

            <div>
              <Label>Do you already have a website?</Label>
              <div className="flex flex-col gap-2">
                {[
                  { key: 'yes', label: 'Yes, I have one' },
                  { key: 'no',  label: 'No, this will be my first website' },
                ].map(o => <RadioCard key={o.key} label={o.label} checked={hasWebsite === o.key} onClick={() => setHasWebsite(o.key)} />)}
              </div>
              {hasWebsite === 'yes' && (
                <div className="mt-3 flex flex-col gap-2">
                  <Input value={existingUrl} onChange={e => setExistingUrl(e.target.value)} placeholder="Paste your website link here" />
                  <Textarea value={siteIssue} onChange={e => setSiteIssue(e.target.value)} placeholder="What's wrong with it or what do you want to improve?" />
                </div>
              )}
            </div>

            <StuckBtn onClick={() => setShowStuck(true)} />
          </div>
        )}

        {/* ── STEP 2 — Pages ── */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-2xl font-extrabold mb-1">Pages you need 📄</h2>
              <p className="text-gray-500 text-sm mb-5">Pick all the pages you want on your website. Then tell us if you have the content for each one, or if you'd like us to write it for you.</p>
            </div>

            <TIP>A "page" is like a section of your website — for example a page just for your services, or one just for photos of your work. Not sure which ones you need? Just pick what sounds right and we'll advise you on the call.</TIP>

            <div>
              <Label required>Which pages do you want?</Label>
              <div className="flex flex-wrap gap-2 mb-3">
                {PAGES.map(p => (
                  <CheckPill key={p} label={p} checked={pages.includes(p)} onChange={() => toggleArr(pages, setPages, p)} />
                ))}
              </div>
              <Input value={otherPage} onChange={e => setOtherPage(e.target.value)} placeholder="Any other page? Type the name here..." />
            </div>

            {allPages.length > 0 && (
              <div>
                <Label>For each page — do you have the content ready?</Label>
                <p className="text-xs text-gray-400 mb-3">"Content" means the text, photos, and information that goes on each page.</p>
                <div className="flex flex-col gap-3">
                  {allPages.map(p => (
                    <div key={p} className="border border-gray-100 rounded-2xl p-4">
                      <div className="font-bold text-sm mb-3">📄 {p} page</div>
                      <div className="flex flex-col gap-2">
                        {[
                          { key: 'have',  label: '✅ I have the content ready' },
                          { key: 'write', label: '✏️ Please write it for me'   },
                          { key: 'unsure',label: '🤷 Not sure — take over for me' },
                        ].map(o => (
                          <RadioCard key={o.key} label={o.label} checked={pageContent[p] === o.key} onClick={() => setPageContent(prev => ({ ...prev, [p]: o.key }))} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <StuckBtn onClick={() => setShowStuck(true)} />
          </div>
        )}

        {/* ── STEP 3 — Look & Feel ── */}
        {step === 3 && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-2xl font-extrabold mb-1">Look & feel 🎨</h2>
              <p className="text-gray-500 text-sm mb-5">How do you want your website to look and feel? You don't need to know exactly — just pick what feels right to you.</p>
            </div>

            <TIP>Think about how you want people to feel when they visit your site. Should they feel impressed? Comfortable? Excited? That helps us design the right look for you.</TIP>

            <div>
              <Label>What style do you like? <span className="text-gray-400 font-normal text-xs">(pick all that feel right)</span></Label>
              <div className="flex flex-wrap gap-2">
                {MOODS.map(m => (
                  <CheckPill key={m} label={m} checked={moods.includes(m)} onChange={() => toggleArr(moods, setMoods, m)} />
                ))}
              </div>
              {moods.includes('✏️ Other') && (
                <div className="mt-3"><Input value={moodOther} onChange={e => setMoodOther(e.target.value)} placeholder="Describe the style you want..." /></div>
              )}
            </div>

            <div>
              <Label>Do you have brand colours?</Label>
              <p className="text-xs text-gray-400 mb-3">Brand colours are the colours that represent your business — like the colours on your logo or packaging.</p>
              <div className="flex flex-col gap-2 mb-3">
                {[
                  { key: 'yes',    label: 'Yes — I have my colours',           sub: 'You can pick them below'          },
                  { key: 'no',     label: 'No — please choose for me',         sub: 'We will pick what suits your brand' },
                  { key: 'unsure', label: 'Not sure — use your best judgment', sub: 'We will advise you on the call'    },
                ].map(o => <RadioCard key={o.key} label={o.label} sub={o.sub} checked={hasColors === o.key} onClick={() => setHasColors(o.key)} />)}
              </div>
              {hasColors === 'yes' && (
                <div className="flex gap-4 mt-2">
                  {[[color1, setColor1, 'Main colour'], [color2, setColor2, 'Second colour'], [color3, setColor3, 'Third colour']].map(([val, set, lbl]) => (
                    <div key={lbl} className="flex flex-col items-center gap-1">
                      <input type="color" value={val} onChange={e => set(e.target.value)} className="w-12 h-12 rounded-xl border border-gray-200 cursor-pointer" />
                      <span className="text-xs text-gray-500">{lbl}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label>Any websites you like the look of? <span className="text-gray-400 font-normal text-xs">(optional)</span></Label>
              <p className="text-xs text-gray-400 mb-3">Paste the link to 1, 2 or 3 websites that you think look great. Doesn't have to be in your industry.</p>
              {siteInspire.map((url, i) => (
                <div key={i} className="mb-2">
                  <Input value={url} onChange={e => { const copy = [...siteInspire]; copy[i] = e.target.value; setSiteInspire(copy); }} placeholder={`Website ${i + 1} link — e.g. https://example.com`} />
                </div>
              ))}
            </div>

            <StuckBtn onClick={() => setShowStuck(true)} />
          </div>
        )}

        {/* ── STEP 4 — What You Have ── */}
        {step === 4 && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-2xl font-extrabold mb-1">What you already have 📦</h2>
              <p className="text-gray-500 text-sm mb-5">Tell us what you already have so we know what we need to create for you and what you can bring.</p>
            </div>

            <TIP>Don't worry if you don't have everything ready. We can help with most of this — just let us know where you are.</TIP>

            <div>
              <Label required>Do you have a logo?</Label>
              <div className="flex flex-col gap-2">
                {[
                  { key: 'yes',    label: '✅ Yes, I have a logo ready'                       },
                  { key: 'no',     label: '❌ No, I need one designed',  sub: 'Logo design is an extra service — we can help'   },
                  { key: 'unsure', label: '🤷 Not sure — take over for me'                    },
                ].map(o => <RadioCard key={o.key} label={o.label} sub={o.sub} checked={hasLogo === o.key} onClick={() => setHasLogo(o.key)} />)}
              </div>
            </div>

            <div>
              <Label required>Do you already have a domain name?</Label>
              <p className="text-xs text-gray-400 mb-3">A domain is your website address — like <strong>mybusiness.com</strong>. If you're not sure what this means, just select "I don't know what this is".</p>
              <div className="flex flex-col gap-2">
                {[
                  { key: 'yes',     label: '✅ Yes, I already have one'    },
                  { key: 'no',      label: '❌ No, I need one',             sub: 'We will help you get one — cost included in your quote' },
                  { key: 'unknown', label: '❓ I don\'t know what this is', sub: 'That\'s fine! We will explain everything on our call'   },
                ].map(o => <RadioCard key={o.key} label={o.label} sub={o.sub} checked={hasDomain === o.key} onClick={() => setHasDomain(o.key)} />)}
              </div>
              {hasDomain === 'yes' && (
                <div className="mt-3"><Input value={domainName} onChange={e => setDomainName(e.target.value)} placeholder="e.g. mybusiness.com" /></div>
              )}
            </div>

            <div>
              <Label required>Do you have a professional email?</Label>
              <p className="text-xs text-gray-400 mb-3">A professional email looks like <strong>you@yourbusiness.com</strong> instead of a Gmail or Yahoo address. It makes you look more credible to customers.</p>
              <div className="flex flex-col gap-2">
                {[
                  { key: 'yes',     label: '✅ Yes, I have one already'                                               },
                  { key: 'no',      label: '❌ No, I want one',          sub: 'Small extra cost — or we guide you to set it up free' },
                  { key: 'unknown', label: '❓ I don\'t know what this is', sub: 'We will explain on our call'          },
                ].map(o => <RadioCard key={o.key} label={o.label} sub={o.sub} checked={hasProEmail === o.key} onClick={() => setHasProEmail(o.key)} />)}
              </div>
            </div>

            <div>
              <Label required>Do you have photos or images for your website?</Label>
              <div className="flex flex-col gap-2">
                {[
                  { key: 'all',    label: '📸 Yes, I have all my photos ready'           },
                  { key: 'some',   label: '🖼 I have some but not all'                   },
                  { key: 'none',   label: '❌ No, I don\'t have any',   sub: 'We can use professional stock photos or advise you on taking them' },
                  { key: 'unsure', label: '🤷 Not sure — you decide for me'              },
                ].map(o => <RadioCard key={o.key} label={o.label} sub={o.sub} checked={hasPhotos === o.key} onClick={() => setHasPhotos(o.key)} />)}
              </div>
              {(hasPhotos === 'all' || hasPhotos === 'some') && (
                <div className="mt-3 flex flex-col gap-2">
                  <p className="text-xs text-gray-500 font-bold">Please share your photos via Google Drive or a folder link:</p>
                  <Input value={driveLink} onChange={e => setDriveLink(e.target.value)} placeholder="Paste Google Drive or Dropbox link here" />
                  <Textarea value={mediaNote} onChange={e => setMediaNote(e.target.value)} placeholder="Any notes about your photos? e.g. which ones go on which page..." />
                </div>
              )}
            </div>

            <div>
              <Label>Would you like to record a voice or video note? <span className="text-gray-400 font-normal text-xs">(optional but very helpful!)</span></Label>
              <p className="text-xs text-gray-400 mb-3">Sometimes it's easier to just talk than to type! Record a short Loom, WhatsApp voice note, or voice memo and share the link here. We will listen carefully.</p>
              <Input value={recording} onChange={e => setRecording(e.target.value)} placeholder="Paste Loom, Google Drive, or YouTube link here" />
            </div>

            <div>
              <Label>Anything else you want us to know? <span className="text-gray-400 font-normal text-xs">(optional)</span></Label>
              <Textarea value={extraNotes} onChange={e => setExtraNotes(e.target.value)} placeholder="Anything at all — the more you share, the better we can help you!" />
            </div>

            <StuckBtn onClick={() => setShowStuck(true)} />
          </div>
        )}

        {/* ── STEP 5 — Budget & Timeline ── */}
        {step === 5 && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-2xl font-extrabold mb-1">Budget & timeline 💰</h2>
              <p className="text-gray-500 text-sm mb-5">This helps us know what to plan for. If you're not sure, just pick "Not sure" and we'll advise you on the call.</p>
            </div>

            <div>
              <Label required>What kind of website do you think you need?</Label>
              <p className="text-xs text-gray-400 mb-3">Not sure? Check our <a href="/calc" className="text-red-600 underline font-bold">pricing calculator</a> — it explains each option in plain language.</p>
              <div className="flex flex-col gap-2">
                {[
                  { key: 'simple',       label: '🌱 Simple Website',        sub: '$300–$500 · 3–6 pages, no accounts or payments'         },
                  { key: 'intermediate', label: '🚀 Intermediate Website',   sub: '$450–$650 · Backend, admin, basic integrations'         },
                  { key: 'complex',      label: '⚡ Full Web Platform',      sub: '$550–$1000 · Accounts, payments, full dashboard'        },
                  { key: 'unsure',       label: '🤷 Not sure — advise me',   sub: 'We will recommend the right option on our call'         },
                ].map(o => <RadioCard key={o.key} label={o.label} sub={o.sub} checked={tier === o.key} onClick={() => setTier(o.key)} />)}
              </div>
            </div>

            <div>
              <Label required>What is your budget range?</Label>
              <div className="flex flex-col gap-2">
                {[
                  { key: 'under300', label: 'Under $300'          },
                  { key: '300_500',  label: '$300 – $500'         },
                  { key: '500_700',  label: '$500 – $700'         },
                  { key: '700_1000', label: '$700 – $1,000'       },
                  { key: 'above1000',label: 'Above $1,000'        },
                  { key: 'unsure',   label: 'Not sure — advise me' },
                ].map(o => <RadioCard key={o.key} label={o.label} checked={budget === o.key} onClick={() => setBudget(o.key)} />)}
              </div>
            </div>

            <div>
              <Label required>When do you need your website ready?</Label>
              <div className="flex flex-col gap-2">
                {[
                  { key: 'patient',  label: '🌿 No rush — take your time',  sub: '6–8 weeks · saves you 20%'         },
                  { key: 'standard', label: '⏳ Normal pace',                sub: '3–5 weeks · standard pricing'      },
                  { key: 'express',  label: '⚡ I need it urgently',         sub: '1–2 weeks · 30% extra for priority' },
                  { key: 'unsure',   label: '🤷 Not sure yet'                                                         },
                ].map(o => <RadioCard key={o.key} label={o.label} sub={o.sub} checked={timeline === o.key} onClick={() => setTimeline(o.key)} />)}
              </div>
            </div>

            <StuckBtn onClick={() => setShowStuck(true)} />
          </div>
        )}

        {/* ── STEP 6 — Review & Send ── */}
        {step === 6 && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-2xl font-extrabold mb-1">You're all done! 🎉</h2>
              <p className="text-gray-500 text-sm mb-5">Your brief is ready. Send it to us and we will review everything and get back to you quickly.</p>
            </div>

            {/* Summary card */}
            <div className="border border-gray-100 rounded-2xl overflow-hidden">
              <div className="bg-black text-white px-5 py-4">
                <div className="font-extrabold text-base">Your project brief</div>
                <div className="text-gray-400 text-xs mt-0.5">Summary of what you filled in</div>
              </div>
              {[
                { label: 'Name',      value: name          },
                { label: 'Business',  value: bizName       },
                { label: 'Industry',  value: INDUSTRIES.find(i => i.key === industry)?.label },
                { label: 'Pages',     value: allPages.join(', ') || 'None selected' },
                { label: 'Style',     value: moods.slice(0, 3).join(', ') || 'Not set' },
                { label: 'Logo',      value: hasLogo       },
                { label: 'Domain',    value: hasDomain === 'yes' ? domainName || 'Yes' : hasDomain },
                { label: 'Pro email', value: hasProEmail   },
                { label: 'Photos',    value: hasPhotos     },
                { label: 'Tier',      value: tier          },
                { label: 'Budget',    value: budget        },
                { label: 'Timeline',  value: timeline      },
              ].filter(r => r.value).map((row, i) => (
                <div key={i} className="px-5 py-3 flex justify-between border-t border-gray-50 text-sm">
                  <span className="text-gray-400">{row.label}</span>
                  <span className="font-bold text-right max-w-[60%]">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4">
              <p className="text-xs text-yellow-700 leading-relaxed">
                <span className="font-bold">Not sure about any section?</span> That is completely fine — just send what you have. We will go through everything together on a free call at no pressure and no commitment.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button onClick={handleWhatsApp}
                className="w-full py-4 rounded-2xl bg-green-500 text-white font-extrabold text-base hover:bg-green-600 transition-all">
                💬 Send Brief on WhatsApp
              </button>
              <button onClick={handleEmail}
                className="w-full py-4 rounded-2xl bg-red-600 text-white font-extrabold text-base hover:bg-red-700 transition-all">
                📧 Send Brief by Email
              </button>
              <a href="https://calendly.com/blackbird77ad/free-consultation" target="_blank" rel="noopener noreferrer"
                className="w-full py-4 rounded-2xl bg-black text-white font-extrabold text-base text-center block hover:bg-gray-800 transition-all">
                📅 Book a Free Call to Discuss
              </a>
              <button onClick={copyAll}
                className="w-full py-3 rounded-2xl border-2 border-black font-bold text-sm hover:bg-black hover:text-white transition-all">
                {copied ? '✓ Copied!' : '📋 Copy Brief Summary'}
              </button>
              <button onClick={() => { setStep(0); setName(''); setBizName(''); setIndustry(''); setEmail(''); setPhone(''); setSocials({}); setWhyNeeds([]); setWhyOther(''); setSiteAbout(''); setHasWebsite(''); setExistingUrl(''); setSiteIssue(''); setPages([]); setOtherPage(''); setPageContent({}); setMoods([]); setMoodOther(''); setHasColors(''); setSiteInspire(['','','']); setHasLogo(''); setHasDomain(''); setDomainName(''); setHasProEmail(''); setHasPhotos(''); setDriveLink(''); setMediaNote(''); setRecording(''); setExtraNotes(''); setTier(''); setBudget(''); setTimeline(''); }}
                className="w-full py-3 rounded-2xl text-gray-400 font-bold text-sm hover:text-black transition-all">
                Start Over
              </button>
            </div>

            <p className="text-center text-gray-400 text-xs leading-relaxed">
              We typically respond within a few hours on WhatsApp. For email, allow up to 24 hours.
            </p>
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
            <button onClick={() => setStep(s => s + 1)}
              className="flex-1 py-4 rounded-2xl bg-red-600 text-white font-extrabold text-base hover:bg-red-700 transition-all">
              {step === 5 ? 'Review my brief →' : 'Continue →'}
            </button>
          </div>
        )}

        {step < 6 && (
          <button onClick={() => setStep(s => s + 1)}
            className="w-full mt-3 py-3 rounded-2xl text-gray-400 font-bold text-sm border border-dashed border-gray-200 hover:border-gray-400 transition-all">
            Skip this step — I'll answer on the call →
          </button>
        )}

      </div>
    </div>
  );
}