import React from "react";

// Images
import storyImg from "../photos/close-up-hands-of-a-professional-seamstress-female-2025-04-06-07-35-25-utc_1.webp";
import missionImg from "../photos/perfecthero.png";

// Trainings
import sewingImg from "../photos/sewingcard.jpg";
import shoeImg from "../photos/shoe mat and tools.png";
import soapImg from "../photos/soap.jpg";
import brandingImg from "../photos/branding-hero.jpeg";
import moreToComeImg from "../photos/etc-more-to-come.jpg";

// Services
import websiteImg from "../photos/website-page-inner-hero-img-1.webp";
import adsImg from "../photos/Facebook-Ads.webp";
import emailImg from "../photos/custom-domain-email-mailbox-1.jpg";

export default function About() {
  const trainings = [
    { title: "Sewing", img: sewingImg, desc: "Learn to make clothes and craft with precision." },
    { title: "Shoe Making", img: shoeImg, desc: "Create footwear from scratch with expert guidance." },
    { title: "Soap Making", img: soapImg, desc: "Handcraft artisanal soaps ready for sale." },
    { title: "Branding", img: brandingImg, desc: "Design and develop your brand identity." },
    { title: "More to Come", img: moreToComeImg, desc: "Exciting new trainings coming soon!" },
  ];

  const services = [
    { title: "Website Development", img: websiteImg },
    { title: "Professional Email", img: emailImg },
    { title: "Ads Running", img: adsImg },
    { title: "More to Come", img: moreToComeImg },
  ];

  return (
    <div className="bg-white text-black">

      {/* HERO */}
      <section className="min-h-[75vh] flex items-center bg-black text-white px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Welcome to Brand Helper
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto mb-10">
            We empower individuals and small businesses to acquire practical skills, grow income, 
            and build sustainable ventures — with the right guidance every step of the way.
          </p>
          <a
            href="/contact"
            className="inline-block bg-[#E11D48] px-8 py-3 rounded text-white uppercase tracking-wide hover:opacity-90 transition"
          >
            Get Started
          </a>
        </div>
      </section>

      {/* STORY */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-semibold mb-6">Our Story</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Brand Helper was built to remove confusion from learning skills and growing businesses. 
              <br /><br />
              Many are sold motivation without practical structure. We provide clarity, action, and real results for every learner.
            </p>
          </div>
          <div className="w-full rounded-lg overflow-hidden flex items-center justify-center">
            <img
              src={storyImg}
              alt="Our Story"
              className="w-full max-h-[500px] object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="py-24 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-12">What We Do</h2>

          {/* Trainings */}
          <h3 className="text-2xl font-semibold mb-6">Trainings We Teach</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
            {trainings.map((item, idx) => (
              <div key={idx} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition transform hover:scale-105 flex flex-col">
                <div className="h-[250px] w-full overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex flex-col items-center">
                  <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
                  <p className="text-gray-500 text-sm">{item.desc || ""}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Services */}
          <h3 className="text-2xl font-semibold mb-6">Services We Render</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {services.map((item, idx) => (
              <div key={idx} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition transform hover:scale-105 flex flex-col">
                <div className="h-[250px] w-full overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-center">{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRAINING OPPORTUNITIES */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-6">Training Opportunities</h2>
          <p className="text-gray-700 text-lg mb-8 leading-relaxed">
            Weekly and monthly training sessions to kickstart your entrepreneurship journey. 
            Can’t find the training you want? We’ll match you with the right trainer. 
            Leave us a message and let’s explore your potential together.
          </p>
          <a
            href="/contact"
            className="inline-block bg-black px-8 py-3 rounded text-white uppercase tracking-wide hover:opacity-90 transition"
          >
            Contact Us
          </a>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-24 bg-[#F5F5F5]">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="w-full rounded-lg overflow-hidden flex items-center justify-center">
            <img
              src={missionImg}
              alt="Our Mission"
              className="w-full max-h-[500px] object-cover object-center"
            />
          </div>
          <div>
            <h2 className="text-3xl font-semibold mb-6">Our Mission</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              To make skill acquisition, business support, and digital growth accessible, practical, and trustworthy. 
              <br /><br />
              We work with individuals, creators, and small businesses who want real outcomes — not theory.
            </p>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-12">What We Stand For</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-xl font-semibold mb-3">Practical Skills</h3>
              <p className="text-gray-600">Every training and service is designed to generate real income.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Trust & Transparency</h3>
              <p className="text-gray-600">No hidden costs, no fake promises, no shortcuts.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Growth Mindset</h3>
              <p className="text-gray-600">We build systems that scale with you, not against you.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
