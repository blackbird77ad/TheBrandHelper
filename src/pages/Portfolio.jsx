import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiExternalLink,
  FiMail,
  FiMessageCircle,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { getPortfolio } from "../utils/api";
import heroImg from "../photos/portfolio-hero-optimized.jpg";
import founderImg from "../photos/davida-profile-headshot.jpg";
import readyBuiltImg from "../photos/Browse ready-built and almost-ready digital products..webp";
import planningImg from "../photos/customer-care-quote-forms-side-by-side.webp";
import teamImg from "../photos/Admin dashboard or SaaS Concept.webp";

const WHATSAPP = "https://wa.me/233501657205";
const EMAIL = "mailto:davida@thebrandhelper.com";
const CALENDLY = "https://calendly.com/blackbird77ad/free-consultation";
const PAGE_SIZE = 6;

const preferredCategories = [
  "All",
  "Website Design",
  "Software Development",
  "AI/ML Development",
  "Brand Strategy",
  "Ads Management",
  "Technical Support",
  "Other",
];

const START_OPTIONS = [
  {
    title: "Send the project brief",
    text: "Best when you know the pages, features, content, or type of system you want built.",
    image: planningImg,
    to: "/contact/requirements",
  },
  {
    title: "Estimate the budget",
    text: "Use the calculator first, then we help refine the scope into a realistic delivery plan.",
    image: readyBuiltImg,
    to: "/contact/calc",
  },
  {
    title: "Move fast with a team",
    text: "For clear scopes, we can assign multiple developers and push a focused MVP quickly.",
    image: teamImg,
    to: "/contact",
  },
];

function getProjectId(project, index = 0) {
  return project?._id || project?.id || `${project?.title || "project"}-${index}`;
}

function compactText(text = "", limit = 130) {
  const cleaned = String(text).replace(/\s+/g, " ").trim();
  if (cleaned.length <= limit) return cleaned;
  return `${cleaned.slice(0, limit).trim()}...`;
}

function normalizeProjects(items) {
  return items.map((item, index) => ({
    id: getProjectId(item, index),
    title: item.title || "Untitled Project",
    category: item.category || "Other",
    featured: Boolean(item.featured),
    description: item.description || "Project details are being prepared.",
    image: item.image || "",
    link: item.link || "",
    tags: Array.isArray(item.tags) ? item.tags.filter(Boolean) : [],
    gallery: Array.isArray(item.gallery)
      ? item.gallery
        .filter((entry) => entry?.image || entry?.title || entry?.description)
        .slice(0, 5)
        .map((entry, galleryIndex) => ({
          title: entry.title || `Project page ${galleryIndex + 1}`,
          description: entry.description || "",
          image: entry.image || "",
          alt: entry.alt || entry.title || item.title || `Project page ${galleryIndex + 1}`,
        }))
      : [],
  }));
}

function splitDescription(text = "") {
  const blocks = String(text)
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);
  return blocks.length ? blocks : ["Project details are being prepared."];
}

function ProjectImage({ project, className = "", eager = false }) {
  const [failed, setFailed] = useState(false);

  if (!project.image || failed) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 p-5 text-center`}>
        <div>
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-black text-lg font-extrabold text-white">
            {project.title?.trim()?.[0]?.toUpperCase() || "P"}
          </span>
          <p className="mt-3 text-xs font-bold uppercase tracking-widest text-gray-400">Project preview</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={project.image}
      alt={project.title}
      className={className}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={eager ? "high" : "auto"}
      onError={() => setFailed(true)}
    />
  );
}

function GalleryImage({ item }) {
  const [failed, setFailed] = useState(false);

  if (!item.image || failed) {
    return (
      <div className="flex h-44 items-center justify-center bg-gray-100 text-xs font-bold uppercase tracking-widest text-gray-400">
        Project page
      </div>
    );
  }

  return (
    <img
      src={item.image}
      alt={item.alt || item.title}
      className="h-44 w-full object-cover"
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

function ActionLink({ to, href, children, variant = "dark", icon = FiArrowRight, className = "" }) {
  const classes = {
    dark: "bg-black text-white hover:bg-red-700",
    red: "bg-red-700 text-white hover:bg-black",
    light: "bg-white text-black hover:bg-red-700 hover:text-white",
    outline: "border border-gray-300 text-black hover:border-black",
    outlineLight: "border border-white/40 text-white hover:bg-white hover:text-black",
  };
  const merged = `inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-bold uppercase tracking-wide transition ${classes[variant]} ${className}`;
  const Icon = icon;

  if (href) {
    const externalProps = href.startsWith("#") ? {} : { target: "_blank", rel: "noopener noreferrer" };
    return (
      <a href={href} className={merged} {...externalProps}>
        {children}
        <Icon className="h-4 w-4" aria-hidden="true" />
      </a>
    );
  }

  return (
    <Link to={to} className={merged}>
      {children}
      <Icon className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
}

function PortfolioCard({ project, index, featured = false, onSelect }) {
  return (
    <article
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition hover:-translate-y-0.5 hover:border-black hover:shadow-xl"
      role="button"
      tabIndex={0}
      onClick={() => onSelect(project)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(project);
        }
      }}
    >
      <div className={`${featured ? "h-36 md:h-40" : "h-40"} overflow-hidden bg-gray-100`}>
        <ProjectImage
          project={project}
          eager={featured && index === 0}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-red-700">{project.category}</span>
          {project.featured && <span className="rounded-full bg-black px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white">Featured</span>}
        </div>
        <h3 className="text-base font-extrabold leading-snug text-black">{project.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">{compactText(project.description)}</p>
        {project.tags?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-bold text-gray-600">{tag}</span>
            ))}
          </div>
        )}
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <button type="button" className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-black transition group-hover:text-red-700">
            View details
            <FiArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 transition hover:text-black"
            >
              Live
              <FiExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getPortfolio()
      .then((res) => {
        if (cancelled) return;
        const items = res?.data || res;
        setProjects(Array.isArray(items) ? normalizeProjects(items) : []);
        setLoadError("");
      })
      .catch(() => {
        if (!cancelled) setLoadError("We could not load the portfolio right now.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const present = new Set(projects.map((project) => project.category).filter(Boolean));
    const ordered = preferredCategories.filter((category) => category === "All" || present.has(category));
    const custom = [...present].filter((category) => !ordered.includes(category)).sort();
    return [...ordered, ...custom];
  }, [projects]);

  const filtered = useMemo(() => {
    return filter === "All" ? projects : projects.filter((project) => project.category === filter);
  }, [filter, projects]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleProjects = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const featuredProjects = useMemo(() => {
    const marked = projects.filter((project) => project.featured).slice(0, 3);
    const topUp = projects.filter((project) => !project.featured).slice(0, Math.max(0, 3 - marked.length));
    return [...marked, ...topUp].slice(0, 3);
  }, [projects]);

  const closeModal = useCallback(() => setSelected(null), []);

  const portfolioSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Portfolio | The BrandHelper",
    url: "https://thebrandhelper.com/portfolio",
    description: "A curated portfolio of websites, software builds, brand systems, AI/ML work, and digital projects by The BrandHelper.",
    creator: {
      "@type": "Organization",
      name: "The BrandHelper",
      founder: {
        "@type": "Person",
        name: "Davida Amponsah Prempeh",
        email: "davida@thebrandhelper.com",
      },
    },
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-black">
      <Helmet>
        <title>Portfolio | Websites, Software and AI Projects by The BrandHelper</title>
        <meta name="description" content="Explore The BrandHelper portfolio, featured builds, fast MVP delivery options, and clear ways to request a website, software platform, or AI/ML project." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://thebrandhelper.com/portfolio" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thebrandhelper.com/portfolio" />
        <meta property="og:title" content="Portfolio | The BrandHelper" />
        <meta property="og:description" content="Websites, software, AI/ML development, and digital product work built with a fast, client-focused delivery flow." />
        <meta property="og:image" content="https://thebrandhelper.com/logo-tbh-wordmark.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Portfolio | The BrandHelper" />
        <meta name="twitter:description" content="See featured digital projects and start your own build with The BrandHelper." />
        <meta name="twitter:image" content="https://thebrandhelper.com/logo-tbh-wordmark.png" />
        <script type="application/ld+json">{JSON.stringify(portfolioSchema)}</script>
      </Helmet>

      <section className="bg-black px-6 py-16 text-white md:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-red-400">The BrandHelper Portfolio</p>
            <h1 className="max-w-4xl text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
              Websites, software, and AI-ready systems built to help clients trust you faster.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-200 md:text-lg">
              Explore selected work, practical build paths, and the kind of client experience we protect: clean UI, useful admin flows, fast planning, and delivery that keeps improving until the project feels right.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ActionLink to="/contact/requirements" variant="red">Start a project brief</ActionLink>
              <ActionLink to="/contact/calc" variant="light" icon={FiClock}>Estimate cost</ActionLink>
              <ActionLink href="#founder-portfolio" variant="outlineLight" icon={FiArrowRight}>View founder portfolio</ActionLink>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-white/10 bg-white/5">
            <img
              src={heroImg}
              alt="Project idea and portfolio planning"
              className="h-[300px] w-full object-cover sm:h-[430px]"
              decoding="async"
              fetchPriority="high"
            />
          </div>
        </div>
      </section>

      {featuredProjects.length > 0 && (
        <section className="bg-[#f7f7f7] px-6 py-14 md:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-red-700">Featured work</p>
                <h2 className="mt-2 text-3xl font-extrabold md:text-4xl">A few builds worth opening.</h2>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-gray-600">
                Compact cards keep the page easy to scan. Open any project to read the fuller story.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {featuredProjects.map((project, index) => (
                <PortfolioCard key={getProjectId(project, index)} project={project} index={index} featured onSelect={setSelected} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-white px-6 py-14 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-red-700">Project library</p>
              <h2 className="mt-2 text-3xl font-extrabold md:text-4xl">Browse the work as it grows.</h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-gray-600">
              Filter by the type of work you need, open a card for details, and choose the next step that fits your project.
            </p>
          </div>

          {projects.length > 0 && (
            <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setFilter(category);
                    setPage(1);
                  }}
                  aria-pressed={filter === category}
                  className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-bold transition ${
                    filter === category
                      ? "border-black bg-black text-white"
                      : "border-gray-200 text-gray-600 hover:border-black hover:text-black"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="overflow-hidden rounded-lg border border-gray-200">
                  <div className="h-40 animate-pulse bg-gray-100" />
                  <div className="space-y-3 p-5">
                    <div className="h-3 w-1/3 animate-pulse rounded bg-gray-100" />
                    <div className="h-5 w-3/4 animate-pulse rounded bg-gray-100" />
                    <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center">
              <p className="text-lg font-extrabold">{loadError || "No portfolio projects are available yet."}</p>
              <p className="mx-auto mt-2 max-w-xl text-sm text-gray-600">
                Ask for a private walkthrough if you want to see recent work, discuss a similar build, or understand what can be delivered for your business.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <ActionLink to="/contact" variant="dark" icon={FiMessageCircle}>Contact us</ActionLink>
                <ActionLink to="/contact/requirements" variant="outline">Send a brief</ActionLink>
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {visibleProjects.map((project, index) => (
                  <PortfolioCard
                    key={getProjectId(project, index)}
                    project={project}
                    index={(currentPage - 1) * PAGE_SIZE + index}
                    onSelect={setSelected}
                  />
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-4 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-gray-600">
                  Showing {(currentPage - 1) * PAGE_SIZE + 1}-{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} projects
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    disabled={currentPage === 1}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 text-black transition hover:border-black disabled:cursor-not-allowed disabled:opacity-35"
                    aria-label="Previous portfolio page"
                  >
                    <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <span className="px-3 text-sm font-extrabold">{currentPage} / {totalPages}</span>
                  <button
                    type="button"
                    onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                    disabled={currentPage === totalPages}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 text-black transition hover:border-black disabled:cursor-not-allowed disabled:opacity-35"
                    aria-label="Next portfolio page"
                  >
                    <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="bg-black px-6 py-14 text-white md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-red-400">Start your own build</p>
              <h2 className="mt-2 text-3xl font-extrabold md:text-4xl">Choose the path that fits your stage.</h2>
            </div>
            <ActionLink href={WHATSAPP} variant="outlineLight" icon={FiMessageCircle}>Ask on WhatsApp</ActionLink>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {START_OPTIONS.map((option) => (
              <Link key={option.title} to={option.to} className="group overflow-hidden rounded-lg border border-white/15 bg-white/5 transition hover:-translate-y-0.5 hover:border-white/50">
                <img src={option.image} alt={option.title} className="h-36 w-full object-cover opacity-90 transition group-hover:opacity-100" loading="lazy" decoding="async" />
                <div className="p-5">
                  <h3 className="text-lg font-extrabold">{option.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-300">{option.text}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-red-300">
                    Continue
                    <FiArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-4 sm:items-center" onClick={closeModal}>
          <div
            className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="portfolio-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
              <div className="min-h-72 bg-gray-100 lg:min-h-full">
                <ProjectImage project={selected} className="h-full min-h-72 w-full object-cover" />
              </div>
              <div className="p-6 md:p-8">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-red-700">{selected.category}</span>
                    <h2 id="portfolio-modal-title" className="mt-2 text-2xl font-extrabold leading-tight md:text-3xl">{selected.title}</h2>
                  </div>
                  <button type="button" onClick={closeModal} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-gray-200 text-black transition hover:border-black" aria-label="Close project details">
                    <FiX className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>

                <div className="space-y-3 text-sm leading-relaxed text-gray-700">
                  {splitDescription(selected.description).map((block) => (
                    <p key={block}>{block}</p>
                  ))}
                </div>

                {selected.tags?.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {selected.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-700">{tag}</span>
                    ))}
                  </div>
                )}

                {selected.gallery?.length > 0 && (
                  <div className="mt-7">
                    <h3 className="text-sm font-extrabold uppercase tracking-widest text-black">Project pages</h3>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {selected.gallery.map((item, galleryIndex) => (
                        <figure key={`${item.title}-${galleryIndex}`} className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                          <GalleryImage item={item} />
                          <figcaption className="p-3">
                            <p className="text-sm font-extrabold text-black">{item.title}</p>
                            {item.description && <p className="mt-1 text-xs leading-relaxed text-gray-600">{item.description}</p>}
                          </figcaption>
                        </figure>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {selected.link && (
                    <ActionLink href={selected.link} variant="dark" icon={FiExternalLink}>View live</ActionLink>
                  )}
                  <ActionLink to="/contact/requirements" variant="red">Build similar</ActionLink>
                  <ActionLink to="/contact/calc" variant="outline" icon={FiClock}>Estimate cost</ActionLink>
                  <ActionLink href={CALENDLY} variant="outline" icon={FiCalendar}>Book a call</ActionLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <section id="founder-portfolio" className="bg-[#f7f7f7] px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="portfolio-founder-marquee mb-8 border-y border-gray-200 py-3">
            <div className="portfolio-founder-marquee-track">
              <span>Software development</span>
              <span>AI/ML development</span>
              <span>Founder-led care</span>
              <span>Business systems</span>
              <span>Client-first delivery</span>
              <span>Software development</span>
              <span>AI/ML development</span>
              <span>Founder-led care</span>
              <span>Business systems</span>
              <span>Client-first delivery</span>
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <img
                src={founderImg}
                alt="Davida Amponsah Prempeh"
                className="aspect-square w-full rounded-md object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="portfolio-founder-copy">
              <p className="text-xs font-bold uppercase tracking-widest text-red-700">Founder portfolio</p>
              <h2 className="mt-2 text-3xl font-extrabold leading-tight md:text-5xl">Davida Amponsah Prempeh</h2>
              <p className="mt-5 text-base leading-relaxed text-gray-700 md:text-lg">
                Davida founded The BrandHelper after seeing how many capable businesses were slowed down by unclear websites, scattered tools, and technology that felt harder than it should. Her work combines software development, AI/ML thinking, brand clarity, and practical support so business owners can move from rough ideas to useful digital systems with confidence.
              </p>
              <p className="mt-4 text-base leading-relaxed text-gray-700">
                With 6 years of experience across software development and AI/ML development, she leads with a simple belief: good technology should make a business easier to trust, easier to run, and easier to grow.
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-gray-200 bg-white p-5">
                  <p className="text-3xl font-extrabold">6 yrs</p>
                  <p className="mt-1 text-sm font-semibold text-gray-600">Software and AI/ML development experience.</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-5">
                  <p className="text-3xl font-extrabold">MVP</p>
                  <p className="mt-1 text-sm font-semibold text-gray-600">Focused delivery when scope and decisions are ready.</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-5">
                  <p className="text-3xl font-extrabold">Team</p>
                  <p className="mt-1 text-sm font-semibold text-gray-600">Enough developers to split work and move faster.</p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <ActionLink href={EMAIL} variant="dark" icon={FiMail} className="portfolio-founder-action">Email Davida</ActionLink>
                <ActionLink to="/contact/requirements" variant="red" icon={FiCheckCircle} className="portfolio-founder-action">Start with The BrandHelper</ActionLink>
                <ActionLink href={CALENDLY} variant="outline" icon={FiCalendar} className="portfolio-founder-action">Book a call</ActionLink>
              </div>

              <div className="mt-7 flex flex-wrap gap-4 text-sm font-bold text-gray-600">
                <span className="inline-flex items-center gap-2"><FiUsers className="h-4 w-4 text-red-700" aria-hidden="true" /> Founder-led direction</span>
                <span className="inline-flex items-center gap-2"><FiClock className="h-4 w-4 text-red-700" aria-hidden="true" /> Fast, clear execution</span>
                <span className="inline-flex items-center gap-2"><FiCheckCircle className="h-4 w-4 text-red-700" aria-hidden="true" /> Build until satisfied</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
