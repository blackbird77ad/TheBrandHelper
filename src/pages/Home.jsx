import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

import heroImg from "../photos/perfecthero.png";
import webImg from "../photos/responsivewebdesign-1.png";
import productImg from "../photos/Browse ready-built and almost-ready digital products..webp";
import emailImg from "../photos/Business Email Setup-newmhomepage.jpg";
import domainEmailImg from "../photos/custom-domain-email-mailbox-1.jpg";
import brandImg from "../photos/Brand Strategy-replacement.avif";
import adsImg from "../photos/Ads-2-use-for-ads-aside-firsts-ads.avif";
import websiteManagementImg from "../photos/Website Management1.png";
import digitalSupportImg from "../photos/Customer-suport-24-7-most-preferred.jpg";
import customSoftwareImg from "../photos/Admin dashboard or SaaS Concept.webp";
import projectImg from "../photos/AI Training and Human Feedback Teams.jpg";
import dataImg from "../photos/AI Data Marketplace-preferred.jpg";
import talentImg from "../photos/find-talent-or-contributors-for0projects.jpg";

const webBuilds = [
  "Business Websites",
  "E-commerce Websites",
  "Booking Platforms",
  "Registration Systems",
  "Admin Dashboards",
  "Custom Web Applications",
];

const supportCards = [
  {
    title: "Website Management",
    text: "Ongoing updates, fixes, monitoring, and small improvements after launch.",
    image: websiteManagementImg,
  },
  {
    title: "Custom-Domain Email",
    text: "Professional mailbox setup so your business email matches your domain.",
    image: domainEmailImg,
  },
  {
    title: "Digital Support",
    text: "Practical support for content, setup, troubleshooting, and business tools.",
    image: digitalSupportImg,
  },
  {
    title: "Custom Software Development",
    text: "When the business needs a dashboard, workflow, or platform beyond a normal website.",
    image: customSoftwareImg,
  },
];

const aiProjects = [
  "AI training projects",
  "Data collection",
  "Annotation",
  "Evaluation",
  "Language support",
  "OCR project support",
];

const talent = [
  "Developers",
  "AI trainers",
  "Data contributors",
  "Annotators",
  "Evaluators",
  "Translators",
  "Local language contributors",
];

const pathways = [
  { title: "Web Development", text: "Start a custom website, platform, or business system.", to: "/web-development" },
  { title: "Portfolio", text: "See website and digital projects built for businesses.", to: "/portfolio" },
  { title: "Products", text: "Browse ready-built websites, tools, and digital products.", to: "/digital-products" },
  { title: "Services", text: "Request business email, ads, brand strategy, or digital support.", to: "/services" },
  { title: "AI Data", text: "Explore datasets, OCR data, and custom data collection.", to: "/ai-data" },
  { title: "AI Projects", text: "Request contributors, evaluation, annotation, or project support.", to: "/ai-projects" },
  { title: "Talent", text: "Request skilled people or join the talent network.", to: "/talent" },
  { title: "Blueprint", text: "Plan the website structure before development begins.", to: "/blueprint" },
  { title: "About", text: "Understand how The BrandHelper works and what we stand for.", to: "/about" },
  { title: "Contact", text: "Send a quick message, full brief, or pricing request.", to: "/contact" },
];

function ButtonLink({ to, children, variant = "dark" }) {
  const styles = {
    dark: "bg-black text-white hover:bg-red-700",
    red: "bg-red-700 text-white hover:bg-black",
    outline: "border border-gray-300 text-black hover:border-black",
    outlineLight: "border border-white/40 text-white hover:bg-white hover:text-black",
    light: "bg-white text-black hover:bg-red-700 hover:text-white",
  };

  return (
    <Link to={to} className={`inline-flex rounded-md px-5 py-3 text-sm font-bold uppercase tracking-wide transition ${styles[variant]}`}>
      {children}
    </Link>
  );
}

function ImageBand({ image, alt, children, dark = false, reverse = false }) {
  return (
    <div className={`grid gap-8 lg:grid-cols-2 lg:items-center ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
      <div className="overflow-hidden rounded-lg bg-gray-100">
        <img src={image} alt={alt} className="h-[280px] w-full object-cover sm:h-[360px] lg:h-[430px]" />
      </div>
      <div className={dark ? "text-white" : "text-black"}>{children}</div>
    </div>
  );
}

function MiniCard({ title, text, image, alt, imageVariant = "default" }) {
  const isServiceImage = imageVariant === "service";

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      {image && (
        <div className={`mb-4 overflow-hidden rounded-md ${isServiceImage ? "aspect-[5/4] bg-white" : "bg-gray-50"}`}>
          <img
            src={image}
            alt={alt || title}
            className={isServiceImage ? "h-full w-full object-contain" : "h-32 w-full object-contain p-2"}
          />
        </div>
      )}
      <h3 className="mb-2 text-base font-semibold">{title}</h3>
      {text && <p className="text-sm leading-relaxed text-gray-600">{text}</p>}
    </div>
  );
}

export default function Home() {
  return (
    <div className="overflow-x-hidden bg-white text-black">
      <Helmet>
        <title>The BrandHelper | Web Development, Products and AI-Ready Solutions</title>
        <meta name="description" content="The BrandHelper builds websites, digital products, business services, AI datasets, AI project support, and talent sourcing systems for growing businesses." />
        <link rel="canonical" href="https://thebrandhelper.com/" />
        <meta property="og:title" content="The BrandHelper | Web Development and Digital Products" />
        <meta property="og:description" content="Websites, digital products, services, AI data, project support, and talent sourcing for growing businesses." />
        <meta property="og:image" content="https://thebrandhelper.com/logo-tbh.png" />
        <meta name="twitter:image" content="https://thebrandhelper.com/logo-tbh.png" />
      </Helmet>

      <section className="bg-black px-6 py-16 text-white md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-red-500">Web Development First</p>
            <h1 className="mb-6 text-4xl font-extrabold leading-tight md:text-6xl">
              We build websites, digital products, and AI-ready solutions for growing businesses.
            </h1>
            <p className="mb-8 max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">
              The BrandHelper helps businesses launch professional websites, access ready-built digital products, request custom services, and connect with AI data and project support.
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink to="/web-development" variant="red">Start a Website Project</ButtonLink>
              <ButtonLink to="/digital-products" variant="light">Browse Products</ButtonLink>
              <ButtonLink to="/ai-data" variant="outlineLight">Explore AI Data</ButtonLink>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-white/10 bg-white/5">
            <img src={heroImg} alt="Professional web development" className="h-[320px] w-full object-cover sm:h-[460px] lg:h-[540px]" />
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <ImageBand image={webImg} alt="Responsive website design">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-red-600">Main Focus</p>
            <h2 className="mb-5 text-3xl font-semibold md:text-4xl">Web development is the core service.</h2>
            <p className="mb-6 leading-relaxed text-gray-600">
              We build websites and web systems that help businesses look professional, capture leads, accept orders, manage work, and grow online.
            </p>
            <div className="mb-7 grid grid-cols-2 gap-3">
              {webBuilds.map((item) => <MiniCard key={item} title={item} />)}
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink to="/web-development" variant="red">Request a Website</ButtonLink>
              <ButtonLink to="/digital-products" variant="outline">View Ready-Built Websites</ButtonLink>
            </div>
          </ImageBand>
        </div>
      </section>

      <section className="bg-[#F5F5F5] px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <ImageBand image={productImg} alt="Digital product concept" reverse>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-red-600">Products</p>
            <h2 className="mb-5 text-3xl font-semibold md:text-4xl">Browse ready-built and almost-ready digital products.</h2>
            <p className="mb-6 leading-relaxed text-gray-600">
              Products can include ready-built websites, website concepts, business platforms, landing pages, digital templates, dataset products, and AI-related resources.
            </p>
            <div className="mb-7 grid gap-3 sm:grid-cols-2">
              {["Ready-built websites", "Business platforms", "Digital tools", "Dataset products"].map((item) => <MiniCard key={item} title={item} />)}
            </div>
            <ButtonLink to="/digital-products" variant="dark">Browse Products</ButtonLink>
          </ImageBand>
        </div>
      </section>

      <section className="bg-white px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-red-600">Services</p>
            <h2 className="mb-4 text-3xl font-semibold md:text-4xl">Business services that support the website work.</h2>
            <p className="text-gray-600">Use The BrandHelper for one service, or let us combine the right services around your business goal.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <MiniCard title="Business Email Setup" text="Professional custom-domain email for your team and brand." image={emailImg} imageVariant="service" />
            <MiniCard title="Ads Management" text="Facebook, Instagram, and Google campaigns set up and managed properly." image={adsImg} imageVariant="service" />
            <MiniCard title="Brand Strategy" text="Clear positioning, messaging, and identity direction before you launch." image={brandImg} imageVariant="service" />
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-4">
            {supportCards.map((item) => <MiniCard key={item.title} title={item.title} text={item.text} image={item.image} imageVariant="service" />)}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to="/services" variant="red">Request a Service</ButtonLink>
            <ButtonLink to="/contact" variant="outline">Speak With Us</ButtonLink>
          </div>
        </div>
      </section>

      <section className="bg-black px-6 py-16 text-white md:py-20">
        <div className="mx-auto max-w-6xl">
          <ImageBand image={dataImg} alt="AI data and campaign analytics" dark>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-red-500">AI Data</p>
            <h2 className="mb-5 text-3xl font-semibold md:text-4xl">Datasets for OCR, ML, AI training, and document AI.</h2>
            <p className="mb-6 leading-relaxed text-gray-300">
              The BrandHelper provides proprietary and custom datasets for OCR, machine learning, AI training, document AI, and data-driven projects.
            </p>
            <div className="mb-7 grid gap-3 sm:grid-cols-2">
              {["OCR datasets", "Handwritten datasets", "Document AI datasets", "Custom data collection"].map((item) => (
                <div key={item} className="rounded border border-white/10 bg-white/5 p-4 text-sm text-gray-200">{item}</div>
              ))}
            </div>
            <ButtonLink to="/ai-data" variant="light">Explore AI Data</ButtonLink>
          </ImageBand>
        </div>
      </section>

      <section className="bg-white px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <ImageBand image={projectImg} alt="AI project planning" reverse>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-red-600">AI Projects</p>
            <h2 className="mb-5 text-3xl font-semibold md:text-4xl">Human support for AI training and data projects.</h2>
            <p className="mb-6 leading-relaxed text-gray-600">
              Companies can request help with data collection, annotation, model evaluation, OCR support, language projects, and human-in-the-loop work.
            </p>
            <div className="mb-7 grid grid-cols-2 gap-3">
              {aiProjects.map((item) => <MiniCard key={item} title={item} />)}
            </div>
            <ButtonLink to="/ai-projects" variant="red">Request AI Project Support</ButtonLink>
          </ImageBand>
        </div>
      </section>

      <section className="bg-[#F5F5F5] px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-red-600">Talent</p>
              <h2 className="mb-5 text-3xl font-semibold md:text-4xl">Request freelancers, contributors, or a managed team.</h2>
              <p className="mb-7 leading-relaxed text-gray-600">
                We can help companies find developers, AI trainers, annotators, evaluators, translators, local language contributors, researchers, and project support talent.
              </p>
              <ButtonLink to="/talent" variant="dark">Request Talent</ButtonLink>
            </div>
            <div className="grid gap-4 md:grid-cols-[0.95fr_1.05fr] md:items-stretch">
              <div className="overflow-hidden rounded-lg bg-gray-100">
                <img src={talentImg} alt="Talent contributors" className="h-full min-h-[260px] w-full object-cover" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {talent.map((item) => <MiniCard key={item} title={item} />)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-red-600">Explore The Platform</p>
              <h2 className="text-3xl font-semibold md:text-4xl">Choose the next step that fits what you need.</h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-gray-600">
              Website, portfolio, products, services, AI data, AI projects, talent, blueprint, and contact paths are all one click away.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pathways.map((item) => (
              <Link key={item.to} to={item.to} className="group rounded-lg border border-gray-100 bg-[#F8F8F8] p-5 transition hover:border-black hover:bg-white">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-base font-semibold">{item.title}</h3>
                  <span className="text-sm font-bold text-red-600 transition group-hover:translate-x-1">Go</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{item.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-red-700 px-6 py-16 text-center text-white md:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-5 text-3xl font-extrabold md:text-5xl">Have a project, product interest, or data need?</h2>
          <p className="mb-8 text-red-100">Tell us what you are trying to build, buy, launch, collect, or staff. We will help you choose the right next step.</p>
          <ButtonLink to="/contact" variant="light">Contact Us</ButtonLink>
        </div>
      </section>
    </div>
  );
}
