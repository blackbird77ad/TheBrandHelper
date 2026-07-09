import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../photos/logo-tbh-wordmark-tight-optimized.jpg";
import { requestAppNotification } from "../utils/pwa";

const WHATSAPP = "https://wa.me/233501657205";
const EMAIL = "davida@thebrandhelper.com";
const CALENDLY = "https://calendly.com/blackbird77ad/free-consultation";
const PHONE1 = "+233 50 165 7205";

const groups = [
  {
    title: "Main",
    links: [
      { label: "Home", to: "/" },
      { label: "Web Development", to: "/web-development" },
      { label: "Products", to: "/digital-products" },
      { label: "Services", to: "/services" },
      { label: "Portfolio", to: "/portfolio" },
    ],
  },
  {
    title: "AI & Talent",
    links: [
      { label: "AI Data", to: "/ai-data" },
      { label: "AI Projects", to: "/ai-projects" },
      { label: "Talent", to: "/talent" },
      { label: "Join Network", to: "/talent" },
    ],
  },
  {
    title: "Start",
    links: [
      { label: "Blueprint", to: "/blueprint" },
      { label: "Project Brief", to: "/contact/requirements" },
      { label: "Pricing Calculator", to: "/contact/calc" },
      { label: "Contact", to: "/contact" },
    ],
  },
];

function FooterLink({ item }) {
  if (item.href) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-gray-400 transition hover:text-white">
        {item.label}
      </a>
    );
  }
  return <Link to={item.to} className="text-gray-400 transition hover:text-white">{item.label}</Link>;
}

export default function Footer() {
  const [alertStatus, setAlertStatus] = useState("");

  const enableAlerts = async () => {
    const result = await requestAppNotification();
    setAlertStatus(result.ok ? "Alerts enabled" : "Alerts unavailable");
  };

  return (
    <footer className="bg-[#0a0a0a] text-white">
      <div className="border-b border-white/10 bg-red-700 px-6 py-5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm font-bold md:text-left">Ready to build, improve, or plan your website?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/web-development" className="rounded bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-red-700 transition hover:bg-black hover:text-white">
              Start Website
            </Link>
            <Link to="/portfolio" className="rounded border border-white px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-white hover:text-red-700">
              See Portfolio
            </Link>
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="rounded border border-white/70 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-white hover:text-red-700">
              Book Call
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[1.25fr_2fr]">
        <div>
          <Link to="/" className="inline-flex items-center overflow-hidden rounded-sm" aria-label="The BrandHelper home">
            <img src={logo} alt="The BrandHelper" className="h-16 w-auto max-w-[310px] object-contain" loading="lazy" decoding="async" />
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-gray-400">
            The BrandHelper builds websites, digital products, business services, AI data support, and talent pipelines for growing businesses.
          </p>
          <div className="mt-5 flex flex-col gap-2 text-sm">
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="text-gray-400 transition hover:text-green-400">WhatsApp: {PHONE1}</a>
            <a href={`mailto:${EMAIL}`} className="text-gray-400 transition hover:text-white">Email: {EMAIL}</a>
          </div>
        </div>

        <nav className="grid gap-8 sm:grid-cols-3" aria-label="Footer navigation">
          {groups.map((group) => (
            <div key={group.title}>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-red-500">{group.title}</h4>
              <ul className="space-y-3 text-sm">
                {group.links.map((item) => (
                  <li key={`${group.title}-${item.label}`}>
                    <FooterLink item={item} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="border-t border-white/10 px-6 py-5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-center text-xs text-gray-500 md:flex-row md:text-left">
          <span>Copyright {new Date().getFullYear()} The BrandHelper. All rights reserved.</span>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/about" className="transition hover:text-white">About</Link>
            <Link to="/portfolio" className="transition hover:text-white">Portfolio</Link>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="transition hover:text-green-400">WhatsApp</a>
            <button type="button" onClick={enableAlerts} className="transition hover:text-white" aria-describedby={alertStatus ? "footer-alert-status" : undefined}>Enable Alerts</button>
            {alertStatus && <span id="footer-alert-status" className="text-gray-400" role="status" aria-live="polite">{alertStatus}</span>}
          </div>
        </div>
      </div>
    </footer>
  );
}
