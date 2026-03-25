import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { label: "Home",      to: "/"          },
  { label: "About",     to: "/about"     },
  { label: "Services",  to: "/services"  },
  { label: "Portfolio", to: "/portfolio" },
  { label: "Contact",   to: "/contact"   },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const isActive = (to) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 200,
          // Always solid dark — no transparency ever
          background: "rgba(10,10,10,0.98)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 24px",
          height: 64, display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 17, letterSpacing: "-0.3px" }}>
              The Brand<span style={{ color: "#e11d48" }}>Helper</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex" style={{ alignItems: "center", gap: 2 }}>
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                style={{
                  color: isActive(to) ? "#ffffff" : "rgba(255,255,255,0.55)",
                  textDecoration: "none",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  padding: "8px 12px",
                  borderRadius: 6,
                  background: isActive(to) ? "rgba(255,255,255,0.08)" : "transparent",
                  transition: "color 0.15s, background 0.15s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => {
                  if (!isActive(to)) {
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive(to)) {
                    e.currentTarget.style.color = "rgba(255,255,255,0.55)";
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {label}
              </Link>
            ))}

            <Link
              to="/contact/requirements"
              style={{
                marginLeft: 10,
                background: "#e11d48",
                color: "#fff",
                textDecoration: "none",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                padding: "10px 18px",
                borderRadius: 6,
                transition: "opacity 0.15s, transform 0.15s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.opacity = "0.88";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Start a Project
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle navigation"
            style={{
              background: "none", border: "none", padding: "8px",
              cursor: "pointer", display: "flex", flexDirection: "column",
              gap: 5, width: 36,
            }}
          >
            <span style={{
              display: "block", height: 2, width: 22,
              background: "#fff", borderRadius: 2, transition: "transform 0.25s",
              transform: menuOpen ? "rotate(45deg) translate(3px, 7px)" : "none",
            }} />
            <span style={{
              display: "block", height: 2, width: 22,
              background: "#fff", borderRadius: 2, transition: "opacity 0.25s",
              opacity: menuOpen ? 0 : 1,
            }} />
            <span style={{
              display: "block", height: 2, width: 22,
              background: "#fff", borderRadius: 2, transition: "transform 0.25s",
              transform: menuOpen ? "rotate(-45deg) translate(3px, -7px)" : "none",
            }} />
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className="md:hidden"
          style={{
            maxHeight: menuOpen ? 520 : 0,
            overflow: "hidden",
            transition: "max-height 0.3s ease",
            background: "rgba(10,10,10,0.99)",
            borderTop: menuOpen ? "1px solid rgba(255,255,255,0.07)" : "none",
          }}
        >
          <div style={{ padding: "12px 24px 24px" }}>
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  color: isActive(to) ? "#fff" : "rgba(255,255,255,0.6)",
                  textDecoration: "none", fontSize: 15, fontWeight: 600,
                  padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                {label}
                <span style={{ color: "#e11d48", fontSize: 12 }}>→</span>
              </Link>
            ))}
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              <Link
                to="/contact/requirements"
                style={{
                  display: "block", background: "#e11d48", color: "#fff",
                  textDecoration: "none", fontSize: 13, fontWeight: 700,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  padding: "14px", borderRadius: 10, textAlign: "center",
                }}
              >
                Start a Project →
              </Link>
              <a
                href="https://wa.me/233501657205"
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: "block",
                  background: "rgba(37,211,102,0.12)",
                  border: "1px solid rgba(37,211,102,0.3)",
                  color: "#25d366", textDecoration: "none",
                  fontSize: 13, fontWeight: 700,
                  padding: "13px", borderRadius: 10, textAlign: "center",
                }}
              >
                💬 WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer — prevents content hiding under fixed nav */}
      <div style={{ height: 64 }} />
    </>
  );
}