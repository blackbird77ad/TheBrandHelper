import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getPhase2Products, submitPhase2Request } from "../utils/api";

import dataHeroImg from "../photos/AI Data Marketplace image.png";
import dataCollectionImg from "../photos/Ai-data-collection.jpg";
import datasetProcessImg from "../photos/AI-dataset-process.jpg";
import handwrittenNotesImg from "../photos/handwritten-data-notes.jpg";
import handwrittenOcrImg from "../photos/handwritten-data-ocr-scan.webp";
import ocrImg from "../photos/ocr.jpg";
import languageDataImg from "../photos/Language and Locale Specialists.jpg";
import projectHeroImg from "../photos/Artificial_Intelligence-data-support-hero-page.jpg";
import trainingTeamsImg from "../photos/AI Training and Human Feedback Teams.jpg";
import projectContributorsImg from "../photos/AI Contributors and Evaluators4.png";
import vendorOpsImg from "../photos/Localization – African Languages Experts.png";
import talentHeroImg from "../photos/AI-talent-contributors-page-hero.jpg";
import talentFormImg from "../photos/Talent-page-contact-form.webp";
import localeTalentImg from "../photos/Localization-Languages Experts-find-talent-or-outsource-native-freelancers.jpg";
import digitalTeamsImg from "../photos/Digital Product and Software Teams.png";
import productsHeroImg from "../photos/Ready-Built Websites and Digital Products.webp";
import ecommerceProductImg from "../photos/Ready-Built Ecommerce Website.jpg";
import bookingProductImg from "../photos/Booking and Service Business Platform.jpg";
import adminProductImg from "../photos/Admin dashboard or SaaS Concept.webp";

const WHATSAPP = "https://wa.me/233501657205";

const statusLabel = {
  available: "Available",
  limited: "Limited availability",
  licensing: "Licensing available",
  custom_collection: "Custom collection",
  coming_soon: "Coming soon",
  request_access: "Request access",
  sold: "Sold",
  unavailable: "Unavailable",
};

const requestStages = [
  "New lead",
  "Contacted",
  "Qualified",
  "Samples or demo",
  "Meeting",
  "Negotiation",
  "Agreement",
  "Won or lost",
];

const roadmap = [
  {
    phase: "Launch",
    title: "Ready for enquiries",
    items: ["Public marketplace pages", "Dataset and product enquiries", "AI project requests", "Talent requests", "Contributor applications", "Admin-managed product and lead flow"],
  },
  {
    phase: "Operations",
    title: "Operations",
    items: ["Contributor database", "Talent matching", "Follow-up tracking", "Order and payment tracking", "Email automation", "Project coordination"],
  },
  {
    phase: "Scale",
    title: "Scale",
    items: ["Contributor accounts", "Client dashboards", "Task assignment", "Dataset delivery", "Licensing automation", "Multi-country operations"],
  },
];

const publicPathways = [
  { label: "AI Data", to: "/ai-data", mode: "data" },
  { label: "AI Projects", to: "/ai-projects", mode: "projects" },
  { label: "Talent", to: "/talent", mode: "talent" },
  { label: "Digital Products", to: "/digital-products", mode: "products" },
];

const pageConfig = {
  data: {
    eyebrow: "AI Data Marketplace",
    title: "Datasets, custom data collection, and licensing for AI teams.",
    description:
      "The BrandHelper helps companies access controlled training data for OCR, speech AI, language AI, document AI, computer vision, and research projects.",
    requestType: "dataset_interest",
    productType: "dataset",
    primaryCta: "Request Dataset Access",
    secondaryCta: "Discuss Custom Data",
    canonical: "https://thebrandhelper.com/ai-data",
    image: dataHeroImg,
    audience: "AI companies, machine-learning teams, researchers, startups, universities, product teams, and organizations that need reliable data.",
    privacyNote: "We do not expose full proprietary datasets, exact private quantities, sensitive samples, or final commercial pricing publicly. Serious buyers can request controlled access.",
    marketplaceEyebrow: "Dataset Catalogue",
    marketplaceTitle: "Preview controlled data products without exposing the full dataset.",
    marketplaceText: "Each dataset card shows enough for a serious buyer to understand the use case, then moves the conversation into sample review, licence terms, and admin approval.",
    capabilitiesEyebrow: "Dataset Supply",
    capabilitiesTitle: "From handwritten pages to custom data collection.",
    capabilitiesText: "Use this page when you need data itself: documents, images, text, audio, speech, OCR samples, metadata, or new data collected around a project brief.",
    pipelineEyebrow: "Dataset sales flow",
    pipelineTitle: "Valuable data stays controlled from first enquiry to delivery.",
    pipelineText: "Visitors can preview or request access, but full delivery is reviewed first so pricing, licence, intended use, and buyer details are properly captured.",
    requestEyebrow: "Data Request",
    requestTitle: "Tell us the dataset, licence, and AI use case.",
    requestText: "You do not need to know every technical field. Tell us what model or workflow you are building and the team will shape the right data option.",
    actions: ["Preview Sample", "Buy Full Dataset", "Request More Information", "Discuss Licensing", "Custom Collection"],
    formIntro: "Tell us what data you need, what you want to train or evaluate, and when you need it.",
    catalog: [
      {
        title: "Handwritten Document Dataset",
        category: "OCR / HTR",
        data_type: "Image / document",
        language: "English and local variants",
        locale: "Ghana and custom regions",
        industry: "Document AI",
        description: "Original handwritten document collections suitable for OCR, handwriting recognition, extraction, document AI, and model evaluation workflows.",
        scale: "Large internal collection, disclosed after qualification",
        price_label: "Request pricing",
        applications: ["OCR", "Handwritten text recognition", "Document AI", "Model evaluation"],
        status: "licensing",
        image: handwrittenNotesImg,
      },
      {
        title: "OCR Scan and Document Samples",
        category: "Document AI",
        data_type: "Scanned image / document",
        language: "Project-specific",
        locale: "Custom collection available",
        industry: "OCR evaluation",
        description: "Sample-ready OCR and scanned-document data for extraction workflows, model testing, and document processing experiments.",
        scale: "Sample preview and private access available",
        price_label: "Request quote",
        applications: ["OCR", "Document extraction", "Scan evaluation", "Data validation"],
        status: "request_access",
        image: handwrittenOcrImg,
      },
      {
        title: "OCR Model Review Pack",
        category: "OCR / evaluation",
        data_type: "Image / text review",
        language: "English and custom languages",
        locale: "Custom regions",
        industry: "AI evaluation",
        description: "Controlled document and OCR review support for teams testing recognition quality, extraction accuracy, and data-readiness.",
        scale: "Built around project scope",
        price_label: "Custom quote",
        applications: ["OCR review", "Model testing", "Quality assurance", "Document AI"],
        status: "custom_collection",
        image: ocrImg,
      },
      {
        title: "African Language Text and Speech Data",
        category: "NLP / Speech",
        data_type: "Text / audio",
        language: "Twi, Fante, Ewe, Ga, Hausa, English",
        locale: "Ghana first, Africa-wide expansion",
        industry: "Language AI",
        description: "Custom language, speech, transcription, translation, and local evaluation data built around native speakers and dialect knowledge.",
        scale: "Custom collected per project",
        price_label: "Custom quote",
        applications: ["Speech AI", "Localization", "Translation", "Language evaluation"],
        status: "custom_collection",
        image: vendorOpsImg,
      },
      {
        title: "Image, Video, and Multimodal Collection",
        category: "Computer vision",
        data_type: "Image / video / metadata",
        language: "Locale-specific where needed",
        locale: "Country-specific collection available",
        industry: "Multimodal AI",
        description: "Sourced image, video, and metadata collections for classification, relevance, safety, OCR, retail, agriculture, documents, and local-environment use cases.",
        scale: "Defined by client specification",
        price_label: "Request quote",
        applications: ["Computer vision", "Classification", "Validation", "Multimodal AI"],
        status: "request_access",
        image: dataCollectionImg,
      },
    ],
    capabilities: [
      "Dataset sales and licensing",
      "Custom data collection",
      "Per-sample or bulk pricing",
      "OCR and document AI data",
      "Speech, image, video, and text data",
      "Controlled samples and access review",
    ],
    models: ["Direct dataset sale", "Non-exclusive or exclusive licensing", "Research or commercial AI training licence", "Per-page, per-record, per-minute, or bulk pricing", "Custom collection from new contributors"],
    process: ["Free sample preview or private sample request", "Buyer details and intended use captured", "Licence option reviewed", "Checkout or custom quote agreed", "Admin reviews valuable datasets before delivery", "Dataset access is released manually or by approved delivery flow"],
  },
  projects: {
    eyebrow: "AI Project Support",
    title: "Managed contributors and project teams for AI training work.",
    description:
      "We can help AI companies recruit, screen, train, coordinate, and manage contributors for data collection, annotation, evaluation, localization, and quality assurance.",
    requestType: "ai_project",
    productType: "ai_service",
    primaryCta: "Request Project Support",
    secondaryCta: "Request Contributors",
    canonical: "https://thebrandhelper.com/ai-projects",
    image: projectHeroImg,
    audience: "AI labs, data vendors, startups, platforms, research teams, and international companies that need a managed local or regional workforce.",
    privacyNote: "Project details can be handled under confidentiality. Public forms collect the requirement first; sensitive guidelines and files can be shared later.",
    marketplaceEyebrow: "Project Support Menu",
    marketplaceTitle: "Choose the work you need people to help deliver.",
    marketplaceText: "This page is about managed execution: contributors, evaluators, annotators, language support, vendor operations, and quality checks for AI projects.",
    capabilitiesEyebrow: "Managed AI Operations",
    capabilitiesTitle: "We organize people, tasks, guidelines, quality, and reporting.",
    capabilitiesText: "Use this page when you already have a project and need a reliable team or vendor partner to recruit, coordinate, train, and manage contributors.",
    pipelineEyebrow: "AI project intake",
    pipelineTitle: "A project request becomes a managed delivery conversation.",
    pipelineText: "We capture the scope first, then review skills, languages, countries, task volume, timeline, confidentiality, and the delivery model.",
    requestEyebrow: "AI Project Request",
    requestTitle: "Send the project requirement and contributor profile.",
    requestText: "Describe the work in plain language: what people need to do, how many are needed, the languages or countries involved, and the deadline.",
    actions: ["Full Project Delivery", "Vendor Management", "Request Contributors", "Model Evaluation", "Data Annotation"],
    formIntro: "Describe the project, data type, countries, languages, volume, and what kind of team you need.",
    catalog: [
      {
        title: "AI Training and Human Feedback Teams",
        category: "Human evaluation",
        data_type: "Text, prompt, response, multimodal",
        language: "English and African languages",
        locale: "Remote or region-specific",
        industry: "Generative AI",
        description: "Contributor teams for response rating, prompt evaluation, model comparison, safety review, relevance scoring, and human feedback workflows.",
        scale: "Small pilot to managed contributor pool",
        applications: ["RLHF support", "Response evaluation", "Search relevance", "Quality review"],
        status: "available",
        image: trainingTeamsImg,
      },
      {
        title: "Data Annotation and Validation Operations",
        category: "Data operations",
        data_type: "Text / image / audio / video / OCR",
        language: "Project-specific",
        locale: "Ghana and Africa-wide network",
        industry: "AI operations",
        description: "Structured support for annotation, validation, transcription, translation, classification, guideline onboarding, and quality assurance.",
        scale: "Built around task volume",
        applications: ["Annotation", "Validation", "Transcription", "QA"],
        status: "available",
        image: datasetProcessImg,
      },
      {
        title: "Regional Vendor Management",
        category: "Workforce management",
        data_type: "People and operations",
        language: "Multi-language",
        locale: "Country and locale specific",
        industry: "AI vendor support",
        description: "A single local partner for contributor recruitment, language screening, training, task allocation, communication, payment coordination, and project reporting.",
        scale: "Managed per engagement",
        applications: ["Recruitment", "Screening", "Onboarding", "Reporting"],
        status: "licensing",
        image: localeTalentImg,
      },
    ],
    capabilities: [
      "Contributor recruitment and screening",
      "Guideline distribution and onboarding",
      "Task allocation and communication",
      "Performance monitoring",
      "Quality assurance",
      "Payment coordination and reporting",
    ],
    models: ["Internal team delivery", "Dedicated contributor recruitment", "Managed vendor service", "Specialist language teams", "Project-based or ongoing operations"],
    process: ["Project requirement review", "Contributor profile and skill planning", "Recruitment or shortlist", "Onboarding and guideline training", "Delivery and quality checks", "Reporting and follow-up"],
  },
  talent: {
    eyebrow: "Talent Network",
    title: "Request skilled people, or join the network for future projects.",
    description:
      "Companies, agencies, and AI teams can ask us to find the right people for a project. Skilled professionals can also sign up so we can match them when suitable work comes in.",
    requestType: "talent_request",
    productType: "ai_service",
    primaryCta: "Request Talent",
    secondaryCta: "Join as Talent",
    canonical: "https://thebrandhelper.com/talent",
    image: talentHeroImg,
    audience: "For clients: tell us the role, skills, language, country, timeline, and budget. For professionals: share your background, CV, links, skills, languages, and availability so we can match you properly.",
    privacyNote: "Talent profiles stay private. We use the information to match people to real project needs, and we only share a profile with a client when the fit and permission are clear.",
    marketplaceEyebrow: "Talent Paths",
    marketplaceTitle: "Companies can request people. Professionals can join the network.",
    marketplaceText: "This page has two clear jobs: help clients ask for talent, and help skilled people submit enough professional detail for future matching.",
    capabilitiesEyebrow: "Talent Matching",
    capabilitiesTitle: "Skills, language, country, availability, and proof all matter.",
    capabilitiesText: "Use this page when you need developers, contributors, evaluators, translators, researchers, or local-language specialists, or when you want to be considered for future work.",
    pipelineEyebrow: "Talent request flow",
    pipelineTitle: "Every profile and talent request becomes searchable for matching.",
    pipelineText: "We collect professional details, CV or portfolio links, language ability, country, work type, availability, and project fit before recommending anyone.",
    requestEyebrow: "Talent Intake",
    requestTitle: "Request talent or apply to join the network.",
    requestText: "Clients should describe the role and timeline. Professionals should share their CV link, LinkedIn, portfolio, country of residence, native languages, skills, and availability.",
    actions: ["One Freelancer", "Managed Team", "AI Contributors", "Language Specialists", "Developers"],
    formIntro: "Choose whether you want to request talent or join the network, then fill the details in simple terms.",
    catalog: [
      {
        title: "AI Contributors and Evaluators",
        category: "AI workforce",
        data_type: "Human judgement / tasks",
        language: "English, Twi, Fante, Ewe, Ga, Hausa",
        locale: "Ghana and Africa-wide growth",
        industry: "AI training",
        description: "AI trainers, annotators, evaluators, data collectors, reviewers, transcribers, and project contributors for structured AI work.",
        scale: "Single contributor to managed group",
        applications: ["AI evaluation", "Data collection", "Annotation", "Transcription"],
        status: "available",
        image: projectContributorsImg,
      },
      {
        title: "Language and Locale Specialists",
        category: "Localization",
        data_type: "Speech, text, translation",
        language: "African languages and dialects",
        locale: "Country, region, and dialect specific",
        industry: "Localization",
        description: "Native speakers, dialect specialists, translators, cultural reviewers, search evaluators, and local-language researchers.",
        scale: "Built per language need",
        applications: ["Translation", "Speech collection", "Localization", "Search evaluation"],
        status: "custom_collection",
        image: languageDataImg,
      },
      {
        title: "Digital Product and Software Teams",
        category: "Technology talent",
        data_type: "Software delivery",
        language: "English and project-specific",
        locale: "Remote-first",
        industry: "Web and software",
        description: "Frontend, backend, full-stack, QA, data, product, and project management support for websites, platforms, tools, and AI-adjacent products.",
        scale: "Freelancer or full project team",
        applications: ["Web development", "Software delivery", "QA", "Project management"],
        status: "available",
        image: digitalTeamsImg,
      },
    ],
    capabilities: [
      "Talent request intake",
      "Contributor applications",
      "Private contributor database",
      "Skill, language, and country tagging",
      "Shortlisting and matching",
      "Placement and project tracking",
    ],
    models: ["One freelancer", "Multiple contributors", "Complete managed team", "Short-term support", "Long-term contract", "Project-based delivery"],
    process: ["Company submits requirements", "BrandHelper reviews needed roles", "Contributor database is searched", "Candidates are shortlisted", "Client receives options", "Placement or project tracking begins"],
  },
  products: {
    eyebrow: "Ready-Built Websites and Digital Products",
    title: "Websites, platforms, and software concepts ready to customize.",
    description:
      "Businesses can browse ready-built websites and product concepts, request demos, discuss customization, or purchase a reserved build path.",
    requestType: "product_enquiry",
    productType: "website",
    primaryCta: "Discuss a Product",
    secondaryCta: "Request Similar Website",
    canonical: "https://thebrandhelper.com/digital-products",
    image: productsHeroImg,
    audience: "Businesses that need a website or platform faster than starting from a blank page, while still getting BrandHelper customization and support.",
    privacyNote: "Some demos and prices may be public, while exclusive products, source files, and deeper customization details are handled after enquiry.",
    marketplaceEyebrow: "Product Shelf",
    marketplaceTitle: "Browse digital products that can become your next launch.",
    marketplaceText: "This page is about speed: preview a product, reserve a build, show interest, or request a similar website for your own business.",
    capabilitiesEyebrow: "Product Delivery",
    capabilitiesTitle: "Ready-made concepts with BrandHelper customization.",
    capabilitiesText: "Use this page when you want a website or digital platform faster than a full blank-page build, but still need content, branding, and handover support.",
    pipelineEyebrow: "Product sales flow",
    pipelineTitle: "A product interest can become a reservation, demo, or custom quote.",
    pipelineText: "Buyers can ask questions first, reserve with a commitment payment, or request a similar product tailored to their business.",
    requestEyebrow: "Product Request",
    requestTitle: "Tell us which product you want to preview or reserve.",
    requestText: "Share the product, brand name, business type, contact details, and what you want customized before launch.",
    actions: ["Preview", "Pay 60% Commitment", "Show Interest", "Discuss Customization", "Request Similar Website"],
    formIntro: "Tell us which product or website type you want and what should be customized.",
    catalog: [
      {
        title: "Ready-Built Ecommerce Website",
        category: "Website product",
        data_type: "Storefront",
        language: "English",
        locale: "Customizable",
        industry: "Retail and fashion",
        description: "A structured ecommerce website with product sections, conversion flow, checkout direction, and brand-ready customization options.",
        scale: "90% built, ready to customize",
        applications: ["Online store", "Product catalogue", "Checkout flow", "WhatsApp handoff"],
        status: "available",
        price_label: "60% commitment, 40% before launch",
        image: ecommerceProductImg,
      },
      {
        title: "Booking and Service Business Platform",
        category: "Website product",
        data_type: "Booking flow",
        language: "English",
        locale: "Customizable",
        industry: "Beauty, hotel, service business",
        description: "A service website or booking concept with service pages, appointment flow, trust sections, gallery, and lead capture.",
        scale: "80% built, ready to customize",
        applications: ["Bookings", "Service sales", "Lead capture", "Portfolio"],
        status: "available",
        price_label: "60% commitment",
        image: bookingProductImg,
      },
      {
        title: "Admin Dashboard or SaaS Concept",
        category: "Software product",
        data_type: "Platform UI",
        language: "English",
        locale: "Remote delivery",
        industry: "Operations",
        description: "A business dashboard or SaaS-style product concept that can be extended into CRM, inventory, reporting, or internal workflow tools.",
        scale: "Custom version available",
        applications: ["Admin tools", "SaaS MVP", "Operations", "Reporting"],
        status: "request_access",
        price_label: "Quoted after scope",
        image: adminProductImg,
      },
    ],
    capabilities: [
      "Ready-built website products",
      "Live demo and screenshots",
      "50%, 75%, or full payment options",
      "Customization after purchase",
      "Exclusive or multi-license sales",
      "Additional development quotes",
    ],
    models: ["60% commitment payment for website products", "Remaining 40% before launch or handover", "Show interest before payment", "Custom version quote", "Dataset products can use full payment after review"],
    process: ["Buyer previews the product", "Buyer pays 60% commitment or shows interest", "Buyer details are captured", "Admin marks product reserved or pending customization", "Customization details are collected", "Remaining balance is paid before final launch"],
  },
};

const fieldClass = "w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-black transition bg-white";

const talentRequestNeeds = ["One Freelancer", "Several Freelancers", "Complete Team", "AI Contributors", "Developers", "Linguists", "Project Manager", "Quality Reviewers"];
const contributorInterestAreas = ["AI Training", "Data Collection", "Data Annotation", "AI Evaluation", "Translation", "Transcription", "Software Development", "Research"];

const standardFields = [
  { key: "company", placeholder: "Company / organization" },
  { key: "contact_name", placeholder: "Contact person / full name", required: true },
  { key: "email", placeholder: "Work email", type: "email", required: true },
  { key: "phone", placeholder: "Phone" },
  { key: "whatsapp", placeholder: "WhatsApp" },
  { key: "country", placeholder: "Country" },
  { key: "website", placeholder: "Website" },
  { key: "timeline", placeholder: "Project timeline" },
  { key: "project_title", placeholder: "Project or product title" },
  { key: "project_type", placeholder: "Project type" },
  { key: "data_type", placeholder: "Data type / work type" },
  { key: "budget", placeholder: "Budget range" },
  { key: "languages", placeholder: "Languages, comma separated" },
  { key: "countries", placeholder: "Countries / locales" },
  { key: "skills", placeholder: "Required skills" },
  { key: "volume", placeholder: "Estimated volume" },
  { key: "contributors", placeholder: "Number of contributors / people" },
  { key: "intended_use", placeholder: "Intended use / action needed" },
  { key: "confidentiality", placeholder: "Confidentiality requirements" },
  { key: "work_arrangement", placeholder: "Remote, onsite, hybrid, or delivery model" },
  { key: "start_date", placeholder: "Start date" },
  { key: "deadline", placeholder: "Deadline" },
];

const talentCompanyFields = [
  { key: "company", placeholder: "Company / agency name", required: true },
  { key: "contact_name", placeholder: "Contact person", required: true },
  { key: "email", placeholder: "Work email", type: "email", required: true },
  { key: "phone", placeholder: "Phone" },
  { key: "whatsapp", placeholder: "WhatsApp" },
  { key: "country", placeholder: "Your country" },
  { key: "website", placeholder: "Company website" },
  { key: "project_type", placeholder: "Role needed, e.g. React developer, AI evaluator" },
  { key: "contributors", placeholder: "How many people do you need?" },
  { key: "skills", placeholder: "Required skills, comma separated" },
  { key: "languages", placeholder: "Required languages" },
  { key: "countries", placeholder: "Preferred country / locale" },
  { key: "work_arrangement", placeholder: "Remote, onsite, hybrid" },
  { key: "volume", placeholder: "Weekly hours or workload" },
  { key: "timeline", placeholder: "Contract duration" },
  { key: "start_date", placeholder: "Expected start date" },
  { key: "deadline", placeholder: "Deadline, if any" },
  { key: "budget", placeholder: "Budget or pay range" },
  { key: "confidentiality", placeholder: "Confidentiality / NDA needs" },
  { key: "project_title", placeholder: "Project name, if available" },
];

const contributorFields = [
  { key: "contact_name", placeholder: "Full name", required: true },
  { key: "email", placeholder: "Email address", type: "email", required: true },
  { key: "phone", placeholder: "Phone" },
  { key: "whatsapp", placeholder: "WhatsApp" },
  { key: "residence_country", placeholder: "Country of residence", required: true },
  { key: "country", placeholder: "Country you can support, if different" },
  { key: "timezone", placeholder: "Time zone, e.g. GMT, GMT+1" },
  { key: "native_languages", placeholder: "Native language(s)" },
  { key: "other_languages", placeholder: "Other languages and fluency level" },
  { key: "current_role", placeholder: "Current role / professional title" },
  { key: "skills", placeholder: "Skills, comma separated" },
  { key: "professional_background", placeholder: "Professional background / industries" },
  { key: "experience_years", placeholder: "Years of experience" },
  { key: "education", placeholder: "Education / certifications" },
  { key: "availability", placeholder: "Availability, e.g. evenings, 20 hrs/week" },
  { key: "preferred_work_type", placeholder: "Preferred work: AI tasks, dev, translation..." },
  { key: "expected_rate", placeholder: "Expected rate / pay preference" },
  { key: "cv_url", placeholder: "CV / resume link" },
  { key: "linkedin_url", placeholder: "LinkedIn URL" },
  { key: "portfolio_url", placeholder: "Portfolio / website URL" },
  { key: "github_url", placeholder: "GitHub URL, if applicable" },
];

function splitInput(value) {
  return String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
}

function Badge({ children, tone = "dark" }) {
  const tones = {
    dark: "bg-black text-white",
    red: "bg-red-600 text-white",
    soft: "bg-gray-100 text-gray-600",
    outline: "border border-gray-200 text-gray-600",
  };

  return <span className={`inline-flex rounded px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest ${tones[tone]}`}>{children}</span>;
}

function ProductCard({ item, onRequest, mode, fallbackImage, requestLabel = "Request Access" }) {
  const applications = item.applications || [];
  const image = item.image || fallbackImage;
  const buttonSets = {
    data: [
      { label: "Preview Sample", action: "Preview Sample", kind: "preview" },
      { label: "Buy Full Dataset", action: "Buy Full Dataset", kind: "buy" },
      { label: "Request More Information", action: "Request More Information", kind: "interest" },
    ],
    products: [
      { label: "Preview", action: "Preview", kind: "preview" },
      { label: "Pay 60% Commitment", action: "Pay 60% Commitment", kind: "buy" },
      { label: "Show Interest", action: "Show Interest", kind: "interest" },
    ],
  };
  const buttons = buttonSets[mode] || [
    { label: requestLabel, action: requestLabel, kind: "buy" },
    { label: "Discuss First", action: "Discuss First", kind: "interest" },
  ];

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
      {image && (
        <div className="h-48 bg-gray-50">
          <img src={image} alt={item.title} className="h-full w-full object-contain p-3" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge tone="soft">{item.category || item.product_type || "Product"}</Badge>
          <span className="text-[11px] font-bold uppercase tracking-widest text-red-600">{statusLabel[item.status] || item.status || "Request quote"}</span>
        </div>
        <h3 className="mt-4 text-lg font-semibold leading-tight">{item.title}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">{item.description}</p>
        <div className="mt-4 grid gap-2 text-xs text-gray-500">
          {item.data_type && <div><span className="font-bold text-gray-800">Type:</span> {item.data_type}</div>}
          {item.language && <div><span className="font-bold text-gray-800">Language:</span> {item.language}</div>}
          {item.locale && <div><span className="font-bold text-gray-800">Locale:</span> {item.locale}</div>}
          {item.scale && <div><span className="font-bold text-gray-800">Status:</span> {item.scale}</div>}
          {item.price_label && <div><span className="font-bold text-gray-800">Price:</span> {item.price_label}</div>}
        </div>
        {applications.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {applications.slice(0, 4).map((application) => (
              <span key={application} className="rounded border border-gray-100 px-2 py-1 text-[11px] font-semibold text-gray-500">{application}</span>
            ))}
          </div>
        )}
        <div className="mt-5 flex flex-wrap gap-2">
          {buttons.map((button) => {
            const canPreview = button.kind === "preview" && (item.demo_url || item.sample_url);
            const className = button.kind === "buy"
              ? "rounded bg-black px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-red-600"
              : "rounded border border-gray-200 px-4 py-2 text-xs font-bold uppercase tracking-wide text-gray-700 transition hover:border-black";
            return canPreview ? (
              <a key={button.label} href={item.demo_url || item.sample_url} target="_blank" rel="noopener noreferrer" className={className}>
                {button.label}
              </a>
            ) : (
              <button key={button.label} type="button" onClick={() => onRequest(button.action, item)} className={className}>
                {button.label}
              </button>
            );
          })}
        </div>
      </div>
    </article>
  );
}

function Phase2Form({ config, mode, activeRequest, onClearRequest }) {
  const [form, setForm] = useState({
    company: "",
    contact_name: "",
    email: "",
    phone: "",
    whatsapp: "",
    country: "",
    website: "",
    project_title: "",
    project_type: "",
    data_type: "",
    languages: "",
    countries: "",
    skills: "",
    volume: "",
    contributors: "",
    timeline: "",
    budget: "",
    intended_use: "",
    confidentiality: "",
    work_arrangement: "",
    start_date: "",
    deadline: "",
    residence_country: "",
    native_languages: "",
    other_languages: "",
    timezone: "",
    current_role: "",
    professional_background: "",
    experience_years: "",
    education: "",
    availability: "",
    preferred_work_type: "",
    expected_rate: "",
    cv_url: "",
    linkedin_url: "",
    portfolio_url: "",
    github_url: "",
    message: "",
  });
  const [requestKind, setRequestKind] = useState(config.requestType);
  const [selectedSupport, setSelectedSupport] = useState([]);
  const [status, setStatus] = useState("idle");

  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const activeRequestKind = useMemo(() => {
    if (mode === "talent" && activeRequest?.action?.toLowerCase().includes("join")) return "contributor_application";
    if (mode === "data" && activeRequest?.action === "Custom Collection") return "data_collection";
    return requestKind;
  }, [activeRequest, mode, requestKind]);

  const requestDefaults = useMemo(() => ({
    project_title: activeRequest?.item?.title || "",
    project_type: activeRequest?.item?.category || "",
    data_type: activeRequest?.item?.data_type || "",
    intended_use: activeRequest?.action || "",
    message: activeRequest?.item?.title ? `I am interested in ${activeRequest.item.title}. ` : "",
  }), [activeRequest]);

  const valueFor = (key) => form[key] || requestDefaults[key] || "";

  const formWithRequestDefaults = () => ({
    ...form,
    project_title: form.project_title || requestDefaults.project_title,
    project_type: form.project_type || requestDefaults.project_type,
    data_type: form.data_type || requestDefaults.data_type,
    intended_use: form.intended_use || requestDefaults.intended_use,
    message: form.message || requestDefaults.message,
  });

  const toggleSupport = (item) => {
    setSelectedSupport((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item]);
  };

  const submit = async (event) => {
    event.preventDefault();
    setStatus("sending");

    const submissionForm = formWithRequestDefaults();
    const isContributorApplication = activeRequestKind === "contributor_application";
    const combinedLanguages = [
      ...splitInput(submissionForm.languages),
      ...splitInput(submissionForm.native_languages),
      ...splitInput(submissionForm.other_languages),
    ];
    const combinedCountries = [
      ...splitInput(submissionForm.countries),
      ...(submissionForm.residence_country ? [submissionForm.residence_country] : []),
    ];
    const profileWebsite = submissionForm.website || submissionForm.portfolio_url || submissionForm.linkedin_url || submissionForm.github_url;

    const payload = {
      ...submissionForm,
      request_type: activeRequestKind,
      company: isContributorApplication ? submissionForm.company || "Independent talent" : submissionForm.company,
      country: isContributorApplication ? submissionForm.residence_country || submissionForm.country : submissionForm.country,
      website: isContributorApplication ? profileWebsite : submissionForm.website,
      project_title: isContributorApplication ? submissionForm.current_role || submissionForm.project_title : submissionForm.project_title,
      project_type: isContributorApplication ? submissionForm.current_role || submissionForm.project_type || "Talent application" : submissionForm.project_type || config.eyebrow,
      timeline: isContributorApplication ? submissionForm.availability || submissionForm.timeline : submissionForm.timeline,
      budget: isContributorApplication ? submissionForm.expected_rate || submissionForm.budget : submissionForm.budget,
      languages: combinedLanguages,
      countries: combinedCountries,
      skills: [...splitInput(submissionForm.skills), ...selectedSupport],
      source_product_id: activeRequest?.item?._id || null,
      source_product: activeRequest?.item?.title || (mode === "products" ? submissionForm.project_title : ""),
      submitted_at: new Date().toISOString(),
      metadata: {
        page: mode,
        action: activeRequest?.action || submissionForm.intended_use,
        confidentiality: submissionForm.confidentiality,
        work_arrangement: submissionForm.work_arrangement,
        start_date: submissionForm.start_date,
        deadline: submissionForm.deadline,
        professional_profile: isContributorApplication ? {
          residence_country: submissionForm.residence_country,
          country_supported: submissionForm.country,
          native_languages: splitInput(submissionForm.native_languages),
          other_languages: splitInput(submissionForm.other_languages),
          timezone: submissionForm.timezone,
          current_role: submissionForm.current_role,
          professional_background: submissionForm.professional_background,
          experience_years: submissionForm.experience_years,
          education: submissionForm.education,
          availability: submissionForm.availability,
          preferred_work_type: submissionForm.preferred_work_type,
          expected_rate: submissionForm.expected_rate,
          cv_url: submissionForm.cv_url,
          linkedin_url: submissionForm.linkedin_url,
          portfolio_url: submissionForm.portfolio_url,
          github_url: submissionForm.github_url,
        } : undefined,
        talent_request: activeRequestKind === "talent_request" ? {
          role_required: submissionForm.project_type,
          number_required: submissionForm.contributors,
          required_skills: splitInput(submissionForm.skills),
          required_languages: splitInput(submissionForm.languages),
          preferred_country_or_locale: submissionForm.countries,
          weekly_hours_or_workload: submissionForm.volume,
          contract_duration: submissionForm.timeline,
        } : undefined,
      },
    };

    try {
      await submitPhase2Request(payload);
      setStatus("sent");
      setForm((current) => ({ ...current, message: "" }));
      setSelectedSupport([]);
      onClearRequest?.();
    } catch (error) {
      console.warn("Platform request:", error);
      setStatus("error");
    }
  };

  const isTalent = mode === "talent";
  const isContributor = activeRequestKind === "contributor_application";
  const fieldDefs = isTalent ? (isContributor ? contributorFields : talentCompanyFields) : standardFields;
  const actionChoices = isTalent ? (isContributor ? contributorInterestAreas : talentRequestNeeds) : config.actions;

  return (
    <form onSubmit={submit} className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm md:p-7">
      <div className="mb-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-red-600">{isContributor ? "Contributor application" : config.primaryCta}</p>
        <h2 className="text-2xl font-semibold md:text-3xl">{isContributor ? "Join our AI and digital talent network" : isTalent ? "Request talent from us" : "Tell us what you need"}</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">{config.formIntro}</p>
      </div>

      {isTalent && (
        <div className="mb-5">
          <div className="mb-4 grid gap-2 sm:grid-cols-2">
            {[
            { key: "talent_request", label: "I need talent", help: "For companies, agencies, and teams that want us to find people." },
            { key: "contributor_application", label: "I want to join", help: "For freelancers and professionals who want future project matches." },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                setRequestKind(item.key);
                onClearRequest?.();
              }}
              className={`rounded-lg border px-4 py-3 text-left text-sm font-bold transition ${activeRequestKind === item.key ? "border-black bg-black text-white" : "border-gray-200 text-gray-600 hover:border-black"}`}
            >
              <span className="block">{item.label}</span>
              <span className={`mt-1 block text-xs font-medium leading-relaxed ${activeRequestKind === item.key ? "text-white/70" : "text-gray-400"}`}>{item.help}</span>
            </button>
          ))}
          </div>
          <div className="rounded-lg border border-gray-100 bg-[#F8F8F8] p-4 text-sm leading-relaxed text-gray-600">
            {isContributor
              ? "Share the details we need to match you well: your CV link, professional links, country of residence, native languages, skills, experience, availability, and the kind of work you can do."
              : "Tell us the role you need, how many people, required skills, languages, location preference, work arrangement, budget, and timeline. We will review the requirement and shortlist suitable people."}
          </div>
        </div>
      )}

      {activeRequest && (
        <div className="mb-5 rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-800">
          Requesting: <span className="font-bold">{activeRequest.action}</span>{activeRequest.item?.title ? ` for ${activeRequest.item.title}` : ""}
          <button type="button" onClick={onClearRequest} className="ml-3 font-bold underline">clear</button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fieldDefs.map((field) => (
          <input
            key={field.key}
            className={field.className || field.wide ? `${fieldClass} sm:col-span-2` : fieldClass}
            value={valueFor(field.key)}
            onChange={update(field.key)}
            placeholder={field.placeholder}
            type={field.type || "text"}
            required={field.required}
          />
        ))}
      </div>

      <div className="mt-5">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-500">{isContributor ? "Areas of interest" : "Support required"}</p>
        <div className="flex flex-wrap gap-2">
          {actionChoices.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => toggleSupport(item)}
              className={`rounded border px-3 py-2 text-xs font-bold transition ${selectedSupport.includes(item) ? "border-black bg-black text-white" : "border-gray-200 text-gray-500 hover:border-black"}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <textarea
        className={`${fieldClass} mt-5 min-h-[130px] resize-y`}
        value={valueFor("message")}
        onChange={update("message")}
        placeholder={isContributor ? "Add anything else we should know before matching you to future projects." : "Describe the request, project need, preferred talent profile, confidentiality needs, or anything important."}
      />

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded bg-red-600 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-black disabled:opacity-60"
        >
          {status === "sending" ? "Sending..." : isContributor ? "Apply To Join" : config.primaryCta}
        </button>
        <a
          href={WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded border border-gray-200 px-6 py-3 text-center text-sm font-bold text-black transition hover:border-black"
        >
          Talk on WhatsApp
        </a>
      </div>

      {status === "sent" && <p className="mt-4 text-sm font-semibold text-green-700">Request received. We will follow up with the next step.</p>}
      {status === "error" && <p className="mt-4 text-sm font-semibold text-red-600">Could not submit through the server. Please use WhatsApp while we check the connection.</p>}
    </form>
  );
}

export default function Phase2({ mode = "data" }) {
  const config = pageConfig[mode] || pageConfig.data;
  const [products, setProducts] = useState([]);
  const [activeRequest, setActiveRequest] = useState(null);
  const requestRef = useRef(null);

  useEffect(() => {
    let alive = true;
    getPhase2Products({ type: config.productType })
      .then((res) => {
        const items = res?.data || res;
        if (alive && Array.isArray(items)) setProducts(items);
      })
      .catch(() => {
        if (alive) setProducts([]);
      });
    return () => { alive = false; };
  }, [config.productType]);

  const cards = useMemo(() => {
    if (products.length > 0) {
      return products.map((product) => ({
        ...product,
        applications: Array.isArray(product.applications) ? product.applications : splitInput(product.applications || ""),
      }));
    }
    return config.catalog;
  }, [products, config.catalog]);

  const startRequest = (action, item = null) => {
    setActiveRequest({ action, item });
    requestRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-white text-black overflow-x-hidden">
      <Helmet>
        <title>{config.eyebrow} | The BrandHelper</title>
        <meta name="description" content={config.description} />
        <link rel="canonical" href={config.canonical} />
      </Helmet>

      <section className="bg-black px-6 py-14 text-white md:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-center">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-red-500">{config.eyebrow}</p>
            <h1 className="mb-6 max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">{config.title}</h1>
            <p className="mb-7 max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">{config.description}</p>
            <div className="mb-7 rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-sm leading-relaxed text-gray-300">{config.audience}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => startRequest(config.primaryCta)} className="rounded bg-red-600 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white hover:text-black">
                {config.primaryCta}
              </button>
              <button type="button" onClick={() => startRequest(config.secondaryCta)} className="rounded border border-white/30 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white hover:text-black">
                {config.secondaryCta}
              </button>
              {mode === "products" && (
                <Link to="/portfolio" className="rounded border border-white/30 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white hover:text-black">
                  See Portfolio
                </Link>
              )}
            </div>
          </div>
          <div className="h-[300px] overflow-hidden rounded-lg border border-white/10 md:h-[460px]">
            <img src={config.image} alt={config.eyebrow} className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      <nav className="border-b border-gray-100 bg-white px-6">
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto py-3">
          {publicPathways.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`shrink-0 rounded px-4 py-2 text-sm font-bold ${item.mode === mode ? "bg-black text-white" : "text-gray-500 hover:bg-gray-100"}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <section id="marketplace" className="bg-[#F5F5F5] px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-9 grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-end">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-red-600">{config.marketplaceEyebrow || "Marketplace"}</p>
              <h2 className="text-3xl font-semibold md:text-4xl">{config.marketplaceTitle || "Browse what The BrandHelper can supply."}</h2>
            </div>
            <p className="text-sm leading-relaxed text-gray-600">{config.marketplaceText || config.privacyNote}</p>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {cards.map((card) => (
              <ProductCard
                key={card._id || card.title}
                item={card}
                mode={mode}
                fallbackImage={config.image}
                onRequest={startRequest}
                requestLabel={mode === "data" ? "Request Access" : config.primaryCta}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-red-600">{config.capabilitiesEyebrow || "What We Can Handle"}</p>
            <h2 className="mb-5 text-3xl font-semibold md:text-4xl">{config.capabilitiesTitle || "Data, people, technology, and managed delivery."}</h2>
            <p className="mb-7 leading-relaxed text-gray-600">
              {config.capabilitiesText || "The BrandHelper helps you get the right data, people, technology, or project support without starting from zero."}
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {config.capabilities.map((item) => (
                <div key={item} className="rounded-lg border border-gray-100 px-4 py-3 text-sm text-gray-700">{item}</div>
              ))}
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-lg border border-gray-100 bg-[#F8F8F8] p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">Commercial Models</p>
              <div className="space-y-3">
                {config.models.map((item) => (
                  <div key={item} className="rounded border border-gray-100 bg-white px-4 py-3 text-sm text-gray-700">{item}</div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-gray-100 bg-[#F8F8F8] p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">Operating Flow</p>
              <div className="space-y-3">
                {config.process.map((item, index) => (
                  <div key={item} className="grid grid-cols-[28px_1fr] gap-3 text-sm text-gray-700">
                    <div className="flex h-7 w-7 items-center justify-center rounded bg-black text-xs font-bold text-white">{index + 1}</div>
                    <div className="rounded border border-gray-100 bg-white px-4 py-3">{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black px-6 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 grid gap-5 md:grid-cols-[0.8fr_1.2fr] md:items-end">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-red-500">{config.pipelineEyebrow || "Admin-managed sales pipeline"}</p>
              <h2 className="text-3xl font-semibold md:text-4xl">{config.pipelineTitle || "Every enquiry becomes a follow-up opportunity."}</h2>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              {config.pipelineText || "Dataset buyers, AI companies, talent clients, product buyers, and contributors are captured for follow-up instead of being forced into instant purchase."}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {requestStages.map((stage, index) => (
              <div key={stage} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded bg-red-600 text-xs font-black">{index + 1}</div>
                <div className="text-sm font-bold">{stage}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={requestRef} id="request" className="bg-white px-6 py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-red-600">{config.requestEyebrow || "Request Intake"}</p>
            <h2 className="mb-5 text-3xl font-semibold md:text-4xl">{config.requestTitle || "Send the details. We shape the scope."}</h2>
            <p className="mb-6 leading-relaxed text-gray-600">
              {config.requestText || "You do not need a perfect technical brief. Tell us what you are trying to achieve and The BrandHelper will turn it into a dataset, contributor, talent, product, or project plan."}
            </p>
            {mode === "talent" && (
              <div className="mb-6 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                <img src={talentFormImg} alt="Talent application form" className="h-52 w-full object-contain p-3" />
              </div>
            )}
            <div className="space-y-3">
              {config.actions.map((action) => (
                <button
                  key={action}
                  type="button"
                  onClick={() => startRequest(action)}
                  className="block w-full rounded-lg border border-gray-100 bg-[#F8F8F8] px-4 py-3 text-left text-sm font-bold text-gray-700 transition hover:border-black hover:bg-white"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
          <Phase2Form key={mode} config={config} mode={mode} activeRequest={activeRequest} onClearRequest={() => setActiveRequest(null)} />
        </div>
      </section>

      <section className="bg-[#F5F5F5] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-red-600">How We Grow With You</p>
            <h2 className="text-3xl font-semibold md:text-4xl">Built to launch now and scale later.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {roadmap.map((phase) => (
              <article key={phase.phase} className="rounded-lg border border-gray-100 bg-white p-5">
                <Badge tone="red">{phase.phase}</Badge>
                <h3 className="mt-4 text-lg font-semibold">{phase.title}</h3>
                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                  {phase.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black px-6 py-16 text-white">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-red-500">Final Positioning</p>
            <h2 className="mb-3 text-3xl font-semibold md:text-4xl">Data when companies need data. People when companies need people. Technology when companies need technology.</h2>
            <p className="max-w-2xl text-gray-400">The BrandHelper becomes a technology and AI enablement partner supplying data, talent, project support, and ready-built digital solutions.</p>
          </div>
          <Link to="/contact" className="rounded bg-white px-7 py-3 text-sm font-bold uppercase tracking-wide text-black transition hover:bg-red-600 hover:text-white">
            General Contact
          </Link>
        </div>
      </section>
    </div>
  );
}
