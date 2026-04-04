import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import storyImg    from "../photos/close-up-hands-of-a-professional-seamstress-female-2025-04-06-07-35-25-utc_1.webp";
import missionImg  from "../photos/perfecthero.png";

const WHATSAPP = "https://wa.me/233501657205";
const EMAIL    = "mailto:davida@thebrandhelper.com";
const CALENDLY = "https://calendly.com/blackbird77ad/free-consultation";

const values = [
  { icon: "⚡", title: "Execution Over Theory",     desc: "We don't just advise — we build, manage, and deliver. Every engagement ends with something real and working." },
  { icon: "🔍", title: "Transparency Always",       desc: "No hidden costs, no fake timelines, no promises we can't keep. You always know exactly where things stand." },
  { icon: "📈", title: "Results-Focused",           desc: "Everything we build is tied to a business outcome — more clients, more visibility, more revenue." },
  { icon: "🤝", title: "Long-Term Partnership",     desc: "We're not a one-and-done agency. We stay involved, iterate, and grow with the businesses we work with." },
  { icon: "🌍", title: "Built for African Markets", desc: "We understand the local context — pricing, platforms, payment methods, and what actually works here." },
  { icon: "🎯", title: "Clarity First",             desc: "Before we build anything, we make sure we're building the right thing. Strategy always comes before execution." },
];

const capabilities = [
  { category: "Web",       items: ["Website Design & Development", "Website Management", "Business Email Setup", "Domain & Hosting"] },
  { category: "Marketing", items: ["Facebook & Instagram Ads", "Google Ads", "Brand Strategy", "Social Media Setup"] },
  { category: "Support",   items: ["AI Tools & Automation", "Technical Writing", "Translation & Transcription", "Customer Support Setup", "Project Support"] },
  { category: "Strategy",  items: ["Business Consulting", "Digital Strategy", "Growth Coaching", "Brand Positioning"] },
];

export default function About() {
  return (
    <div className="bg-white text-black overflow-x-hidden">
      <Helmet>
        <title>About The BrandHelper | Digital Agency — Accra, Ghana</title>
        <meta name="description" content="The BrandHelper is a digital agency based in Accra, Ghana. We build websites, run ad campaigns, and develop brand strategy for businesses growing online." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://thebrandhelper.com/about" />
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content="https://thebrandhelper.com/about" />
        <meta property="og:title"       content="About The BrandHelper | Digital Agency — Accra, Ghana" />
        <meta property="og:description" content="We build websites, run ads, and develop brand strategy for businesses in Ghana and globally. Learn who we are and how we work." />
        <meta property="og:image"       content="https://thebrandhelper.com/images/og-image.jpg" />
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content="About The BrandHelper | Digital Agency" />
        <meta name="twitter:description" content="Digital agency based in Ghana. Websites, ads, and brand strategy done properly." />
        <meta name="twitter:image"       content="https://thebrandhelper.com/images/og-image.jpg" />
      </Helmet>

      {/* ── HERO ── */}
      <section className="min-h-[70vh] flex items-center bg-black text-white px-6">
        <div className="max-w-5xl mx-auto py-20 w-full">
          <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-5">About Us</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-7 max-w-3xl">
            We Build Digital Businesses.<br />
            <span className="text-red-600">Properly.</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
            The Brand Helper is a digital agency helping founders, startups, and growing businesses establish a credible, effective online presence.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/contact/requirements"
              className="bg-red-600 text-white px-7 py-3 text-sm font-bold uppercase tracking-wide hover:opacity-90 transition rounded">
              Start a Project
            </Link>
            <Link to="/portfolio"
              className="border border-white/40 text-white px-7 py-3 text-sm font-bold uppercase tracking-wide hover:bg-white hover:text-black transition rounded">
              See Our Work
            </Link>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-500/20 border border-green-500/40 text-green-400 px-7 py-3 text-sm font-bold hover:bg-green-500 hover:text-white transition rounded">
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* ── STORY ── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div>
            <p className="text-red-600 text-xs font-bold uppercase tracking-widest mb-4">Our Story</p>
            <h2 className="text-3xl md:text-4xl font-semibold mb-6">Built to cut through the confusion</h2>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-5">
              The Brand Helper was built because too many businesses were sold motivation without structure — advice without execution. Founders were being told what to do, but nobody was actually doing it with them.
            </p>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-5">
              We started as a hands-on agency focused on one thing: helping real businesses get online properly. Not templates. Not generic packages. Custom, considered work that ties back to business outcomes.
            </p>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              Today we work with businesses across industries — e-commerce, food, consulting, health, education, and more — delivering websites, ad campaigns, brand strategy, and technical support that actually moves the needle.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden order-first md:order-last">
            <img src={storyImg} alt="Our Story" className="w-full h-[320px] md:h-[480px] object-cover object-center" />
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-20 md:py-28 bg-[#F5F5F5]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12 md:mb-16 text-center">
            <p className="text-red-600 text-xs font-bold uppercase tracking-widest mb-3">What We Stand For</p>
            <h2 className="text-3xl md:text-4xl font-semibold">How we work and why it matters</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {values.map(({ icon, title, desc }) => (
              <div key={title} className="bg-white p-7 rounded-xl shadow-sm hover:shadow-md transition">
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="text-base font-semibold mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAPABILITIES ── */}
      <section className="py-20 md:py-28 bg-black text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-3">What We Do</p>
            <h2 className="text-3xl md:text-4xl font-semibold mb-3">Full-service capabilities</h2>
            <p className="text-gray-400 max-w-xl">One agency. Everything your digital business needs to launch, grow, and operate professionally.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {capabilities.map(({ category, items }) => (
              <div key={category}>
                <div className="text-red-500 text-xs font-bold uppercase tracking-widest mb-4">{category}</div>
                <ul className="flex flex-col gap-3">
                  {items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-red-500 mt-0.5 shrink-0">→</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/services"
              className="bg-red-600 text-white px-7 py-3 text-sm font-bold uppercase tracking-wide hover:opacity-90 transition rounded">
              View All Services
            </Link>
            <Link to="/contact"
              className="border border-white/30 text-white px-7 py-3 text-sm font-bold uppercase tracking-wide hover:bg-white hover:text-black transition rounded">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="rounded-xl overflow-hidden">
            <img src={missionImg} alt="Our Mission" className="w-full h-[300px] md:h-[400px] object-cover object-center" />
          </div>
          <div>
            <p className="text-red-600 text-xs font-bold uppercase tracking-widest mb-4">Our Mission</p>
            <h2 className="text-3xl md:text-4xl font-semibold mb-6">Make digital growth accessible, practical, and trustworthy</h2>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-5">
              We work with individuals, creators, and small businesses who want real outcomes — not theory. Our mission is to bridge the gap between business ambition and digital execution.
            </p>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8">
              Every project we take on is an opportunity to help a business reach more people, operate more professionally, and build something sustainable.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={CALENDLY} target="_blank" rel="noopener noreferrer"
                className="bg-black text-white px-6 py-3 text-sm font-bold uppercase tracking-wide hover:bg-red-600 transition rounded">
                📅 Book a Free Call
              </a>
              <a href={EMAIL}
                className="border-2 border-gray-200 text-black px-6 py-3 text-sm font-bold uppercase tracking-wide hover:border-black transition rounded">
                📧 Email Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-red-600 text-white text-center px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-5">Ready to work together?</h2>
          <p className="text-red-100 text-base md:text-lg mb-10 max-w-xl mx-auto">
            Fill in the brief and let's figure out exactly what your business needs. Free consultation, no commitment.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            <Link to="/contact/requirements"
              className="bg-white text-red-600 px-8 py-3.5 text-sm font-bold uppercase tracking-wide hover:bg-black hover:text-white transition rounded">
              Start Your Project →
            </Link>
            <Link to="/portfolio"
              className="border border-white/40 text-white px-8 py-3.5 text-sm font-bold uppercase tracking-wide hover:bg-white hover:text-red-600 transition rounded">
              See Our Work
            </Link>
          </div>
          <div className="flex flex-wrap gap-3 justify-center text-sm">
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-red-100 hover:text-white transition">
              💬 +233 50 165 7205
            </a>
            <span className="text-red-300">·</span>
            <a href={EMAIL} className="flex items-center gap-2 text-red-100 hover:text-white transition">
              📧 davida@thebrandhelper.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}