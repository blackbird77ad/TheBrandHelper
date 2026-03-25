import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getProjects } from "../utils/api";

const WHATSAPP = "https://wa.me/233501657205";
const EMAIL    = "mailto:davida@thebrandhelper.com";
const CALENDLY = "https://calendly.com/blackbird77ad/free-consultation";

// ── Hardcoded fallback — shown while loading or if server is unreachable ─────
const FALLBACK = [
  { id: "f1", title: "E-commerce Store",           category: "Website Design",  featured: true,  description: "Full online store with product listings, cart, checkout, and mobile-first design.",              image: "", link: "", tags: ["E-commerce", "React", "Payments"]    },
  { id: "f2", title: "Restaurant Brand & Website", category: "Brand Strategy",  featured: true,  description: "Brand identity, colour system, and website for a growing food business.",                       image: "", link: "", tags: ["Branding", "Website", "Food"]         },
  { id: "f3", title: "Consulting Firm Website",    category: "Website Design",  featured: false, description: "Professional site with service pages, team profiles, and booking integration.",                  image: "", link: "", tags: ["Website", "Booking", "Professional"]  },
  { id: "f4", title: "Facebook Ad Campaign",       category: "Ads Management",  featured: false, description: "End-to-end ad campaign for a fashion brand — strategy, creative, targeting, and reporting.",    image: "", link: "", tags: ["Facebook Ads", "Fashion", "Leads"]    },
];

const CATEGORIES = ["All", "Website Design", "Brand Strategy", "Ads Management", "Technical Support", "Other"];

export default function Portfolio() {
  const [projects,  setProjects]  = useState(FALLBACK);
  const [loading,   setLoading]   = useState(true);
  const [filter,    setFilter]    = useState("All");
  const [selected,  setSelected]  = useState(null);

  useEffect(() => {
    getProjects()
      .then(data => { if (data?.length) setProjects(data); })
      .catch(() => { /* silently keep fallback */ })
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "All" ? projects : projects.filter(p => p.category === filter);
  const featured = projects.filter(p => p.featured).slice(0, 2);
  const closeModal = useCallback(() => setSelected(null), []);

  return (
    <div className="bg-white text-black min-h-screen overflow-x-hidden">
      <Helmet>
        <title>Portfolio | The Brand Helper — Our Work</title>
        <meta name="description" content="Browse websites, brand projects, and ad campaigns built by The Brand Helper." />
      </Helmet>

      {/* ── HERO ── */}
      <section className="bg-black text-white py-20 md:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-4">Our Work</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Projects We've Built<br />
            <span className="text-red-600">& Contributed To</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mb-10">
            Real work for real businesses. Browse what we've delivered — and let's build yours next.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/contact/requirements"
              className="bg-red-600 text-white px-7 py-3 text-sm font-bold uppercase tracking-wide hover:opacity-90 transition rounded">
              Start a Similar Project
            </Link>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-500/15 border border-green-500/30 text-green-400 px-7 py-3 text-sm font-bold hover:bg-green-500 hover:text-white transition rounded">
              💬 Ask on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── FEATURED ── */}
      {featured.length > 0 && (
        <section className="py-16 md:py-20 bg-[#F5F5F5] px-6">
          <div className="max-w-6xl mx-auto">
            <p className="text-red-600 text-xs font-bold uppercase tracking-widest mb-8">Featured Work</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featured.map(project => (
                <div key={project.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition cursor-pointer"
                  onClick={() => setSelected(project)}
                >
                  <div className="h-52 sm:h-64 bg-[#0a0a0a] flex items-center justify-center overflow-hidden relative">
                    {project.image
                      ? <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" />
                      : <div className="flex flex-col items-center gap-3 text-white/30"><span className="text-6xl">🖥️</span><span className="text-xs uppercase tracking-widest">Preview Coming Soon</span></div>
                    }
                    <div className="absolute top-4 left-4">
                      <span className="bg-red-600 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">Featured</span>
                    </div>
                  </div>
                  <div className="p-6 md:p-7">
                    <span className="text-red-600 text-xs font-bold uppercase tracking-widest">{project.category}</span>
                    <h3 className="text-lg font-semibold mt-2 mb-3">{project.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-5">{project.description}</p>
                    {project.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-5">
                        {project.tags.map(tag => <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{tag}</span>)}
                      </div>
                    )}
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      {project.link
                        ? <a href={project.link} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                            className="text-xs font-bold uppercase tracking-widest text-black hover:text-red-600 transition">View Live →</a>
                        : <span className="text-xs font-bold uppercase tracking-widest text-gray-300">Live Link Coming Soon</span>
                      }
                      <button className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition">Details →</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── ALL PROJECTS ── */}
      <section className="py-16 md:py-20 bg-white px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-1">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-all whitespace-nowrap
                  ${filter === cat ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-500 hover:border-gray-400'}`}>
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {[1,2,3].map(i => (
                <div key={i} className="rounded-xl overflow-hidden border border-gray-100 animate-pulse">
                  <div className="h-48 bg-gray-100" />
                  <div className="p-5"><div className="h-3 bg-gray-100 rounded w-1/3 mb-3" /><div className="h-4 bg-gray-100 rounded w-2/3 mb-2" /><div className="h-3 bg-gray-100 rounded w-full" /></div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-300">
              <span className="text-5xl block mb-4">📂</span>
              <p className="text-base font-semibold text-gray-400">No projects in this category yet</p>
              <button onClick={() => setFilter('All')} className="mt-4 text-sm text-red-600 font-bold hover:underline">View all</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {filtered.map(project => (
                <div key={project.id}
                  className="group border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition cursor-pointer"
                  onClick={() => setSelected(project)}
                >
                  <div className="h-48 sm:h-52 bg-[#F5F5F5] flex items-center justify-center overflow-hidden">
                    {project.image
                      ? <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" />
                      : <div className="flex flex-col items-center gap-2 text-gray-300"><span className="text-4xl">🖥️</span><span className="text-xs uppercase tracking-widest">Preview Soon</span></div>
                    }
                  </div>
                  <div className="p-5">
                    <span className="text-red-600 text-xs font-bold uppercase tracking-widest">{project.category}</span>
                    <h3 className="text-sm font-semibold mt-1.5 mb-2">{project.title}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">{project.description}</p>
                    {project.link
                      ? <a href={project.link} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                          className="text-xs font-bold uppercase tracking-widest text-black hover:text-red-600 transition">View Live →</a>
                      : <span className="text-xs font-bold uppercase tracking-widest text-gray-300">Coming Soon</span>
                    }
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── MODAL ── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.8)" }} onClick={closeModal}>
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <div className="h-52 sm:h-64 bg-[#0a0a0a] flex items-center justify-center overflow-hidden rounded-t-3xl">
              {selected.image
                ? <img src={selected.image} alt={selected.title} className="w-full h-full object-cover" />
                : <div className="flex flex-col items-center gap-2 text-white/30"><span className="text-6xl">🖥️</span><span className="text-xs uppercase tracking-widest">Preview Coming Soon</span></div>
              }
            </div>
            <div className="p-6 md:p-8">
              <span className="text-red-600 text-xs font-bold uppercase tracking-widest">{selected.category}</span>
              <h2 className="text-2xl font-extrabold mt-2 mb-4">{selected.title}</h2>
              <p className="text-gray-600 leading-relaxed mb-5">{selected.description}</p>
              {selected.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selected.tags.map(tag => <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{tag}</span>)}
                </div>
              )}
              <div className="flex flex-wrap gap-3">
                {selected.link && (
                  <a href={selected.link} target="_blank" rel="noopener noreferrer"
                    className="bg-black text-white px-5 py-3 text-xs font-bold uppercase tracking-wide hover:bg-red-600 transition rounded-xl">
                    View Live Site →
                  </a>
                )}
                <Link to="/contact/requirements"
                  className="bg-red-600 text-white px-5 py-3 text-xs font-bold uppercase tracking-wide hover:opacity-90 transition rounded-xl">
                  Start a Similar Project
                </Link>
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
                  className="bg-green-500 text-white px-5 py-3 text-xs font-bold uppercase tracking-wide hover:bg-green-600 transition rounded-xl">
                  💬 WhatsApp
                </a>
                <button onClick={closeModal}
                  className="border border-gray-200 text-gray-500 px-5 py-3 text-xs font-bold hover:border-gray-400 transition rounded-xl">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CTA ── */}
      <section className="py-20 bg-black text-white text-center px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-5">Like what you see?</h2>
          <p className="text-gray-400 text-base md:text-lg mb-10">Let's build something like this — or better — for your business.</p>
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <Link to="/contact/requirements"
              className="bg-red-600 text-white px-8 py-3.5 text-sm font-bold uppercase tracking-wide hover:opacity-90 transition rounded">
              Start Your Project →
            </Link>
            <Link to="/contact/calc"
              className="border border-white/30 text-white px-8 py-3.5 text-sm font-bold uppercase tracking-wide hover:bg-white hover:text-black transition rounded">
              Get a Quote
            </Link>
          </div>
          <div className="flex flex-wrap gap-5 justify-center text-sm">
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition">💬 +233 50 165 7205</a>
            <a href={EMAIL} className="flex items-center gap-2 text-gray-400 hover:text-white transition">📧 davida@thebrandhelper.com</a>
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition">📅 Book a Free Call</a>
          </div>
        </div>
      </section>
    </div>
  );
}