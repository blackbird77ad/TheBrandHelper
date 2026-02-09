import React from "react";
import { Link } from "react-router-dom";

export default function Trainings() {
  const trainings = [
    "Sewing & Fashion",
    "Braiding & Hair Business",
    "Shoe Making",
    "Soap & Skincare",
    "Importation",
    "Ads & Digital Promotion"
  ];

  return (
    <div className="bg-white text-black">

      {/* HERO */}
      <section className="min-h-[60vh] flex items-center bg-[#F5F5F5]">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-5xl font-semibold mb-6">Skill Trainings</h1>
          <p className="text-gray-600 text-lg max-w-2xl">
            Practical programs designed to help you earn, grow, and scale with confidence.
          </p>
        </div>
      </section>

      {/* TRAININGS GRID */}
      <section className="min-h-[80vh] py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">

          {trainings.map((item, i) => (
            <div key={i} className="border p-8 hover:shadow-lg transition">
              <div className="h-[180px] bg-gray-200 mb-6 flex items-center justify-center">
                <span className="text-gray-500">Image</span>
              </div>

              <h3 className="text-xl font-semibold mb-4">{item}</h3>
              <p className="text-gray-600 mb-6">
                Hands-on training focused on real-world income and business application.
              </p>

              {/* Dynamic source hidden via URL param */}
              <Link
                to={`/contact?source=${encodeURIComponent(item + " training")}`}
                className="text-sm uppercase tracking-wide text-[#E11D48] hover:text-[#FF3366] transition"
              >
                Register →
              </Link>
            </div>
          ))}

        </div>
      </section>
    </div>
  );
}
