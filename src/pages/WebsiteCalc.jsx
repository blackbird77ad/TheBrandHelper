import { createElement, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiChevronDown,
  FiClock,
  FiCopy,
  FiDownload,
  FiDollarSign,
  FiInfo,
  FiMail,
  FiMessageCircle,
  FiRefreshCw,
  FiSend,
  FiShield,
  FiSliders,
  FiUser,
  FiZap,
} from 'react-icons/fi';
import { submitLead } from '../utils/api';
import ApiIssueReport from '../components/ApiIssueReport';
import calculatorGuideImg from '../photos/customer-care-quote-forms-side-by-side.webp';
import {
  CONTENT_OPTIONS,
  DESIGN_COMPLEXITY_OPTIONS,
  EXISTING_SITE_OPTIONS,
  FEATURE_PACKAGE_RULES,
  INFRA_OPTIONS,
  INFRA_SERVICES,
  NOTIFICATION_OPTIONS,
  NOTIFICATION_PRICING,
  NOTIFICATION_TYPES,
  PACKAGE_ORDER,
  PACKAGES,
  PRICING_THRESHOLDS,
  PROJECT_INTENT_OPTIONS,
  STANDALONE_COMPLEXITY_OPTIONS,
  STANDALONE_PRICING,
  STANDALONE_SERVICE_GROUPS,
  TIMELINE_OPTIONS,
  UPGRADE_EXISTING_PRICING,
  UPGRADE_MESSAGES,
} from '../config/websitePricingConfig';

const STORAGE_KEY = 'tbh_website_pricing_calculator_v2';
const ESTIMATE_SNAPSHOT_KEY = 'tbh_website_pricing_last_estimate_v2';
const WHATSAPP_NUMBER = '233501657205';
const CONSULTATION_URL = 'https://calendly.com/blackbird77ad/free-consultation';

const BUSINESS_TYPES = [
  { key: 'church', label: 'Church', desc: 'Ministry, congregation, media, donations, or member care.' },
  { key: 'school', label: 'School', desc: 'Admissions, records, teachers, parents, courses, or exams.' },
  { key: 'restaurant', label: 'Restaurant', desc: 'Menus, reservations, orders, delivery, or catering.' },
  { key: 'healthcare', label: 'Healthcare', desc: 'Clinic, pharmacy, wellness, appointments, or patient support.' },
  { key: 'ngo', label: 'NGO', desc: 'Community work, programmes, donors, volunteers, or reports.' },
  { key: 'consultancy', label: 'Consultancy', desc: 'Services, bookings, coaching, proposals, or expert content.' },
  { key: 'real_estate', label: 'Real Estate', desc: 'Listings, agents, rentals, enquiries, or property media.' },
  { key: 'startup', label: 'Startup', desc: 'New product, SaaS, MVP, investor demo, or pilot system.' },
  { key: 'retail', label: 'Retail', desc: 'Products, catalogue, stock, checkout, or customer accounts.' },
  { key: 'government', label: 'Government', desc: 'Public services, portals, records, departments, or citizens.' },
  { key: 'other', label: 'Other', desc: 'Choose this if your business does not fit the list.' },
];

const PAGE_OPTIONS = [
  { key: 'landing', label: 'Landing Page', desc: 'One focused page for a service, campaign, product, or event.', price: 90, weight: 1 },
  { key: '2_5', label: '2-5 Pages', desc: 'A compact site with the core pages most visitors expect.', price: 220, weight: 2 },
  { key: '6_10', label: '6-10 Pages', desc: 'More room for services, branches, team, galleries, FAQs, or content.', price: 430, weight: 4 },
  { key: '11_20', label: '11-20 Pages', desc: 'A larger content website with more planning and page templates.', price: 780, weight: 7 },
  { key: '20_plus', label: '20+ Pages', desc: 'A content-heavy website that needs stronger structure and governance.', price: 1300, weight: 11 },
];

const FRONTEND_FEATURES = [
  { key: 'responsive', label: 'Responsive Design', desc: 'The site adapts cleanly to phones, tablets, and desktops.', price: 120, weight: 1 },
  { key: 'premium_ui', label: 'Premium UI', desc: 'A more polished visual direction with richer layouts and details.', price: 260, weight: 3 },
  { key: 'animations', label: 'Animations', desc: 'Thoughtful motion for transitions, reveals, and interaction feedback.', price: 160, weight: 2 },
  { key: 'accessibility', label: 'Accessibility', desc: 'Better keyboard, contrast, labels, and readable layout support.', price: 170, weight: 2 },
  { key: 'advanced_seo', label: 'Advanced SEO', desc: 'Search-friendly page setup, metadata, structured content, and speed focus.', price: 230, weight: 2 },
  { key: 'blog', label: 'Blog', desc: 'Publish articles, news, announcements, sermons, updates, or resources.', price: 240, weight: 3 },
  { key: 'portfolio', label: 'Portfolio', desc: 'Show projects, case studies, work samples, or testimonials visually.', price: 140, weight: 1 },
  { key: 'gallery', label: 'Gallery', desc: 'A polished photo or media section for events, products, or spaces.', price: 120, weight: 1 },
  { key: 'testimonials', label: 'Testimonials', desc: 'Display reviews, client comments, or success stories.', price: 80, weight: 1 },
  { key: 'faq', label: 'FAQ', desc: 'Answer common questions before a visitor contacts you.', price: 70, weight: 1 },
  { key: 'contact_forms', label: 'Contact Forms', desc: 'Simple forms for enquiries, bookings, applications, or requests.', price: 120, weight: 1 },
  { key: 'multilanguage', label: 'Multi-language Support', desc: 'Plan and display the site in two or more languages.', price: 380, weight: 4 },
];

const BACKEND_FEATURES = [
  { key: 'database', label: 'Simple Database', desc: 'Save enquiries, posts, gallery items, or other light website records.', price: 360, weight: 3 },
  { key: 'cms', label: 'Content Management', desc: 'Update pages, blog posts, announcements, gallery items, or basic website content.', price: 480, weight: 4 },
  { key: 'rest_api', label: 'App / Tool Connection', desc: 'Let the site, dashboard, or outside tools exchange information securely.', price: 440, weight: 5 },
  { key: 'authentication', label: 'Secure Login', desc: 'Add protected access for a simple admin area or private section.', price: 480, weight: 3 },
  { key: 'file_storage', label: 'File Uploads', desc: 'Upload and manage photos, documents, files, or media.', price: 330, weight: 2 },
  { key: 'admin_dashboard', label: 'Admin Area', desc: 'A private control area for basic website, content, or enquiry management.', price: 700, weight: 4 },
  { key: 'analytics_dashboard', label: 'Reporting Dashboard', desc: 'Charts and reporting for business activity, records, or performance.', price: 560, weight: 5 },
  { key: 'media_library', label: 'Media Library', desc: 'Organise uploaded images, video, documents, or downloads.', price: 380, weight: 2 },
];

const USER_FEATURES = [
  { key: 'registration', label: 'User Registration', desc: 'People can create their own account.', price: 240, weight: 3 },
  { key: 'login', label: 'Login', desc: 'Returning users can access private pages.', price: 190, weight: 2 },
  { key: 'password_reset', label: 'Password Reset', desc: 'Users can recover access safely.', price: 140, weight: 2 },
  { key: 'two_factor', label: 'Two-Factor Authentication', desc: 'Add an extra security step for sensitive accounts.', price: 340, weight: 4 },
  { key: 'profiles', label: 'User Profiles', desc: 'Each user has saved details, preferences, or history.', price: 220, weight: 3 },
  { key: 'roles', label: 'Roles & Permissions', desc: 'Control what staff, admins, members, or customers can access.', price: 520, weight: 6 },
  { key: 'staff_accounts', label: 'Staff Accounts', desc: 'Internal users can manage work securely.', price: 210, weight: 2, role: true },
  { key: 'customer_accounts', label: 'Customer Accounts', desc: 'Customers can manage orders, bookings, or documents.', price: 220, weight: 2, role: true },
  { key: 'member_accounts', label: 'Member Accounts', desc: 'Members can access private resources, events, or updates.', price: 220, weight: 2, role: true },
];

const MODULE_GROUPS = [
  {
    key: 'general',
    label: 'General Modules',
    audience: ['church', 'school', 'restaurant', 'healthcare', 'ngo', 'consultancy', 'real_estate', 'startup', 'retail', 'government', 'other'],
    items: [
      { key: 'bookings', label: 'Bookings', desc: 'Let people request or reserve a service.', price: 520, weight: 5 },
      { key: 'appointments', label: 'Appointments', desc: 'Manage dates, times, availability, and confirmations.', price: 420, weight: 4 },
      { key: 'orders', label: 'Orders', desc: 'Track customer requests, purchases, or service fulfilment.', price: 620, weight: 6 },
      { key: 'inventory', label: 'Inventory', desc: 'Track products, stock, quantities, and changes.', price: 820, weight: 8 },
      { key: 'reports', label: 'Reports', desc: 'Generate summaries, exports, and management views.', price: 520, weight: 5 },
      { key: 'crm', label: 'CRM', desc: 'Manage leads, customers, notes, follow-ups, and pipelines.', price: 980, weight: 10, complex: true },
      { key: 'notifications', label: 'Notifications', desc: 'Send email, SMS, WhatsApp, or in-app alerts.', price: 340, weight: 4 },
      { key: 'documents', label: 'Document Management', desc: 'Store, organise, share, or approve documents.', price: 680, weight: 7 },
    ],
  },
  {
    key: 'church',
    label: 'Church Modules',
    audience: ['church'],
    items: [
      { key: 'member_management', label: 'Member Management', desc: 'Manage members, groups, families, and pastoral notes.', price: 720, weight: 7 },
      { key: 'donations', label: 'Donations', desc: 'Accept and track giving online.', price: 560, weight: 5 },
      { key: 'tithes', label: 'Tithes', desc: 'Record tithes and giving history.', price: 500, weight: 5 },
      { key: 'church_attendance', label: 'Attendance', desc: 'Track services, meetings, groups, or classes.', price: 440, weight: 4 },
      { key: 'events', label: 'Events', desc: 'Publish and manage church events.', price: 340, weight: 3 },
      { key: 'livestream', label: 'Livestream', desc: 'Embed live or recorded services.', price: 280, weight: 2 },
      { key: 'volunteers', label: 'Volunteer Management', desc: 'Coordinate teams, rotas, roles, and availability.', price: 560, weight: 5 },
      { key: 'prayer_requests', label: 'Prayer Requests', desc: 'Receive, review, and respond to prayer requests.', price: 340, weight: 3 },
      { key: 'sermons', label: 'Sermons', desc: 'Publish sermon audio, video, notes, and series.', price: 380, weight: 4 },
    ],
  },
  {
    key: 'school',
    label: 'School Modules',
    audience: ['school'],
    items: [
      { key: 'admissions', label: 'Admissions', desc: 'Collect and manage student applications.', price: 720, weight: 7 },
      { key: 'student_records', label: 'Student Records', desc: 'Store student profiles, classes, guardians, and documents.', price: 920, weight: 9, complex: true },
      { key: 'teacher_portal', label: 'Teacher Portal', desc: 'Give teachers private access to teaching workflows.', price: 780, weight: 8 },
      { key: 'parent_portal', label: 'Parent Portal', desc: 'Let parents view student information and updates.', price: 800, weight: 8 },
      { key: 'school_attendance', label: 'Attendance', desc: 'Track attendance for classes or school days.', price: 520, weight: 5 },
      { key: 'timetable', label: 'Timetable', desc: 'Manage schedules for classes, teachers, and rooms.', price: 560, weight: 5 },
      { key: 'exams', label: 'Exams', desc: 'Manage exams, grades, results, and reports.', price: 880, weight: 9, complex: true },
      { key: 'lms', label: 'Learning Management', desc: 'Courses, lessons, assignments, progress, and learning resources.', price: 1600, weight: 16, complex: true },
    ],
  },
  {
    key: 'commerce',
    label: 'Commerce',
    audience: ['restaurant', 'startup', 'retail'],
    items: [
      { key: 'products', label: 'Products', desc: 'Create a product catalogue with details, images, and categories.', price: 520, weight: 5 },
      { key: 'shipping', label: 'Shipping', desc: 'Manage delivery options, zones, and fulfilment notes.', price: 420, weight: 4 },
      { key: 'commerce_coupons', label: 'Coupons', desc: 'Offer discount codes and promotions.', price: 240, weight: 2 },
      { key: 'reviews', label: 'Reviews', desc: 'Collect and display customer reviews.', price: 260, weight: 2 },
      { key: 'wishlist', label: 'Wishlist', desc: 'Let customers save items for later.', price: 210, weight: 2 },
    ],
  },
];

const PAYMENT_FEATURES = [
  { key: 'stripe', label: 'Stripe', desc: 'Card payments through Stripe.', price: 360, weight: 4 },
  { key: 'paystack', label: 'Paystack', desc: 'Card, bank transfer, and local payments through Paystack, including MOMO or mobile money.', price: 360, weight: 4 },
  { key: 'paypal', label: 'PayPal', desc: 'PayPal payments for international customers.', price: 330, weight: 4 },
  { key: 'mobile_money', label: 'Separate Mobile Money Flow', desc: 'Use this only if mobile money is needed outside Paystack, such as manual MOMO instructions or a separate provider flow.', price: 340, weight: 4 },
  { key: 'subscriptions', label: 'Subscriptions', desc: 'Recurring plans, memberships, or renewals.', price: 580, weight: 7 },
  { key: 'payment_coupons', label: 'Coupons', desc: 'Discount codes tied to checkout.', price: 190, weight: 2 },
  { key: 'invoices', label: 'Invoices', desc: 'Issue invoices or payment requests.', price: 400, weight: 4 },
  { key: 'tax_management', label: 'Tax Management', desc: 'Tax fields, calculations, or reporting support.', price: 420, weight: 5 },
];

const INTEGRATION_FEATURES = [
  { key: 'google_maps', label: 'Google Maps', desc: 'Maps, directions, or location lookup.', price: 140, weight: 1 },
  { key: 'google_analytics', label: 'Google Analytics', desc: 'Traffic tracking and visitor reporting.', price: 130, weight: 1 },
  { key: 'whatsapp', label: 'WhatsApp', desc: 'WhatsApp buttons, links, or notifications.', price: 160, weight: 2 },
  { key: 'zoom', label: 'Zoom', desc: 'Meeting links, events, or booking workflows.', price: 280, weight: 3 },
  { key: 'mailchimp', label: 'Mailchimp', desc: 'Newsletter or audience sync.', price: 280, weight: 3 },
  { key: 'external_crm', label: 'CRM', desc: 'Connect an existing CRM or sales tool.', price: 540, weight: 6 },
  { key: 'google_calendar', label: 'Google Calendar', desc: 'Calendar sync for bookings or events.', price: 340, weight: 4 },
  { key: 'openai', label: 'AI Features', desc: 'AI features such as assistants, summaries, or smart automation.', price: 980, weight: 12 },
  { key: 'slack', label: 'Slack', desc: 'Team alerts and workflow notifications.', price: 280, weight: 3 },
  { key: 'zapier', label: 'Zapier', desc: 'Connect your site to other apps with automations.', price: 340, weight: 4 },
];

const CONTACT_METHODS = [
  { key: 'whatsapp', label: 'WhatsApp', desc: 'Fastest for quick clarification.' },
  { key: 'email', label: 'Email', desc: 'Best for detailed written follow-up.' },
  { key: 'phone', label: 'Phone Call', desc: 'Best if you prefer a direct conversation.' },
];

const WEBSITE_STEPS = [
  { key: 'intent', title: 'What would you like help with today?', eyebrow: 'Start here' },
  { key: 'business', title: 'What type of business is this for?', eyebrow: 'Business type' },
  { key: 'package', title: 'Which project type sounds closest?', eyebrow: 'Service level' },
  { key: 'frontend', title: 'What should visitors see on the website?', eyebrow: 'Visitor experience' },
  { key: 'design', title: 'How custom should your design be?', eyebrow: 'Design complexity' },
  { key: 'content', title: 'Who will provide the content and existing website materials?', eyebrow: 'Content and migration' },
  { key: 'backend', title: 'Will the website save information or include management tools?', eyebrow: 'Data and management' },
  { key: 'users', title: 'Will people need accounts or private access?', eyebrow: 'User management' },
  { key: 'modules', title: 'Which business tools should the project include?', eyebrow: 'Business modules' },
  { key: 'payments', title: 'Will the project accept payments or handle commerce?', eyebrow: 'Payments and commerce' },
  { key: 'notifications', title: 'Should the website send automatic emails or notifications?', eyebrow: 'Email and notifications' },
  { key: 'integrations', title: 'Which outside tools should connect to the project?', eyebrow: 'Integrations' },
  { key: 'timeline', title: 'How quickly do you need the project?', eyebrow: 'Timeline' },
  { key: 'infrastructure', title: 'What setup or ongoing services do you need?', eyebrow: 'Setup and care' },
  { key: 'review', title: 'Review and confirm your estimate.', eyebrow: 'Review' },
  { key: 'estimate', title: 'Send your estimate to The BrandHelper.', eyebrow: 'Submission' },
];

const STANDALONE_STEPS = [
  { key: 'intent', title: 'What would you like help with today?', eyebrow: 'Start here' },
  { key: 'standalone_services', title: 'Which standalone digital services do you need?', eyebrow: 'Standalone services' },
  { key: 'standalone_details', title: 'Tell us a little more about the service.', eyebrow: 'Service details' },
  { key: 'estimate', title: 'Send your request to The BrandHelper.', eyebrow: 'Submission' },
];

const DEFAULT_CALC = {
  version: 3,
  step: 0,
  requestType: '',
  businessType: '',
  otherBusinessType: '',
  projectType: '',
  frontend: {
    pages: '',
    design: '',
    existingSite: '',
    content: [],
    features: [],
  },
  backend: {
    required: '',
    features: [],
  },
  users: [],
  modules: [],
  payments: [],
  integrations: [],
  notifications: {
    level: 'none',
    types: [],
  },
  standalone: {
    services: [],
    complexity: 'standard',
    currentWebsite: '',
    details: '',
    urgency: 'standard',
  },
  timeline: 'standard',
  infrastructure: {
    domain: 'own',
    hosting: 'own',
    email: 'own',
    ssl: 'own',
    maintenance: 'none',
    services: [],
  },
  contact: {
    name: '',
    company: '',
    email: '',
    phone: '',
    country: '',
    preferred: 'whatsapp',
  },
  reference: '',
};

function makeReference() {
  const now = new Date();
  const stamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('');
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TBH-WEB-${stamp}-${suffix}`;
}

function freshCalc() {
  return { ...JSON.parse(JSON.stringify(DEFAULT_CALC)), reference: makeReference() };
}

function readSavedCalc() {
  if (typeof window === 'undefined') return freshCalc();
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null');
    if (!saved || ![2, 3].includes(saved.version)) return freshCalc();
    return {
      ...freshCalc(),
      ...saved,
      version: 3,
      requestType: saved.requestType || '',
      frontend: { ...DEFAULT_CALC.frontend, ...(saved.frontend || {}) },
      backend: { ...DEFAULT_CALC.backend, ...(saved.backend || {}) },
      notifications: { ...DEFAULT_CALC.notifications, ...(saved.notifications || {}) },
      standalone: { ...DEFAULT_CALC.standalone, ...(saved.standalone || {}) },
      infrastructure: { ...DEFAULT_CALC.infrastructure, ...(saved.infrastructure || {}) },
      contact: { ...DEFAULT_CALC.contact, ...(saved.contact || {}) },
      reference: saved.reference || makeReference(),
    };
  } catch {
    return freshCalc();
  }
}

const money = (value) => `$${Math.round(value).toLocaleString()}`;
const signedMoney = (value) => value < 0 ? `-${money(Math.abs(value))}` : money(value);
const rangeMoney = (low, high, suffix = '') => `${money(low)} - ${money(high)}${suffix}`;
const roundToTen = (value) => Math.round(value / 10) * 10;
const packageIndex = (key) => Math.max(0, PACKAGE_ORDER.indexOf(key));
const selectedFrom = (items, keys) => items.filter((item) => keys.includes(item.key));
const allModuleItems = () => MODULE_GROUPS.flatMap((group) => group.items.map((item) => ({ ...item, group: group.label })));
const allStandaloneItems = () => STANDALONE_SERVICE_GROUPS.flatMap((group) => group.items.map((item) => ({ ...item, group: group.label })));
const packageByKey = (key) => PACKAGES.find((item) => item.key === key) || PACKAGES[0];
const pricingPackageForRequest = (pkg, requestType) => {
  if (requestType !== 'upgrade_existing') return pkg;
  return { ...pkg, ...(UPGRADE_EXISTING_PRICING[pkg.key] || {}) };
};

function packageRangeLabel(pkg) {
  return pkg.max ? `${money(pkg.min)} - ${money(pkg.max)}${pkg.plusAtMax ? '+' : ''}` : `${money(pkg.min)}+`;
}

function estimateRangeMoney(estimate, lowField = 'launchLow', highField = 'launchHigh') {
  const suffix = highField === 'developmentHigh' ? estimate.developmentHighSuffix : estimate.launchHighSuffix;
  return rangeMoney(estimate[lowField], estimate[highField], suffix || '');
}

function selectedBusinessLabel(calc) {
  const business = BUSINESS_TYPES.find((item) => item.key === calc.businessType);
  if (calc.businessType === 'other' && calc.otherBusinessType.trim()) return calc.otherBusinessType.trim();
  return business?.label || 'Not selected';
}

function selectedLabel(items, key, fallback = 'Not selected') {
  return items.find((item) => item.key === key)?.label || fallback;
}

function sum(items, field = 'price') {
  return items.reduce((total, item) => total + Number(item[field] || 0), 0);
}

function intentLabel(key) {
  return PROJECT_INTENT_OPTIONS.find((item) => item.key === key)?.label || 'Not selected';
}

function notificationLevelLabel(key) {
  return NOTIFICATION_OPTIONS.find((item) => item.key === key)?.label || 'No';
}

function selectedNotificationTypes(keys = []) {
  return selectedFrom(NOTIFICATION_TYPES, keys);
}

function notificationFeatureLine(calc, pkg) {
  const level = calc.notifications?.level || 'none';
  if (level === 'none') return null;
  const option = NOTIFICATION_OPTIONS.find((item) => item.key === level);
  const selectedTypes = selectedNotificationTypes(calc.notifications?.types || []);
  const price = NOTIFICATION_PRICING[pkg.key] || NOTIFICATION_PRICING.enterprise || 90;
  return {
    key: 'email_notification_system',
    label: 'Email & Notification System',
    desc: [
      option?.desc || 'Standard website email and notification setup.',
      'Covers standard transactional email implementation using Resend or another suitable provider.',
      level === 'advanced' ? 'Advanced marketing automation, drip campaigns, and multi-step workflows may be quoted separately.' : '',
      selectedTypes.length ? `Requested notifications: ${selectedTypes.map((item) => item.label).join(', ')}.` : '',
    ].filter(Boolean).join(' '),
    price,
    weight: Number(option?.weight || 0),
    category: 'Email and notifications',
  };
}

function standaloneServiceFee(service, complexityOption) {
  if (Number.isFinite(Number(service.fixedPrice))) {
    const price = roundToTen(Number(service.fixedPrice));
    return {
      low: price,
      high: price,
      midpoint: price,
      label: money(price),
    };
  }

  const multiplier = Number(complexityOption?.multiplier || 1);
  const low = roundToTen(Math.max(STANDALONE_PRICING.min, Number(service.typicalLow || service.priceFrom || STANDALONE_PRICING.min) * multiplier));
  const high = roundToTen(Math.max(low, Number(service.typicalHigh || service.priceFrom || low) * multiplier));
  const suffix = service.quoteIfAdvanced ? '+' : '';
  return {
    low,
    high,
    midpoint: roundToTen((low + high) / 2),
    label: low === high ? money(low) : rangeMoney(low, high, suffix),
  };
}

function standaloneServiceRange(services, complexityOption) {
  if (!services.length) {
    return {
      low: STANDALONE_PRICING.min,
      high: STANDALONE_PRICING.max,
      highSuffix: '+',
      from: STANDALONE_PRICING.min,
      quoteRecommended: false,
    };
  }

  const serviceFees = services.map((service) => standaloneServiceFee(service, complexityOption));
  const low = roundToTen(Math.max(STANDALONE_PRICING.min, sum(serviceFees, 'low')));
  const uncappedHigh = roundToTen(Math.max(low, sum(serviceFees, 'high')));
  const high = low > STANDALONE_PRICING.max ? uncappedHigh : Math.min(STANDALONE_PRICING.max, uncappedHigh);
  const quoteRecommended = Boolean(
    complexityOption?.quoteRecommended ||
    services.some((item) => item.quoteIfAdvanced) ||
    uncappedHigh > STANDALONE_PRICING.max
  );

  return {
    low,
    high: Math.max(low, high),
    highSuffix: quoteRecommended && uncappedHigh >= STANDALONE_PRICING.max ? '+' : '',
    from: Math.min(...services.map((item) => Number(item.priceFrom || item.typicalLow || STANDALONE_PRICING.min))),
    quoteRecommended,
  };
}

function buildSetup(calc) {
  const lines = [];
  const recurring = [];

  Object.entries(INFRA_OPTIONS).forEach(([groupKey, options]) => {
    const selected = options.find((item) => item.key === calc.infrastructure[groupKey]);
    if (!selected) return;
    if (selected.setup > 0) {
      lines.push({
        label: selected.label,
        group: groupKey,
        price: selected.setup,
        desc: selected.desc,
      });
    }
    if (selected.recurring > 0) {
      recurring.push({
        label: selected.label,
        group: groupKey,
        price: selected.recurring,
        cadence: selected.cadence,
        desc: selected.desc,
      });
    }
  });

  selectedFrom(INFRA_SERVICES, calc.infrastructure.services).forEach((service) => {
    if (service.setup > 0) {
      lines.push({
        label: service.label,
        group: 'additional service',
        price: service.setup,
        desc: service.desc,
      });
    }
    if (service.recurring > 0) {
      recurring.push({
        label: service.label,
        group: 'additional service',
        price: service.recurring,
        cadence: service.cadence,
        desc: service.desc,
      });
    }
  });

  return {
    lines,
    recurring,
    setupTotal: sum(lines),
    monthlyTotal: recurring.filter((item) => item.cadence === 'month').reduce((total, item) => total + item.price, 0),
    annualTotal: recurring.filter((item) => item.cadence === 'year').reduce((total, item) => total + item.price, 0),
  };
}

function scoreItems(items) {
  return items.reduce((total, item) => total + Number(item.weight || 0), 0);
}

function interpolate(value, inMin, inMax, outMin, outMax) {
  if (inMax <= inMin) return outMax;
  const progress = Math.min(1, Math.max(0, (value - inMin) / (inMax - inMin)));
  return outMin + ((outMax - outMin) * progress);
}

function enrichLine(item, category, overrides = {}) {
  const rule = FEATURE_PACKAGE_RULES[item.key] || {};
  return {
    ...item,
    ...overrides,
    category,
    weight: Number(overrides.weight ?? rule.weight ?? item.weight ?? 0),
    minPackage: overrides.minPackage || rule.minPackage || item.minPackage || 'starter',
    scopeReason: overrides.scopeReason || rule.reason || item.scopeReason || item.desc || '',
    price: 0,
  };
}

function estimateAmountForPackage(pkg, complexityScore) {
  const rules = PRICING_THRESHOLDS[pkg.key] || PRICING_THRESHOLDS.starter;
  if (!pkg.max) {
    const baseScore = Math.max(rules.minScore || 0, complexityScore);
    return pkg.min + Math.max(0, baseScore - (rules.minScore || 0)) * (rules.pointValue || 100);
  }

  if (complexityScore <= rules.targetScore) {
    return interpolate(complexityScore, rules.minScore, rules.targetScore, pkg.min, pkg.target);
  }
  return interpolate(complexityScore, rules.targetScore, rules.maxScore, pkg.target, pkg.max);
}

function estimateDevelopmentRange(pkg, complexityScore, timelineOption) {
  const rules = PRICING_THRESHOLDS[pkg.key] || PRICING_THRESHOLDS.starter;
  const beforeTimeline = roundToTen(estimateAmountForPackage(pkg, complexityScore));
  const multiplier = Number(timelineOption?.multiplier || 1);
  const midpoint = roundToTen(Math.max(pkg.min, beforeTimeline * multiplier));
  const low = roundToTen(Math.max(pkg.min, midpoint * (rules.lowVariance || 0.9)));
  const uncappedHigh = roundToTen(Math.max(low, midpoint * (rules.highVariance || 1.12)));
  const high = pkg.max && low <= pkg.max ? Math.min(pkg.max, uncappedHigh) : uncappedHigh;

  return {
    beforeTimeline,
    midpoint,
    low,
    high,
    highSuffix: pkg.plusAtMax && pkg.max && uncappedHigh >= pkg.max ? '+' : '',
    timelineAdjustment: midpoint - beforeTimeline,
  };
}

function featureGuidanceFor(lines, selectedPackage) {
  const selectedIndex = packageIndex(selectedPackage.key);
  const seen = new Set();
  return lines
    .filter((line) => packageIndex(line.minPackage) > selectedIndex)
    .filter((line) => {
      const key = `${line.label}-${line.minPackage}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((line) => ({
      label: line.label,
      package: packageByKey(line.minPackage).label,
      reason: line.scopeReason,
    }));
}

function buildStandaloneEstimate(calc) {
  const services = selectedFrom(allStandaloneItems(), calc.standalone.services || []);
  const complexityOption = STANDALONE_COMPLEXITY_OPTIONS.find((item) => item.key === calc.standalone.complexity) || STANDALONE_COMPLEXITY_OPTIONS[1];
  const serviceRange = standaloneServiceRange(services, complexityOption);
  const standalonePackage = {
    key: 'standalone',
    label: 'Standalone Digital Service',
    summary: 'Focused digital help such as domains, hosting, business email, integrations, fixes, improvements, branding, maintenance, or technical setup.',
    min: STANDALONE_PRICING.min,
    max: null,
    target: STANDALONE_PRICING.target,
  };
  const developmentLines = services.length
    ? services.map((service) => {
        const fee = standaloneServiceFee(service, complexityOption);
        return {
          key: service.key,
          label: service.label,
          desc: `${service.desc} Typical fee: ${fee.label}.`,
          group: service.group,
          category: service.group || 'Standalone service',
          price: fee.midpoint,
          priceLabel: fee.label,
          low: fee.low,
          high: fee.high,
          weight: 0,
        };
      })
    : [{
        key: 'standalone_consultation',
        label: 'Standalone service review',
        desc: 'We will review the requested digital service and confirm the exact scope.',
        category: 'Standalone service',
        price: 0,
        weight: 0,
      }];
  const complexityLine = complexityOption.key !== 'standard'
    ? [{
        key: 'standalone_complexity',
        label: complexityOption.label,
        desc: complexityOption.desc,
        category: 'Service complexity',
        price: 0,
        weight: 0,
      }]
    : [];
  const quoteNote = serviceRange.quoteRecommended
    ? [`Standalone digital services start from ${money(STANDALONE_PRICING.min)} and typically sit up to ${money(STANDALONE_PRICING.max)}+. Some selected services may need custom review before the final quote is confirmed.`]
    : [`Standalone digital services range from ${money(STANDALONE_PRICING.min)} to ${money(STANDALONE_PRICING.max)}+ depending on service type and complexity. Final pricing will be confirmed after reviewing your requirements.`];

  return {
    selectedPackage: standalonePackage,
    recommendedPackage: standalonePackage,
    selectedPackageChanged: false,
    developmentLines: [...developmentLines, ...complexityLine],
    backendNeeded: false,
    score: services.length,
    complexityScore: services.length,
    boundaryMessages: quoteNote,
    scopeGuidance: [],
    developmentLow: serviceRange.low,
    developmentHigh: serviceRange.high,
    developmentHighSuffix: serviceRange.highSuffix,
    setup: {
      lines: [],
      recurring: [],
      setupTotal: 0,
      monthlyTotal: 0,
      annualTotal: 0,
    },
    launchLow: serviceRange.low,
    launchHigh: serviceRange.high,
    launchHighSuffix: serviceRange.highSuffix,
    timeline: calc.timeline === 'rush' ? 'Priority timing, subject to review' : 'Confirmed after service review',
    reference: calc.reference,
    standaloneQuoteRecommended: serviceRange.quoteRecommended,
    selected: {
      page: null,
      design: null,
      existingSite: null,
      contentFeatures: [],
      timelineOption: TIMELINE_OPTIONS.find((item) => item.key === calc.timeline) || TIMELINE_OPTIONS[1],
      frontendFeatures: [],
      backendFeatures: [],
      userFeatures: [],
      moduleItems: [],
      paymentFeatures: [],
      integrationFeatures: [],
      notificationLevel: null,
      notificationTypes: [],
      standaloneServices: services,
      standaloneComplexity: complexityOption,
    },
  };
}

function buildEstimate(calc) {
  if (calc.requestType === 'standalone_service') return buildStandaloneEstimate(calc);

  const selectedPackage = packageByKey(calc.projectType);
  const page = PAGE_OPTIONS.find((item) => item.key === calc.frontend.pages);
  const design = DESIGN_COMPLEXITY_OPTIONS.find((item) => item.key === calc.frontend.design);
  const existingSite = EXISTING_SITE_OPTIONS.find((item) => item.key === calc.frontend.existingSite);
  const contentFeatures = selectedFrom(CONTENT_OPTIONS, calc.frontend.content || []);
  const timelineOption = TIMELINE_OPTIONS.find((item) => item.key === calc.timeline) || TIMELINE_OPTIONS[1];
  const frontendFeatures = selectedFrom(FRONTEND_FEATURES, calc.frontend.features);
  const backendFeatures = calc.backend.required === 'yes' ? selectedFrom(BACKEND_FEATURES, calc.backend.features) : [];
  const userFeatures = selectedFrom(USER_FEATURES, calc.users);
  const moduleItems = selectedFrom(allModuleItems(), calc.modules);
  const paymentFeatures = selectedFrom(PAYMENT_FEATURES, calc.payments);
  const integrationFeatures = selectedFrom(INTEGRATION_FEATURES, calc.integrations);
  const notificationOption = NOTIFICATION_OPTIONS.find((item) => item.key === calc.notifications?.level) || NOTIFICATION_OPTIONS[0];
  const notificationTypes = selectedNotificationTypes(calc.notifications?.types || []);

  const backendNeeded = calc.backend.required === 'yes' || userFeatures.length > 0 || moduleItems.length > 0 || paymentFeatures.length > 0;
  const backendFoundation = backendNeeded
    ? [enrichLine({
        key: 'backend_foundation',
        label: 'Data and management foundation',
        desc: 'Planning for saved records, admin tools, security, and reliable workflows.',
        weight: 3,
      }, 'Data and management', {
        minPackage: 'starter',
        scopeReason: 'Light data and admin features can fit Starter when they support simple website management rather than large operations.',
      })]
    : [];
  const roleCount = userFeatures.filter((item) => item.role).length;
  const rolePlanning = roleCount > 1
    ? [enrichLine({
        key: 'role_planning',
        label: 'Additional user role planning',
        desc: 'Extra planning for multiple user types and access rules.',
        weight: (roleCount - 1) * 3,
      }, 'Accounts and access', {
        minPackage: roleCount >= 3 ? 'custom' : 'business',
        scopeReason: 'Multiple user roles require careful permissions planning and testing.',
      })]
    : [];

  const weightedLines = [
    ...(page ? [enrichLine(page, 'Website pages')] : []),
    ...(design ? [enrichLine(design, 'Design')] : []),
    ...(existingSite ? [enrichLine(existingSite, 'Existing website')] : []),
    ...contentFeatures.map((item) => enrichLine(item, 'Content')),
    ...frontendFeatures.map((item) => enrichLine(item, 'Visitor experience')),
    ...backendFoundation,
    ...backendFeatures.map((item) => enrichLine(item, 'Data and management')),
    ...userFeatures.map((item) => enrichLine(item, 'Accounts and access')),
    ...rolePlanning,
    ...moduleItems.map((item) => enrichLine(item, item.group || 'Business module')),
    ...paymentFeatures.map((item) => enrichLine(item, 'Payments and commerce')),
    ...integrationFeatures.map((item) => enrichLine(item, 'Integration')),
  ];

  const score = scoreItems(weightedLines);
  const complexityScore = score + Number(timelineOption.weight || 0);
  const complexModules = moduleItems.filter((item) => item.complex).length;
  const advancedIntegrationCount = integrationFeatures.filter((item) => packageIndex(FEATURE_PACKAGE_RULES[item.key]?.minPackage) >= packageIndex('custom')).length;
  const enterpriseSignals = integrationFeatures.some((item) => item.enterprise) || (
    paymentFeatures.length >= 4 && moduleItems.length >= 3
  ) || (
    integrationFeatures.length >= 5 && moduleItems.length >= 4
  ) || (
    advancedIntegrationCount >= 2 && moduleItems.length >= 3 && userFeatures.length >= 3
  );

  let recommendedIndex = packageIndex(selectedPackage.key);
  weightedLines.forEach((line) => {
    recommendedIndex = Math.max(recommendedIndex, packageIndex(line.minPackage));
  });
  if (moduleItems.length >= 4 || complexModules >= 1 || userFeatures.some((item) => item.key === 'roles')) {
    recommendedIndex = Math.max(recommendedIndex, packageIndex('custom'));
  }
  if (enterpriseSignals) recommendedIndex = Math.max(recommendedIndex, packageIndex('enterprise'));

  for (let index = recommendedIndex; index < PACKAGES.length - 1; index += 1) {
    const rules = PRICING_THRESHOLDS[PACKAGES[index].key];
    if (!rules?.maxScore || complexityScore <= rules.maxScore) break;
    recommendedIndex = index + 1;
  }

  let recommendedPackage = PACKAGES[recommendedIndex];
  let pricingPackage = pricingPackageForRequest(recommendedPackage, calc.requestType);
  let developmentRange = estimateDevelopmentRange(pricingPackage, complexityScore, timelineOption);

  for (let tries = 0; tries < 4; tries += 1) {
    recommendedPackage = PACKAGES[recommendedIndex];
    pricingPackage = pricingPackageForRequest(recommendedPackage, calc.requestType);
    developmentRange = estimateDevelopmentRange(pricingPackage, complexityScore, timelineOption);
    if (pricingPackage.max && developmentRange.high >= pricingPackage.max && complexityScore > (PRICING_THRESHOLDS[recommendedPackage.key]?.maxScore || Infinity) && recommendedIndex < PACKAGES.length - 1) {
      recommendedIndex += 1;
      continue;
    }
    break;
  }

  const totalWeight = Math.max(1, scoreItems(weightedLines));
  const allocationPool = Math.max(0, developmentRange.beforeTimeline - pricingPackage.min);
  const allocatedLines = weightedLines.map((line) => ({
    ...line,
    price: line.weight > 0 ? roundToTen(allocationPool * (line.weight / totalWeight)) : 0,
  }));
  const developmentLines = [
    {
      key: 'base_package',
      label: `${recommendedPackage.label} foundation`,
      desc: 'Package baseline covering project planning, core build setup, responsive implementation, QA, and launch preparation.',
      price: pricingPackage.min,
      weight: 0,
      category: 'Base package',
    },
    ...allocatedLines,
    ...(developmentRange.timelineAdjustment !== 0
      ? [{
          key: 'timeline_adjustment',
          label: `${timelineOption.label} timeline adjustment`,
          desc: timelineOption.desc,
          price: developmentRange.timelineAdjustment,
          weight: 0,
          category: 'Timeline',
        }]
      : []),
  ];
  const notificationLine = notificationFeatureLine(calc, recommendedPackage);
  if (notificationLine) developmentLines.push(notificationLine);
  const notificationPrice = Number(notificationLine?.price || 0);

  const setup = buildSetup(calc);
  const baseTimeline = estimateTimeline(recommendedPackage.key, complexityScore, developmentRange.high);
  const timeline = timelineOption.key === 'standard' ? baseTimeline : `${baseTimeline} (${timelineOption.label} preference)`;
  const selectedPackageChanged = recommendedPackage.key !== selectedPackage.key;
  const boundaryMessages = [];
  if (packageIndex(selectedPackage.key) < packageIndex('business') && recommendedIndex >= packageIndex('business')) {
    boundaryMessages.push(UPGRADE_MESSAGES.starterToBusiness);
  }
  if (packageIndex(selectedPackage.key) < packageIndex('custom') && recommendedIndex >= packageIndex('custom')) {
    boundaryMessages.push(UPGRADE_MESSAGES.businessToCustom);
  }
  if (packageIndex(selectedPackage.key) < packageIndex('enterprise') && recommendedIndex >= packageIndex('enterprise')) {
    boundaryMessages.push(UPGRADE_MESSAGES.customToEnterprise);
  }
  const scopeGuidance = featureGuidanceFor(weightedLines, selectedPackage);

  return {
    selectedPackage,
    recommendedPackage,
    selectedPackageChanged,
    developmentLines,
    backendNeeded,
    score,
    complexityScore,
    boundaryMessages,
    scopeGuidance,
    developmentLow: developmentRange.low + notificationPrice,
    developmentHigh: developmentRange.high + notificationPrice,
    developmentHighSuffix: developmentRange.highSuffix,
    setup,
    launchLow: developmentRange.low + notificationPrice + setup.setupTotal,
    launchHigh: developmentRange.high + notificationPrice + setup.setupTotal,
    launchHighSuffix: developmentRange.highSuffix,
    timeline,
    reference: calc.reference,
    selected: {
      page,
      design,
      existingSite,
      contentFeatures,
      timelineOption,
      frontendFeatures,
      backendFeatures,
      userFeatures,
      moduleItems,
      paymentFeatures,
      integrationFeatures,
      notificationLevel: notificationOption,
      notificationTypes,
      standaloneServices: [],
      standaloneComplexity: null,
    },
  };
}

function estimateTimeline(packageKey, score, high) {
  if (packageKey === 'enterprise' || high >= 10000) return '10-16+ weeks after discovery';
  if (packageKey === 'custom') return score >= 42 ? '8-12 weeks' : '6-10 weeks';
  if (packageKey === 'business') return score >= 22 ? '5-7 weeks' : '4-6 weeks';
  return score >= 8 ? '3-4 weeks' : '2-3 weeks';
}

function buildBrief(calc, estimate) {
  const contact = calc.contact;
  const preferred = selectedLabel(CONTACT_METHODS, contact.preferred);
  const isStandalone = calc.requestType === 'standalone_service';
  const recurringLines = estimate.setup.recurring.length
    ? estimate.setup.recurring.map((item) => `- ${item.label}: ${money(item.price)} / ${item.cadence}`)
    : ['- None selected'];
  const setupLines = estimate.setup.lines.length
    ? estimate.setup.lines.map((item) => `- ${item.label}: ${money(item.price)}`)
    : ['- None selected'];
  const featureLines = estimate.developmentLines.map((item) => `- ${item.category}: ${item.label}: ${item.priceLabel || (item.price ? signedMoney(item.price) : 'Included')}`);
  const boundaryLines = estimate.boundaryMessages.length
    ? estimate.boundaryMessages.map((message) => `- ${message}`)
    : ['- No package upgrade required based on current selections.'];
  const scopeLines = estimate.scopeGuidance.length
    ? estimate.scopeGuidance.map((item) => `- ${item.label}: ${item.package}. ${item.reason}`)
    : ['- Current selections fit within the chosen package scope.'];
  const standaloneLines = estimate.selected.standaloneServices?.length
    ? estimate.selected.standaloneServices.map((item) => `- ${item.group}: ${item.label}. ${item.desc}`)
    : ['- None selected'];
  const notificationLines = [
    `Level: ${notificationLevelLabel(calc.notifications?.level)}`,
    `Types: ${estimate.selected.notificationTypes?.map((item) => item.label).join(', ') || 'None selected'}`,
  ];

  return [
    isStandalone ? 'The BrandHelper Standalone Digital Service Estimate' : 'The BrandHelper Website Pricing Estimate',
    `Reference: ${estimate.reference}`,
    '',
    'Contact',
    `Name: ${contact.name || 'Not provided'}`,
    `Company: ${contact.company || 'Not provided'}`,
    `Email: ${contact.email || 'Not provided'}`,
    `Phone: ${contact.phone || 'Not provided'}`,
    `Country: ${contact.country || 'Not provided'}`,
    `Preferred contact: ${preferred}`,
    '',
    'Project Summary',
    `Reference: ${estimate.reference}`,
    `Request type: ${intentLabel(calc.requestType)}`,
    !isStandalone ? `Business type: ${selectedBusinessLabel(calc)}` : '',
    `Selected package: ${estimate.selectedPackage.label}`,
    `Recommended package: ${estimate.recommendedPackage.label}${estimate.selectedPackageChanged ? ' (scope upgrade recommended)' : ''}`,
    `Estimated timeline: ${estimate.timeline}`,
    `Development estimate: ${estimateRangeMoney(estimate, 'developmentLow', 'developmentHigh')}`,
    `Setup costs: ${money(estimate.setup.setupTotal)}`,
    `Launch estimate: ${estimateRangeMoney(estimate)}`,
    `Recurring monthly costs: ${money(estimate.setup.monthlyTotal)} / month`,
    `Recurring annual costs: ${money(estimate.setup.annualTotal)} / year`,
    '',
    'Development Cost (One-Time)',
    ...featureLines,
    '',
    'Setup Costs (One-Time)',
    ...setupLines,
    '',
    'Recurring Costs',
    ...recurringLines,
    '',
    'Selected Features',
    ...(isStandalone ? [
      `Complexity: ${estimate.selected.standaloneComplexity?.label || 'Standard service'}`,
      `Current website/platform: ${calc.standalone.currentWebsite || 'Not provided'}`,
      `Details: ${calc.standalone.details || 'Not provided'}`,
      'Standalone services',
      ...standaloneLines,
    ] : [
      `Pages: ${estimate.selected.page?.label || 'Not selected'}`,
      `Design complexity: ${estimate.selected.design?.label || 'Not selected'}`,
      `Existing website: ${estimate.selected.existingSite?.label || 'Not selected'}`,
      `Content: ${estimate.selected.contentFeatures.map((item) => item.label).join(', ') || 'None selected'}`,
      `Timeline choice: ${estimate.selected.timelineOption?.label || 'Not selected'}`,
      `Visitor experience: ${estimate.selected.frontendFeatures.map((item) => item.label).join(', ') || 'None selected'}`,
      `Saved data or management tools: ${estimate.backendNeeded ? 'Yes' : 'No'}`,
      `Data and management features: ${estimate.selected.backendFeatures.map((item) => item.label).join(', ') || 'None selected'}`,
      `Accounts and access: ${estimate.selected.userFeatures.map((item) => item.label).join(', ') || 'None selected'}`,
      `Business modules: ${estimate.selected.moduleItems.map((item) => item.label).join(', ') || 'None selected'}`,
      `Payments and commerce: ${estimate.selected.paymentFeatures.map((item) => item.label).join(', ') || 'None selected'}`,
      `Email and notifications: ${notificationLines.join(' | ')}`,
      `Integrations: ${estimate.selected.integrationFeatures.map((item) => item.label).join(', ') || 'None selected'}`,
    ]),
    '',
    'Package Boundary Notes',
    ...boundaryLines,
    '',
    'Package Fit Notes',
    ...scopeLines,
    '',
    'Note',
    'This is a planning estimate. The final quote is confirmed after The BrandHelper reviews the exact requirements, content, timeline, and technical details.',
  ].join('\n');
}

function groupedLines(lines) {
  return lines.reduce((groups, item) => {
    const key = item.category || 'Other';
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {});
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function ToggleButton({ active, children, className = '', ...props }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`flex min-h-[76px] w-full min-w-0 items-start gap-3 rounded-lg border p-4 text-left transition focus:outline-none ${
        active
          ? 'border-red-600 bg-red-50 text-black shadow-sm'
          : 'border-gray-200 bg-white text-gray-800 hover:border-gray-400'
      } ${className}`}
      {...props}
    >
      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
        active ? 'border-red-600 bg-red-600 text-white' : 'border-gray-300 bg-white text-transparent'
      }`}>
        <FiCheck className="h-3.5 w-3.5" />
      </span>
      <span className="min-w-0 flex-1 break-words">{children}</span>
    </button>
  );
}

function OptionText({ label, desc, meta, tooltip }) {
  return (
    <span className="block">
      <span className="flex flex-wrap items-center gap-2">
        <span className="min-w-0 break-words font-bold leading-snug">{label}</span>
        {tooltip && (
          <span title={tooltip} aria-label={tooltip} className="inline-flex text-gray-400">
            <FiInfo className="h-4 w-4" />
          </span>
        )}
      </span>
      <span className="mt-1 block text-sm leading-relaxed text-gray-500">{desc}</span>
      {meta && (
        <span className="mt-2 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wide">
          <span className="break-words text-gray-400">{meta}</span>
        </span>
      )}
    </span>
  );
}

function complexityMeta(item) {
  const packageRule = FEATURE_PACKAGE_RULES[item.key] || {};
  const weight = Number(packageRule.weight ?? item.weight ?? 0);
  if (!weight) return undefined;
  const minPackage = packageRule.minPackage || item.minPackage;
  const packageNote = minPackage ? ` | Fits from ${packageByKey(minPackage).label}` : '';
  return `Complexity ${weight}${packageNote}`;
}

function MultiSelectGrid({ items, selected, onToggle, columns = 'sm:grid-cols-2 xl:grid-cols-3', getMeta }) {
  return (
    <div className={`grid gap-3 ${columns}`}>
      {items.map((item) => (
        <ToggleButton key={item.key} active={selected.includes(item.key)} onClick={() => onToggle(item.key)}>
          <OptionText label={item.label} desc={item.desc} meta={getMeta ? getMeta(item) : complexityMeta(item)} tooltip={item.desc} />
        </ToggleButton>
      ))}
    </div>
  );
}

function RadioGrid({ items, value, onChange, columns = 'sm:grid-cols-2 xl:grid-cols-3', getMeta }) {
  return (
    <div className={`grid gap-3 ${columns}`}>
      {items.map((item) => (
        <ToggleButton key={item.key} active={value === item.key} onClick={() => onChange(item.key)}>
          <OptionText
            label={item.label}
            desc={item.desc || item.summary}
            meta={getMeta ? getMeta(item) : complexityMeta(item)}
            tooltip={item.desc || item.summary}
          />
        </ToggleButton>
      ))}
    </div>
  );
}

function Progress({ step, total }) {
  const percent = ((step + 1) / total) * 100;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
        <span>Step {step + 1} of {total}</span>
        <span>{Math.round(percent)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-200" aria-hidden="true">
        <div className="h-full rounded-full bg-red-600 transition-all duration-300" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function SummaryAside({ calc, estimate }) {
  return (
    <aside className="min-w-0 space-y-4 lg:sticky lg:top-24">
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <img src={calculatorGuideImg} alt="Project estimate consultation" className="h-40 w-full object-cover xl:h-48" loading="lazy" decoding="async" />
        <div className="p-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-600">
            <FiSliders className="h-4 w-4" />
            Live Scope
          </div>
          <h2 className="mt-2 text-xl font-extrabold text-black">{estimate.recommendedPackage.label}</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            {estimate.selectedPackageChanged
              ? estimate.boundaryMessages[estimate.boundaryMessages.length - 1] || `Your selections now fit ${estimate.recommendedPackage.label} better than ${estimate.selectedPackage.label}.`
              : estimate.recommendedPackage.summary}
          </p>
          <div className="mt-5 grid gap-3 text-sm">
            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
              <span className="text-gray-500">Development</span>
              <span className="font-extrabold text-black">{estimateRangeMoney(estimate, 'developmentLow', 'developmentHigh')}</span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
              <span className="text-gray-500">Setup</span>
              <span className="font-extrabold text-black">{money(estimate.setup.setupTotal)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
              <span className="text-gray-500">Timeline</span>
              <span className="font-extrabold text-black">{estimate.timeline}</span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
              <span className="text-gray-500">Reference</span>
              <span className="font-extrabold text-black">{estimate.reference}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
        <div className="mb-1 flex items-center gap-2 font-extrabold">
          <FiInfo className="h-4 w-4" />
          Planning note
        </div>
        <p>
          {calc.requestType === 'standalone_service'
            ? 'Standalone service pricing is separate from full website package pricing, so small digital tasks stay easy to quote.'
            : 'Setup and recurring services stay separate from the development estimate, so the build cost stays clear.'}
        </p>
      </div>
      {calc.step > 0 && (
        <a
          href={CONSULTATION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-extrabold text-black transition hover:border-black"
        >
          <FiClock className="h-4 w-4" />
          Book a free call
        </a>
      )}
    </aside>
  );
}

function EstimateSection({ title, icon, children, tone = 'white' }) {
  const tones = {
    white: 'border-gray-200 bg-white',
    green: 'border-emerald-200 bg-emerald-50',
    blue: 'border-sky-200 bg-sky-50',
    amber: 'border-amber-200 bg-amber-50',
  };
  return (
    <section className={`rounded-lg border p-5 ${tones[tone] || tones.white}`}>
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white">
          {createElement(icon, { className: 'h-4 w-4' })}
        </span>
        <h3 className="text-lg font-extrabold text-black">{title}</h3>
      </div>
      {children}
    </section>
  );
}

export default function WebsiteCalc() {
  const [calc, setCalc] = useState(readSavedCalc);
  const [showAllModules, setShowAllModules] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionIssue, setSubmissionIssue] = useState(null);
  const [copied, setCopied] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const activeSteps = calc.requestType === 'standalone_service' ? STANDALONE_STEPS : WEBSITE_STEPS;
  const step = Math.min(Math.max(calc.step, 0), activeSteps.length - 1);
  const stepData = activeSteps[step];
  const estimate = useMemo(() => buildEstimate(calc), [calc]);
  const brief = useMemo(() => buildBrief(calc, estimate), [calc, estimate]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...calc, step }));
  }, [calc, step]);

  useEffect(() => {
    window.localStorage.setItem(ESTIMATE_SNAPSHOT_KEY, JSON.stringify({
      reference: estimate.reference,
      requestType: intentLabel(calc.requestType),
      selectedPackage: estimate.selectedPackage.label,
      recommendedPackage: estimate.recommendedPackage.label,
      estimatedBudget: estimateRangeMoney(estimate),
      developmentEstimate: estimateRangeMoney(estimate, 'developmentLow', 'developmentHigh'),
      setupCost: money(estimate.setup.setupTotal),
      recurringMonthly: `${money(estimate.setup.monthlyTotal)} / month`,
      recurringAnnual: `${money(estimate.setup.annualTotal)} / year`,
      timeline: estimate.timeline,
      features: [
        estimate.selected.page?.label,
        estimate.selected.design?.label,
        estimate.selected.existingSite?.label,
        ...estimate.selected.contentFeatures.map((item) => item.label),
        ...estimate.selected.frontendFeatures.map((item) => item.label),
        ...estimate.selected.backendFeatures.map((item) => item.label),
        ...estimate.selected.userFeatures.map((item) => item.label),
        ...estimate.selected.moduleItems.map((item) => item.label),
        ...estimate.selected.paymentFeatures.map((item) => item.label),
        estimate.selected.notificationLevel?.key !== 'none' ? estimate.selected.notificationLevel?.label : '',
        ...estimate.selected.notificationTypes.map((item) => item.label),
        ...estimate.selected.integrationFeatures.map((item) => item.label),
        ...estimate.selected.standaloneServices.map((item) => item.label),
      ].filter(Boolean),
      savedAt: new Date().toISOString(),
    }));
  }, [estimate, calc.requestType]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const updateCalc = (patch) => {
    setCalc((current) => ({ ...current, ...patch }));
  };

  const updateNested = (group, patch) => {
    setCalc((current) => ({ ...current, [group]: { ...current[group], ...patch } }));
  };

  const toggleIn = (field, key) => {
    setCalc((current) => {
      const values = current[field] || [];
      return {
        ...current,
        [field]: values.includes(key) ? values.filter((item) => item !== key) : [...values, key],
      };
    });
  };

  const toggleNestedIn = (group, field, key) => {
    setCalc((current) => {
      const values = current[group]?.[field] || [];
      return {
        ...current,
        [group]: {
          ...current[group],
          [field]: values.includes(key) ? values.filter((item) => item !== key) : [...values, key],
        },
      };
    });
  };

  const toggleContent = (key) => {
    setCalc((current) => {
      const values = current.frontend.content || [];
      if (key === 'ready') {
        return {
          ...current,
          frontend: { ...current.frontend, content: values.includes('ready') ? [] : ['ready'] },
        };
      }
      const withoutReady = values.filter((item) => item !== 'ready');
      return {
        ...current,
        frontend: {
          ...current.frontend,
          content: withoutReady.includes(key) ? withoutReady.filter((item) => item !== key) : [...withoutReady, key],
        },
      };
    });
  };

  const chooseRequestType = (requestType) => {
    setCalc((current) => ({
      ...current,
      requestType,
      step: 0,
      frontend: {
        ...current.frontend,
        existingSite: requestType === 'upgrade_existing' && !current.frontend.existingSite
          ? 'redesign'
          : current.frontend.existingSite,
      },
    }));
  };

  const goTo = (nextStep) => {
    setCalc((current) => {
      const steps = current.requestType === 'standalone_service' ? STANDALONE_STEPS : WEBSITE_STEPS;
      return { ...current, step: Math.min(Math.max(nextStep, 0), steps.length - 1) };
    });
  };

  const canContinue = (() => {
    if (stepData.key === 'intent') return Boolean(calc.requestType);
    if (stepData.key === 'standalone_services') return calc.standalone.services.length > 0;
    if (stepData.key === 'standalone_details') return Boolean(calc.standalone.complexity);
    if (stepData.key === 'business') return Boolean(calc.businessType && (calc.businessType !== 'other' || calc.otherBusinessType.trim()));
    if (stepData.key === 'package') return Boolean(calc.projectType);
    if (stepData.key === 'frontend') return Boolean(calc.frontend.pages);
    if (stepData.key === 'design') return Boolean(calc.frontend.design);
    if (stepData.key === 'content') return Boolean(calc.frontend.existingSite && calc.frontend.content.length);
    if (stepData.key === 'backend') return Boolean(calc.backend.required);
    if (stepData.key === 'timeline') return Boolean(calc.timeline);
    return true;
  })();

  const contactMissing = {
    name: !calc.contact.name.trim(),
    email: !calc.contact.email.trim() || !/.+@.+\..+/.test(calc.contact.email.trim()),
    phone: !calc.contact.phone.trim(),
    country: !calc.contact.country.trim(),
    preferred: !calc.contact.preferred,
  };
  const canSubmit = !Object.values(contactMissing).some(Boolean);

  const visibleModuleGroups = showAllModules
    ? MODULE_GROUPS
    : MODULE_GROUPS
        .filter((group) => group.key === 'general' || group.audience.includes(calc.businessType))
        .sort((a, b) => {
          const relevance = (group) => {
            if (group.key === calc.businessType) return 0;
            if (group.key === 'commerce' && ['restaurant', 'startup', 'retail'].includes(calc.businessType)) return 0;
            if (group.key === 'general') return 1;
            return 2;
          };
          return relevance(a) - relevance(b);
        });
  const isStandaloneFlow = calc.requestType === 'standalone_service';

  const handleReset = () => {
    const clean = freshCalc();
    setCalc(clean);
    setSubmitted(false);
    setSubmissionIssue(null);
    setCopied(false);
    setSubmitAttempted(false);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  const copyBrief = async () => {
    try {
      await navigator.clipboard.writeText(brief);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const downloadPdfProposal = () => {
    const proposalWindow = window.open('', '_blank', 'noopener,noreferrer,width=900,height=1100');
    if (!proposalWindow) return;
    proposalWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>${escapeHtml(estimate.reference)} Website Estimate</title>
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
          <h1>Website Pricing Estimate</h1>
          <p><strong>Reference:</strong> ${escapeHtml(estimate.reference)}</p>
          <pre>${escapeHtml(brief)}</pre>
          <p class="note">Use your browser print dialog to save this proposal as a PDF.</p>
          <script>window.onload = () => { window.print(); };</script>
        </body>
      </html>
    `);
    proposalWindow.document.close();
  };

  const submitEstimate = async () => {
    setSubmitAttempted(true);
    if (!canSubmit) return;
    setSubmitting(true);
    setSubmissionIssue(null);

    const payload = {
      form_type: 'Website Pricing Calculator v3',
      source_detail: isStandaloneFlow ? 'Website Pricing Calculator - Standalone Digital Service' : 'Website Pricing Calculator v3',
      reference_number: estimate.reference,
      client_name: calc.contact.name.trim(),
      business_name: calc.contact.company.trim(),
      email: calc.contact.email.trim(),
      phone: calc.contact.phone.trim(),
      industry: isStandaloneFlow ? 'Standalone digital service' : selectedBusinessLabel(calc),
      location: calc.contact.country.trim(),
      service: isStandaloneFlow ? 'Standalone digital service estimate' : `${estimate.recommendedPackage.label} website estimate`,
      tier: `Reference: ${estimate.reference}; Request: ${intentLabel(calc.requestType)}; Selected: ${estimate.selectedPackage.label}; Recommended: ${estimate.recommendedPackage.label}`,
      budget: `${estimateRangeMoney(estimate)} ${isStandaloneFlow ? 'service estimate' : 'launch estimate'}`,
      timeline: estimate.timeline,
      message: [
        `Reference: ${estimate.reference}`,
        `Request type: ${intentLabel(calc.requestType)}`,
        `Preferred contact method: ${selectedLabel(CONTACT_METHODS, calc.contact.preferred)}`,
        `Development estimate: ${estimateRangeMoney(estimate, 'developmentLow', 'developmentHigh')}`,
        `Setup estimate: ${money(estimate.setup.setupTotal)}`,
        `Recurring monthly: ${money(estimate.setup.monthlyTotal)}`,
        `Recurring annual: ${money(estimate.setup.annualTotal)}`,
      ].join('\n'),
      full_brief: brief,
      notes: `Reference ${estimate.reference} | Calculator version 3 | ${intentLabel(calc.requestType)} | score ${estimate.complexityScore} | data/management needed ${estimate.backendNeeded ? 'yes' : 'no'}`,
      metadata: {
        calculator_version: 3,
        request_type: calc.requestType,
        reference: estimate.reference,
        recommended_package: estimate.recommendedPackage.label,
        selected_services: estimate.selected.standaloneServices?.map((item) => item.label) || [],
        standalone_service_fees: estimate.developmentLines
          .filter((item) => item.priceLabel)
          .map((item) => ({
            service: item.label,
            category: item.category,
            fee_range: item.priceLabel,
          })),
        notification_level: estimate.selected.notificationLevel?.label || '',
        notification_types: estimate.selected.notificationTypes?.map((item) => item.label) || [],
        standalone_details: calc.standalone,
        draft_snapshot: calc,
      },
      submitted_at: new Date().toISOString(),
    };

    try {
      await submitLead(payload);
      setSubmitted(true);
    } catch (error) {
      setSubmissionIssue(error);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent([
    'Hi The BrandHelper,',
    '',
    isStandaloneFlow ? 'I just completed the standalone service estimator.' : 'I just completed the website estimator.',
    '',
    `Reference: ${estimate.reference}`,
    `Name: ${calc.contact.name || 'Not provided'}`,
    `Business: ${isStandaloneFlow ? (calc.contact.company || 'Not provided') : selectedBusinessLabel(calc)}`,
    `${isStandaloneFlow ? 'Service' : 'Project'}: ${estimate.recommendedPackage.label}`,
    `Estimated Budget: ${estimateRangeMoney(estimate)}`,
    '',
    "I'd like to discuss this further.",
  ].join('\n'))}`;

  return (
    <section className="bg-[#f6f7f9] px-4 py-8 text-gray-900 sm:px-6 md:py-10">
      <Helmet>
        <title>Website & Digital Service Pricing Calculator | The BrandHelper</title>
        <meta name="description" content="Estimate the cost of a business website, store, booking platform, dashboard, custom web platform, or standalone digital service with The BrandHelper pricing calculator." />
        <link rel="canonical" href="https://thebrandhelper.com/contact/calc" />
      </Helmet>

      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-red-600">The BrandHelper</p>
            <h1 className="mt-2 max-w-4xl text-3xl font-extrabold leading-tight text-black md:text-5xl">Website & Digital Service Pricing Calculator</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-600 md:text-base">
              Scope a website, portal, store, dashboard, custom platform, or standalone digital service in plain language.
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-extrabold text-black transition hover:border-black"
          >
            <FiRefreshCw className="h-4 w-4" />
            Start over
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0 rounded-lg border border-gray-200 bg-white p-5 shadow-sm md:p-7 xl:p-8">
            <Progress step={step} total={activeSteps.length} />

            <div className="mt-7">
              <p className="text-xs font-extrabold uppercase tracking-widest text-red-600">{stepData.eyebrow}</p>
              <h2 className="mt-2 text-2xl font-extrabold leading-tight text-black md:text-3xl">{stepData.title}</h2>
            </div>

            <div className="mt-6">
              {stepData.key === 'intent' && (
                <div className="space-y-4">
                  <div className="rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm leading-relaxed text-sky-900">
                    Choose the path that matches what you need today. Full website projects continue through the package estimate; standalone services use their own service pricing.
                  </div>
                  <RadioGrid
                    items={PROJECT_INTENT_OPTIONS}
                    value={calc.requestType}
                    onChange={chooseRequestType}
                    columns="md:grid-cols-3"
                    getMeta={(item) => item.priceRange}
                  />
                </div>
              )}

              {stepData.key === 'standalone_services' && (
                <div className="space-y-7">
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
                    Standalone digital services range from {money(STANDALONE_PRICING.min)} to {money(STANDALONE_PRICING.max)}+. Each service below has its own typical fee so the estimate is broken down clearly.
                  </div>
                  {STANDALONE_SERVICE_GROUPS.map((group) => (
                    <div key={group.key}>
                      <h3 className="mb-3 text-sm font-extrabold uppercase tracking-widest text-gray-400">{group.label}</h3>
                      <MultiSelectGrid
                        items={group.items}
                        selected={calc.standalone.services}
                        onToggle={(key) => toggleNestedIn('standalone', 'services', key)}
                        getMeta={(item) => `${standaloneServiceFee(item, STANDALONE_COMPLEXITY_OPTIONS[1]).label}${item.quoteIfAdvanced ? ' | Review if advanced' : ''}`}
                      />
                    </div>
                  ))}
                </div>
              )}

              {stepData.key === 'standalone_details' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-3 text-sm font-extrabold uppercase tracking-widest text-gray-400">How complex does this feel?</h3>
                    <RadioGrid
                      items={STANDALONE_COMPLEXITY_OPTIONS}
                      value={calc.standalone.complexity}
                      onChange={(complexity) => updateNested('standalone', { complexity })}
                      getMeta={(item) => item.quoteRecommended ? `Can exceed ${money(STANDALONE_PRICING.max)}` : 'Uses selected service fees'}
                    />
                  </div>
                  <Field label="Current website, domain, or platform">
                    <input
                      className="field-input"
                      value={calc.standalone.currentWebsite}
                      onChange={(event) => updateNested('standalone', { currentWebsite: event.target.value })}
                      placeholder="https://example.com, domain name, hosting provider, or email provider"
                    />
                  </Field>
                  <Field label="What should we help you with?">
                    <textarea
                      className="field-input min-h-32 resize-y"
                      value={calc.standalone.details}
                      onChange={(event) => updateNested('standalone', { details: event.target.value })}
                      placeholder="Describe the issue, setup, integration, migration, improvement, or service you need."
                    />
                  </Field>
                </div>
              )}

              {stepData.key === 'business' && (
                <div className="space-y-4">
                  <RadioGrid items={BUSINESS_TYPES} value={calc.businessType} onChange={(businessType) => updateCalc({ businessType })} />
                  {calc.businessType === 'other' && (
                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-gray-700">Business type</span>
                      <input
                        value={calc.otherBusinessType}
                        onChange={(event) => updateCalc({ otherBusinessType: event.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-red-600"
                        placeholder="Tell us what kind of organisation this is"
                      />
                    </label>
                  )}
                </div>
              )}

              {stepData.key === 'package' && (
                <div className="grid gap-3 xl:grid-cols-2">
                  {PACKAGES.map((item) => {
                    const pricingPackage = pricingPackageForRequest(item, calc.requestType);
                    return (
                      <ToggleButton key={item.key} active={calc.projectType === item.key} onClick={() => updateCalc({ projectType: item.key })}>
                        <span className="block">
                          <span className="flex flex-wrap items-center justify-between gap-3">
                            <span className="text-lg font-extrabold text-black">{item.label}</span>
                            <span className="rounded-lg bg-black px-3 py-1 text-xs font-extrabold text-white">
                              From {money(pricingPackage.start)}
                            </span>
                          </span>
                          <span className="mt-2 block text-sm leading-relaxed text-gray-600">{item.summary}</span>
                          <span className="mt-3 flex flex-wrap gap-2">
                            <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-600">
                              Typical {packageRangeLabel(pricingPackage)}
                            </span>
                            <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                              Target avg. {money(pricingPackage.target)}
                            </span>
                            {item.examples.map((example) => (
                              <span key={example} className="rounded-lg bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-700">
                                {example}
                              </span>
                            ))}
                          </span>
                        </span>
                      </ToggleButton>
                    );
                  })}
                </div>
              )}

              {stepData.key === 'frontend' && (
                <div className="space-y-7">
                  <div>
                    <h3 className="mb-3 text-sm font-extrabold uppercase tracking-widest text-gray-400">Pages</h3>
                    <RadioGrid items={PAGE_OPTIONS} value={calc.frontend.pages} onChange={(pages) => updateNested('frontend', { pages })} />
                  </div>
                  <div>
                    <h3 className="mb-3 text-sm font-extrabold uppercase tracking-widest text-gray-400">Design and visitor features</h3>
                    <MultiSelectGrid
                      items={FRONTEND_FEATURES}
                      selected={calc.frontend.features}
                      onToggle={(key) => toggleNestedIn('frontend', 'features', key)}
                    />
                  </div>
                </div>
              )}

              {stepData.key === 'design' && (
                <div className="space-y-4">
                  <div className="rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm leading-relaxed text-sky-900">
                    Design complexity has a large effect on planning and build effort. A template-style site can stay lean; bespoke UI/UX usually moves into platform-level planning.
                  </div>
                  <RadioGrid
                    items={DESIGN_COMPLEXITY_OPTIONS}
                    value={calc.frontend.design}
                    onChange={(design) => updateNested('frontend', { design })}
                  />
                </div>
              )}

              {stepData.key === 'content' && (
                <div className="space-y-7">
                  <div>
                    <h3 className="mb-3 text-sm font-extrabold uppercase tracking-widest text-gray-400">Do you already have a website?</h3>
                    <RadioGrid
                      items={EXISTING_SITE_OPTIONS}
                      value={calc.frontend.existingSite}
                      onChange={(existingSite) => updateNested('frontend', { existingSite })}
                    />
                  </div>
                  <div>
                    <h3 className="mb-3 text-sm font-extrabold uppercase tracking-widest text-gray-400">Who provides the content?</h3>
                    <MultiSelectGrid
                      items={CONTENT_OPTIONS}
                      selected={calc.frontend.content}
                      onToggle={toggleContent}
                    />
                  </div>
                </div>
              )}

              {stepData.key === 'backend' && (
                <div className="space-y-7">
                  <RadioGrid
                    items={[
                      { key: 'no', label: 'No', desc: 'I only need public pages and simple enquiry options.' },
                      { key: 'yes', label: 'Yes', desc: 'I need content editing, saved records, admin tools, accounts, payments, or management workflows.' },
                    ]}
                    value={calc.backend.required}
                    onChange={(required) => updateNested('backend', { required })}
                  />
                  {calc.backend.required === 'yes' && (
                    <div>
                      <h3 className="mb-3 text-sm font-extrabold uppercase tracking-widest text-gray-400">Data and management features</h3>
                      <MultiSelectGrid
                        items={BACKEND_FEATURES}
                        selected={calc.backend.features}
                        onToggle={(key) => toggleNestedIn('backend', 'features', key)}
                      />
                    </div>
                  )}
                </div>
              )}

              {stepData.key === 'users' && (
                <div className="space-y-4">
                  <div className="rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm leading-relaxed text-sky-900">
                    Choose only the account features you truly need. More account types usually means more planning, testing, and security work.
                  </div>
                  <MultiSelectGrid items={USER_FEATURES} selected={calc.users} onToggle={(key) => toggleIn('users', key)} />
                </div>
              )}

              {stepData.key === 'modules' && (
                <div className="space-y-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm leading-relaxed text-gray-600">
                      Showing modules that fit {selectedBusinessLabel(calc).toLowerCase()}. You can browse everything too.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowAllModules((value) => !value)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-extrabold transition hover:border-black"
                    >
                      <FiChevronDown className={`h-4 w-4 transition ${showAllModules ? 'rotate-180' : ''}`} />
                      {showAllModules ? 'Show recommended' : 'Browse all modules'}
                    </button>
                  </div>

                  {visibleModuleGroups.map((group) => (
                    <div key={group.key}>
                      <h3 className="mb-3 text-sm font-extrabold uppercase tracking-widest text-gray-400">{group.label}</h3>
                      <MultiSelectGrid items={group.items} selected={calc.modules} onToggle={(key) => toggleIn('modules', key)} />
                    </div>
                  ))}
                </div>
              )}

              {stepData.key === 'payments' && (
                <div className="space-y-4">
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm leading-relaxed text-emerald-900">
                    Payment features usually move the project into business operations because transactions, records, and security need to be handled properly.
                  </div>
                  <MultiSelectGrid items={PAYMENT_FEATURES} selected={calc.payments} onToggle={(key) => toggleIn('payments', key)} />
                </div>
              )}

              {stepData.key === 'notifications' && (
                <div className="space-y-7">
                  <div className="rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm leading-relaxed text-sky-900">
                    This is for the client website sending emails to its own visitors, customers, members, or admins. It is separate from The BrandHelper calculator emails.
                  </div>
                  <RadioGrid
                    items={NOTIFICATION_OPTIONS}
                    value={calc.notifications.level}
                    onChange={(level) => updateNested('notifications', { level, types: level === 'none' ? [] : calc.notifications.types })}
                    getMeta={(item) => item.key === 'none'
                      ? 'No add-on'
                      : `Starter +${money(NOTIFICATION_PRICING.starter)} | Business +${money(NOTIFICATION_PRICING.business)} | Custom +${money(NOTIFICATION_PRICING.custom)}${item.key === 'advanced' ? ' | Advanced workflows quoted separately' : ''}`}
                  />
                  {calc.notifications.level !== 'none' && (
                    <div>
                      <h3 className="mb-3 text-sm font-extrabold uppercase tracking-widest text-gray-400">Which notifications would you like your website to send?</h3>
                      <MultiSelectGrid
                        items={NOTIFICATION_TYPES}
                        selected={calc.notifications.types}
                        onToggle={(key) => toggleNestedIn('notifications', 'types', key)}
                      />
                    </div>
                  )}
                </div>
              )}

              {stepData.key === 'integrations' && (
                <MultiSelectGrid items={INTEGRATION_FEATURES} selected={calc.integrations} onToggle={(key) => toggleIn('integrations', key)} />
              )}

              {stepData.key === 'timeline' && (
                <div className="space-y-4">
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
                    Shorter timelines can increase the estimate because they require priority scheduling, faster review cycles, and less room for phased delivery.
                  </div>
                  <RadioGrid
                    items={TIMELINE_OPTIONS}
                    value={calc.timeline}
                    onChange={(timeline) => updateCalc({ timeline })}
                    getMeta={(item) => item.multiplier === 1 ? item.timeline : `${item.timeline} | x${item.multiplier}`}
                  />
                </div>
              )}

              {stepData.key === 'infrastructure' && (
                <div className="space-y-7">
                  {Object.entries(INFRA_OPTIONS).map(([key, options]) => (
                    <div key={key}>
                      <h3 className="mb-3 text-sm font-extrabold uppercase tracking-widest text-gray-400">
                        {key === 'ssl' ? 'SSL' : key.charAt(0).toUpperCase() + key.slice(1)}
                      </h3>
                      <RadioGrid
                        items={options}
                        value={calc.infrastructure[key]}
                        onChange={(value) => updateNested('infrastructure', { [key]: value })}
                        getMeta={(item) => [
                          item.setup > 0 ? `Setup ${money(item.setup)}` : '',
                          item.recurring > 0 ? `${money(item.recurring)} / ${item.cadence}` : '',
                        ].filter(Boolean).join(' + ')}
                      />
                    </div>
                  ))}
                  <div>
                    <h3 className="mb-3 text-sm font-extrabold uppercase tracking-widest text-gray-400">Additional services</h3>
                    <MultiSelectGrid
                      items={INFRA_SERVICES.map((item) => ({
                        ...item,
                        desc: `${item.desc}${item.recurring ? ` Typical recurring: ${money(item.recurring)} / ${item.cadence}.` : ''}`,
                      }))}
                      selected={calc.infrastructure.services}
                      onToggle={(key) => toggleNestedIn('infrastructure', 'services', key)}
                      getMeta={(item) => [
                        item.setup > 0 ? `Setup ${money(item.setup)}` : '',
                        item.recurring > 0 ? `${money(item.recurring)} / ${item.cadence}` : '',
                      ].filter(Boolean).join(' + ')}
                    />
                  </div>
                </div>
              )}

              {stepData.key === 'review' && (
                <div className="space-y-5">
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
                    This is an estimated quotation based on the information provided. Final pricing may vary after a detailed project consultation.
                  </div>
                  {estimate.boundaryMessages.length > 0 && (
                    <div className="space-y-2">
                      {estimate.boundaryMessages.map((message) => (
                        <div key={message} className="rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm font-bold leading-relaxed text-sky-900">
                          {message}
                        </div>
                      ))}
                    </div>
                  )}
                  <EstimateSection title="Project Summary" icon={FiZap} tone="amber">
                    <div className="grid gap-3 text-sm sm:grid-cols-2">
                      {[
                        ['Reference', estimate.reference],
                        ['Request type', intentLabel(calc.requestType)],
                        ['Business type', selectedBusinessLabel(calc)],
                        ['Selected package', estimate.selectedPackage.label],
                        ['Recommended package', estimate.recommendedPackage.label],
                        ['Pages', estimate.selected.page?.label || 'Not selected'],
                        ['Design', estimate.selected.design?.label || 'Not selected'],
                        ['Existing website', estimate.selected.existingSite?.label || 'Not selected'],
                        ['Timeline', estimate.timeline],
                        ['Development estimate', estimateRangeMoney(estimate, 'developmentLow', 'developmentHigh')],
                        ['Setup costs', money(estimate.setup.setupTotal)],
                        ['Recurring monthly', `${money(estimate.setup.monthlyTotal)} / month`],
                        ['Recurring annual', `${money(estimate.setup.annualTotal)} / year`],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-lg bg-white p-3">
                          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</p>
                          <p className="mt-1 font-extrabold text-black">{value}</p>
                        </div>
                      ))}
                    </div>
                  </EstimateSection>
                  <EstimateSection title="Selected Features" icon={FiSliders}>
                    <div className="grid gap-3 text-sm">
                      {[
                        ['Content', estimate.selected.contentFeatures.map((item) => item.label).join(', ') || 'None selected'],
                        ['Visitor experience', estimate.selected.frontendFeatures.map((item) => item.label).join(', ') || 'None selected'],
                        ['Data and management', estimate.selected.backendFeatures.map((item) => item.label).join(', ') || 'None selected'],
                        ['Accounts and access', estimate.selected.userFeatures.map((item) => item.label).join(', ') || 'None selected'],
                        ['Business modules', estimate.selected.moduleItems.map((item) => item.label).join(', ') || 'None selected'],
                        ['Payments and commerce', estimate.selected.paymentFeatures.map((item) => item.label).join(', ') || 'None selected'],
                        ['Email and notifications', estimate.selected.notificationLevel?.key === 'none' ? 'No' : `${estimate.selected.notificationLevel?.label || 'Not selected'}${estimate.selected.notificationTypes.length ? `: ${estimate.selected.notificationTypes.map((item) => item.label).join(', ')}` : ''}`],
                        ['Integrations', estimate.selected.integrationFeatures.map((item) => item.label).join(', ') || 'None selected'],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</p>
                          <p className="mt-1 font-semibold text-black">{value}</p>
                        </div>
                      ))}
                    </div>
                  </EstimateSection>
                  {estimate.scopeGuidance.length > 0 && (
                    <EstimateSection title="Package Fit Notes" icon={FiInfo} tone="blue">
                      <div className="space-y-3">
                        {estimate.scopeGuidance.map((item) => (
                          <div key={`${item.label}-${item.package}`} className="rounded-lg bg-white p-3 text-sm">
                            <p className="font-extrabold text-black">{item.label}: {item.package}</p>
                            <p className="mt-1 leading-relaxed text-gray-600">{item.reason}</p>
                          </div>
                        ))}
                      </div>
                    </EstimateSection>
                  )}
                </div>
              )}

              {stepData.key === 'estimate' && (
                <div className="space-y-5">
                  <div className="rounded-lg bg-black p-5 text-white md:p-7">
                    <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400">{isStandaloneFlow ? 'Estimated service range' : 'Estimated launch investment'}</p>
                    <p className="mt-2 text-sm font-bold text-gray-300">Reference: {estimate.reference}</p>
                    <div className="mt-2 text-3xl font-extrabold md:text-5xl">{estimateRangeMoney(estimate)}</div>
                    <p className="mt-3 text-sm leading-relaxed text-gray-300">
                      {isStandaloneFlow
                        ? `Standalone digital services range from ${money(STANDALONE_PRICING.min)} to ${money(STANDALONE_PRICING.max)}+ depending on service type and complexity. Final pricing will be confirmed after reviewing your requirements.`
                        : 'Includes development and selected one-time setup costs. Recurring services are shown separately.'}
                    </p>
                    {estimate.boundaryMessages.map((message) => (
                      <div key={message} className="mt-4 rounded-lg border border-amber-400 bg-amber-400/10 p-3 text-sm font-bold text-amber-100">
                        {message}
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-4">
                    <EstimateSection title={isStandaloneFlow ? 'Standalone Service Estimate' : 'Development Cost (One-Time)'} icon={FiDollarSign}>
                      <div className="space-y-5">
                        {Object.entries(groupedLines(estimate.developmentLines)).map(([group, lines]) => (
                          <div key={group}>
                            <h4 className="mb-2 text-xs font-extrabold uppercase tracking-widest text-gray-400">{group}</h4>
                            <div className="divide-y divide-gray-100 rounded-lg border border-gray-100">
                              {lines.map((item) => (
                                <div key={`${group}-${item.label}`} className="flex items-start justify-between gap-4 p-3 text-sm">
                                  <div>
                                    <p className="font-bold text-black">{item.label}</p>
                                    <p className="mt-1 text-xs leading-relaxed text-gray-500">{item.desc}</p>
                                  </div>
                                  <span className="shrink-0 font-extrabold text-black">{item.priceLabel || (item.price ? signedMoney(item.price) : 'Included')}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                        <div className="flex items-center justify-between rounded-lg bg-gray-100 p-4">
                          <span className="font-extrabold text-black">{isStandaloneFlow ? 'Service estimate' : 'Development estimate'}</span>
                          <span className="font-extrabold text-red-600">{estimateRangeMoney(estimate, 'developmentLow', 'developmentHigh')}</span>
                        </div>
                      </div>
                    </EstimateSection>

                    {!isStandaloneFlow && <EstimateSection title="Setup Costs (One-Time)" icon={FiShield} tone="blue">
                      {estimate.setup.lines.length ? (
                        <div className="divide-y divide-sky-100 rounded-lg border border-sky-100 bg-white/70">
                          {estimate.setup.lines.map((item) => (
                            <div key={`${item.group}-${item.label}`} className="flex items-start justify-between gap-4 p-3 text-sm">
                              <div>
                                <p className="font-bold text-black">{item.label}</p>
                                <p className="mt-1 text-xs leading-relaxed text-gray-500">{item.desc}</p>
                              </div>
                              <span className="shrink-0 font-extrabold text-black">{money(item.price)}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">No one-time setup services selected.</p>
                      )}
                      <div className="mt-4 flex items-center justify-between rounded-lg bg-white p-4">
                        <span className="font-extrabold text-black">Setup total</span>
                        <span className="font-extrabold text-sky-700">{money(estimate.setup.setupTotal)}</span>
                      </div>
                    </EstimateSection>}

                    {!isStandaloneFlow && <EstimateSection title="Recurring Costs" icon={FiClock} tone="green">
                      {estimate.setup.recurring.length ? (
                        <div className="divide-y divide-emerald-100 rounded-lg border border-emerald-100 bg-white/70">
                          {estimate.setup.recurring.map((item) => (
                            <div key={`${item.group}-${item.label}`} className="flex items-start justify-between gap-4 p-3 text-sm">
                              <div>
                                <p className="font-bold text-black">{item.label}</p>
                                <p className="mt-1 text-xs leading-relaxed text-gray-500">{item.desc}</p>
                              </div>
                              <span className="shrink-0 font-extrabold text-black">{money(item.price)} / {item.cadence}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">No recurring services selected.</p>
                      )}
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-lg bg-white p-4">
                          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Monthly</p>
                          <p className="mt-1 text-xl font-extrabold text-emerald-700">{money(estimate.setup.monthlyTotal)} / month</p>
                        </div>
                        <div className="rounded-lg bg-white p-4">
                          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Annual</p>
                          <p className="mt-1 text-xl font-extrabold text-emerald-700">{money(estimate.setup.annualTotal)} / year</p>
                        </div>
                      </div>
                    </EstimateSection>}

                    <EstimateSection title="Project Summary" icon={FiZap} tone="amber">
                      <div className="grid gap-3 text-sm sm:grid-cols-2">
                        {(isStandaloneFlow ? [
                          ['Reference', estimate.reference],
                          ['Request type', intentLabel(calc.requestType)],
                          ['Service type', estimate.recommendedPackage.label],
                          ['Complexity', estimate.selected.standaloneComplexity?.label || 'Standard service'],
                          ['Selected services', estimate.selected.standaloneServices.map((item) => item.label).join(', ') || 'Not selected'],
                          ['Timeline', estimate.timeline],
                          ['Current website', calc.standalone.currentWebsite || 'Not provided'],
                        ] : [
                          ['Reference', estimate.reference],
                          ['Request type', intentLabel(calc.requestType)],
                          ['Business type', selectedBusinessLabel(calc)],
                          ['Selected package', estimate.selectedPackage.label],
                          ['Recommended package', estimate.recommendedPackage.label],
                          ['Timeline', estimate.timeline],
                          ['Pages', estimate.selected.page?.label || 'Not selected'],
                          ['Design', estimate.selected.design?.label || 'Not selected'],
                          ['Content', estimate.selected.contentFeatures.map((item) => item.label).join(', ') || 'None selected'],
                          ['Existing website', estimate.selected.existingSite?.label || 'Not selected'],
                          ['Data/management', estimate.backendNeeded ? 'Yes' : 'No'],
                          ['Email and notifications', estimate.selected.notificationLevel?.key === 'none' ? 'No' : estimate.selected.notificationLevel?.label || 'Not selected'],
                        ]).map(([label, value]) => (
                          <div key={label} className="rounded-lg bg-white p-3">
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</p>
                            <p className="mt-1 font-extrabold text-black">{value}</p>
                          </div>
                        ))}
                      </div>
                    </EstimateSection>
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-white p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-white">
                        <FiUser className="h-4 w-4" />
                      </span>
                      <div>
                        <h3 className="font-extrabold text-black">Send this estimate to The BrandHelper</h3>
                        <p className="text-sm text-gray-500">We will receive the full project brief and pricing breakdown.</p>
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <Field label="Name" required error={submitAttempted && contactMissing.name ? 'Name is required.' : ''}>
                        <input className="field-input" value={calc.contact.name} onChange={(event) => updateNested('contact', { name: event.target.value })} placeholder="Your name" />
                      </Field>
                      <Field label="Company name">
                        <input className="field-input" value={calc.contact.company} onChange={(event) => updateNested('contact', { company: event.target.value })} placeholder="Optional" />
                      </Field>
                      <Field label="Email" required error={submitAttempted && contactMissing.email ? 'Enter a valid email.' : ''}>
                        <input className="field-input" value={calc.contact.email} onChange={(event) => updateNested('contact', { email: event.target.value })} placeholder="you@example.com" />
                      </Field>
                      <Field label="Phone number" required error={submitAttempted && contactMissing.phone ? 'Phone number is required.' : ''}>
                        <input className="field-input" value={calc.contact.phone} onChange={(event) => updateNested('contact', { phone: event.target.value })} placeholder="+233..." />
                      </Field>
                      <Field label="Country" required error={submitAttempted && contactMissing.country ? 'Country is required.' : ''}>
                        <input className="field-input" value={calc.contact.country} onChange={(event) => updateNested('contact', { country: event.target.value })} placeholder="Country" />
                      </Field>
                      <Field label="Preferred contact method" required error={submitAttempted && contactMissing.preferred ? 'Choose one.' : ''}>
                        <select className="field-input" value={calc.contact.preferred} onChange={(event) => updateNested('contact', { preferred: event.target.value })}>
                          {CONTACT_METHODS.map((method) => (
                            <option key={method.key} value={method.key}>{method.label}</option>
                          ))}
                        </select>
                      </Field>
                    </div>

                    {submitted ? (
                      <div className="mt-5 space-y-3">
                        <div className={`rounded-lg border p-4 text-sm leading-relaxed ${submissionIssue ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-emerald-200 bg-emerald-50 text-emerald-900'}`}>
                          <p className="font-extrabold">
                            {submissionIssue ? 'Your estimate is ready, but the API could not confirm email delivery.' : 'Estimate received. We will follow up soon.'}
                          </p>
                          <p className="mt-1">
                            {submissionIssue
                              ? 'Use WhatsApp below so the brief still reaches The BrandHelper immediately.'
                              : 'You can continue on WhatsApp with the same summary if you want the fastest conversation.'}
                          </p>
                        </div>
                        {submissionIssue && (
                          <ApiIssueReport error={submissionIssue} context="Website pricing calculator" payloadText={brief} className="rounded-lg p-4" />
                        )}
                        <div className="grid gap-3 sm:grid-cols-2">
                          <button
                            type="button"
                            onClick={downloadPdfProposal}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-sm font-extrabold text-black transition hover:border-black"
                          >
                            <FiDownload className="h-4 w-4" />
                            Download PDF
                          </button>
                          <a
                            href={`mailto:${encodeURIComponent(calc.contact.email)}?subject=${encodeURIComponent(`${isStandaloneFlow ? 'Your standalone service estimate' : 'Your website estimate'} ${estimate.reference}`)}&body=${encodeURIComponent(brief)}`}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-sm font-extrabold text-black transition hover:border-black"
                          >
                            <FiMail className="h-4 w-4" />
                            Email Me A Copy
                          </a>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <a
                            href={whatsappHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-emerald-700"
                          >
                            <FiMessageCircle className="h-4 w-4" />
                            Continue on WhatsApp
                          </a>
                          <a
                            href={CONSULTATION_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-3 text-sm font-extrabold text-white transition hover:bg-gray-900"
                          >
                            <FiClock className="h-4 w-4" />
                            Book a free call
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
                        <button
                          type="button"
                          onClick={submitEstimate}
                          disabled={submitting}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {submitting ? (
                            <>
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                              Sending
                            </>
                          ) : (
                            <>
                              <FiSend className="h-4 w-4" />
                              Submit Estimate
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={copyBrief}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-3 text-sm font-extrabold text-black transition hover:border-black"
                        >
                          <FiCopy className="h-4 w-4" />
                          {copied ? 'Copied' : 'Copy summary'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {stepData.key !== 'estimate' && (
              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => goTo(step - 1)}
                  disabled={step === 0}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-3 text-sm font-extrabold text-black transition hover:border-black disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FiArrowLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => canContinue && goTo(step + 1)}
                  disabled={!canContinue}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  Continue
                  <FiArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {stepData.key === 'estimate' && (
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => goTo(step - 1)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-3 text-sm font-extrabold text-black transition hover:border-black"
                >
                  <FiArrowLeft className="h-4 w-4" />
                  Back to review
                </button>
                <a
                  href={`mailto:davida@thebrandhelper.com?subject=${encodeURIComponent(isStandaloneFlow ? 'Standalone digital service estimate' : 'Website pricing estimate')}&body=${encodeURIComponent(brief)}`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-3 text-sm font-extrabold text-black transition hover:border-black"
                >
                  <FiMail className="h-4 w-4" />
                  Email manually
                </a>
              </div>
            )}
          </div>

          <SummaryAside calc={{ ...calc, step }} estimate={estimate} />
        </div>
      </div>
    </section>
  );
}

function Field({ label, required, error, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-gray-700">
        {label} {required && <span className="text-red-600">*</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs font-bold text-red-600">{error}</span>}
    </label>
  );
}
