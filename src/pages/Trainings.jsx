import React from "react";
import { Link } from "react-router-dom";

// Images
import sewingImg from "../photos/452a6a_1d0c0494ff47445c9b43ac2f02bb2fe1~mv2.avif";
import braidingImg from "../photos/452a6a_1d0c0494ff47445c9b43ac2f02bb2fe1~mv2 copy.avif";
import shoeMakingImg from "../photos/branding.jpg";
import soapImg from "../photos/images (1).jpg";
import importationImg from "../photos/images (2).jpg";
import adsImg from "../photos/Facebook-Ads.webp";

export default function Trainings() {
  const trainings = [
    { name: "Sewing & Fashion", image: sewingImg },
    { name: "Braiding & Hair Business", image: braidingImg },
    { name: "Shoe Making", image: shoeMakingImg },
    { name: "Soap & Skincare", image: soapImg },
    { name: "Importation", image: importationImg },
    { name: "Ads & Digital Promotion", image: adsImg },
  ];

  return (
    <div className="bg-white text-black">

      {/* HERO */}
      <section className="min-h-[60vh] flex items-center bg-black text-white">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-5xl font-semibold mb-6">
            Skill Trainings
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            Practical programs designed to help you earn, grow, and scale with confidence.
          </p>
        </div>
      </section>

      {/* TRAININGS GRID */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">

          {trainings.map((item, i) => (
            <div
              key={i}
              className="group border rounded-xl overflow-hidden bg-white hover:shadow-xl transition"
            >

              {/* Image */}
              <div className="relative h-52">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition" />
              </div>

              {/* Red accent */}
              <div className="h-1 bg-[#E11D48]" />

              {/* Content */}
              <div className="p-6 flex flex-col">
                <h3 className="text-xl font-semibold mb-3">
                  {item.name}
                </h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                  Hands-on training focused on real-world income and business application.
                </p>

                <Link
                  to={`/contact?source=${encodeURIComponent(item.name + " training")}`}
                  className="mt-auto text-sm uppercase tracking-wide text-[#E11D48] hover:text-[#FF3366] transition"
                >
                  Register →
                </Link>
              </div>

            </div>
          ))}

        </div>
      </section>
    </div>
  );
}
