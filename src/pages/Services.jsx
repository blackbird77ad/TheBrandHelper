import React from "react";
import { Link } from "react-router-dom";

export default function Services() {
  const services = [
    "Website Design",
    "Website Management",
    "Business Email Setup",
    "Ads Management",
    "Brand Strategy"
  ];

  return (
    <div className="bg-black text-white">

      {/* HERO */}
      <section className="min-h-[60vh] flex items-center">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-5xl font-semibold mb-6">
            Business services
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            For founders who want results without the learning curve.
          </p>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-white text-black py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16">

          {services.map((service, i) => (
            <div key={i}>
              <h3 className="text-2xl font-semibold mb-4">
                {service}
              </h3>
              <p className="text-gray-600 mb-6">
                Professional, reliable support tailored to your
                business goals and growth stage.
              </p>
              <Link
                to="/contact"
                className="uppercase text-sm tracking-wide border-b border-black"
              >
                Get started
              </Link>
            </div>
          ))}

        </div>
      </section>

    </div>
  );
}
