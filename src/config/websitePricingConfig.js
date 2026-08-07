export const PACKAGES = [
  {
    key: 'starter',
    label: 'Starter Website',
    start: 300,
    min: 300,
    max: 1200,
    target: 750,
    summary: 'A professional website with light business functionality such as forms, simple content editing, blog/gallery management, newsletters, or a small admin area.',
    examples: ['Landing pages', 'Small business sites', 'Basic CMS', 'Blog or gallery sites'],
    includedFeatures: ['Responsive build', 'Core pages', 'Contact form', 'Light CMS or blog support', 'Basic enquiry handling'],
    optionalFeatures: ['Simple admin area', 'Gallery management', 'Newsletter signup', 'Basic email notifications', 'Basic analytics'],
    premiumFeatures: ['Premium UI polish', 'Content writing help', 'Image sourcing', 'Small content migration'],
    upgradeTriggers: ['Customer accounts', 'Payments', 'Inventory', 'Booking management', 'Order management', 'Multiple user roles'],
    pageLimit: 'Best for landing pages and small websites up to around 10 pages.',
    scalabilityLimit: 'Designed for individuals, startups, and small businesses with light daily management needs.',
    recommendedTimeline: '2-4 weeks',
  },
  {
    key: 'business',
    label: 'Business Website',
    start: 650,
    min: 650,
    max: 3000,
    target: 1800,
    summary: 'A website that actively supports day-to-day operations with enquiries, booking requests, product management, dashboards, payments, reports, uploads, or integrations.',
    examples: ['Booking sites', 'Admin dashboards', 'Payment sites', 'Operational websites'],
    includedFeatures: ['Everything in Starter', 'Operational forms', 'Product or service management', 'Admin dashboard', 'Authentication', 'Reports'],
    optionalFeatures: ['Payment integration', 'Booking requests', 'File uploads', 'Email automation', 'API integrations', 'Customer enquiries'],
    premiumFeatures: ['Premium UI', 'Larger CMS', 'Workflow reporting', 'Multi-form automation'],
    upgradeTriggers: ['Multiple dashboards', 'Advanced permissions', 'CRM', 'ERP-style modules', 'LMS', 'Marketplace workflows'],
    pageLimit: 'Best for larger business websites and operational sites with structured management areas.',
    scalabilityLimit: 'Designed for day-to-day business operations that remain relatively straightforward.',
    recommendedTimeline: '4-8 weeks',
  },
  {
    key: 'custom',
    label: 'Custom Platform',
    start: 2500,
    min: 2500,
    max: 10000,
    target: 5500,
    summary: 'A complete business system designed around workflows, multiple user types, permissions, large records, portals, CRM, LMS, inventory, automation, or advanced reporting.',
    examples: ['Church systems', 'School portals', 'Marketplaces', 'CRM platforms'],
    includedFeatures: ['Everything in Business', 'Multiple dashboards', 'Multiple user types', 'Permissions', 'Advanced workflows', 'Large data structures'],
    optionalFeatures: ['CRM modules', 'LMS modules', 'Inventory systems', 'Cloud storage', 'Advanced reports', 'Mobile API'],
    premiumFeatures: ['Automation planning', 'Advanced integrations', 'Custom portals', 'Operational process design'],
    upgradeTriggers: ['Multi-tenant architecture', 'Large organisational rollout', 'High availability', 'Exceptional scale', 'Enterprise security'],
    pageLimit: 'Built around systems and workflows rather than simple page count.',
    scalabilityLimit: 'Designed for complete platforms that run important parts of the business.',
    recommendedTimeline: '6-12 weeks',
  },
  {
    key: 'enterprise',
    label: 'Enterprise Solution',
    start: 4000,
    min: 4000,
    max: null,
    target: 4000,
    summary: 'A large-scale platform requiring advanced architecture, performance, scalability, resilience, security, integrations, and long-term maintainability.',
    examples: ['National platforms', 'Enterprise ERP', 'AI SaaS', 'Healthcare networks'],
    includedFeatures: ['Everything in Custom', 'Architecture planning', 'Scalability planning', 'Performance planning', 'Security planning', 'Long-term maintainability'],
    optionalFeatures: ['High availability', 'Multi-tenant systems', 'Enterprise integrations', 'Advanced security', 'Dedicated infrastructure'],
    premiumFeatures: ['SLA planning', 'Compliance support', 'Resilience strategy', 'Enterprise rollout support'],
    upgradeTriggers: ['No fixed cap; final scope is quoted after discovery.'],
    pageLimit: 'No fixed page limit; planned around architecture and organisation scale.',
    scalabilityLimit: 'Designed for large organisations, high traffic, many teams, many locations, or long-term product growth.',
    recommendedTimeline: '10-16+ weeks after discovery',
  },
];

export const PACKAGE_ORDER = PACKAGES.map((item) => item.key);

export const PRICING_THRESHOLDS = {
  starter: { minScore: 0, targetScore: 14, maxScore: 32, lowVariance: 0.9, highVariance: 1.1 },
  business: { minScore: 18, targetScore: 48, maxScore: 78, lowVariance: 0.9, highVariance: 1.13 },
  custom: { minScore: 58, targetScore: 100, maxScore: 155, lowVariance: 0.88, highVariance: 1.16 },
  enterprise: { minScore: 120, targetScore: 150, pointValue: 105, lowVariance: 0.86, highVariance: 1.22 },
};

export const UPGRADE_MESSAGES = {
  starterToBusiness: "Your selections have moved beyond a light website into day-to-day business operations. This is now better suited to our Business Website package, which allows for more management, automation, integrations, and operational workflows.",
  businessToCustom: "Your selections now describe multiple connected workflows or a more specialised business system. This is better suited to our Custom Platform package, where the structure can be planned around the full process instead of only website pages.",
  customToEnterprise: 'Your project now shows enterprise-level scale, architecture, integrations, performance, security, or long-term growth needs. Enterprise projects are quoted individually so the platform can be designed for resilience and maintainability.',
};

export const PROJECT_INTENT_OPTIONS = [
  {
    key: 'new_website',
    label: 'Build a New Website',
    desc: 'Start from a fresh website, store, booking site, dashboard, or platform idea.',
    priceRange: '$300 - $10,000+',
  },
  {
    key: 'upgrade_existing',
    label: 'Upgrade an Existing Website',
    desc: 'Improve, redesign, migrate, repair, or extend a website you already have.',
    priceRange: '$100 - $1,500+',
  },
  {
    key: 'standalone_service',
    label: 'Standalone Digital Service',
    desc: 'Get help with domains, hosting, email, integrations, fixes, branding, maintenance, or technical setup without a full website build.',
    priceRange: '$50 - $1,000+',
  },
];

export const UPGRADE_EXISTING_PRICING = {
  starter: { start: 100, min: 100, max: 700, target: 350 },
  business: { start: 650, min: 650, max: 1500, target: 1000, plusAtMax: true },
};

export const STANDALONE_PRICING = {
  min: 50,
  max: 1000,
  target: 250,
};

export const NOTIFICATION_OPTIONS = [
  {
    key: 'none',
    label: 'No',
    desc: 'The website does not need to send automatic emails or alerts.',
    weight: 0,
  },
  {
    key: 'basic',
    label: 'Yes, basic email notifications',
    desc: 'Good for contact form confirmations, admin alerts, welcome emails, or simple booking/order messages.',
    weight: 1,
  },
  {
    key: 'advanced',
    label: 'Yes, advanced automated notifications',
    desc: 'Useful when emails depend on timing, status changes, reminders, multiple user actions, or a longer workflow.',
    weight: 3,
    quotedSeparately: true,
  },
  {
    key: 'advise',
    label: 'Not sure, advise me',
    desc: 'We will recommend the practical notifications after reviewing the project.',
    weight: 1,
  },
];

export const NOTIFICATION_TYPES = [
  { key: 'contact_form', label: 'Contact Form Emails', desc: 'Send a confirmation to the visitor and an alert to the business.' },
  { key: 'welcome', label: 'Welcome Emails', desc: 'Greet new subscribers, members, customers, or account users.' },
  { key: 'booking_confirmations', label: 'Booking Confirmations', desc: 'Confirm a booking or request after someone submits it.' },
  { key: 'appointment_reminders', label: 'Appointment Reminders', desc: 'Remind clients before an appointment, consultation, or scheduled service.' },
  { key: 'order_confirmations', label: 'Order Confirmations', desc: 'Send order details after someone places an order.' },
  { key: 'payment_receipts', label: 'Payment Receipts', desc: 'Send proof of payment or transaction details after checkout.' },
  { key: 'password_reset', label: 'Password Reset Emails', desc: 'Let account users securely recover access.' },
  { key: 'email_verification', label: 'Email Verification', desc: 'Ask users to confirm their email address before using an account.' },
  { key: 'newsletter', label: 'Newsletter Emails', desc: 'Send simple updates, announcements, or campaigns to subscribers.' },
  { key: 'admin_notifications', label: 'Admin Notifications', desc: 'Alert the business when a new enquiry, booking, order, or action arrives.' },
  { key: 'status_updates', label: 'Status Updates', desc: 'Notify users when an order, application, request, or booking changes status.' },
  { key: 'custom_notifications', label: 'Custom Notifications', desc: 'A special notification that follows your own business process.' },
];

export const NOTIFICATION_PRICING = {
  starter: 25,
  business: 45,
  custom: 90,
  enterprise: 90,
};

export const STANDALONE_SERVICE_GROUPS = [
  {
    key: 'domains',
    label: 'Domains',
    items: [
      { key: 'domain_registration', label: 'Domain Registration', desc: 'Register and connect a new website address.', priceFrom: 50, typicalLow: 50, typicalHigh: 120 },
      { key: 'domain_transfer', label: 'Domain Transfer', desc: 'Move a domain from one provider to another.', priceFrom: 80, typicalLow: 100, typicalHigh: 220 },
      { key: 'dns_configuration', label: 'DNS Configuration', desc: 'Point domain records to the right website, email, or service.', priceFrom: 50, typicalLow: 50, typicalHigh: 150 },
    ],
  },
  {
    key: 'hosting',
    label: 'Hosting',
    items: [
      { key: 'hosting_setup', label: 'Hosting Setup', desc: 'Prepare hosting and connect it to the website.', priceFrom: 80, typicalLow: 100, typicalHigh: 220 },
      { key: 'vps_setup', label: 'VPS Setup', desc: 'Configure a virtual server for stronger performance or custom needs.', priceFrom: 150, typicalLow: 180, typicalHigh: 350 },
      { key: 'cloud_hosting', label: 'Cloud Hosting', desc: 'Set up cloud hosting for platforms, dashboards, or scalable websites.', priceFrom: 200, typicalLow: 250, typicalHigh: 650, quoteIfAdvanced: true },
      { key: 'website_migration', label: 'Website Migration', desc: 'Move a website, files, content, or setup from one host to another.', priceFrom: 120, typicalLow: 150, typicalHigh: 650, quoteIfAdvanced: true },
    ],
  },
  {
    key: 'business_email',
    label: 'Business Email',
    items: [
      { key: 'google_workspace', label: 'Google Workspace Setup', desc: 'Create and connect professional Gmail-style business email.', fixedPrice: 120, priceFrom: 120, typicalLow: 120, typicalHigh: 120 },
      { key: 'microsoft_365', label: 'Microsoft 365 Setup', desc: 'Create and connect Outlook business email.', fixedPrice: 120, priceFrom: 120, typicalLow: 120, typicalHigh: 120 },
      { key: 'spaceship_spacemail', label: 'Spaceship / Spacemail Setup', desc: 'Create and connect Spaceship Spacemail business email for your domain.', fixedPrice: 55, priceFrom: 55, typicalLow: 55, typicalHigh: 55 },
      { key: 'zoho_mail', label: 'Zoho Mail Setup', desc: 'Create and connect Zoho business email.', fixedPrice: 90, priceFrom: 90, typicalLow: 90, typicalHigh: 90 },
      { key: 'business_email_migration', label: 'Business Email Migration', desc: 'Move mailboxes or records from an old email setup.', priceFrom: 150, typicalLow: 180, typicalHigh: 550, quoteIfAdvanced: true },
    ],
  },
  {
    key: 'website_improvements',
    label: 'Website Improvements',
    items: [
      { key: 'seo_optimisation', label: 'SEO Optimisation', desc: 'Improve page titles, descriptions, content structure, and search readiness.', priceFrom: 120, typicalLow: 150, typicalHigh: 350 },
      { key: 'speed_optimisation', label: 'Website Speed Optimisation', desc: 'Improve load speed, image handling, scripts, and performance basics.', priceFrom: 120, typicalLow: 150, typicalHigh: 350 },
      { key: 'accessibility_improvements', label: 'Accessibility Improvements', desc: 'Improve readability, labels, contrast, keyboard access, and usability.', priceFrom: 120, typicalLow: 150, typicalHigh: 350 },
      { key: 'security_hardening', label: 'Security Hardening', desc: 'Add security checks, safer settings, SSL checks, and basic protections.', priceFrom: 150, typicalLow: 180, typicalHigh: 350 },
      { key: 'bug_fixes', label: 'Bug Fixes', desc: 'Fix broken layout, forms, links, scripts, or website behaviour.', priceFrom: 50, typicalLow: 75, typicalHigh: 500, quoteIfAdvanced: true },
      { key: 'content_updates', label: 'Content Updates', desc: 'Update text, images, pages, links, or small website sections.', priceFrom: 50, typicalLow: 75, typicalHigh: 250 },
    ],
  },
  {
    key: 'integrations',
    label: 'Integrations',
    items: [
      { key: 'stripe_integration', label: 'Stripe Integration', desc: 'Connect Stripe payments to a website or checkout flow.', priceFrom: 90, typicalLow: 90, typicalHigh: 400 },
      { key: 'paystack_integration', label: 'Paystack Integration', desc: 'Connect Paystack payments for cards, bank transfer, and local payments including MOMO or mobile money.', priceFrom: 70, typicalLow: 70, typicalHigh: 350 },
      { key: 'whatsapp_integration', label: 'WhatsApp Integration', desc: 'Add WhatsApp buttons, lead links, or simple WhatsApp actions.', priceFrom: 55, typicalLow: 55, typicalHigh: 150 },
      { key: 'google_maps', label: 'Google Maps', desc: 'Add maps, directions, location embeds, or simple location lookup.', priceFrom: 40, typicalLow: 40, typicalHigh: 200 },
      { key: 'google_analytics', label: 'Google Analytics', desc: 'Set up website traffic tracking and reporting.', priceFrom: 50, typicalLow: 50, typicalHigh: 200 },
      { key: 'facebook_pixel', label: 'Facebook Pixel', desc: 'Set up Meta tracking for ads and retargeting.', priceFrom: 50, typicalLow: 75, typicalHigh: 180 },
      { key: 'mailchimp', label: 'Mailchimp', desc: 'Connect newsletter forms or basic subscriber capture.', priceFrom: 80, typicalLow: 100, typicalHigh: 220 },
      { key: 'resend_email', label: 'Resend Email Integration', desc: 'Set up transactional email sending for website notifications.', priceFrom: 50, typicalLow: 50, typicalHigh: 300 },
    ],
  },
  {
    key: 'branding',
    label: 'Branding',
    items: [
      { key: 'logo_design', label: 'Logo Design', desc: 'Create or refine a logo for the business.', priceFrom: 45, typicalLow: 45, typicalHigh: 180 },
      { key: 'brand_identity', label: 'Brand Identity', desc: 'Create colours, typography, visual direction, and brand basics.', priceFrom: 70, typicalLow: 70, typicalHigh: 800, quoteIfAdvanced: true },
      { key: 'social_media_graphics', label: 'Social Media Graphics', desc: 'Design reusable social media graphics or launch visuals.', priceFrom: 50, typicalLow: 50, typicalHigh: 300 },
      { key: 'business_cards', label: 'Business Cards', desc: 'Design a professional business card layout.', priceFrom: 30, typicalLow: 30, typicalHigh: 180 },
    ],
  },
  {
    key: 'technical_services',
    label: 'Other Technical Services',
    items: [
      { key: 'database_setup', label: 'Database Setup', desc: 'Set up a database for a small website, tool, or platform.', priceFrom: 120, typicalLow: 120, typicalHigh: 650, quoteIfAdvanced: true },
      { key: 'cms_setup', label: 'CMS Setup', desc: 'Set up content editing so pages, posts, or galleries can be managed.', priceFrom: 100, typicalLow: 100, typicalHigh: 650, quoteIfAdvanced: true },
      { key: 'payment_gateway_configuration', label: 'Payment Gateway Configuration', desc: 'Configure payment accounts, keys, webhooks, or checkout settings.', priceFrom: 150, typicalLow: 150, typicalHigh: 350 },
      { key: 'notification_system', label: 'Notification System', desc: 'Set up website emails such as confirmations, receipts, reminders, or alerts.', priceFrom: 80, typicalLow: 80, typicalHigh: 500, quoteIfAdvanced: true },
      { key: 'admin_dashboard_enhancement', label: 'Admin Dashboard Enhancement', desc: 'Improve an existing admin area with better fields, tables, workflows, or reports.', priceFrom: 130, typicalLow: 130, typicalHigh: 1000, quoteIfAdvanced: true },
      { key: 'website_maintenance', label: 'Website Maintenance', desc: 'Ongoing care, updates, checks, backups, and support.', priceFrom: 100, typicalLow: 100, typicalHigh: 500 },
    ],
  },
];

export const STANDALONE_COMPLEXITY_OPTIONS = [
  { key: 'simple', label: 'Simple task', desc: 'A focused setup, fix, or configuration task.', multiplier: 0.85 },
  { key: 'standard', label: 'Standard service', desc: 'A typical standalone digital service with review and testing.', multiplier: 1 },
  { key: 'advanced', label: 'Advanced or unclear', desc: 'May need deeper review, custom work, multiple systems, or separate quoting.', multiplier: 1.2, quoteRecommended: true },
];

export const TIMELINE_OPTIONS = [
  { key: 'flexible', label: 'Flexible', desc: 'You can wait for a calmer delivery schedule.', multiplier: 0.95, timeline: '6-10 weeks', weight: 0 },
  { key: 'standard', label: '1-2 Months', desc: 'A normal delivery pace for most website projects.', multiplier: 1, timeline: '4-8 weeks', weight: 0 },
  { key: 'fast', label: '2-4 Weeks', desc: 'Faster scheduling with tighter review windows.', multiplier: 1.15, timeline: '2-4 weeks', weight: 4 },
  { key: 'priority', label: '2 Weeks', desc: 'Priority scheduling for a compressed launch window.', multiplier: 1.3, timeline: '2 weeks', weight: 7 },
  { key: 'rush', label: '1 Week (Rush)', desc: 'Rush delivery. Availability must be confirmed before approval.', multiplier: 1.5, timeline: '1 week if scope allows', weight: 11 },
];

export const DESIGN_COMPLEXITY_OPTIONS = [
  { key: 'template', label: 'Template Style', desc: 'Clean, professional layouts based on a proven structure.', weight: 2, minPackage: 'starter' },
  { key: 'custom', label: 'Professional Custom Design', desc: 'Custom page composition and stronger visual direction.', weight: 7, minPackage: 'starter' },
  { key: 'premium', label: 'Premium Brand Experience', desc: 'Richer interface details, stronger brand feel, and more polish.', weight: 14, minPackage: 'business' },
  { key: 'bespoke', label: 'Fully Bespoke UI/UX', desc: 'Custom UX planning, detailed interface states, and design-system level work.', weight: 24, minPackage: 'custom' },
];

export const CONTENT_OPTIONS = [
  { key: 'ready', label: 'I already have everything.', desc: 'You will provide final text, images, and key details.', weight: 0, minPackage: 'starter' },
  { key: 'writing', label: 'I need help writing.', desc: 'We help shape page copy, service descriptions, and key messages.', weight: 6, minPackage: 'starter' },
  { key: 'product_uploads', label: 'I need product uploads.', desc: 'We help upload product names, images, prices, and descriptions.', weight: 8, minPackage: 'business' },
  { key: 'image_sourcing', label: 'I need image sourcing.', desc: 'We help find or prepare suitable website imagery.', weight: 4, minPackage: 'starter' },
];

export const EXISTING_SITE_OPTIONS = [
  { key: 'none', label: 'No', desc: 'This is a new project.', weight: 0, minPackage: 'starter' },
  { key: 'redesign', label: 'Yes, redesign', desc: 'You already have a website and want a better version.', weight: 5, minPackage: 'starter' },
  { key: 'migrate', label: 'Yes, migrate', desc: 'Existing pages, content, files, or data need to be moved.', weight: 10, minPackage: 'business' },
];

export const INFRA_OPTIONS = {
  domain: [
    { key: 'own', label: 'Yes', desc: 'You already own the domain.', setup: 0, recurring: 0, cadence: '' },
    { key: 'register', label: "No, I would like The BrandHelper to register one.", desc: 'We register and connect it for you.', setup: 45, recurring: 20, cadence: 'year' },
  ],
  hosting: [
    { key: 'own', label: 'I already have hosting.', desc: 'We can connect the website to your hosting.', setup: 0, recurring: 0, cadence: '' },
    { key: 'shared', label: 'Shared Hosting', desc: 'Good for simple websites and small business sites.', setup: 80, recurring: 15, cadence: 'month' },
    { key: 'vps', label: 'VPS', desc: 'Better for custom sites with more traffic, saved records, or management tools.', setup: 160, recurring: 35, cadence: 'month' },
    { key: 'cloud', label: 'Cloud Hosting', desc: 'Best for platforms, dashboards, scaling, and reliability.', setup: 260, recurring: 75, cadence: 'month' },
  ],
  email: [
    { key: 'own', label: 'Already have one.', desc: 'You already use business email.', setup: 0, recurring: 0, cadence: '' },
    { key: 'setup', label: 'Set one up for me.', desc: 'We configure business email for your domain.', setup: 90, recurring: 6, cadence: 'month' },
  ],
  ssl: [
    { key: 'own', label: 'Already have SSL.', desc: 'Your hosting already provides a secure certificate.', setup: 0, recurring: 0, cadence: '' },
    { key: 'setup', label: 'Set one up.', desc: 'We configure HTTPS and basic certificate checks.', setup: 60, recurring: 0, cadence: '' },
  ],
  maintenance: [
    { key: 'none', label: 'None', desc: 'You only need the build for now.', setup: 0, recurring: 0, cadence: '' },
    { key: 'basic', label: 'Basic', desc: 'Light updates and technical checks.', setup: 0, recurring: 80, cadence: 'month' },
    { key: 'standard', label: 'Standard', desc: 'Regular updates, checks, backups, and support.', setup: 0, recurring: 180, cadence: 'month' },
    { key: 'premium', label: 'Premium', desc: 'Priority care for important platforms and busy sites.', setup: 0, recurring: 360, cadence: 'month' },
  ],
};

export const INFRA_SERVICES = [
  { key: 'cdn', label: 'CDN', desc: 'Faster global delivery for pages and files.', setup: 80, recurring: 12, cadence: 'month' },
  { key: 'monitoring', label: 'Monitoring', desc: 'Watch uptime and technical issues.', setup: 90, recurring: 15, cadence: 'month' },
  { key: 'backups', label: 'Automated Backups', desc: 'Scheduled backups for safer recovery.', setup: 110, recurring: 18, cadence: 'month' },
  { key: 'security', label: 'Security Hardening', desc: 'Extra security checks and setup.', setup: 220, recurring: 0, cadence: '' },
  { key: 'performance', label: 'Performance Optimisation', desc: 'Speed improvements and launch checks.', setup: 260, recurring: 0, cadence: '' },
  { key: 'migration', label: 'Website or Content Migration', desc: 'Move content, pages, files, or data from an old setup.', setup: 180, recurring: 0, cadence: '' },
];

export const FEATURE_PACKAGE_RULES = {
  landing: { weight: 1, minPackage: 'starter' },
  '2_5': { weight: 2, minPackage: 'starter' },
  '6_10': { weight: 4, minPackage: 'starter' },
  '11_20': { weight: 7, minPackage: 'starter' },
  '20_plus': { weight: 11, minPackage: 'starter' },

  responsive: { weight: 1, minPackage: 'starter' },
  premium_ui: { weight: 3, minPackage: 'starter' },
  animations: { weight: 2, minPackage: 'starter' },
  accessibility: { weight: 2, minPackage: 'starter' },
  advanced_seo: { weight: 2, minPackage: 'starter' },
  blog: { weight: 3, minPackage: 'starter' },
  portfolio: { weight: 1, minPackage: 'starter' },
  gallery: { weight: 1, minPackage: 'starter' },
  testimonials: { weight: 1, minPackage: 'starter' },
  faq: { weight: 1, minPackage: 'starter' },
  contact_forms: { weight: 1, minPackage: 'starter' },
  multilanguage: { weight: 4, minPackage: 'starter' },

  database: { weight: 3, minPackage: 'starter', reason: 'A simple database can fit Starter when it only supports light website content, enquiries, or basic records.' },
  cms: { weight: 4, minPackage: 'starter', reason: 'A basic CMS can fit Starter when it is used for simple page, blog, gallery, or announcement updates.' },
  rest_api: { weight: 5, minPackage: 'business', reason: 'API work usually belongs in Business once data must support workflows, external systems, or secure exchange between tools.' },
  authentication: { weight: 3, minPackage: 'starter', reason: 'A simple admin login can fit Starter; wider customer, staff, or member access increases the package scope.' },
  file_storage: { weight: 2, minPackage: 'starter', reason: 'Light uploads can fit Starter when they support basic gallery, blog, or document updates.' },
  admin_dashboard: { weight: 4, minPackage: 'starter', reason: 'A simple admin area can fit Starter when it only manages light website content or enquiries.' },
  analytics_dashboard: { weight: 5, minPackage: 'business', reason: 'Requires reporting views and stored activity data.' },
  media_library: { weight: 2, minPackage: 'starter', reason: 'A basic media library can fit Starter when it supports simple blog, gallery, or page content updates.' },

  registration: { weight: 3, minPackage: 'business', reason: 'User registration requires account storage and security handling.' },
  login: { weight: 2, minPackage: 'business', reason: 'Login requires protected sessions and account security.' },
  password_reset: { weight: 2, minPackage: 'business', reason: 'Password reset requires secure account recovery flows.' },
  two_factor: { weight: 4, minPackage: 'business', reason: 'Two-factor authentication adds extra security flows and testing.' },
  profiles: { weight: 3, minPackage: 'business', reason: 'Profiles require stored user data and private views.' },
  roles: { weight: 6, minPackage: 'custom', reason: 'Multiple permissions usually require custom platform planning.' },
  staff_accounts: { weight: 2, minPackage: 'business', reason: 'Staff accounts require role-aware private access.' },
  customer_accounts: { weight: 2, minPackage: 'business', reason: 'Customer accounts require stored user records.' },
  member_accounts: { weight: 2, minPackage: 'business', reason: 'Member accounts require private access and stored records.' },

  bookings: { weight: 5, minPackage: 'business', reason: 'Booking workflows require saved requests and status management.' },
  appointments: { weight: 4, minPackage: 'business', reason: 'Appointments require availability, dates, and confirmations.' },
  orders: { weight: 6, minPackage: 'business', reason: 'Orders require stored records and fulfilment workflows.' },
  inventory: { weight: 8, minPackage: 'business', reason: 'Inventory moves the project into operations because stock records, updates, and management rules are involved.' },
  reports: { weight: 5, minPackage: 'business', reason: 'Reports require structured data and export or dashboard views.' },
  crm: { weight: 10, minPackage: 'custom', reason: 'CRM workflows require records, pipelines, notes, and reporting.' },
  notifications: { weight: 4, minPackage: 'business', reason: 'Notifications require triggers, templates, and delivery handling.' },
  documents: { weight: 7, minPackage: 'custom', reason: 'Document management needs structured storage, access rules, and workflows.' },

  member_management: { weight: 7, minPackage: 'custom', reason: 'Member management is a portal feature with records and workflows.' },
  donations: { weight: 5, minPackage: 'business', reason: 'Donations require payment or giving records.' },
  tithes: { weight: 5, minPackage: 'business', reason: 'Tithes require stored giving history and reports.' },
  church_attendance: { weight: 4, minPackage: 'business', reason: 'Attendance requires stored event and member records.' },
  events: { weight: 3, minPackage: 'starter', reason: 'Simple event publishing can fit Starter when it is mainly website content rather than booking or attendance management.' },
  livestream: { weight: 2, minPackage: 'starter' },
  volunteers: { weight: 5, minPackage: 'business', reason: 'Volunteer management requires schedules, roles, and records.' },
  prayer_requests: { weight: 3, minPackage: 'starter', reason: 'Simple prayer request collection can fit Starter when it behaves like a light enquiry workflow.' },
  sermons: { weight: 4, minPackage: 'starter', reason: 'Sermon publishing can fit Starter when it is a simple media or blog-style content section.' },

  admissions: { weight: 7, minPackage: 'business', reason: 'Admissions require application records and review workflows.' },
  student_records: { weight: 9, minPackage: 'custom', reason: 'Student records require structured profiles, permissions, and reporting.' },
  teacher_portal: { weight: 8, minPackage: 'custom', reason: 'Portals require roles, private workflows, and dashboards.' },
  parent_portal: { weight: 8, minPackage: 'custom', reason: 'Portals require private access, permissions, and student data.' },
  school_attendance: { weight: 5, minPackage: 'business', reason: 'School attendance requires saved class or student records.' },
  timetable: { weight: 5, minPackage: 'business', reason: 'Timetables require structured schedules and update workflows.' },
  exams: { weight: 9, minPackage: 'custom', reason: 'Exam workflows need records, grading, reports, and permissions.' },
  lms: { weight: 16, minPackage: 'custom', reason: 'A learning management system includes courses, progress, roles, and reporting.' },

  products: { weight: 5, minPackage: 'business', reason: 'Product catalogues normally require stored product data.' },
  shipping: { weight: 4, minPackage: 'business', reason: 'Shipping requires checkout or fulfilment rules.' },
  commerce_coupons: { weight: 2, minPackage: 'business', reason: 'Commerce coupons require stored promotion rules.' },
  reviews: { weight: 2, minPackage: 'business', reason: 'Reviews require saved customer submissions.' },
  wishlist: { weight: 2, minPackage: 'business', reason: 'Wishlists require customer accounts or saved sessions.' },

  stripe: { weight: 4, minPackage: 'business', reason: 'Payment integrations move the project into business operations because transaction security and payment records must be handled properly.' },
  paystack: { weight: 4, minPackage: 'business', reason: 'Payment integrations move the project into business operations because transaction security and payment records must be handled properly.' },
  paypal: { weight: 4, minPackage: 'business', reason: 'Payment integrations move the project into business operations because transaction security and payment records must be handled properly.' },
  mobile_money: { weight: 4, minPackage: 'business', reason: 'Mobile money payment flows require payment records or instructions.' },
  subscriptions: { weight: 7, minPackage: 'custom', reason: 'Subscriptions require recurring billing logic and account handling.' },
  payment_coupons: { weight: 2, minPackage: 'business', reason: 'Checkout coupons require stored payment rules.' },
  invoices: { weight: 4, minPackage: 'business', reason: 'Invoices require generated records and payment tracking.' },
  tax_management: { weight: 5, minPackage: 'custom', reason: 'Tax management adds calculation and reporting rules.' },

  google_maps: { weight: 1, minPackage: 'starter' },
  google_analytics: { weight: 1, minPackage: 'starter' },
  whatsapp: { weight: 2, minPackage: 'starter' },
  zoom: { weight: 3, minPackage: 'business', reason: 'Zoom workflows usually require events, bookings, or saved meeting data.' },
  mailchimp: { weight: 3, minPackage: 'starter', reason: 'A simple newsletter signup can fit Starter when it only collects subscribers or connects a basic mailing list.' },
  external_crm: { weight: 6, minPackage: 'custom', reason: 'CRM integrations usually require mapping, syncing, and error handling.' },
  google_calendar: { weight: 4, minPackage: 'business', reason: 'Calendar sync requires booking or event data mapping.' },
  openai: { weight: 12, minPackage: 'custom', reason: 'AI features usually need custom workflow planning, safety review, and ongoing operating assumptions.' },
  slack: { weight: 3, minPackage: 'business', reason: 'Slack notifications require event triggers and external service setup.' },
  zapier: { weight: 4, minPackage: 'business', reason: 'Zapier workflows require trigger and data mapping setup.' },
};
