import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

// ── All images from your existing src/photos/ folder ──────────────────────
// These are confirmed present in your codebase — no training photos used
import websiteDesignImg  from "../photos/responsivewebdesign-1.png";
import websiteManageImg  from "../photos/website-page-inner-hero-img-1.webp";
import businessEmailImg  from "../photos/custom-domain-email-mailbox-1.jpg";
import adsManagementImg  from "../photos/Facebook-Ads.webp";
import brandStrategyImg  from "../photos/how-to-run-multiple-ad-campaigns-on-facebook-rd5rn3hdqt26ovpxwhalq8rtc9ddf1lrxx09wum2ng.png";
import consultingImg     from "../photos/consult.jpg";
// Hero background — branding photo, professional and relevant
import heroImg           from "../photos/branding-hero.jpeg";

const WHATSAPP = "https://wa.me/233501657205";
const EMAIL    = "mailto:davida@thebrandhelper.com";
const CALENDLY = "https://calendly.com/blackbird77ad/free-consultation";

const coreServices = [
  {
    name: "Website Design & Development",
    image: websiteDesignImg,
    badge: "Most Popular",
    description:
      "Modern, responsive websites built to convert — from simple 6-page brochure sites to full platforms with user accounts, payments, and custom dashboards.",
    points: ["Mobile-first & fast", "SEO optimised", "Domain & hosting included", "Payment & booking integrations"],
  },
  {
    name: "Website Management",
    image: websiteManageImg,
    badge: null,
    description:
      "We maintain, update, and optimise your website so it stays fast, secure, and always current. You never have to touch it.",
    points: ["Regular updates", "Security monitoring", "Performance optimisation", "Content changes"],
  },
  {
    name: "Business Email Setup",
    image: businessEmailImg,
    badge: null,
    description:
      "Professional custom-domain email (you@yourbusiness.com) that builds instant trust and credibility with every client you contact.",
    points: ["Custom domain email", "Professional appearance", "Setup & configuration", "Team accounts available"],
  },
  {
    name: "Ads Management",
    image: adsManagementImg,
    badge: null,
    description:
      "End-to-end Facebook, Instagram, and Google ad campaign management — strategy, creative, targeting, and reporting done for you.",
    points: ["Facebook & Instagram ads", "Google Ads", "Creative & copywriting", "Weekly reporting"],
  },
  {
    name: "Brand Strategy",
    image: brandStrategyImg,
    badge: null,
    description:
      "Clear positioning, messaging, and visual identity that makes your brand stand out, stay memorable, and attract the right clients.",
    points: ["Brand positioning", "Logo & identity", "Messaging & tone", "Competitor analysis"],
  },
  {
    name: "Consulting & Coaching",
    image: consultingImg,
    badge: null,
    description:
      "Personalised digital strategy sessions to help you structure your business, set priorities, and make decisions that actually move the needle.",
    points: ["1-on-1 sessions", "Digital strategy", "Growth roadmap", "Ongoing support"],
  },
];

const supportServices = [
  {
    emoji: "🤖",
    name: "AI Tools & Automation",
    description: "We identify and integrate the right AI tools into your business workflow — saving time, reducing manual work, and improving output quality.",
  },
  {
    emoji: "✍️",
    name: "Technical Writing",
    description: "SOPs, product descriptions, user documentation, and business guides — clear, professional, and ready to use.",
  },
  {
    emoji: "🌍",
    name: "Translation & Transcription",
    description: "Accurate translation and transcription services for businesses working across languages, markets, and content formats.",
  },
  {
    emoji: "📞",
    name: "Customer Support Setup",
    description: "We help you design and implement a professional customer support system — scripts, channels, tools, and workflows.",
  },
  {
    emoji: "📋",
    name: "Project & Technical Support",
    description: "A reliable technical partner for project managers and business owners who need execution support — not just advice.",
  },
];

export default function Services() {
  return (
    <div className="bg-white text-black overflow-x-hidden">
      <Helmet>
        <title>Services | The BrandHelper — Website Design, Ads, Brand Strategy</title>
        <meta name="description" content="Website design and development, ads management, brand strategy, business email setup, website management, and consulting. Transparent pricing, real results." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://thebrandhelper.com/services" />
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content="https://thebrandhelper.com/services" />
        <meta property="og:title"       content="Services | The BrandHelper — Website Design, Ads, Brand Strategy" />
        <meta property="og:description" content="Professional digital services: website design, Facebook and Google ads, brand strategy, business email, and more. Starting from $150." />
        <meta property="og:image"       content="https://thebrandhelper.com/images/og-image.jpg" />
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content="Services | The BrandHelper" />
        <meta name="twitter:description" content="Website design, ads management, brand strategy and more. Transparent pricing, real results." />
        <meta name="twitter:image"       content="https://thebrandhelper.com/images/og-image.jpg" />
      </Helmet>

      {/* ── HERO ── */}
      <section className="bg-black text-white py-20 md:py-28 px-6 relative overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <img src={heroImg} alt="" className="w-full h-full object-cover object-center opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
          <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-4">What We Do</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight max-w-3xl">
            Services That Grow<br />
            <span className="text-red-600">Real Businesses</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
            Done-for-you digital solutions for serious founders who want structure, visibility, and real results — not theory.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/contact/requirements"
              className="bg-red-600 text-white px-7 py-3 text-sm font-bold uppercase tracking-wide hover:opacity-90 transition rounded">
              Start a Project
            </Link>
            <Link to="/contact/calc"
              className="border border-white/40 text-white px-7 py-3 text-sm font-bold uppercase tracking-wide hover:bg-white hover:text-black transition rounded">
              Get a Quote
            </Link>
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 border border-white/20 text-white/70 px-7 py-3 text-sm font-bold hover:text-white hover:border-white/50 transition rounded">
              📅 Free Consultation
            </a>
          </div>
        </div>
      </section>

      {/* ── CORE SERVICES GRID ── */}
      <section className="py-16 md:py-24 px-6 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 md:mb-16">
            <p className="text-red-600 text-xs font-bold uppercase tracking-widest mb-3">Core Services</p>
            <h2 className="text-3xl md:text-4xl font-semibold mb-3">Web, Brand & Digital</h2>
            <p className="text-gray-500 max-w-xl text-base md:text-lg">
              Our primary services — this is where we go deepest and deliver the most value.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {coreServices.map((service, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition duration-300 flex flex-col overflow-hidden group"
              >
                {/* Image */}
                <div className="h-48 bg-gray-100 overflow-hidden relative">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
                  />
                  {service.badge && (
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                      {service.badge}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold mb-3 group-hover:text-red-600 transition">{service.name}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5 flex-grow">{service.description}</p>

                  {/* Feature points */}
                  <ul className="flex flex-col gap-1.5 mb-6">
                    {service.points.map(point => (
                      <li key={point} className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="text-red-500 font-bold shrink-0">✓</span>{point}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={`/contact?source=${encodeURIComponent(service.name)}`}
                    className="inline-block bg-black text-white px-5 py-3 text-xs font-bold uppercase tracking-wide hover:bg-red-600 transition text-center rounded"
                  >
                    Get Started →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING NUDGE ── */}
      <section className="py-12 bg-black text-white px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="text-xl md:text-2xl font-bold mb-2">Not sure how much your website will cost?</h3>
            <p className="text-gray-400 text-sm max-w-xl">Use our instant pricing calculator — answer 5 simple questions, no tech knowledge needed. Takes 2 minutes.</p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center shrink-0">
            <Link to="/contact/calc"
              className="bg-red-600 text-white px-7 py-3 text-sm font-bold uppercase tracking-wide hover:opacity-90 transition rounded whitespace-nowrap">
              💰 Get an Instant Quote
            </Link>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
              className="bg-green-500 text-white px-7 py-3 text-sm font-bold uppercase tracking-wide hover:bg-green-600 transition rounded whitespace-nowrap">
              💬 Ask on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── SUPPORTING SERVICES ── */}
      <section className="py-16 md:py-24 px-6 bg-[#0a0a0a] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-3">Also Available</p>
            <h2 className="text-3xl md:text-4xl font-semibold mb-3">Supporting Business Services</h2>
            <p className="text-gray-400 max-w-xl text-sm md:text-base">
              Beyond the website and brand — operational and technical support that keeps your business running smoothly and professionally.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportServices.map((service, i) => (
              <div
                key={i}
                className="border border-white/10 p-7 rounded-xl hover:border-red-600 transition flex flex-col gap-4 group"
              >
                <div className="text-3xl">{service.emoji}</div>
                <div>
                  <h3 className="text-base font-semibold mb-2 group-hover:text-red-400 transition">{service.name}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
                </div>
                <Link
                  to={`/contact?source=${encodeURIComponent(service.name)}`}
                  className="mt-auto text-xs font-bold uppercase tracking-widest text-red-500 hover:text-white transition"
                >
                  Enquire →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW PAYMENT WORKS ── */}
      <section className="py-16 md:py-20 bg-white px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10 text-center">
            <p className="text-red-600 text-xs font-bold uppercase tracking-widest mb-3">No Surprises</p>
            <h2 className="text-3xl md:text-4xl font-semibold mb-3">How payment works</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Simple, transparent, and flexible. No Payoneer account needed on your end.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { num: "01", title: "30% deposit to start",       desc: "Sent via Payoneer invoice. You pay by bank transfer, card, or mobile money — no Payoneer account needed." },
              { num: "02", title: "We build & show you",        desc: "Midway progress check included at no extra charge. You see it before we finish." },
              { num: "03", title: "Balance on completion",      desc: "Final payment only after you review and approve the completed work. No approval, no final payment." },
            ].map(({ num, title, desc }) => (
              <div key={num} className="bg-[#F5F5F5] p-7 rounded-xl text-center">
                <div className="text-red-600 text-2xl font-extrabold mb-3">{num}</div>
                <h3 className="text-base font-semibold mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 md:py-20 bg-[#F5F5F5] px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold mb-5">
            Not sure which service you need?
          </h2>
          <p className="text-gray-600 text-base md:text-lg mb-10 max-w-xl mx-auto">
            Fill in the brief and we'll tell you exactly what makes sense for your business — no pressure, no commitment.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <Link to="/contact/requirements"
              className="bg-red-600 text-white px-8 py-3.5 text-sm font-bold uppercase tracking-wide hover:opacity-90 transition rounded">
              Fill the Brief →
            </Link>
            <Link to="/contact/calc"
              className="border-2 border-black text-black px-8 py-3.5 text-sm font-bold uppercase tracking-wide hover:bg-black hover:text-white transition rounded">
              Get an Instant Quote
            </Link>
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer"
              className="border-2 border-gray-300 text-gray-600 px-8 py-3.5 text-sm font-bold uppercase tracking-wide hover:border-black hover:text-black transition rounded">
              📅 Book a Free Call
            </a>
          </div>
          {/* Direct contact */}
          <div className="flex flex-wrap gap-5 justify-center text-sm text-gray-500">
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-green-600 transition">
              💬 +233 50 165 7205
            </a>
            <span className="text-gray-300">·</span>
            <a href={EMAIL} className="flex items-center gap-2 hover:text-black transition">
              📧 davida@thebrandhelper.com
            </a>
            <span className="text-gray-300">·</span>
            <a href="tel:+233548894600" className="flex items-center gap-2 hover:text-black transition">
              📞 +233 54 889 4600
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}