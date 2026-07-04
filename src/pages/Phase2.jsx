import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getPhase2Products, submitPhase2Request } from "../utils/api";

import heroImg from "../photos/website-page-inner-hero-img-1.webp";
import dataImg from "../photos/branding-hero.jpeg";
import productImg from "../photos/responsivewebdesign-1.png";

const WHATSAPP = "https://wa.me/233501657205";

const pageConfig = {
  data: {
    eyebrow: "AI Data Marketplace",
    title: "Training data for AI teams, researchers, and product builders.",
    description:
      "Source controlled datasets, request custom data collection, and discuss licensing for OCR, language, speech, image, document, and local-market AI use cases.",
    requestType: "dataset_interest",
    primaryCta: "Request Dataset Access",
    secondaryCta: "Custom Data Collection",
    canonical: "https://thebrandhelper.com/ai-data",
    image: dataImg,
    cards: [
      {
        title: "Handwritten Document Data",
        tag: "OCR / HTR",
        description: "Original handwritten document collections for OCR, handwriting recognition, document AI, and model evaluation.",
        meta: "Licensing available",
      },
      {
        title: "African Language Data",
        tag: "NLP / Speech",
        description: "Language, speech, text, and localization datasets built around local speakers, dialects, and cultural context.",
        meta: "Custom collection",
      },
      {
        title: "Image, Text, Audio, and Video",
        tag: "Multimodal",
        description: "Custom sourced datasets for computer vision, speech AI, content classification, and human feedback workflows.",
        meta: "Request access",
      },
    ],
    capabilities: [
      "Dataset sales and licensing",
      "Custom data collection",
      "OCR and document AI data",
      "Speech, text, image, and video data",
      "Quality review and validation",
      "Controlled sample and pricing requests",
    ],
  },
  projects: {
    eyebrow: "AI Project Support",
    title: "Teams and contributors for AI training projects.",
    description:
      "We help companies assemble and manage contributors for AI training, evaluation, data annotation, localization, transcription, and vendor-managed delivery.",
    requestType: "ai_project",
    primaryCta: "Request Project Support",
    secondaryCta: "Request Contributors",
    canonical: "https://thebrandhelper.com/ai-projects",
    image: heroImg,
    cards: [
      {
        title: "AI Training and Evaluation",
        tag: "Human feedback",
        description: "Contributor teams for prompt evaluation, response rating, model comparison, and quality assurance.",
        meta: "Managed teams",
      },
      {
        title: "Annotation and Validation",
        tag: "Data operations",
        description: "Structured support for image, text, audio, video, OCR, and multimodal annotation projects.",
        meta: "QA included",
      },
      {
        title: "Vendor Management",
        tag: "Operations",
        description: "Recruit, screen, train, coordinate, and report across local or regional contributor groups.",
        meta: "Single partner",
      },
    ],
    capabilities: [
      "Contributor recruitment",
      "Guideline onboarding",
      "Task allocation",
      "Quality assurance",
      "Language and locale screening",
      "Progress reporting",
    ],
  },
  talent: {
    eyebrow: "Talent Network",
    title: "Find people for AI, data, language, and technical projects.",
    description:
      "Request freelancers, contributors, evaluators, linguists, translators, developers, and complete project teams through a managed sourcing process.",
    requestType: "talent_request",
    primaryCta: "Request Talent",
    secondaryCta: "Join the Network",
    canonical: "https://thebrandhelper.com/talent",
    image: dataImg,
    cards: [
      {
        title: "AI Contributors",
        tag: "Data and model work",
        description: "AI trainers, annotators, evaluators, data collectors, reviewers, and project contributors.",
        meta: "Short or long term",
      },
      {
        title: "Language Specialists",
        tag: "Localization",
        description: "Native speakers, translators, transcribers, dialect specialists, and cultural reviewers.",
        meta: "Ghana and Africa",
      },
      {
        title: "Technical Teams",
        tag: "Delivery",
        description: "Frontend, backend, full-stack, product, QA, data, and project management support.",
        meta: "Managed matching",
      },
    ],
    capabilities: [
      "Freelancer sourcing",
      "Managed shortlists",
      "Contributor database",
      "Developer and PM support",
      "Language and country filters",
      "Private talent profiles",
    ],
  },
  products: {
    eyebrow: "Digital Products",
    title: "Ready-built websites, platforms, and software products.",
    description:
      "Browse ready-built websites and product concepts that can be customized for a buyer faster than a full custom build.",
    requestType: "product_enquiry",
    primaryCta: "Discuss a Product",
    secondaryCta: "Request Similar Website",
    canonical: "https://thebrandhelper.com/digital-products",
    image: productImg,
    cards: [
      {
        title: "Ready-Built Websites",
        tag: "Customize fast",
        description: "Industry-specific websites with layouts, core flows, and pages already prepared for customization.",
        meta: "Deposit options",
      },
      {
        title: "Business Platforms",
        tag: "Operations",
        description: "Booking, marketplace, portfolio, ecommerce, registration, and service platform concepts.",
        meta: "Demo available",
      },
      {
        title: "Software Concepts",
        tag: "Digital assets",
        description: "Useful product ideas and lightweight platforms that can be customized, licensed, or extended.",
        meta: "Enquiry first",
      },
    ],
    capabilities: [
      "Live demo and screenshots",
      "Customization after purchase",
      "50%, 75%, or full payment options",
      "Exclusive or multi-license sales",
      "Additional development quotes",
      "Product enquiry pipeline",
    ],
  },
};

const fieldClass = "w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-black transition bg-white";

function splitInput(value) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function Phase2Form({ config, mode }) {
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
    message: "",
  });
  const [status, setStatus] = useState("idle");

  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setStatus("sending");

    const payload = {
      ...form,
      request_type: config.requestType,
      project_type: form.project_type || config.eyebrow,
      languages: splitInput(form.languages),
      countries: splitInput(form.countries),
      skills: splitInput(form.skills),
      source_product: mode === "products" ? form.project_title : "",
      submitted_at: new Date().toISOString(),
      metadata: { page: mode },
    };

    try {
      await submitPhase2Request(payload);
      setStatus("sent");
      setForm((current) => ({ ...current, message: "" }));
    } catch (error) {
      console.warn("Phase 2 request:", error);
      setStatus("error");
    }
  };

  const productMode = mode === "products";
  const talentMode = mode === "talent";

  return (
    <form onSubmit={submit} className="bg-white border border-gray-100 rounded-lg p-5 md:p-7 shadow-sm">
      <div className="mb-6">
        <p className="text-red-600 text-xs font-bold uppercase tracking-widest mb-2">{config.primaryCta}</p>
        <h2 className="text-2xl md:text-3xl font-semibold">Tell us what you need</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input className={fieldClass} value={form.company} onChange={update("company")} placeholder="Company / organization" />
        <input className={fieldClass} value={form.contact_name} onChange={update("contact_name")} placeholder="Contact person" required />
        <input className={fieldClass} value={form.email} onChange={update("email")} placeholder="Work email" type="email" required />
        <input className={fieldClass} value={form.phone} onChange={update("phone")} placeholder="Phone" />
        <input className={fieldClass} value={form.whatsapp} onChange={update("whatsapp")} placeholder="WhatsApp" />
        <input className={fieldClass} value={form.country} onChange={update("country")} placeholder="Country" />
        <input className={fieldClass} value={form.website} onChange={update("website")} placeholder="Website" />
        <input className={fieldClass} value={form.timeline} onChange={update("timeline")} placeholder="Timeline" />
        <input className={fieldClass} value={form.project_title} onChange={update("project_title")} placeholder={productMode ? "Product or website type" : "Project title"} />
        <input className={fieldClass} value={form.project_type} onChange={update("project_type")} placeholder={talentMode ? "Role required" : "Project type"} />
        <input className={fieldClass} value={form.data_type} onChange={update("data_type")} placeholder="Data type / work type" />
        <input className={fieldClass} value={form.budget} onChange={update("budget")} placeholder="Budget range" />
        <input className={fieldClass} value={form.languages} onChange={update("languages")} placeholder="Languages, comma separated" />
        <input className={fieldClass} value={form.countries} onChange={update("countries")} placeholder="Countries / locales" />
        <input className={fieldClass} value={form.skills} onChange={update("skills")} placeholder="Required skills" />
        <input className={fieldClass} value={form.volume} onChange={update("volume")} placeholder={talentMode ? "Weekly hours / duration" : "Estimated volume"} />
        <input className={fieldClass} value={form.contributors} onChange={update("contributors")} placeholder="Number of contributors / people" />
        <input className={fieldClass} value={form.intended_use} onChange={update("intended_use")} placeholder="Intended use" />
      </div>

      <textarea
        className={`${fieldClass} mt-4 min-h-[130px] resize-y`}
        value={form.message}
        onChange={update("message")}
        placeholder="Describe the request, confidentiality needs, sample expectations, or anything we should know."
      />

      <div className="mt-5 flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          disabled={status === "sending"}
          className="bg-red-600 text-white px-6 py-3 rounded text-sm font-bold uppercase tracking-wide hover:bg-black transition disabled:opacity-60"
        >
          {status === "sending" ? "Sending..." : config.primaryCta}
        </button>
        <a
          href={WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-gray-200 text-black px-6 py-3 rounded text-sm font-bold text-center hover:border-black transition"
        >
          Talk on WhatsApp
        </a>
      </div>

      {status === "sent" && <p className="mt-4 text-sm text-green-700 font-semibold">Request received. We will follow up with the next step.</p>}
      {status === "error" && <p className="mt-4 text-sm text-red-600 font-semibold">Could not submit through the server. Please use WhatsApp while we check the connection.</p>}
    </form>
  );
}

export default function Phase2({ mode = "data" }) {
  const config = pageConfig[mode] || pageConfig.data;
  const [products, setProducts] = useState([]);
  const productType = {
    data: "dataset",
    products: "website",
    projects: "ai_service",
    talent: "ai_service",
  }[mode];

  useEffect(() => {
    let alive = true;
    getPhase2Products({ type: productType })
      .then((res) => {
        const items = res?.data || res;
        if (alive && Array.isArray(items)) setProducts(items);
      })
      .catch(() => {
        if (alive) setProducts([]);
      });
    return () => { alive = false; };
  }, [productType]);

  const cards = products.length > 0
    ? products.map((product) => ({
        title: product.title,
        tag: product.category || product.product_type,
        description: product.description,
        meta: product.status || product.price_label || "Request access",
      }))
    : config.cards;

  const pathways = useMemo(() => [
    { label: "AI Data", to: "/ai-data", active: mode === "data" },
    { label: "AI Projects", to: "/ai-projects", active: mode === "projects" },
    { label: "Talent", to: "/talent", active: mode === "talent" },
    { label: "Digital Products", to: "/digital-products", active: mode === "products" },
  ], [mode]);

  return (
    <div className="bg-white text-black overflow-x-hidden">
      <Helmet>
        <title>{config.eyebrow} | The BrandHelper</title>
        <meta name="description" content={config.description} />
        <link rel="canonical" href={config.canonical} />
      </Helmet>

      <section className="bg-black text-white px-6 py-16 md:py-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1.05fr_0.95fr] gap-10 md:gap-14 items-center">
          <div>
            <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-4">{config.eyebrow}</p>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">{config.title}</h1>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-2xl mb-8">{config.description}</p>
            <div className="flex flex-wrap gap-3">
              <a href="#request" className="bg-red-600 text-white px-7 py-3 rounded text-sm font-bold uppercase tracking-wide hover:bg-white hover:text-black transition">
                {config.primaryCta}
              </a>
              <a href="#capabilities" className="border border-white/30 text-white px-7 py-3 rounded text-sm font-bold uppercase tracking-wide hover:bg-white hover:text-black transition">
                {config.secondaryCta}
              </a>
            </div>
          </div>
          <div className="h-[300px] md:h-[470px] rounded-lg overflow-hidden border border-white/10">
            <img src={config.image} alt={config.eyebrow} className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <nav className="border-b border-gray-100 bg-white px-6">
        <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto py-3">
          {pathways.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`shrink-0 px-4 py-2 rounded text-sm font-bold ${item.active ? "bg-black text-white" : "text-gray-500 hover:bg-gray-100"}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <section id="capabilities" className="py-16 md:py-24 px-6 bg-[#F5F5F5]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <p className="text-red-600 text-xs font-bold uppercase tracking-widest mb-3">Phase 2 Capability</p>
            <h2 className="text-3xl md:text-4xl font-semibold">Built around data, people, and technology</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((card) => (
              <article key={card.title} className="bg-white rounded-lg border border-gray-100 p-6 shadow-sm">
                <div className="text-red-600 text-xs font-bold uppercase tracking-widest mb-4">{card.tag}</div>
                <h3 className="text-lg font-semibold mb-3">{card.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">{card.description}</p>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{card.meta}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[0.85fr_1.15fr] gap-10 md:gap-14 items-start">
          <div>
            <p className="text-red-600 text-xs font-bold uppercase tracking-widest mb-3">What We Can Handle</p>
            <h2 className="text-3xl md:text-4xl font-semibold mb-5">A practical partner for companies that need execution.</h2>
            <p className="text-gray-600 leading-relaxed mb-7">
              Phase 2 turns The BrandHelper into a managed platform for dataset access, AI project support, talent sourcing, and ready-built digital products.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {config.capabilities.map((item) => (
                <div key={item} className="border border-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div id="request">
            <Phase2Form config={config} mode={mode} />
          </div>
        </div>
      </section>

      <section className="py-16 bg-black text-white px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-3">Next Step</p>
            <h2 className="text-3xl md:text-4xl font-semibold mb-3">Need data, people, technology, or all three?</h2>
            <p className="text-gray-400 max-w-2xl">Send the request and we will help shape it into a clear scope, team, dataset, or product plan.</p>
          </div>
          <Link to="/contact" className="bg-white text-black px-7 py-3 rounded text-sm font-bold uppercase tracking-wide hover:bg-red-600 hover:text-white transition">
            General Contact
          </Link>
        </div>
      </section>
    </div>
  );
}
