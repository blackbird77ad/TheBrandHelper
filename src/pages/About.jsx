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
            and businesses create long-term freedom.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="min-h-[60vh] flex items-center">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16">

          <div>
            <h2 className="text-3xl font-semibold mb-6">
              Our mission
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Brand Helper was created to make skill acquisition,
              business support, and digital growth accessible,
              practical, and trustworthy.
              <br /><br />
              We work with individuals, creators, and small businesses
              who want real results — not theory.
            </p>
          </div>

          <div className="h-[380px] bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">About Image</span>
          </div>

        </div>
      </section>

    </div>
  );
}
