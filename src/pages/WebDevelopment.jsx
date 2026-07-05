import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { submitLead } from "../utils/api";

import heroImg from "../photos/webdev-heropage.jpg";
import businessWebsiteImg from "../photos/Business Websites.avif";
import ecommerceImg from "../photos/E-commerce Websites-web-page.jpg";
import bookingImg from "../photos/Booking and Service Business Platform.jpg";
import dashboardImg from "../photos/Custom Web Applications.svg";
import registrationImg from "../photos/Registration Systems-.jpg";
import customWebImg from "../photos/Custom Web Applications.png";
import requestImg from "../photos/Tell us what you want to build.jpg";

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

  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setStatus("sending");
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
      setStatus("error");
    }
  };

  return (
    <div className="bg-white text-black">
      <Helmet>
        <title>Web Development | The BrandHelper</title>
        <meta name="description" content="Professional websites, e-commerce websites, booking platforms, registration systems, dashboards, and custom web applications built by The BrandHelper." />
        <link rel="canonical" href="https://thebrandhelper.com/web-development" />
      </Helmet>

      <section className="bg-black px-6 py-16 text-white md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-red-500">Web Development</p>
            <h1 className="mb-6 text-4xl font-extrabold leading-tight md:text-6xl">
              Professional websites and web platforms built for your business.
            </h1>
            <p className="mb-8 max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">
              We build business websites, online stores, booking systems, dashboards, registration portals, and custom web applications that look professional and help your business work better.
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
            <img src={heroImg} alt="Website development workspace" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-red-600">What We Build</p>
            <h2 className="mb-4 text-3xl font-semibold md:text-4xl">Websites and systems for real business use.</h2>
            <p className="text-gray-600">Choose a normal website, a ready-to-customize product, or a custom platform built around your workflow.</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {buildCards.map((card) => (
              <article key={card.title} className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
                <div className="h-44 bg-gray-50">
                  <img src={card.image} alt={card.title} className="h-full w-full object-contain p-3" />
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
              <img src={requestImg} alt="Website requirements and support forms" className="h-56 w-full object-cover" />
            </div>
          </div>

          <form onSubmit={submit} className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm md:p-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <input className={inputClass} value={form.name} onChange={set("name")} placeholder="Name" required />
              <input className={inputClass} value={form.business} onChange={set("business")} placeholder="Brand / business name" />
              <input className={inputClass} value={form.email} onChange={set("email")} placeholder="Email" type="email" required />
              <input className={inputClass} value={form.phone} onChange={set("phone")} placeholder="WhatsApp / phone" />
              <input className={inputClass} value={form.location} onChange={set("location")} placeholder="Country / location" />
              <select className={inputClass} value={form.website_type} onChange={set("website_type")}>
                <option value="">Type of website needed</option>
                {websiteTypes.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
              <input className={inputClass} value={form.budget} onChange={set("budget")} placeholder="Budget range" />
              <input className={inputClass} value={form.timeline} onChange={set("timeline")} placeholder="Timeline" />
              <input className={inputClass} value={form.meeting_date} onChange={set("meeting_date")} placeholder="Preferred meeting date" />
            </div>
            <textarea className={`${inputClass} mt-4 min-h-[130px] resize-y`} value={form.description} onChange={set("description")} placeholder="Tell us what the website should do, pages needed, examples you like, and anything important." />
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button disabled={status === "sending"} className="rounded bg-red-600 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-black disabled:opacity-60">
                {status === "sending" ? "Sending..." : "Submit Website Request"}
              </button>
              <Link to="/contact/calc" className="rounded border border-gray-200 px-6 py-3 text-center text-sm font-bold text-black transition hover:border-black">
                Use Pricing Calculator
              </Link>
            </div>
            {status === "sent" && <p className="mt-4 text-sm font-semibold text-green-700">Request received. We will follow up with you.</p>}
            {status === "error" && <p className="mt-4 text-sm font-semibold text-red-600">Could not submit through the server. Please use WhatsApp while we check it.</p>}
          </form>
        </div>
      </section>
    </div>
  );
}
