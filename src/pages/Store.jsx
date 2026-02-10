import React from "react";
import { Link } from "react-router-dom";

export default function Store() {
  const items = [
    {
      title: "Recorded Skill Trainings",
      description: "Self-paced video lessons you can watch anytime.",
    },
    {
      title: "Business & Branding Guides",
      description: "Practical eBooks and PDFs for real-world growth.",
    },
    {
      title: "Marketing Toolkits",
      description: "Templates, checklists, and ad-ready resources.",
    },
  ];

  return (
    <div className="bg-white text-black">

      {/* HERO */}
      <section className="min-h-[60vh] flex items-center bg-black text-white">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-5xl font-semibold mb-6">Store</h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            Learn and build at your own pace with digital products,
            recorded trainings, and business tools.
          </p>
        </div>
      </section>

      {/* STORE GRID */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">

          {items.map((item, i) => (
            <div
              key={i}
              className="border p-8 hover:shadow-lg transition"
            >
              <div className="h-[180px] bg-gray-200 mb-6 flex items-center justify-center">
                <span className="text-gray-500">Product Image</span>
              </div>

              <h3 className="text-xl font-semibold mb-4">
                {item.title}
              </h3>

              <p className="text-gray-600 mb-6">
                {item.description}
              </p>

              <button className="border border-black px-6 py-3 text-sm uppercase tracking-wide hover:bg-black hover:text-white transition">
                Coming Soon
              </button>
            </div>
          ))}

        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#F5F5F5] py-20 text-center">
        <h2 className="text-3xl font-semibold mb-6">
          Prefer guided support?
        </h2>
        <p className="text-gray-600 mb-8">
          You can also explore our services or live trainings.
        </p>

        <div className="flex justify-center gap-6">
          <Link
            to="/services"
            className="border border-black px-8 py-4 uppercase text-sm hover:bg-black hover:text-white transition"
          >
            Services
          </Link>

          <Link
            to="/trainings"
            className="bg-[#E11D48] text-white px-8 py-4 uppercase text-sm hover:opacity-90 transition"
          >
            Trainings
          </Link>
        </div>
      </section>

    </div>
  );
}
