import React from "react"; 
import { Link } from "react-router-dom";

// Correct Images
import sewingImg from "../photos/sewing.jpg"; // correct sewing image
import braidingImg from "../photos/braiding.jpg";
import shoeMakingImg from "../photos/shoe mat and tools.png";
import soapImg from "../photos/soap.jpg";
import importationImg from "../photos/importation.jpg"; // correct importation image
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
        <div className="max-w-4xl mx-auto px-6 py-20 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Skill Trainings
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
            Practical programs designed to help you earn, grow, and scale with confidence.
          </p>
          <div className="mt-8 w-20 h-1 bg-[#E11D48] mx-auto md:mx-0" />
        </div>
      </section>

      {/* VERTICAL TRAININGS LIST */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          {trainings.map((item, i) => (
            <div
              key={i}
              className="group border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-xl transition duration-300 flex flex-col"
            >
              {/* Image */}
              <div className="w-full h-[280px] overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain object-center"
                />
              </div>

              {/* Accent */}
              <div className="h-1 bg-[#E11D48]" />

              {/* Content */}
              <div className="p-8 flex flex-col">
                <h3 className="text-xl font-semibold mb-3">
                  {item.name}
                </h3>

                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                  Hands-on training focused on real-world income and business application.
                </p>

                <Link
                  to={`/contact?source=${encodeURIComponent(
                    item.name + " training"
                  )}`}
                  className="mt-auto text-xs uppercase tracking-wider text-[#E11D48] hover:text-[#FF3366] transition"
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
