import React from "react";
import { Link } from "react-router-dom";

import recordedImg from "../photos/recorded-skill-trainings.jpg";
import guidesImg from "../photos/business-branding-guides.jpg";
import toolkitImg from "../photos/store2.png";

export default function Store() {
  const items = [
    {
      title: "Recorded Skill Trainings",
      description:
        "Step-by-step video lessons covering sewing, footwear, soap making, branding and more — learn anytime, anywhere.",
      image: recordedImg,
    },
    {
      title: "Business & Branding Guides",
      description:
        "Structured eBooks and downloadable PDFs to help you build, position, and grow your brand professionally.",
      image: guidesImg,
    },
    {
      title: "Marketing Toolkits",
      description:
        "Templates, checklists, ad creatives and ready-to-use resources to promote your business confidently.",
      image: toolkitImg,
    },
  ];

  return (
    <div className="bg-white text-black">
      {/* HERO */}
      <section className="min-h-[60vh] flex items-center bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Digital Store
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
            Practical digital products designed to help you learn faster,
            build smarter, and grow confidently.
          </p>
          <div className="mt-8 w-20 h-1 bg-[#E11D48]"></div>
        </div>
      </section>

      {/* VERTICAL STORE LIST */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          {items.map((item, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition duration-300 bg-white"
            >
              <div className="w-full h-[280px] bg-gray-100 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <div className="p-8">
                <h3 className="text-xl font-semibold mb-4">
                  {item.title}
                </h3>

                <p className="text-gray-600 leading-relaxed mb-6">
                  {item.description}
                </p>

                <button className="border border-black px-8 py-3 text-xs uppercase tracking-wider hover:bg-black hover:text-white transition">
                  Coming Soon
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#F5F5F5] py-20 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">
          Prefer guided support?
        </h2>
        <p className="text-gray-600 mb-8">
          Explore our services or join our live practical trainings.
        </p>

        <div className="flex flex-col items-center gap-6">
          <Link
            to="/services"
            className="border border-black px-8 py-4 uppercase text-xs tracking-wider hover:bg-black hover:text-white transition"
          >
            Services
          </Link>

          <Link
            to="/trainings"
            className="bg-[#E11D48] text-white px-8 py-4 uppercase text-xs tracking-wider hover:opacity-90 transition"
          >
            Trainings
          </Link>
        </div>
      </section>
    </div>
  );
}
