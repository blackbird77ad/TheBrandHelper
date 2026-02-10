import React from "react";

export default function About() {
  return (
    <div className="bg-white text-black">

      {/* HERO */}
      <section className="min-h-[70vh] flex items-center bg-black text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-semibold mb-8">
            Why Brand Helper exists
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            We believe skills create income, income builds businesses,
            and businesses create long‑term freedom.
          </p>
        </div>
      </section>

      {/* STORY */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

          <div>
            <h2 className="text-3xl font-semibold mb-6">Our story</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Brand Helper was built to remove confusion from learning skills,
              starting businesses, and growing online.
              <br /><br />
              Too many people are sold motivation without structure.
              We focus on clarity, action, and real results.
            </p>
          </div>

          <div className="h-[380px] bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Story Image</span>
          </div>

        </div>
      </section>

      {/* MISSION */}
      <section className="bg-[#F5F5F5] py-24">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

          <div className="h-[380px] bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Mission Image</span>
          </div>

          <div>
            <h2 className="text-3xl font-semibold mb-6">Our mission</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Our mission is to make skill acquisition, business support,
              and digital growth accessible, practical, and trustworthy.
              <br /><br />
              We work with individuals, creators, and small businesses
              who want real outcomes — not theory.
            </p>
          </div>

        </div>
      </section>

      {/* VALUES */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-12">What we stand for</h2>

          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-xl font-semibold mb-3">Practical Skills</h3>
              <p className="text-gray-600">
                Every training and service is designed to generate real income.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Trust & Transparency</h3>
              <p className="text-gray-600">
                No hidden costs, no fake promises, no shortcuts.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Growth Mindset</h3>
              <p className="text-gray-600">
                We build systems that scale with you, not against you.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
