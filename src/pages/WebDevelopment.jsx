import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { submitLead } from "../utils/api";
import ApiIssueReport from "../components/ApiIssueReport";

import heroImg from "../photos/webdev-heropage.jpg";
import businessWebsiteImg from "../photos/Business Websites.avif";
import ecommerceImg from "../photos/E-commerce Websites-web-page.jpg";
import bookingImg from "../photos/Booking and Service Business Platform.jpg";
import dashboardImg from "../photos/Custom Web Applications.svg";
import registrationImg from "../photos/Registration Systems-.jpg";
import customWebImg from "../photos/Custom Web Applications.png";
import requestImg from "../photos/Tell us what you want to build.jpg";

const WHATSAPP = "https://wa.me/233501657205";
const PHONE = "+233 50 165 7205";
const EMAIL = "davida@thebrandhelper.com";

const websiteTypes = [
  "Business websites",
  "E-commerce websites",
  "Landing pages",
  "Booking systems",
  "Registration portals",
  "Admin dashboards",
  "Custom platforms",
  "Portfolio websites",
];

const buildCards = [
  {
    title: "Business Websites",
    text: "Clean websites for companies that need credibility, service pages, contact capture, and a strong first impression.",
    image: businessWebsiteImg,
  },
  {
    title: "E-commerce Websites",
    text: "Online stores with product pages, payment direction, catalogue structure, and conversion-focused layouts.",
    image: ecommerceImg,
  },
  {
    title: "Booking Platforms",
    text: "Appointment, reservation, and service booking flows for salons, hotels, clinics, restaurants, and service businesses.",
    image: bookingImg,
  },
  {
    title: "Admin Dashboards",
    text: "Private dashboards for managing orders, leads, content, users, products, requests, or internal business operations.",
    image: dashboardImg,
  },
  {
    title: "Registration Systems",
    text: "Forms, records, approvals, and participant management for events, schools, programs, and business workflows.",
    image: registrationImg,
  },
  {
    title: "Custom Web Applications",
    text: "Tailored web systems when your business needs more than a normal website or template.",
    image: customWebImg,
  },
];

const processSteps = [
  "Discovery call",
  "Requirement gathering",
  "Design direction",
  "Development",
  "Review and revisions",
  "Final payment",
  "Launch and handover",
];

const webDevFaqs = [
  {
    question: "What kind of website can The BrandHelper build for my business?",
    answer: "We build business websites, e-commerce websites, landing pages, booking systems, registration portals, admin dashboards, portfolio websites, and custom web platforms."
  },
  {
    question: "Can you help if I only have an idea and no technical brief?",
    answer: "Yes. You can explain the business in normal words. We help turn the idea into pages, features, content needs, timelines, and a clear build plan."
  },
  {
    question: "Will the website work on phones?",
    answer: "Yes. Every website is built to work on mobile, tablet, laptop, and desktop screens because many clients will visit from their phone first."
  },
  {
    question: "Can I see previous work before starting?",
    answer: "Yes. The portfolio page shows website and digital projects so you can understand the quality and decide what you want for your own business."
  }
];

const webDevelopmentSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://thebrandhelper.com/web-development#service",
      "name": "Web Development and Website Design",
      "serviceType": "Web Development",
      "provider": { "@id": "https://thebrandhelper.com/#organization" },
      "areaServed": ["Ghana", "United States", "United Kingdom", "Worldwide"],
      "description": "Professional business websites, e-commerce websites, booking platforms, admin dashboards, registration systems, and custom web applications built by The BrandHelper.",
      "offers": {
        "@type": "Offer",
        "url": "https://thebrandhelper.com/web-development",
        "availability": "https://schema.org/InStock"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://thebrandhelper.com/web-development#faq",
      "mainEntity": webDevFaqs.map((item) => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://thebrandhelper.com/web-development#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://thebrandhelper.com/" },
        { "@type": "ListItem", "position": 2, "name": "Web Development", "item": "https://thebrandhelper.com/web-development" }
      ]
    }
  ]
};

const initialForm = {
  name: "",
  business: "",
  email: "",
  phone: "",
  location: "",
  website_type: "",
  budget: "",
  timeline: "",
  meeting_date: "",
  description: "",
};

const inputClass = "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-black";

export default function WebDevelopment() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [requestIssue, setRequestIssue] = useState(null);

  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const buildRequestText = () => [
    "Website request - The BrandHelper",
    "",
    `Name: ${form.name}`,
    `Business: ${form.business}`,
    `Email: ${form.email}`,
    `Phone: ${form.phone}`,
    `Location: ${form.location}`,
    `Website type: ${form.website_type || "Web Development"}`,
    `Budget: ${form.budget}`,
    `Timeline: ${form.timeline}`,
    `Preferred meeting date: ${form.meeting_date}`,
    "",
    "Message:",
    form.description,
  ].join("\n");

  const submit = async (event) => {
    event.preventDefault();
    setStatus("sending");
    setRequestIssue(null);
    try {
      await submitLead({
        form_type: "Web Development Request",
        client_name: form.name,
        business_name: form.business,
        email: form.email,
        phone: form.phone,
        location: form.location,
        service: form.website_type || "Web Development",
        budget: form.budget,
        timeline: form.timeline,
        message: form.description,
        full_brief: JSON.stringify({
          preferred_meeting_date: form.meeting_date,
          website_type: form.website_type,
          description: form.description,
        }, null, 2),
        submitted_at: new Date().toISOString(),
      });
      setStatus("sent");
      setForm(initialForm);
    } catch (error) {
      console.warn("Web development request:", error);
      setRequestIssue(error);
      setStatus("error");
    }
  };

  return (
    <div className="bg-white text-black">
      <Helmet>
        <title>Web Development in Ghana | Business Websites and Web Platforms</title>
        <meta name="description" content="Need a professional website that makes clients trust your business? The BrandHelper builds business websites, e-commerce sites, booking systems, dashboards, and custom web platforms." />
        <link rel="canonical" href="https://thebrandhelper.com/web-development" />
        <meta property="og:title" content="Web Development in Ghana | The BrandHelper" />
        <meta property="og:description" content="Professional websites and web platforms for businesses that need trust, leads, orders, bookings, and clean execution." />
        <meta property="og:image" content="https://thebrandhelper.com/logo-tbh-wordmark.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Web Development in Ghana | The BrandHelper" />
        <meta name="twitter:description" content="Business websites, e-commerce sites, booking systems, dashboards, and custom web platforms." />
        <meta name="twitter:image" content="https://thebrandhelper.com/logo-tbh-wordmark.png" />
        <script type="application/ld+json">{JSON.stringify(webDevelopmentSchema)}</script>
      </Helmet>

      <section className="bg-black px-6 py-16 text-white md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-red-500">Web Development</p>
            <h1 className="mb-6 text-4xl font-extrabold leading-tight md:text-6xl">
              A professional website that makes people trust your business before they call.
            </h1>
            <p className="mb-8 max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">
              If your business looks unclear online, clients hesitate. We build business websites, online stores, booking systems, dashboards, registration portals, and custom web applications that explain your offer clearly and help your business work better.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#request" className="rounded bg-red-600 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white hover:text-black">
                Request a Quote
              </a>
              <Link to="/digital-products" className="rounded border border-white/30 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white hover:text-black">
                View Website Products
              </Link>
              <Link to="/portfolio" className="rounded border border-white/30 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white hover:text-black">
                See Portfolio
              </Link>
            </div>
          </div>
          <div className="h-[320px] overflow-hidden rounded-lg border border-white/10 md:h-[500px]">
            <img src={heroImg} alt="Website development workspace" className="h-full w-full object-cover" decoding="async" fetchPriority="high" />
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-red-600">What We Build</p>
            <h2 className="mb-4 text-3xl font-semibold md:text-4xl">Websites and systems for real business use.</h2>
            <p className="text-gray-600">Choose a normal website, a ready-to-customize product, or a custom platform built around how your clients buy, book, register, or contact you.</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {buildCards.map((card) => (
              <article key={card.title} className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
                <div className="h-44 bg-gray-50">
                  <img src={card.image} alt={card.title} className="h-full w-full object-contain p-3" loading="lazy" decoding="async" />
                </div>
                <div className="p-5">
                  <h3 className="mb-2 text-lg font-semibold">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{card.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F5F5F5] px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-red-600">Website Questions</p>
            <h2 className="text-3xl font-semibold md:text-4xl">Clear answers before you request a quote.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {webDevFaqs.map((item) => (
              <article key={item.question} className="rounded-lg border border-gray-100 bg-white p-5">
                <h3 className="text-base font-semibold">{item.question}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F5F5F5] px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-end">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-red-600">Development Process</p>
              <h2 className="text-3xl font-semibold md:text-4xl">Clear steps from first call to launch.</h2>
            </div>
            <p className="text-sm leading-relaxed text-gray-600">
              You always know what stage the project is in, what we need from you, and what happens next.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
            {processSteps.map((step, index) => (
              <div key={step} className="rounded-lg border border-gray-100 bg-white p-4">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded bg-black text-xs font-bold text-white">{index + 1}</div>
                <p className="text-sm font-semibold">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="request" className="bg-white px-6 py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-red-600">Request Website</p>
            <h2 className="mb-5 text-3xl font-semibold md:text-4xl">Tell us what you want to build.</h2>
            <p className="mb-6 leading-relaxed text-gray-600">
              You do not need technical knowledge. Share the basics and we will help you shape the right website, product, or platform.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {websiteTypes.map((type) => (
                <div key={type} className="rounded border border-gray-100 bg-[#F8F8F8] px-3 py-2 text-xs font-semibold text-gray-600">{type}</div>
              ))}
            </div>
            <div className="mt-6 overflow-hidden rounded-lg bg-gray-100">
              <img src={requestImg} alt="Website requirements and support forms" className="h-56 w-full object-cover" loading="lazy" decoding="async" />
            </div>
          </div>

          <form onSubmit={submit} className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm md:p-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <input className={inputClass} value={form.name} onChange={set("name")} placeholder="Name" aria-label="Name" autoComplete="name" required />
              <input className={inputClass} value={form.business} onChange={set("business")} placeholder="Brand / business name" aria-label="Brand or business name" autoComplete="organization" />
              <input className={inputClass} value={form.email} onChange={set("email")} placeholder="Email" aria-label="Email" type="email" autoComplete="email" required />
              <input className={inputClass} value={form.phone} onChange={set("phone")} placeholder="WhatsApp / phone" aria-label="WhatsApp or phone number" autoComplete="tel" />
              <input className={inputClass} value={form.location} onChange={set("location")} placeholder="Country / location" aria-label="Country or location" autoComplete="country-name" />
              <select className={inputClass} value={form.website_type} onChange={set("website_type")} aria-label="Type of website needed">
                <option value="">Type of website needed</option>
                {websiteTypes.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
              <input className={inputClass} value={form.budget} onChange={set("budget")} placeholder="Budget range" aria-label="Budget range" />
              <input className={inputClass} value={form.timeline} onChange={set("timeline")} placeholder="Timeline" aria-label="Timeline" />
              <input className={inputClass} value={form.meeting_date} onChange={set("meeting_date")} placeholder="Preferred meeting date" aria-label="Preferred meeting date" />
            </div>
            <textarea className={`${inputClass} mt-4 min-h-[130px] resize-y`} value={form.description} onChange={set("description")} placeholder="Tell us what the website should do, pages needed, examples you like, and anything important." aria-label="Website project description" />
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button type="submit" disabled={status === "sending"} className="rounded bg-red-600 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-black disabled:opacity-60">
                {status === "sending" ? "Sending..." : "Submit Website Request"}
              </button>
              <Link to="/contact/calc" className="rounded border border-gray-200 px-6 py-3 text-center text-sm font-bold text-black transition hover:border-black">
                Use Pricing Calculator
              </Link>
            </div>
            {status === "sent" && <p className="mt-4 text-sm font-semibold text-green-700" role="status" aria-live="polite">Request received. We will follow up with you.</p>}
            {status === "error" && (
              <ApiIssueReport error={requestIssue} context="Website development request" payloadText={buildRequestText()} className="mt-4" />
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
