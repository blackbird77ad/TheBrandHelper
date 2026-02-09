import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";


export default function Home() {
  return (
    <div className="bg-white text-black">
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
      </Helmet>
      {/* HERO (90vh)*/}
      <section className="min-h-[90vh] flex items-center bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

          {/* Text */}
          <div>
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

            <div className="flex gap-6">
              <Link
                to="/trainings"
                className="bg-[#E11D48] text-white px-8 py-4 text-sm uppercase tracking-wide hover:opacity-90 transition"
              >
                View Trainings
              </Link>

              <Link
                to="/services"
                className="border border-white px-8 py-4 text-sm uppercase tracking-wide hover:bg-white hover:text-black transition"
              >
                Business Services
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="h-[420px] md:h-[520px] bg-white/10 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">Hero Image</span>
          </div>

        </div>
      </section>

      {/* ================= HOW IT WORKS (60vh) ================= */}
      <section className="min-h-[60vh] flex items-center bg-[#F5F5F5]">
        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-4xl font-semibold mb-16">
            A simple, trusted process
          </h2>

          <div className="grid md:grid-cols-4 gap-12">
            {[
              ["01", "Choose a program"],
              ["02", "Register securely"],
              ["03", "Make payment"],
              ["04", "Join & start learning"]
            ].map(([num, text]) => (
              <div key={num}>
                <div className="text-[#A78BFA] text-2xl font-medium mb-3">
                  {num}
                </div>
                <p className="text-lg">{text}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= TRAININGS OVERVIEW (80vh) ================= */}
      <section className="min-h-[80vh] flex items-center bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

          {/* Image */}
          <div className="h-[420px] bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Training Visual</span>
          </div>

          {/* Text */}
          <div>
            <h2 className="text-4xl font-semibold mb-6">
              Practical skill training
            </h2>

            <p className="text-gray-600 text-lg max-w-xl mb-8">
              Hands-on programs designed for real income —
              from creative trades to digital and business skills.
            </p>

            <Link
              to="/trainings"
              className="inline-block border border-black px-8 py-4 text-sm uppercase tracking-wide hover:bg-black hover:text-white transition"
            >
              Explore Trainings
            </Link>
          </div>

        </div>
      </section>

      {/* ================= SERVICES OVERVIEW (60vh) ================= */}
      <section className="min-h-[60vh] flex items-center bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

          {/* Text */}
          <div>
            <h2 className="text-4xl font-semibold mb-6">
              Done-for-you business services
            </h2>

            <p className="text-gray-300 text-lg max-w-xl mb-8">
              For founders who want results without the learning curve.
              We design, manage, and grow digital businesses.
            </p>

            <Link
              to="/services"
              className="bg-[#A78BFA] text-black px-8 py-4 text-sm uppercase tracking-wide hover:opacity-90 transition"
            >
              View Services
            </Link>
          </div>

          {/* Image */}
          <div className="h-[360px] bg-white/10 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">Services Visual</span>
          </div>

        </div>
      </section>

      {/* ================= CTA (60vh) ================= */}
      <section className="min-h-[60vh] flex items-center bg-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-semibold mb-8">
            Start building something real
          </h2>

          <p className="text-gray-600 text-lg mb-10">
            Learn a skill. Grow a business. Create long-term value.
          </p>

          <Link
            to="/trainings"
            className="bg-[#E11D48] text-white px-10 py-5 text-sm uppercase tracking-wide hover:opacity-90 transition"
          >
            Get Started
          </Link>
        </div>
      </section>

    </div>
  );
}
