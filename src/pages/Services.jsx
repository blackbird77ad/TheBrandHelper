import React from "react";
import { Link } from "react-router-dom";

// Images
import websiteDesignImg from "../photos/responsivewebdesign-1.png";
import websiteManagementImg from "../photos/website-page-inner-hero-img-1.webp";
import businessEmailImg from "../photos/custom-domain-email-mailbox-1.jpg";
import adsManagementImg from "../photos/Facebook-Ads.webp";
import brandStrategyImg from "../photos/how-to-run-multiple-ad-campaigns-on-facebook-rd5rn3hdqt26ovpxwhalq8rtc9ddf1lrxx09wum2ng.png";
import consultingImg from "../photos/consult.jpg";

export default function Services() {
  const services = [
    {
      name: "Website Design",
      image: websiteDesignImg,
      description:
        "Modern, responsive websites built to convert visitors into clients.",
    },
    {
      name: "Website Management",
      image: websiteManagementImg,
      description:
        "We maintain, update, and optimize your website for performance.",
    },
    {
      name: "Business Email Setup",
      image: businessEmailImg,
      description:
        "Professional custom-domain email that builds trust and credibility.",
    },
    {
      name: "Ads Management",
      image: adsManagementImg,
      description:
        "Strategic ad campaigns that generate leads and real business growth.",
    },
    {
      name: "Brand Strategy",
      image: brandStrategyImg,
      description:
        "Clear positioning and messaging that makes your brand stand out.",
    },
    {
      name: "Consulting & Coaching",
      image: consultingImg,
      description:
        "Personalized guidance to help you scale with clarity and structure.",
    },
  ];

  return (
    <div className="bg-white text-black">

      {/* HERO */}
      <section className="bg-black text-white py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-semibold mb-6">
            Business Services
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Done-for-you solutions designed for serious founders who want
            structure, clarity, and real results.
          </p>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">

          {services.map((service, i) => (
            <div
              key={i}
              className="bg-white border rounded-xl shadow-sm hover:shadow-xl transition duration-300 flex flex-col"
            >
              {/* Image */}
              <div className="h-56 bg-white flex items-center justify-center p-6 border-b">
                <img
                  src={service.image}
                  alt={service.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-semibold mb-4">
                  {service.name}
                </h3>

                <p className="text-gray-600 mb-6 flex-grow">
                  {service.description}
                </p>

                <Link
                  to={`/contact?source=${encodeURIComponent(
                    service.name + " service"
                  )}`}
                  className="inline-block mt-auto bg-black text-white px-6 py-3 text-sm uppercase tracking-wide hover:bg-[#E11D48] transition text-center"
                >
                  Get Started
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STRONG CTA */}
      <section className="bg-[#F5F5F5] py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-semibold mb-6">
            Ready to grow your business properly?
          </h2>
          <p className="text-gray-600 text-lg mb-10">
            Let’s structure your business for visibility, credibility, and
            sustainable growth.
          </p>

          <Link
            to="/contact"
            className="bg-black text-white px-10 py-4 uppercase text-sm tracking-wide hover:bg-[#E11D48] transition"
          >
            Book a Consultation
          </Link>
        </div>
      </section>

    </div>
  );
}
