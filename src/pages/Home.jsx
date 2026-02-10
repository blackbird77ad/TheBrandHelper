import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

// Import images from src/photos
import heroImg from "../photos/branding-hero.jpeg";
import trainingImg from "../photos/branding.jpg";
import servicesImg from "../photos/Facebook-Ads.webp";

export default function Home() {
  return (
    <div className="bg-white text-black">

      {/* ================= SEO ================= */}
      <Helmet>
        <title>The Brand Helper | Training, Digital Skills & Business Growth</title>
        <meta
          name="description"
          content="The Brand Helper provides digital skills training, brand development, and business support for individuals and startups."
        />
        <meta property="og:site_name" content="The Brand Helper" />
        <meta property="og:title" content="The Brand Helper" />
        <meta
          property="og:description"
          content="Training, digital skills, and business growth support."
        />
        <meta property="og:url" content="https://thebrandhelper.com" />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* ================= HERO ================= */}
      <section className="min-h-[90vh] flex flex-col md:flex-row items-center bg-black text-white px-6 md:px-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 w-full">
          
          <div className="md:w-1/2">
            <h1 className="text-5xl md:text-6xl font-semibold leading-tight mb-8">
              Build skills. <br />
              Build income. <br />
              Build ownership.
            </h1>
            <p className="text-gray-300 text-lg max-w-xl mb-10">
              Brand Helper helps individuals and small businesses learn
              practical skills and access modern digital services
              to grow sustainably.
            </p>
            <div className="flex gap-4 md:gap-6 flex-wrap">
              <Link
                to="/trainings"
                className="bg-[#E11D48] text-white px-6 py-3 text-sm uppercase tracking-wide hover:opacity-90 transition"
              >
                View Trainings
              </Link>
              <Link
                to="/services"
                className="border border-white px-6 py-3 text-sm uppercase tracking-wide hover:bg-white hover:text-black transition"
              >
                Business Services
              </Link>
            </div>
          </div>

          <div className="md:w-1/2 h-[300px] md:h-[520px] rounded-lg overflow-hidden flex items-center justify-center">
            <img
              src={heroImg}
              alt="Hero"
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="min-h-[60vh] flex items-center bg-[#F5F5F5] px-6">
        <div className="max-w-6xl mx-auto w-full text-center">
          <h2 className="text-4xl font-semibold mb-16">A simple, trusted process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              ["01", "Choose a program"],
              ["02", "Register securely"],
              ["03", "Make payment"],
              ["04", "Join & start learning"]
            ].map(([num, text]) => (
              <div key={num} className="bg-white p-6 rounded-xl shadow-md">
                <div className="text-[#A78BFA] text-2xl font-medium mb-3">{num}</div>
                <p className="text-lg">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TRAININGS OVERVIEW ================= */}
      <section className="min-h-[80vh] flex flex-col md:flex-row items-center bg-white px-6">
        <div className="md:w-1/2 h-[280px] md:h-[420px] rounded-lg overflow-hidden flex items-center justify-center mb-8 md:mb-0">
          <img
            src={trainingImg}
            alt="Training Visual"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="md:w-1/2 md:pl-12">
          <h2 className="text-4xl font-semibold mb-6">Practical skill training</h2>
          <p className="text-gray-600 text-lg max-w-xl mb-8">
            Hands-on programs designed for real income — from creative trades to digital and business skills.
          </p>
          <Link
            to="/trainings"
            className="inline-block border border-black px-6 py-3 text-sm uppercase tracking-wide hover:bg-black hover:text-white transition"
          >
            Explore Trainings
          </Link>
        </div>
      </section>

      {/* ================= SERVICES OVERVIEW ================= */}
      <section className="min-h-[60vh] flex flex-col md:flex-row items-center bg-black text-white px-6">
        <div className="md:w-1/2 md:pr-12 order-2 md:order-1">
          <h2 className="text-4xl font-semibold mb-6">Done-for-you business services</h2>
          <p className="text-gray-300 text-lg max-w-xl mb-8">
            For founders who want results without the learning curve.
            We design, manage, and grow digital businesses.
          </p>
          <Link
            to="/services"
            className="bg-[#A78BFA] text-black px-6 py-3 text-sm uppercase tracking-wide hover:opacity-90 transition"
          >
            View Services
          </Link>
        </div>
        <div className="md:w-1/2 h-[280px] md:h-[360px] rounded-lg overflow-hidden flex items-center justify-center order-1 md:order-2 mb-8 md:mb-0">
          <img
            src={servicesImg}
            alt="Services Visual"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* ================= STORE TEASER ================= */}
<section className="min-h-[60vh] flex items-center bg-[#F5F5F5]">
  <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

    <div>
      <h2 className="text-4xl font-semibold mb-6">
        Learn at your own pace
      </h2>
      <p className="text-gray-600 text-lg mb-8">
        Access recorded trainings, business guides,
        and digital tools from our store.
      </p>

      <Link
        to="/store"
        className="inline-block bg-black text-white px-8 py-4 text-sm uppercase tracking-wide hover:opacity-90 transition"
      >
        Visit Store
      </Link>
    </div>

    <div className="h-[360px] bg-gray-200 rounded-lg flex items-center justify-center">
      <span className="text-gray-500">Store Visual</span>
    </div>

  </div>
</section>


      {/* ================= CTA ================= */}
      <section className="min-h-[60vh] flex items-center bg-white text-center px-6">
        <div className="max-w-3xl mx-auto w-full">
          <h2 className="text-4xl font-semibold mb-8">Start building something real</h2>
          <p className="text-gray-600 text-lg mb-10">
            Learn a skill. Grow a business. Create long-term value.
          </p>
          <Link
            to="/trainings"
            className="bg-[#E11D48] text-white px-8 py-3 text-sm uppercase tracking-wide hover:opacity-90 transition"
          >
            Get Started
          </Link>
        </div>
      </section>

    </div>
  );
}
