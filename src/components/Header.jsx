import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="text-lg font-semibold tracking-wide hover:opacity-80 transition"
        >
        The Brand<span className="text-[#E11D48]">Helper</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-10 text-sm uppercase tracking-wide">
          {["Home", "Trainings", "Services", "About", "Contact"].map((item) => (
            <Link
              key={item}
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className="relative group"
            >
              <span className="group-hover:text-[#A78BFA] transition">
                {item}
              </span>
              <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-[#A78BFA] transition-all group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Link
          to="/trainings"
          className="hidden md:inline border border-white px-6 py-2 text-xs uppercase tracking-wide hover:bg-white hover:text-black transition"
        >
          Get Started
        </Link>

        {/* Mobile Button */}
        <button
          className="md:hidden text-xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-black border-t border-white/10 px-6 py-8 space-y-6 text-center">
          {["Home", "Trainings", "Services", "About", "Contact"].map((item) => (
            <Link
              key={item}
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className="block text-sm uppercase tracking-wide hover:text-[#E11D48] transition"
            >
              {item}
            </Link>
          ))}
          <Link
            to="/trainings"
            onClick={() => setOpen(false)}
            className="inline-block mt-4 bg-[#E11D48] px-8 py-3 text-xs uppercase tracking-wide hover:opacity-90 transition"
          >
            Get Started
          </Link>
        </div>
      )}
    </header>
  );
}
