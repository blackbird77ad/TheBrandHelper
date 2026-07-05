import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../photos/logo-tbh-wordmark-tight.png";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Web Development", to: "/web-development" },
  { label: "Products", to: "/digital-products" },
  { label: "Services", to: "/services" },
  { label: "AI Data", to: "/ai-data" },
  { label: "AI Projects", to: "/ai-projects" },
  { label: "Talent", to: "/talent" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const isActive = (to) => {
    if (to === "/web-development") return pathname === "/web-development";
    if (to === "/") return pathname === "/";
    return pathname === to || pathname.startsWith(`${to}/`);
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-[200] border-b border-white/10 bg-black/95 text-white backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center" aria-label="The BrandHelper home" onClick={() => setMenuOpen(false)}>
          <span className="flex h-14 items-center overflow-hidden rounded-sm">
            <img src={logo} alt="The BrandHelper" className="h-14 w-auto max-w-[250px] object-contain" />
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={`rounded-md px-3 py-2 text-[11px] font-bold uppercase tracking-wide transition ${
                isActive(to) ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/15 text-white transition hover:bg-white/10 lg:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label="Toggle navigation"
        >
          <span className="sr-only">Open menu</span>
          <span className="relative block h-5 w-6">
            <span className={`absolute left-0 top-0 h-0.5 w-6 rounded bg-white transition ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`absolute left-0 top-2 h-0.5 w-6 rounded bg-white transition ${menuOpen ? "opacity-0" : "opacity-100"}`} />
            <span className={`absolute left-0 top-4 h-0.5 w-6 rounded bg-white transition ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      <div
        id="mobile-navigation"
        className={`overflow-hidden border-t border-white/10 bg-black transition-[max-height,opacity] duration-300 lg:hidden ${
          menuOpen ? "max-h-[540px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-auto flex max-w-7xl flex-col px-4 py-3 sm:px-6">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center justify-between border-b border-white/10 py-4 text-sm font-bold ${
                isActive(to) ? "text-white" : "text-white/65"
              }`}
            >
              <span>{label}</span>
              <span className="text-red-500">Go</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
