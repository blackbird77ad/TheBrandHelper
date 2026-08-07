import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiCopy,
  FiDownload,
  FiMail,
  FiMessageCircle,
  FiPhoneCall,
  FiRefreshCw,
  FiSend,
} from 'react-icons/fi';
import { submitLead } from '../utils/api';
import ApiIssueReport from '../components/ApiIssueReport';
import formGuideImg from '../photos/fill-in-forms-use-this-by-the-side-of-a-form-which-has-no-images-yet.png';

const SESSION_KEY = 'tbh_project_requirements_draft_v3';
const CALC_SNAPSHOT_KEY = 'tbh_website_pricing_last_estimate_v2';
const CALC_DRAFT_KEY = 'tbh_website_pricing_calculator_v2';
const WHATSAPP_NUMBER = '233501657205';
const CONSULTATION_URL = 'https://calendly.com/blackbird77ad/free-consultation';

const STEPS = [
  { key: 'welcome', title: "Let's Build Your Project Together" },
  { key: 'about', title: 'About You' },
  { key: 'business', title: 'Your Business' },
  { key: 'project', title: 'Your Project' },
  { key: 'pages', title: 'Pages & Content' },
  { key: 'features', title: 'How Should Your Website Work?' },
  { key: 'branding', title: 'Branding' },
  { key: 'assets', title: 'Existing Assets' },
  { key: 'budget', title: 'Budget & Timeline' },
  { key: 'review', title: 'Final Review' },
];

const INDUSTRIES = [
  'Church or Ministry',
  'School or Education',
  'Restaurant or Food',
  'Healthcare',
  'NGO or Non-profit',
  'Consultancy or Coaching',
  'Real Estate',
  'Startup or SaaS',
  'Retail or E-commerce',
  'Government or Public Sector',
  'Other',
];

const CONTACT_METHODS = ['WhatsApp', 'Email', 'Phone Call'];
const CUSTOMER_ACTIONS = ['Book appointments', 'Buy products', 'Contact me', 'Join my church', 'Register for school', 'Watch videos', 'Download files', 'Donate', 'Learn online', 'Other'];
const VISITOR_ACTIONS = ['Read information', 'Create accounts', 'Book appointments', 'Make payments', 'Upload files', 'Download files', 'Chat', 'Watch videos', 'Learn online', 'Track orders', 'Manage inventory', 'Manage staff', 'Manage members', 'Other'];
const ACCOUNT_TYPES = ['Customers', 'Staff', 'Students', 'Teachers', 'Parents', 'Members', 'Vendors', 'Administrators', 'Volunteers', 'Other'];
const PAGES = ['Home', 'About', 'Services', 'Contact', 'Gallery', 'Blog', 'FAQ', 'Pricing', 'Testimonials', 'Team', 'Shop', 'Events', 'Donations', 'Dashboard', 'Portal'];

const FEATURE_GROUPS = [
  { label: 'Communication', items: ['Contact forms', 'Live chat', 'WhatsApp', 'Newsletter', 'Email notifications', 'SMS notifications'] },
  { label: 'Selling', items: ['Products', 'Payments', 'Coupons', 'Subscriptions', 'Invoices', 'Shipping'] },
  { label: 'Bookings', items: ['Appointments', 'Calendar', 'Reservations', 'Availability', 'Reminders'] },
  { label: 'Members', items: ['Login', 'Dashboard', 'Profiles', 'Roles and permissions', 'Member directory'] },
  { label: 'Management', items: ['Manage customers', 'Manage staff', 'Reports', 'Inventory', 'Orders', 'Documents'] },
  { label: 'Media', items: ['Videos', 'Audio', 'Photo gallery', 'Livestream', 'Downloads'] },
  { label: 'Advanced', items: ['AI', 'Mobile app', 'Multi-language', 'Maps', 'Automations', 'External integrations'] },
];

const ASSET_ITEMS = ['Logo', 'Domain', 'Hosting', 'Business email', 'Photos', 'Videos', 'Documents', 'Brand guide', 'Existing website', 'Source code', 'Admin access', 'Hosting access', 'Social accounts'];
const BUDGET_OPTIONS = ['$300 - $1,200', '$1,200 - $3,000', '$3,000 - $10,000', '$10,000 - $20,000', '$20,000+', 'Not sure yet'];
const TIMELINE_OPTIONS = ['Flexible', '1-2 months', '2-4 weeks', '2 weeks', '1 week / rush', 'Not sure yet'];

function makeReference() {
  const now = new Date();
  const stamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('');
  return `TBH-${stamp}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

const DEFAULT_FORM = {
  version: 3,
  reference: '',
  step: 0,
  completedCalculator: '',
  pricingEstimate: null,
  contact: {
    name: '',
    business: '',
    industry: '',
    email: '',
    phone: '',
    country: '',
    preferredContact: 'WhatsApp',
    socials: '',
  },
  business: {
    description: '',
    customers: '',
    problem: '',
    desiredActions: [],
    otherAction: '',
  },
  project: {
    description: '',
    visitorActions: [],
    otherVisitorAction: '',
    accountTypes: [],
    signedInExperience: '',
    managerNeeds: '',
    uploads: '',
    notifications: '',
    automation: '',
  },
  pages: {
    selected: [],
    other: '',
    contentStatus: {},
  },
  features: {},
  branding: {
    colors: '',
    logo: '',
    fonts: '',
    guidelines: '',
    exampleSites: ['', '', ''],
    socialLinks: '',
    notes: '',
  },
  assets: {
    available: {},
    accessNotes: '',
    driveLink: '',
    missing: '',
  },
  budget: {
    budget: '',
    timeline: '',
    mustHave: '',
    niceToHave: '',
    later: '',
  },
  submitted: false,
};

function freshForm() {
  return { ...JSON.parse(JSON.stringify(DEFAULT_FORM)), reference: makeReference() };
}

function readSessionForm() {
  if (typeof window === 'undefined') return freshForm();
  try {
    const saved = JSON.parse(window.sessionStorage.getItem(SESSION_KEY) || 'null');
    if (!saved || saved.version !== 3) return freshForm();
    const restored = {
      ...freshForm(),
      ...saved,
      contact: { ...DEFAULT_FORM.contact, ...(saved.contact || {}) },
      business: { ...DEFAULT_FORM.business, ...(saved.business || {}) },
      project: { ...DEFAULT_FORM.project, ...(saved.project || {}) },
      pages: { ...DEFAULT_FORM.pages, ...(saved.pages || {}) },
      branding: { ...DEFAULT_FORM.branding, ...(saved.branding || {}) },
      assets: { ...DEFAULT_FORM.assets, ...(saved.assets || {}) },
      budget: { ...DEFAULT_FORM.budget, ...(saved.budget || {}) },
      reference: saved.reference || makeReference(),
    };
    if (restored.budget.budget && !BUDGET_OPTIONS.includes(restored.budget.budget)) {
      restored.budget.budget = '';
    }
    return restored;
  } catch {
    return freshForm();
  }
}

function readCalculatorEstimate() {
  if (typeof window === 'undefined') return null;
  try {
    const snapshot = JSON.parse(window.localStorage.getItem(CALC_SNAPSHOT_KEY) || 'null');
    if (snapshot?.recommendedPackage || snapshot?.estimatedBudget) return snapshot;
  } catch {
    // Continue to legacy draft fallback.
  }

  try {
    const draft = JSON.parse(window.localStorage.getItem(CALC_DRAFT_KEY) || 'null');
    if (!draft) return null;
    const packageLabels = {
      starter: 'Starter Website',
      business: 'Business Website',
      custom: 'Custom Platform',
      enterprise: 'Enterprise Solution',
    };
    return {
      reference: draft.reference || '',
      selectedPackage: packageLabels[draft.projectType] || draft.projectType || '',
      recommendedPackage: packageLabels[draft.projectType] || draft.projectType || '',
      estimatedBudget: '',
      timeline: '',
      features: [
        draft.frontend?.pages,
        ...(draft.frontend?.features || []),
        ...(draft.backend?.features || []),
        ...(draft.users || []),
        ...(draft.modules || []),
        ...(draft.payments || []),
        ...(draft.integrations || []),
      ].filter(Boolean),
    };
  } catch {
    return null;
  }
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function list(items) {
  return items?.length ? items.join(', ') : 'Not provided';
}

function ToggleCard({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex min-h-[64px] w-full min-w-0 items-start gap-3 rounded-lg border p-4 text-left text-sm transition ${
        active ? 'border-red-600 bg-red-50 text-black' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
      }`}
    >
      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${active ? 'border-red-600 bg-red-600 text-white' : 'border-gray-300 text-transparent'}`}>
        <FiCheck className="h-3.5 w-3.5" />
      </span>
      <span className="min-w-0 flex-1 break-words">{children}</span>
    </button>
  );
}

function RadioGrid({ items, value, onChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <ToggleCard key={item} active={value === item} onClick={() => onChange(item)}>
          <span className="font-bold">{item}</span>
        </ToggleCard>
      ))}
    </div>
  );
}

function CheckGrid({ items, selected, onToggle }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <ToggleCard key={item} active={selected.includes(item)} onClick={() => onToggle(item)}>
          <span className="font-bold">{item}</span>
        </ToggleCard>
      ))}
    </div>
  );
}

const CONTENT_STATUS_OPTIONS = ['I have content', 'Need help', 'Not sure'];

function PageContentStatus({ pages, contentStatus, onChange }) {
  return (
    <div>
      <div className="grid gap-3 md:hidden">
        {pages.map((page) => (
          <div key={page} className="rounded-lg border border-gray-200 bg-white p-3">
            <p className="mb-3 text-sm font-extrabold text-black">{page}</p>
            <div className="grid gap-2">
              {CONTENT_STATUS_OPTIONS.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => onChange(page, status)}
                  className={`rounded-lg border px-3 py-2 text-left text-sm font-bold transition ${
                    contentStatus[page] === status
                      ? 'border-red-600 bg-red-50 text-red-700'
                      : 'border-gray-200 text-gray-500 hover:border-gray-400'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-lg border border-gray-200 md:block">
        <div className="grid grid-cols-[minmax(140px,1.1fr)_repeat(3,minmax(120px,0.9fr))] bg-gray-100 text-xs font-extrabold uppercase tracking-wide text-gray-500">
          <div className="p-3">Page</div>
          {CONTENT_STATUS_OPTIONS.map((status) => (
            <div key={status} className="p-3 text-center">{status}</div>
          ))}
        </div>
        {pages.map((page) => (
          <div key={page} className="grid grid-cols-[minmax(140px,1.1fr)_repeat(3,minmax(120px,0.9fr))] border-t border-gray-100 text-sm">
            <div className="min-w-0 break-words p-3 font-bold text-black">{page}</div>
            {CONTENT_STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => onChange(page, status)}
                className={`p-3 text-center font-bold transition ${
                  contentStatus[page] === status ? 'bg-red-50 text-red-700' : 'text-gray-400 hover:bg-gray-50'
                }`}
              >
                {contentStatus[page] === status ? 'Selected' : 'Choose'}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, why, children, required }) {
  return (
    <label className="block">
      <span className="block text-sm font-extrabold text-black">
        {label} {required && <span className="text-red-600">*</span>}
      </span>
      {why && <span className="mb-2 mt-1 block text-xs leading-relaxed text-gray-500">{why}</span>}
      {children}
    </label>
  );
}

function HelpBox({ children }) {
  return (
    <div className="rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm leading-relaxed text-sky-900">
      {children}
    </div>
  );
}

export default function ClientRequirements() {
  const [form, setForm] = useState(readSessionForm);
  const [submitting, setSubmitting] = useState(false);
  const [serverIssue, setServerIssue] = useState(null);
  const [copied, setCopied] = useState(false);

  const step = Math.min(Math.max(form.step, 0), STEPS.length - 1);
  const stepData = STEPS[step];

  useEffect(() => {
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ...form, step }));
  }, [form, step]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const update = (patch) => setForm((current) => ({ ...current, ...patch }));
  const updateGroup = (group, patch) => setForm((current) => ({ ...current, [group]: { ...current[group], ...patch } }));

  const toggleArray = (group, field, item) => {
    setForm((current) => {
      const values = current[group][field] || [];
      return {
        ...current,
        [group]: {
          ...current[group],
          [field]: values.includes(item) ? values.filter((value) => value !== item) : [...values, item],
        },
      };
    });
  };

  const setStep = (nextStep) => update({ step: Math.min(Math.max(nextStep, 0), STEPS.length - 1) });

  const allPages = useMemo(() => {
    const extra = form.pages.other.split(',').map((item) => item.trim()).filter(Boolean);
    return [...form.pages.selected, ...extra];
  }, [form.pages.other, form.pages.selected]);

  const selectedFeatures = useMemo(() => Object.entries(form.features)
    .flatMap(([group, values]) => Object.entries(values || {})
      .filter(([, value]) => value)
      .map(([feature]) => `${group}: ${feature}`)), [form.features]);

  const missingInfo = useMemo(() => {
    const missing = [];
    if (!form.contact.name) missing.push('Your name');
    if (!form.contact.email) missing.push('Email address');
    if (!form.contact.phone) missing.push('Phone number');
    if (!form.business.description) missing.push('What the business does');
    if (!form.project.description) missing.push('Project description');
    if (!allPages.length) missing.push('Required pages');
    if (!form.budget.budget) missing.push('Budget range');
    if (!form.budget.timeline) missing.push('Timeline');
    return missing;
  }, [allPages.length, form]);

  const recommendations = useMemo(() => {
    const notes = [];
    if (form.completedCalculator !== 'Yes') notes.push('Consider comparing this brief with the Pricing Calculator estimate before final quotation.');
    if (form.project.visitorActions.some((item) => ['Create accounts', 'Make payments', 'Upload files', 'Track orders', 'Manage inventory', 'Manage staff', 'Manage members'].includes(item))) {
      notes.push('This project likely needs backend planning, saved data, user permissions, and a management area.');
    }
    if (selectedFeatures.some((item) => /AI|Mobile app|Automations|External integrations/i.test(item))) {
      notes.push('Advanced features should be reviewed carefully for architecture, cost, and long-term maintenance.');
    }
    if (form.budget.later) notes.push('There is a clear Phase 2 opportunity, so the first build can stay focused on must-have features.');
    if (!notes.length) notes.push('The brief looks suitable for a straightforward website scoping review.');
    return notes;
  }, [form, selectedFeatures]);

  const summary = useMemo(() => buildSummary({ form, allPages, selectedFeatures, missingInfo, recommendations }), [allPages, form, missingInfo, recommendations, selectedFeatures]);

  const canContinue = (() => {
    if (stepData.key === 'welcome') return Boolean(form.completedCalculator);
    if (stepData.key === 'about') return Boolean(form.contact.name && form.contact.business && form.contact.email && form.contact.phone && form.contact.country);
    if (stepData.key === 'business') return Boolean(form.business.description && form.business.customers && form.business.problem);
    if (stepData.key === 'project') return Boolean(form.project.description && form.project.visitorActions.length);
    if (stepData.key === 'pages') return Boolean(allPages.length);
    if (stepData.key === 'budget') return Boolean(form.budget.budget && form.budget.timeline);
    return true;
  })();

  const handleCalculatorChoice = (value) => {
    if (value === 'Yes') {
      const pricingEstimate = readCalculatorEstimate();
      setForm((current) => ({
        ...current,
        completedCalculator: value,
        pricingEstimate,
        budget: {
          ...current.budget,
          budget: pricingEstimate?.estimatedBudget || current.budget.budget,
          timeline: pricingEstimate?.timeline || current.budget.timeline,
        },
      }));
      return;
    }
    update({ completedCalculator: value, pricingEstimate: null });
  };

  const resetForm = () => {
    const clean = freshForm();
    setForm(clean);
    setServerIssue(null);
    setCopied(false);
    window.sessionStorage.removeItem(SESSION_KEY);
  };

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const downloadPdfCopy = () => {
    const proposalWindow = window.open('', '_blank', 'noopener,noreferrer,width=900,height=1100');
    if (!proposalWindow) return;
    proposalWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>${escapeHtml(form.reference)} Project Brief</title>
          <style>
            body { font-family: Arial, sans-serif; color: #111827; margin: 40px; line-height: 1.55; }
            h1 { margin: 0 0 8px; font-size: 28px; }
            .eyebrow { color: #dc2626; font-size: 12px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; }
            pre { white-space: pre-wrap; border: 1px solid #e5e7eb; border-radius: 8px; padding: 18px; background: #f9fafb; font-family: Arial, sans-serif; font-size: 13px; }
            .note { margin-top: 18px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="eyebrow">The BrandHelper</div>
          <h1>Project Requirements Brief</h1>
          <p><strong>Reference:</strong> ${escapeHtml(form.reference)}</p>
          <pre>${escapeHtml(summary)}</pre>
          <p class="note">Use your browser print dialog to save this brief as a PDF.</p>
          <script>window.onload = () => { window.print(); };</script>
        </body>
      </html>
    `);
    proposalWindow.document.close();
  };

  const submitBrief = async () => {
    setSubmitting(true);
    setServerIssue(null);
    const payload = {
      form_type: 'Project Requirements Brief v3',
      source_detail: 'Project Requirements Form',
      reference_number: form.reference,
      client_name: form.contact.name,
      business_name: form.contact.business,
      industry: form.contact.industry,
      email: form.contact.email,
      phone: form.contact.phone,
      location: form.contact.country,
      service: 'Website project requirements',
      tier: form.pricingEstimate?.recommendedPackage ? `Calculator: ${form.pricingEstimate.recommendedPackage}` : 'Not selected in requirements form',
      budget: form.budget.budget || form.pricingEstimate?.estimatedBudget || 'Not answered',
      timeline: form.budget.timeline || 'Not answered',
      message: [
        `Reference: ${form.reference}`,
        `Preferred contact: ${form.contact.preferredContact}`,
        `Completed calculator: ${form.completedCalculator}`,
        form.pricingEstimate?.estimatedBudget ? `Calculator estimate: ${form.pricingEstimate.estimatedBudget}` : '',
        `Must-have features: ${form.budget.mustHave || 'Not provided'}`,
      ].filter(Boolean).join('\n'),
      notes: `Reference ${form.reference} | Requirements v3 | Missing info: ${missingInfo.join(', ') || 'None'}`,
      full_brief: summary,
      metadata: {
        requirements_version: 3,
        reference: form.reference,
        completed_calculator: form.completedCalculator,
        calculator_estimate: form.pricingEstimate,
        missing_information: missingInfo,
        draft_snapshot: form,
      },
      submitted_at: new Date().toISOString(),
    };

    try {
      await submitLead(payload);
    } catch (error) {
      setServerIssue(error);
    } finally {
      setSubmitting(false);
      update({ submitted: true });
    }
  };

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent([
    'Hi The BrandHelper,',
    '',
    'I just completed the Project Requirements form.',
    '',
    `Reference: ${form.reference}`,
    `Name: ${form.contact.name || 'Not provided'}`,
    `Business: ${form.contact.business || 'Not provided'}`,
    `Estimated Budget: ${form.budget.budget || form.pricingEstimate?.estimatedBudget || 'Not provided'}`,
    `Timeline: ${form.budget.timeline || 'Not provided'}`,
    '',
    "I'd like to discuss the next steps.",
  ].join('\n'))}`;

  if (form.submitted) {
    return (
      <SuccessView
        form={form}
        summary={summary}
        serverIssue={serverIssue}
        whatsappHref={whatsappHref}
        copied={copied}
        onCopy={copySummary}
        onReset={resetForm}
        onDownload={downloadPdfCopy}
      />
    );
  }

  return (
    <section className="min-h-screen bg-[#f6f7f9] px-4 py-8 text-gray-900 sm:px-6">
      <Helmet>
        <title>Website Project Requirements | The BrandHelper</title>
        <meta name="description" content="Complete The BrandHelper project requirements form so we can understand your website, platform, content, features, assets, budget, and timeline." />
        <link rel="canonical" href="https://thebrandhelper.com/contact/requirements" />
      </Helmet>

      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-red-600">Project Requirements</p>
            <h1 className="mt-2 max-w-4xl text-3xl font-extrabold leading-tight text-black md:text-5xl">{stepData.title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-600 md:text-base">
              Final discovery questionnaire for project scope. Autosaved in this browser tab while it stays open.
            </p>
          </div>
          <button type="button" onClick={resetForm} className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-extrabold text-black transition hover:border-black">
            <FiRefreshCw className="h-4 w-4" />
            Start over
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0 rounded-lg border border-gray-200 bg-white p-5 shadow-sm md:p-7 xl:p-8">
            <Progress step={step} />
            <div className="mt-7">
              <StepContent
                stepKey={stepData.key}
                form={form}
                updateGroup={updateGroup}
                toggleArray={toggleArray}
                handleCalculatorChoice={handleCalculatorChoice}
                allPages={allPages}
                selectedFeatures={selectedFeatures}
                missingInfo={missingInfo}
                recommendations={recommendations}
              />
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                disabled={step === 0}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-3 text-sm font-extrabold text-black transition hover:border-black disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiArrowLeft className="h-4 w-4" />
                Back
              </button>
              {stepData.key === 'review' ? (
                <button
                  type="button"
                  onClick={submitBrief}
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Submitting
                    </>
                  ) : (
                    <>
                      <FiSend className="h-4 w-4" />
                      Submit Project Brief
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => canContinue && setStep(step + 1)}
                  disabled={!canContinue}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  Continue
                  <FiArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <aside className="min-w-0 space-y-4 lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
              <img src={formGuideImg} alt="Project brief guide" className="h-40 w-full object-cover xl:h-48" loading="lazy" decoding="async" />
              <div className="p-5">
                <p className="text-xs font-extrabold uppercase tracking-widest text-red-600">Reference</p>
                <p className="mt-1 text-xl font-extrabold text-black">{form.reference}</p>
                <div className="mt-4 grid gap-3 text-sm">
                  <div className="flex justify-between border-t border-gray-100 pt-3">
                    <span className="text-gray-500">Step</span>
                    <span className="font-extrabold">{step + 1} of {STEPS.length}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-3">
                    <span className="text-gray-500">Calculator</span>
                    <span className="font-extrabold">{form.completedCalculator || 'Not answered'}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-3">
                    <span className="text-gray-500">Budget</span>
                    <span className="font-extrabold text-right">{form.budget.budget || form.pricingEstimate?.estimatedBudget || 'Not set'}</span>
                  </div>
                </div>
              </div>
            </div>
            <HelpBox>
              This form is not the pricing calculator. It is the final discovery brief we use to understand scope, workflows, content, assets, and next steps.
            </HelpBox>
          </aside>
        </div>
      </div>
    </section>
  );
}

function StepContent({ stepKey, form, updateGroup, toggleArray, handleCalculatorChoice, allPages, selectedFeatures, missingInfo, recommendations }) {
  if (stepKey === 'welcome') {
    return (
      <div className="space-y-5">
        <HelpBox>
          This short questionnaire helps us understand exactly what you are looking for so we can give you the best solution. Do not worry if you are unsure about anything. Answer as best as you can.
        </HelpBox>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm font-extrabold text-black">Estimated time</p>
          <p className="mt-1 text-sm text-gray-600">5-10 minutes. Your answers are autosaved while this browser tab remains open.</p>
        </div>
        <Field label="Did you already complete our Pricing Calculator?" why="If yes, we can bring the estimate, package, and selected features into this final requirements form." required>
          <RadioGrid items={['Yes', 'No']} value={form.completedCalculator} onChange={handleCalculatorChoice} />
        </Field>
        {form.completedCalculator === 'Yes' && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            {form.pricingEstimate ? (
              <>
                <p className="font-extrabold">Calculator estimate found.</p>
                <p className="mt-1">Package: {form.pricingEstimate.recommendedPackage || form.pricingEstimate.selectedPackage || 'Not available'}</p>
                <p>Budget: {form.pricingEstimate.estimatedBudget || 'Not available'}</p>
              </>
            ) : (
              <p>No calculator estimate was found in this browser. You can continue normally.</p>
            )}
          </div>
        )}
      </div>
    );
  }

  if (stepKey === 'about') {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <TextField label="Name" required value={form.contact.name} onChange={(name) => updateGroup('contact', { name })} why="We need to know who owns the brief." />
        <TextField label="Business" required value={form.contact.business} onChange={(business) => updateGroup('contact', { business })} why="This is used in your project record and proposal." />
        <Field label="Industry" why="This helps us ask better follow-up questions.">
          <select className="field-input" value={form.contact.industry} onChange={(event) => updateGroup('contact', { industry: event.target.value })}>
            <option value="">Select one</option>
            {INDUSTRIES.map((industry) => <option key={industry} value={industry}>{industry}</option>)}
          </select>
        </Field>
        <TextField label="Email" required value={form.contact.email} onChange={(email) => updateGroup('contact', { email })} why="We send confirmations and formal follow-up here." />
        <TextField label="Phone" required value={form.contact.phone} onChange={(phone) => updateGroup('contact', { phone })} why="Useful for WhatsApp or urgent clarification." />
        <TextField label="Country" required value={form.contact.country} onChange={(country) => updateGroup('contact', { country })} why="This affects payments, timing, hosting, and local integrations." />
        <Field label="Preferred contact method" why="We will follow up using the channel you prefer.">
          <select className="field-input" value={form.contact.preferredContact} onChange={(event) => updateGroup('contact', { preferredContact: event.target.value })}>
            {CONTACT_METHODS.map((method) => <option key={method} value={method}>{method}</option>)}
          </select>
        </Field>
        <TextField label="Socials" value={form.contact.socials} onChange={(socials) => updateGroup('contact', { socials })} why="Optional, but helpful for brand and credibility review." />
      </div>
    );
  }

  if (stepKey === 'business') {
    return (
      <div className="space-y-5">
        <TextAreaField label="What do you do?" required value={form.business.description} onChange={(description) => updateGroup('business', { description })} why="Explain your business in plain English." placeholder="Example: We run a church with weekly services, events, donations, and member groups." />
        <TextAreaField label="Who are your customers or users?" required value={form.business.customers} onChange={(customers) => updateGroup('business', { customers })} why="This helps us design the website around the right people." />
        <TextAreaField label="What problem should this website solve?" required value={form.business.problem} onChange={(problem) => updateGroup('business', { problem })} why="A good website should solve a real business or operations problem." />
        <Field label="What do you hope people will do on the website?" why="These goals tell us what features and pages matter most.">
          <CheckGrid items={CUSTOMER_ACTIONS} selected={form.business.desiredActions} onToggle={(item) => toggleArray('business', 'desiredActions', item)} />
        </Field>
        {form.business.desiredActions.includes('Other') && (
          <TextField label="Other action" value={form.business.otherAction} onChange={(otherAction) => updateGroup('business', { otherAction })} />
        )}
      </div>
    );
  }

  if (stepKey === 'project') {
    return (
      <div className="space-y-5">
        <TextAreaField label="Describe your project." required value={form.project.description} onChange={(description) => updateGroup('project', { description })} why="Pretend you are explaining it to a friend. This is often more useful than technical terms." placeholder="Example: I want a school website where parents can learn about us, apply for admission, and later log in to see updates." />
        <Field label="What do you want people to be able to do?" required why="Choose the actions people should perform on the website.">
          <CheckGrid items={VISITOR_ACTIONS} selected={form.project.visitorActions} onToggle={(item) => toggleArray('project', 'visitorActions', item)} />
        </Field>
        {form.project.visitorActions.includes('Create accounts') && (
          <Field label="Who needs accounts?" why="This helps us plan logins, permissions, and dashboards.">
            <CheckGrid items={ACCOUNT_TYPES} selected={form.project.accountTypes} onToggle={(item) => toggleArray('project', 'accountTypes', item)} />
          </Field>
        )}
        {form.project.visitorActions.includes('Create accounts') && (
          <TextAreaField label="What should happen after someone signs in?" value={form.project.signedInExperience} onChange={(signedInExperience) => updateGroup('project', { signedInExperience })} />
        )}
        <TextAreaField label="Will someone need to manage the website?" value={form.project.managerNeeds} onChange={(managerNeeds) => updateGroup('project', { managerNeeds })} why="Tell us what an owner, admin, staff member, or manager should control." />
        <TextAreaField label="Will people upload documents, photos, or videos?" value={form.project.uploads} onChange={(uploads) => updateGroup('project', { uploads })} />
        <TextAreaField label="Should people receive emails, SMS, or WhatsApp notifications?" value={form.project.notifications} onChange={(notifications) => updateGroup('project', { notifications })} />
        <TextAreaField label="Is there anything that should happen automatically?" value={form.project.automation} onChange={(automation) => updateGroup('project', { automation })} why="Examples: send reminders, approve requests, update inventory, notify staff, generate reports." />
      </div>
    );
  }

  if (stepKey === 'pages') {
    return (
      <div className="space-y-5">
        <Field label="Which pages do you need?" required why="Pages help us estimate content, structure, and navigation.">
          <CheckGrid items={PAGES} selected={form.pages.selected} onToggle={(item) => toggleArray('pages', 'selected', item)} />
        </Field>
        <TextField label="Other pages" value={form.pages.other} onChange={(other) => updateGroup('pages', { other })} why="Separate multiple pages with commas." />
        {allPages.length > 0 && (
          <div>
            <p className="text-sm font-extrabold text-black">Do you already have content?</p>
            <p className="mb-3 mt-1 text-xs leading-relaxed text-gray-500">This helps us know whether you need copywriting, content planning, or only page layout.</p>
            <PageContentStatus
              pages={allPages}
              contentStatus={form.pages.contentStatus}
              onChange={(page, status) => updateGroup('pages', { contentStatus: { ...form.pages.contentStatus, [page]: status } })}
            />
          </div>
        )}
      </div>
    );
  }

  if (stepKey === 'features') {
    return (
      <div className="space-y-5">
        <HelpBox>
          We avoid technical words here. Behind the scenes, these answers tell us whether the project needs forms, dashboards, payments, databases, integrations, or automation.
        </HelpBox>
        {FEATURE_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="mb-3 text-sm font-extrabold uppercase tracking-widest text-gray-400">{group.label}</p>
            <CheckGrid
              items={group.items}
              selected={Object.entries(form.features[group.label] || {}).filter(([, value]) => value).map(([key]) => key)}
              onToggle={(item) => updateGroup('features', {
                ...form.features,
                [group.label]: {
                  ...(form.features[group.label] || {}),
                  [item]: !form.features[group.label]?.[item],
                },
              })}
            />
          </div>
        ))}
      </div>
    );
  }

  if (stepKey === 'branding') {
    return (
      <div className="space-y-5">
        <TextField label="Colours" value={form.branding.colors} onChange={(colors) => updateGroup('branding', { colors })} why="List brand colours or say if you want us to choose." />
        <TextField label="Logo status" value={form.branding.logo} onChange={(logo) => updateGroup('branding', { logo })} why="Tell us if you have a logo, need one, or need an update." />
        <TextField label="Fonts" value={form.branding.fonts} onChange={(fonts) => updateGroup('branding', { fonts })} />
        <TextAreaField label="Brand guidelines" value={form.branding.guidelines} onChange={(guidelines) => updateGroup('branding', { guidelines })} />
        <div>
          <p className="text-sm font-extrabold text-black">Example websites</p>
          <p className="mb-2 mt-1 text-xs leading-relaxed text-gray-500">Share websites you like or dislike. This helps us understand taste quickly.</p>
          <div className="grid gap-3">
            {form.branding.exampleSites.map((site, index) => (
              <input
                key={index}
                className="field-input"
                value={site}
                onChange={(event) => {
                  const exampleSites = [...form.branding.exampleSites];
                  exampleSites[index] = event.target.value;
                  updateGroup('branding', { exampleSites });
                }}
                placeholder={`Example website ${index + 1}`}
              />
            ))}
          </div>
        </div>
        <TextAreaField label="Social links" value={form.branding.socialLinks} onChange={(socialLinks) => updateGroup('branding', { socialLinks })} />
        <TextAreaField label="Brand notes" value={form.branding.notes} onChange={(notes) => updateGroup('branding', { notes })} />
      </div>
    );
  }

  if (stepKey === 'assets') {
    return (
      <div className="space-y-5">
        <HelpBox>
          Put everything you already have in one place. Missing items are fine; they simply help us know what to prepare.
        </HelpBox>
        <div>
          <p className="mb-3 text-sm font-extrabold text-black">Which assets or access details do you already have?</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {ASSET_ITEMS.map((item) => (
              <ToggleCard
                key={item}
                active={form.assets.available[item] === true}
                onClick={() => updateGroup('assets', { available: { ...form.assets.available, [item]: !form.assets.available[item] } })}
              >
                <span className="font-bold">{item}</span>
              </ToggleCard>
            ))}
          </div>
        </div>
        <TextField label="Google Drive, Dropbox, or folder link" value={form.assets.driveLink} onChange={(driveLink) => updateGroup('assets', { driveLink })} />
        <TextAreaField label="Access notes" value={form.assets.accessNotes} onChange={(accessNotes) => updateGroup('assets', { accessNotes })} why="Mention who has domain, hosting, admin, or social access." />
        <TextAreaField label="What is missing?" value={form.assets.missing} onChange={(missing) => updateGroup('assets', { missing })} />
      </div>
    );
  }

  if (stepKey === 'budget') {
    return (
      <div className="space-y-5">
        {form.pricingEstimate && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            <p className="font-extrabold">Pricing Calculator Estimate</p>
            <p className="mt-1">Package: {form.pricingEstimate.recommendedPackage || form.pricingEstimate.selectedPackage || 'Not available'}</p>
            <p>Budget: {form.pricingEstimate.estimatedBudget || 'Not available'}</p>
            <p>Features: {list(form.pricingEstimate.features || [])}</p>
          </div>
        )}
        <Field label="Budget" required why="This helps us shape the project around what is realistic now.">
          <RadioGrid items={BUDGET_OPTIONS} value={form.budget.budget} onChange={(budget) => updateGroup('budget', { budget })} />
        </Field>
        <Field label="Timeline" required why="This tells us how urgent the project is and whether phased delivery is needed.">
          <RadioGrid items={TIMELINE_OPTIONS} value={form.budget.timeline} onChange={(timeline) => updateGroup('budget', { timeline })} />
        </Field>
        <TextAreaField label="Must-have features" value={form.budget.mustHave} onChange={(mustHave) => updateGroup('budget', { mustHave })} why="These should be included in the first build." />
        <TextAreaField label="Nice-to-have features" value={form.budget.niceToHave} onChange={(niceToHave) => updateGroup('budget', { niceToHave })} />
        <TextAreaField label="Anything we should build later?" value={form.budget.later} onChange={(later) => updateGroup('budget', { later })} why="This helps us identify Phase 2 work without inflating the current project." />
      </div>
    );
  }

  return (
    <Review form={form} allPages={allPages} selectedFeatures={selectedFeatures} missingInfo={missingInfo} recommendations={recommendations} />
  );
}

function TextField({ label, value, onChange, why, required }) {
  return (
    <Field label={label} why={why} required={required}>
      <input className="field-input" value={value} onChange={(event) => onChange(event.target.value)} />
    </Field>
  );
}

function TextAreaField({ label, value, onChange, why, required, placeholder }) {
  return (
    <Field label={label} why={why} required={required}>
      <textarea className="field-input min-h-[110px] resize-y" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </Field>
  );
}

function Review({ form, allPages, selectedFeatures, missingInfo, recommendations }) {
  const contentStatus = allPages.map((page) => `${page}: ${form.pages.contentStatus[page] || 'Not answered'}`);
  return (
    <div className="space-y-5">
      <HelpBox>
        Review the brief below before submitting. It is okay if some information is missing; we will use the missing information list during follow-up.
      </HelpBox>
      <ReviewSection title="Project Overview" rows={[
        ['Reference', form.reference],
        ['Business', form.contact.business],
        ['Industry', form.contact.industry],
        ['Project description', form.project.description],
        ['Pricing calculator', form.completedCalculator],
        ['Calculator estimate', form.pricingEstimate?.estimatedBudget || 'Not available'],
      ]} />
      <ReviewSection title="Business" rows={[
        ['What they do', form.business.description],
        ['Customers', form.business.customers],
        ['Problem to solve', form.business.problem],
        ['Desired visitor actions', list(form.business.desiredActions)],
      ]} />
      <ReviewSection title="Required Pages" rows={[
        ['Pages', list(allPages)],
        ['Content status', contentStatus.join('; ') || 'Not answered'],
      ]} />
      <ReviewSection title="Features" rows={[
        ['Visitor actions', list(form.project.visitorActions)],
        ['Account types', list(form.project.accountTypes)],
        ['Selected features', list(selectedFeatures)],
        ['Automation', form.project.automation],
      ]} />
      <ReviewSection title="Brand Assets" rows={[
        ['Colours', form.branding.colors],
        ['Logo', form.branding.logo],
        ['Example websites', list(form.branding.exampleSites.filter(Boolean))],
        ['Available assets', Object.entries(form.assets.available).filter(([, value]) => value).map(([key]) => key).join(', ')],
      ]} />
      <ReviewSection title="Budget & Timeline" rows={[
        ['Budget', form.budget.budget || form.pricingEstimate?.estimatedBudget],
        ['Timeline', form.budget.timeline],
        ['Must-have', form.budget.mustHave],
        ['Nice-to-have', form.budget.niceToHave],
        ['Build later', form.budget.later],
      ]} />
      <ReviewSection title="Missing Information" rows={missingInfo.length ? missingInfo.map((item) => [item, 'Needs follow-up']) : [['None', 'Ready for review']]} />
      <ReviewSection title="Recommendations" rows={recommendations.map((item) => ['Recommendation', item])} />
    </div>
  );
}

function ReviewSection({ title, rows }) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="mb-3 text-lg font-extrabold text-black">{title}</h3>
      <div className="divide-y divide-gray-100">
        {rows.filter(([, value]) => String(value || '').trim()).map(([label, value]) => (
          <div key={`${title}-${label}-${value}`} className="grid gap-2 py-3 text-sm sm:grid-cols-[180px_1fr]">
            <span className="font-bold text-gray-500">{label}</span>
            <span className="font-semibold text-black">{value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Progress({ step }) {
  const percent = ((step + 1) / STEPS.length) * 100;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
        <span>Step {step + 1} of {STEPS.length}</span>
        <span>{Math.round(percent)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-200" aria-hidden="true">
        <div className="h-full rounded-full bg-red-600 transition-all duration-300" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function SuccessView({ form, summary, serverIssue, whatsappHref, copied, onCopy, onReset, onDownload }) {
  return (
    <section className="min-h-screen bg-[#f6f7f9] px-4 py-10 text-gray-900 sm:px-6">
      <Helmet>
        <title>Project Brief Received | The BrandHelper</title>
      </Helmet>
      <div className="mx-auto max-w-3xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-xs font-extrabold uppercase tracking-widest text-red-600">Project Brief Submitted</p>
        <h1 className="mt-2 text-3xl font-extrabold text-black md:text-4xl">We've Received Your Project Brief</h1>
        <div className="mt-5 grid gap-3 rounded-lg bg-gray-50 p-4 text-sm sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Reference Number</p>
            <p className="mt-1 font-extrabold text-black">{form.reference}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Estimated Budget</p>
            <p className="mt-1 font-extrabold text-black">{form.budget.budget || form.pricingEstimate?.estimatedBudget || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Timeline</p>
            <p className="mt-1 font-extrabold text-black">{form.budget.timeline || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Business</p>
            <p className="mt-1 font-extrabold text-black">{form.contact.business || 'Not provided'}</p>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm leading-relaxed text-emerald-900">
          <p className="font-extrabold">Next steps</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>We'll review your project.</li>
            <li>We'll compare it with your calculator estimate if available.</li>
            <li>We'll contact you within 24 hours.</li>
          </ol>
        </div>

        {serverIssue && (
          <ApiIssueReport error={serverIssue} context="Project requirements brief" payloadText={summary} className="mt-5 rounded-lg p-4" />
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={onDownload} className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-sm font-extrabold text-black transition hover:border-black">
            <FiDownload className="h-4 w-4" />
            Download PDF Copy
          </button>
          <a href={`mailto:${encodeURIComponent(form.contact.email)}?subject=${encodeURIComponent(`Project brief ${form.reference}`)}&body=${encodeURIComponent(summary)}`} className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-sm font-extrabold text-black transition hover:border-black">
            <FiMail className="h-4 w-4" />
            Email Me A Copy
          </a>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-emerald-700">
            <FiMessageCircle className="h-4 w-4" />
            Continue on WhatsApp
          </a>
          <a href={CONSULTATION_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-3 text-sm font-extrabold text-white transition hover:bg-gray-900">
            <FiPhoneCall className="h-4 w-4" />
            Book Discovery Call
          </a>
          <button type="button" onClick={onCopy} className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-sm font-extrabold text-black transition hover:border-black">
            <FiCopy className="h-4 w-4" />
            {copied ? 'Copied' : 'Copy Brief'}
          </button>
          <button type="button" onClick={onReset} className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-3 text-sm font-extrabold text-black transition hover:border-black">
            Start Another Brief
          </button>
        </div>
      </div>
    </section>
  );
}

function buildSummary({ form, allPages, selectedFeatures, missingInfo, recommendations }) {
  const assets = Object.entries(form.assets.available).filter(([, value]) => value).map(([key]) => key);
  return [
    'The BrandHelper Project Requirements Brief',
    `Reference: ${form.reference}`,
    '',
    'Contact',
    `Name: ${form.contact.name || 'Not provided'}`,
    `Business: ${form.contact.business || 'Not provided'}`,
    `Industry: ${form.contact.industry || 'Not provided'}`,
    `Email: ${form.contact.email || 'Not provided'}`,
    `Phone: ${form.contact.phone || 'Not provided'}`,
    `Country: ${form.contact.country || 'Not provided'}`,
    `Preferred contact: ${form.contact.preferredContact || 'Not provided'}`,
    `Socials: ${form.contact.socials || 'Not provided'}`,
    '',
    'Pricing Calculator',
    `Completed calculator: ${form.completedCalculator || 'Not answered'}`,
    `Calculator reference: ${form.pricingEstimate?.reference || 'Not available'}`,
    `Calculator package: ${form.pricingEstimate?.recommendedPackage || form.pricingEstimate?.selectedPackage || 'Not available'}`,
    `Calculator budget: ${form.pricingEstimate?.estimatedBudget || 'Not available'}`,
    `Calculator features: ${list(form.pricingEstimate?.features || [])}`,
    '',
    'Business',
    `What they do: ${form.business.description || 'Not provided'}`,
    `Customers/users: ${form.business.customers || 'Not provided'}`,
    `Problem to solve: ${form.business.problem || 'Not provided'}`,
    `Desired actions: ${list(form.business.desiredActions)}${form.business.otherAction ? `, ${form.business.otherAction}` : ''}`,
    '',
    'Project',
    `Description: ${form.project.description || 'Not provided'}`,
    `Visitor actions: ${list(form.project.visitorActions)}${form.project.otherVisitorAction ? `, ${form.project.otherVisitorAction}` : ''}`,
    `Account types: ${list(form.project.accountTypes)}`,
    `After sign-in: ${form.project.signedInExperience || 'Not provided'}`,
    `Management needs: ${form.project.managerNeeds || 'Not provided'}`,
    `Uploads: ${form.project.uploads || 'Not provided'}`,
    `Notifications: ${form.project.notifications || 'Not provided'}`,
    `Automation: ${form.project.automation || 'Not provided'}`,
    '',
    'Pages & Content',
    `Pages: ${list(allPages)}`,
    `Content status: ${allPages.map((page) => `${page} - ${form.pages.contentStatus[page] || 'Not answered'}`).join('; ') || 'Not provided'}`,
    '',
    'Features',
    `Selected features: ${list(selectedFeatures)}`,
    '',
    'Branding',
    `Colours: ${form.branding.colors || 'Not provided'}`,
    `Logo: ${form.branding.logo || 'Not provided'}`,
    `Fonts: ${form.branding.fonts || 'Not provided'}`,
    `Guidelines: ${form.branding.guidelines || 'Not provided'}`,
    `Example sites: ${list(form.branding.exampleSites.filter(Boolean))}`,
    `Social links: ${form.branding.socialLinks || 'Not provided'}`,
    `Brand notes: ${form.branding.notes || 'Not provided'}`,
    '',
    'Existing Assets',
    `Available: ${list(assets)}`,
    `Folder link: ${form.assets.driveLink || 'Not provided'}`,
    `Access notes: ${form.assets.accessNotes || 'Not provided'}`,
    `Missing: ${form.assets.missing || 'Not provided'}`,
    '',
    'Budget & Timeline',
    `Budget: ${form.budget.budget || form.pricingEstimate?.estimatedBudget || 'Not provided'}`,
    `Timeline: ${form.budget.timeline || 'Not provided'}`,
    `Must-have: ${form.budget.mustHave || 'Not provided'}`,
    `Nice-to-have: ${form.budget.niceToHave || 'Not provided'}`,
    `Build later: ${form.budget.later || 'Not provided'}`,
    '',
    'Missing Information',
    missingInfo.length ? missingInfo.map((item) => `- ${item}`).join('\n') : 'None',
    '',
    'Recommendations',
    recommendations.map((item) => `- ${item}`).join('\n'),
  ].join('\n');
}
