import React from "react";
import { Link } from "react-router-dom";

const WHATSAPP  = "https://wa.me/233501657205";
const WHATSAPP2 = "https://wa.me/233548894600";
const EMAIL     = "davida@thebrandhelper.com";
const CALENDLY  = "https://calendly.com/blackbird77ad/free-consultation";
const PHONE1    = "+233 50 165 7205";
const PHONE2    = "+233 54 493 0276";

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-white">

      {/* ── MINI CTA BAND ── */}
      <div className="bg-red-600 py-5 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-bold text-white text-sm md:text-base text-center sm:text-left">
            Ready to build your business online? Let's talk — it's free.
          </p>
          <div className="flex gap-3 shrink-0 flex-wrap justify-center">
            <Link
              to="/contact/requirements"
              className="bg-white text-red-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wide hover:bg-black hover:text-white transition rounded"
            >
              Start a Project
            </Link>
            <a
              href={CALENDLY} target="_blank" rel="noopener noreferrer"
              className="border border-white text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wide hover:bg-white hover:text-red-600 transition rounded"
            >
              Book a Free Call
            </a>
          </div>
        </div>
      </div>

      {/* ── MAIN FOOTER ── */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Link to="/" className="inline-block mb-4">
            <span className="text-xl font-extrabold">
              The Brand<span className="text-red-600">Helper</span>
            </span>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            A digital agency helping businesses grow online — through websites, ads, brand strategy, and technical support. Done for you, properly.
          </p>
          <div className="flex flex-col gap-2">
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-green-400 transition">
              <span className="text-green-400">💬</span> {PHONE1}
            </a>
            <a href={`mailto:${EMAIL}`}
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition">
              <span>📧</span> {EMAIL}
            </a>
          </div>
        </div>

        {/* Navigate */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-red-500 mb-5 font-bold">Navigate</h4>
          <ul className="flex flex-col gap-3 text-sm">
            {[
              { label: "Home",      to: "/"          },
              { label: "About",     to: "/about"     },
              { label: "Services",  to: "/services"  },
              { label: "Portfolio", to: "/portfolio" },
              { label: "Contact",   to: "/contact"   },
            ].map(({ label, to }) => (
              <li key={to}>
                <Link to={to} className="text-gray-400 hover:text-white transition">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-red-500 mb-5 font-bold">Services</h4>
          <ul className="flex flex-col gap-3 text-sm">
            {[
              "Website Design",
              "Ads Management",
              "Brand Strategy",
              "Website Management",
              "Business Email Setup",
              "AI Tools & Automation",
              "Technical Writing",
              "Translation & Transcription",
            ].map(label => (
              <li key={label}>
                <Link to="/services" className="text-gray-400 hover:text-white transition">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Get Started */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-red-500 mb-5 font-bold">Get Started</h4>
          <ul className="flex flex-col gap-3 text-sm mb-8">
            <li><Link to="/contact/requirements" className="text-gray-400 hover:text-white transition">📋 Fill Project Brief</Link></li>
            <li><Link to="/contact/calc"         className="text-gray-400 hover:text-white transition">💰 Get a Quote</Link></li>
            <li><a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">📅 Book a Free Call</a></li>
            <li><Link to="/contact"              className="text-gray-400 hover:text-white transition">✉️ Quick Inquiry</Link></li>
            <li><Link to="/portfolio"            className="text-gray-400 hover:text-white transition">🖥️ View Our Work</Link></li>
          </ul>

          <h4 className="text-xs uppercase tracking-widest text-red-500 mb-4 font-bold">Call / WhatsApp</h4>
          <div className="flex flex-col gap-2">
            <a href={`tel:${PHONE1}`}  className="text-sm text-gray-400 hover:text-white transition">{PHONE1}</a>
            <a href={WHATSAPP2} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition">{PHONE2}</a>
          </div>
        </div>

      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="border-t border-white/10 py-6 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <span>© {new Date().getFullYear()} The Brand Helper. All rights reserved.</span>
          <div className="flex gap-5">
            <Link to="/contact" className="hover:text-white transition">Contact</Link>
            <Link to="/portfolio" className="hover:text-white transition">Portfolio</Link>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition">WhatsApp</a>
          </div>
          {/* Built by credit — replaces dev email */}
          <span className="text-gray-600">
            Built by{" "}
            <a href="https://thebrandhelper.com" target="_blank" rel="noopener noreferrer"
              className="text-red-600/70 hover:text-red-500 transition font-medium">
              thebrandhelper.com
            </a>
          </span>
        </div>
      </div>

    </footer>
  );
}