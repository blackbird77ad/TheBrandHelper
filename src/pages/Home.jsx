import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import heroImg       from "../photos/branding-hero.jpeg";
import servicesImg   from "../photos/Facebook-Ads.webp";
import consultingImg from "../photos/consult.jpg";
import websiteImg    from "../photos/website-page-inner-hero-img-1.webp";

const WHATSAPP = "https://wa.me/233501657205";
const EMAIL    = "mailto:davida@thebrandhelper.com";
const CALENDLY = "https://calendly.com/blackbird77ad/free-consultation";

const coreServices = [
  { num: "01", title: "Website Design & Development", desc: "Modern, responsive websites built to convert — from clean 6-page sites to full platforms with payments, accounts, and dashboards." },
  { num: "02", title: "Ads Management",               desc: "Facebook, Instagram, and Google campaigns managed end-to-end. Strategy, creative, targeting, and reporting — done for you." },
  { num: "03", title: "Brand Strategy",               desc: "Positioning, messaging, and identity that makes your brand stand out and stay memorable in a crowded market." },
  { num: "04", title: "Website Management",           desc: "We maintain, update, and optimise your site so it stays fast, secure, and always current." },
  { num: "05", title: "Business Email Setup",         desc: "Custom-domain professional email (you@yourbusiness.com) that builds instant trust with every client." },
  { num: "06", title: "Consulting & Coaching",        desc: "Personalised digital strategy sessions to help you structure your business and scale with clarity." },
];

const supportServices = [
  { emoji: "🤖", title: "AI Tools & Automation",        desc: "Right AI tools integrated into your workflow — saving time and cutting manual work." },
  { emoji: "✍️", title: "Technical Writing",             desc: "SOPs, documentation, product descriptions, and guides — clear and professional." },
  { emoji: "🌍", title: "Translation & Transcription",  desc: "Accurate translation and transcription for businesses working across languages." },
  { emoji: "📞", title: "Customer Support Setup",       desc: "Scripts, channels, and tools to build a professional customer support system." },
  { emoji: "📋", title: "Project & Technical Support",  desc: "Reliable technical partner for project managers who need execution, not just advice." },
];

function getProjects() {
  try {
    const stored = localStorage.getItem("tbh_projects");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed.slice(0, 3);
    }
  } catch (_) {}
  return [];
}

// ── Reusable contact strip used between sections ──────────────
function ContactStrip({ light = false }) {
  return (
    <div className={`flex flex-wrap gap-3 justify-center ${light ? "opacity-80" : ""}`}>
      <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-green-600 transition">
        💬 WhatsApp Us
      </a>
      <a href={EMAIL}
        className="flex items-center gap-2 bg-white/10 border border-white/20 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-white/20 transition">
        📧 Email Us
      </a>
      <a href={CALENDLY} target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-2 border border-white/20 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-white/10 transition">
        📅 Book a Free Call
      </a>
    </div>
  );
}

export default function Home() {
  const featuredProjects = getProjects();

  return (
    <div className="bg-white text-black overflow-x-hidden">
      <Helmet>
        <title>The Brand Helper | Web Agency — Websites, Ads & Brand Strategy</title>
        <meta name="description" content="The Brand Helper is a digital web agency offering website design, ads management, brand strategy, and business support services." />
      </Helmet>

      {/* ══════════════════════════════════════════════
          1. HERO — first impression, two CTAs
      ══════════════════════════════════════════════ */}
      <section className="min-h-screen flex items-center bg-black text-white px-6">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center gap-10 py-16 md:py-0">

          <div className="md:w-1/2 text-center md:text-left">
            <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-5">
              Web Agency · Brand · Digital
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              Your Business Deserves<br />
              <span className="text-red-600">A Proper Online Presence.</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-xl mb-8 leading-relaxed">
              We design websites, run ads, and build brand strategies for businesses ready to grow — properly and professionally.
            </p>

            {/* Primary CTAs */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-8">
              <Link to="/contact/requirements"
                className="bg-red-600 text-white px-7 py-3.5 text-sm font-bold uppercase tracking-wide hover:opacity-90 transition rounded">
                Fill the Brief — It's Free
              </Link>
              <Link to="/services"
                className="border border-white/40 text-white px-7 py-3.5 text-sm font-bold uppercase tracking-wide hover:bg-white hover:text-black transition rounded">
                View Services
              </Link>
            </div>

            {/* Quick contact links */}
            <div className="flex flex-wrap gap-4 justify-center md:justify-start text-xs text-gray-400">
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-green-400 transition">
                <span className="text-green-400">💬</span> +233 50 165 7205
              </a>
              <a href={EMAIL} className="flex items-center gap-1.5 hover:text-white transition">
                <span>📧</span> davida@thebrandhelper.com
              </a>
            </div>
          </div>

          <div className="md:w-1/2 w-full h-[280px] sm:h-[380px] md:h-[540px] rounded-xl overflow-hidden shadow-2xl">
            <img src={heroImg} alt="The Brand Helper Agency" className="w-full h-full object-cover object-center" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          2. LABEL STRIP — what we do at a glance
      ══════════════════════════════════════════════ */}
      <div className="bg-red-600 py-4 px-6 overflow-x-auto">
        <div className="max-w-6xl mx-auto flex flex-nowrap md:flex-wrap gap-x-8 gap-y-2 justify-start md:justify-between items-center min-w-max md:min-w-0">
          {["Website Design", "Ads Management", "Brand Strategy", "Business Email", "Website Management", "Consulting", "AI Tools", "Translation"].map(label => (
            <span key={label} className="text-white text-xs font-bold uppercase tracking-widest whitespace-nowrap opacity-90">
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          3. CORE SERVICES — what we primarily do
          Tour guide: "here's what we offer, go deeper →"
      ══════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-[#F5F5F5]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12 md:mb-16">
            <p className="text-red-600 text-xs font-bold uppercase tracking-widest mb-3">Core Services</p>
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">Digital services that drive real results</h2>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl">
              Done-for-you solutions for founders and business owners who want visibility, credibility, and sustainable growth online.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {coreServices.map(({ num, title, desc }) => (
              <div key={num} className="bg-white p-7 rounded-xl shadow-sm hover:shadow-lg transition group cursor-default">
                <div className="text-red-600 text-xs font-bold uppercase tracking-widest mb-4">{num}</div>
                <h3 className="text-base font-semibold mb-3 group-hover:text-red-600 transition">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Tour guide CTA: go to full services page */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link to="/services"
              className="bg-black text-white px-8 py-3.5 text-sm font-bold uppercase tracking-wide hover:bg-red-600 transition rounded">
              See Full Services & Pricing →
            </Link>
            <Link to="/contact/requirements"
              className="border-2 border-black text-black px-8 py-3.5 text-sm font-bold uppercase tracking-wide hover:bg-black hover:text-white transition rounded">
              Start a Project
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          4. WEBSITE FEATURE SPLIT
          Tour guide: "this is our core — learn more"
      ══════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-black text-white px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16">
          <div className="w-full md:w-1/2 h-[260px] sm:h-[340px] md:h-[420px] rounded-xl overflow-hidden order-2 md:order-1">
            <img src={websiteImg} alt="Website Design" className="w-full h-full object-cover object-center" />
          </div>
          <div className="md:w-1/2 order-1 md:order-2">
            <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-4">Websites That Work</p>
            <h2 className="text-3xl md:text-4xl font-semibold mb-5">Not just a website. A business asset.</h2>
            <p className="text-gray-300 text-base md:text-lg mb-7 leading-relaxed">
              We build websites that are fast, mobile-first, and designed to convert visitors into clients. From a clean starter site to a full platform with payments and user accounts.
            </p>
            <div className="flex flex-col gap-2.5 mb-8">
              {["Mobile-first responsive design", "Built for speed and SEO", "Payment and booking integrations", "Admin dashboards and user accounts", "Domain, hosting, and email included"].map(point => (
                <div key={point} className="flex items-center gap-3 text-sm text-gray-300">
                  <span className="text-red-500 font-bold shrink-0">✓</span>{point}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/contact/calc"
                className="bg-red-600 text-white px-6 py-3 text-sm font-bold uppercase tracking-wide hover:opacity-90 transition rounded">
                Get a Website Quote
              </Link>
              <Link to="/portfolio"
                className="border border-white/30 text-white px-6 py-3 text-sm font-bold uppercase tracking-wide hover:bg-white/10 transition rounded">
                See Our Work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          5. ADS SPLIT
          Tour guide: "another key service — see more"
      ══════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16">
          <div className="md:w-1/2">
            <p className="text-red-600 text-xs font-bold uppercase tracking-widest mb-4">Ads That Convert</p>
            <h2 className="text-3xl md:text-4xl font-semibold mb-5">Stop wasting ad budget.<br />Start getting clients.</h2>
            <p className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed">
              Most ad spend is wasted on the wrong audience, wrong creative, or no strategy. We manage your Facebook, Instagram, and Google campaigns end-to-end — from strategy to reporting.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/services"
                className="bg-black text-white px-6 py-3 text-sm font-bold uppercase tracking-wide hover:bg-red-600 transition rounded">
                See How We Run Ads
              </Link>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 border-2 border-gray-200 text-black px-6 py-3 text-sm font-bold hover:border-black transition rounded">
                💬 Ask on WhatsApp
              </a>
            </div>
          </div>
          <div className="w-full md:w-1/2 h-[260px] sm:h-[320px] md:h-[380px] rounded-xl overflow-hidden">
            <img src={servicesImg} alt="Ads Management" className="w-full h-full object-cover object-center" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          6. HOW IT WORKS
          Tour guide: "now you understand us — here's the process"
      ══════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-[#F5F5F5]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12 md:mb-16 text-center">
            <p className="text-red-600 text-xs font-bold uppercase tracking-widest mb-3">Our Process</p>
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">Simple. Transparent. Structured.</h2>
            <p className="text-gray-500 max-w-xl mx-auto">No confusion, no hidden steps. Here's exactly how we work with every client from start to finish.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { num: "01", title: "Fill the Brief",      desc: "Tell us about your business and what you need. Our form takes 5 minutes and covers everything.", link: "/contact/requirements", cta: "Start here →" },
              { num: "02", title: "Free Consultation",   desc: "We review your brief and get on a free call to align on scope, timeline, and exact pricing.", link: CALENDLY, external: true, cta: "Book a call →" },
              { num: "03", title: "We Build & Deliver",  desc: "You sit back. We execute — with a midway progress check to make sure you're happy.", link: null, cta: null },
              { num: "04", title: "You Go Live",         desc: "Your business launches properly. We stay available for support and ongoing management.", link: "/portfolio", cta: "See results →" },
            ].map(({ num, title, desc, link, cta, external }) => (
              <div key={num} className="bg-white p-7 rounded-xl shadow-sm text-center flex flex-col">
                <div className="text-red-600 text-3xl font-extrabold mb-4">{num}</div>
                <h3 className="text-base font-semibold mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-1">{desc}</p>
                {link && cta && (
                  external
                    ? <a href={link} target="_blank" rel="noopener noreferrer" className="mt-4 text-xs font-bold uppercase tracking-widest text-red-600 hover:underline">{cta}</a>
                    : <Link to={link} className="mt-4 text-xs font-bold uppercase tracking-widest text-red-600 hover:underline">{cta}</Link>
                )}
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link to="/contact/requirements"
              className="inline-block bg-red-600 text-white px-10 py-4 text-sm font-bold uppercase tracking-wide hover:opacity-90 transition rounded">
              Fill the Brief — It's Free →
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          7. PORTFOLIO TEASER
          Tour guide: "don't just take our word — see the work"
      ══════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-5">
            <div>
              <p className="text-red-600 text-xs font-bold uppercase tracking-widest mb-3">Our Work</p>
              <h2 className="text-3xl md:text-4xl font-semibold mb-3">Projects We've Built</h2>
              <p className="text-gray-500 max-w-lg">Real work for real businesses. See what we've delivered — and let's build yours next.</p>
            </div>
            <Link to="/portfolio"
              className="shrink-0 inline-block border-2 border-black px-7 py-3 text-sm font-bold uppercase tracking-wide hover:bg-black hover:text-white transition rounded">
              View All Work →
            </Link>
          </div>

          {featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
              {featuredProjects.map((project, i) => (
                <div key={project.id || i} className="group border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition">
                  <div className="h-48 sm:h-52 bg-[#F5F5F5] flex items-center justify-center overflow-hidden">
                    {project.image
                      ? <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      : <div className="flex flex-col items-center gap-2 text-gray-300"><span className="text-4xl">🖥️</span><span className="text-xs uppercase tracking-widest">Preview Soon</span></div>
                    }
                  </div>
                  <div className="p-5">
                    <span className="text-red-600 text-xs font-bold uppercase tracking-widest">{project.category}</span>
                    <h3 className="text-sm font-semibold mt-1.5 mb-2">{project.title}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">{project.description}</p>
                    {project.link
                      ? <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-xs font-bold uppercase tracking-widest text-black hover:text-red-600 transition">View Live →</a>
                      : <Link to="/portfolio" className="text-xs font-bold uppercase tracking-widest text-gray-300 hover:text-red-600 transition">See More →</Link>
                    }
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty state — still guides them to portfolio */
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-7">
              {["Website Design", "Brand Strategy", "Ads Management"].map((cat, i) => (
                <Link key={i} to="/portfolio"
                  className="group border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-red-600 hover:bg-red-50 transition">
                  <div className="text-4xl mb-3">🖥️</div>
                  <div className="text-red-600 text-xs font-bold uppercase tracking-widest mb-2">{cat}</div>
                  <p className="text-gray-400 text-sm">View our portfolio →</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          8. CONSULTING SPLIT
          Tour guide: "not sure where to start? talk to us"
      ══════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-[#F5F5F5] px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16">
          <div className="w-full md:w-1/2 h-[260px] sm:h-[320px] md:h-[380px] rounded-xl overflow-hidden">
            <img src={consultingImg} alt="Consulting" className="w-full h-full object-cover object-center" />
          </div>
          <div className="md:w-1/2">
            <p className="text-red-600 text-xs font-bold uppercase tracking-widest mb-4">Strategy First</p>
            <h2 className="text-3xl md:text-4xl font-semibold mb-5">Not sure where to start?<br />Start with a conversation.</h2>
            <p className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed">
              Before we build anything, we make sure you're building the right thing. Our free consultation helps you get clear on strategy, priorities, and what will actually move the needle.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={CALENDLY} target="_blank" rel="noopener noreferrer"
                className="bg-black text-white px-6 py-3 text-sm font-bold uppercase tracking-wide hover:bg-red-600 transition rounded">
                📅 Book a Free Consultation
              </a>
              <Link to="/about"
                className="border-2 border-gray-300 text-black px-6 py-3 text-sm font-bold uppercase tracking-wide hover:border-black transition rounded">
                Learn About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          9. SUPPORTING SERVICES (30%)
          Tour guide: "we do more — see if you need any of this"
      ══════════════════════════════════════════════ */}
      <section className="py-20 bg-[#0a0a0a] text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-10">
            <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-3">Also Available</p>
            <h2 className="text-2xl md:text-3xl font-semibold mb-3">Supporting Business Services</h2>
            <p className="text-gray-400 max-w-xl text-sm md:text-base">
              Beyond web and brand — technical and operational support that keeps your business running smoothly.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {supportServices.map(({ emoji, title, desc }) => (
              <div key={title} className="border border-white/10 p-6 rounded-xl hover:border-red-600 transition">
                <div className="text-2xl mb-3">{emoji}</div>
                <h3 className="text-sm font-semibold mb-2">{title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/services"
              className="border border-white/30 text-white px-7 py-3 text-sm font-bold uppercase tracking-wide hover:bg-white hover:text-black transition rounded">
              View All Services
            </Link>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
              className="bg-green-500 text-white px-7 py-3 text-sm font-bold uppercase tracking-wide hover:bg-green-600 transition rounded">
              💬 Ask on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          10. FINAL CTA
          Tour guide: "you've seen everything — take action now"
      ══════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-red-600 text-white text-center px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
            Ready to build your business online?
          </h2>
          <p className="text-red-100 text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Fill in the brief, get a free consultation, and let's build something that actually works for your business.
          </p>

          {/* Three paths */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <Link to="/contact/requirements"
              className="bg-white text-red-600 px-5 py-4 rounded-xl font-bold text-sm hover:bg-black hover:text-white transition">
              📋 Fill the Brief
              <div className="text-xs font-normal mt-1 opacity-70">Start a project</div>
            </Link>
            <Link to="/contact/calc"
              className="bg-white/15 border border-white/30 text-white px-5 py-4 rounded-xl font-bold text-sm hover:bg-white hover:text-red-600 transition">
              💰 Get a Quote
              <div className="text-xs font-normal mt-1 opacity-70">Instant estimate</div>
            </Link>
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer"
              className="bg-white/15 border border-white/30 text-white px-5 py-4 rounded-xl font-bold text-sm hover:bg-white hover:text-red-600 transition">
              📅 Book a Call
              <div className="text-xs font-normal mt-1 opacity-70">Free consultation</div>
            </a>
          </div>

          <ContactStrip />

          <p className="text-red-200 text-xs mt-8">
            Or call / WhatsApp: +233 50 165 7205 · +233 54 889 4600
          </p>
        </div>
      </section>
    </div>
  );
}