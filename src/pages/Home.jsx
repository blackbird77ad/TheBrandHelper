import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

// Hero and other visuals
import heroImg from "../photos/branding-hero.jpeg";
import servicesImg from "../photos/Facebook-Ads.webp";
import storeVisualImg from "../photos/store.jpg";

// Learners' work images
import soapIng from "../photos/soap ing.jpg";          // 1st soap
import soap from "../photos/soap.jpg";                // 2nd soap
import shoeLast from "../photos/shoe last.jpg";       // Footwear
import sewingCard from "../photos/sewingcard.jpg";    // Dress
import durag from "../photos/durag.jpg";             // Durag
import braiding from "../photos/braiding.jpg";       // Hair

// Gallery images
import gallery1 from "../photos/gallery.jpeg";
import gallery2 from "../photos/gallery2.jpeg";
import gallery3 from "../photos/gallery3.jpeg";
import gallery4 from "../photos/gallery4.jpeg";
import gallery5 from "../photos/gallery5.jpeg";
import gallery6 from "../photos/gallery6.jpeg";

// Professional action image for after program steps
import trainingActionImg from "../photos/about1.png";

export default function Home() {
  const programSteps = [
    ["01", "Decide on Training/Service"],
    ["02", "Register to secure your spot"],
    ["03", "Join WhatsApp to learn more about training"],
  ];

  // Learners' work with descriptions
  const learnersWork = [
    { img: soapIng, desc: "Soap Making" },
    { img: soap, desc: "Soap Making" },
    { img: shoeLast, desc: "Footwear" },
    { img: sewingCard, desc: "Dress Making" },
    { img: durag, desc: "Durag" },
    { img: braiding, desc: "Hair Braiding" },
  ];

  const galleryImages = [
    gallery1,
    gallery2,
    gallery3,
    gallery4,
    gallery5,
    gallery6,
  ];

  return (
    <div className="bg-white text-black">

      {/* ================= SEO ================= */}
      <Helmet>
        <title>The Brand Helper | Training, Digital Skills & Business Growth</title>
        <meta
          name="description"
          content="The Brand Helper provides digital skills training, brand development, and business support for individuals and startups."
        />
      </Helmet>

      {/* ================= HERO ================= */}
      <section className="min-h-[90vh] flex flex-col md:flex-row items-center bg-black text-white px-6 md:px-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 w-full">
          
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              Build Skills. <span className="text-red-600">Earn Income.</span> <br />
              Build <span className="text-red-600">Ownership</span>.
            </h1>
            <p className="text-gray-300 text-lg max-w-xl mb-8">
              Brand Helper guides individuals and small businesses to gain real skills, start businesses, and grow with confidence.
            </p>
            <div className="flex gap-4 md:gap-6 flex-wrap justify-center md:justify-start">
              <Link
                to="/trainings"
                className="bg-red-600 text-white px-6 py-3 text-sm uppercase tracking-wide hover:opacity-90 transition"
              >
                View Trainings
              </Link>
              <Link
                to="/services"
                className="border border-white px-6 py-3 text-sm uppercase tracking-wide hover:bg-white hover:text-black transition"
              >
                Business Services
              </Link>
            </div>
          </div>

          <div className="md:w-1/2 h-[300px] md:h-[520px] rounded-lg overflow-hidden flex items-center justify-center shadow-xl">
            <img
              src={heroImg}
              alt="Hero"
              className="w-full h-full object-cover object-center"
            />
          </div>

        </div>
      </section>

      {/* ================= PROGRAM STEPS ================= */}
      <section className="py-24 bg-[#F5F5F5]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-semibold mb-16">A simple, trusted process</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {programSteps.map(([num, text]) => (
              <div key={num} className="bg-white p-6 rounded-xl shadow-md">
                <div className="text-red-600 text-2xl font-bold mb-3">{num}</div>
                <p className="text-lg">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TRAINING ACTION IMAGE ================= */}
      <section className="py-24 bg-white flex justify-center">
        <div className="max-w-6xl w-full rounded-lg overflow-hidden shadow-lg">
          <img
            src={trainingActionImg}
            alt="Hands-on training"
            className="w-full h-[400px] md:h-[500px] object-cover object-center rounded-lg"
          />
        </div>
      </section>

      {/* ================= SERVICES OVERVIEW ================= */}
      <section className="py-24 flex flex-col md:flex-row items-center bg-black text-white px-6 gap-12">
        <div className="md:w-1/2 md:pr-12 order-2 md:order-1">
          <h2 className="text-4xl font-semibold mb-6">Done-for-you business services</h2>
          <p className="text-gray-300 text-lg max-w-xl mb-8">
            For founders who want results without the learning curve.
            We design, manage, and grow digital businesses.
          </p>
          <Link
            to="/services"
            className="bg-red-600 text-white px-6 py-3 text-sm uppercase tracking-wide hover:opacity-90 transition"
          >
            View Services
          </Link>
        </div>
        <div className="md:w-1/2 h-[280px] md:h-[360px] rounded-lg overflow-hidden flex items-center justify-center order-1 md:order-2">
          <img
            src={servicesImg}
            alt="Services Visual"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </section>

      {/* // ================= WHAT OUR LEARNERS MAKE ================= */}
<section className="py-24 bg-[#F5F5F5]">
  <div className="max-w-6xl mx-auto px-6 text-center">
    <h2 className="text-4xl font-semibold mb-12">What Our Learners Make</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {[
        { img: soapIng, desc: "Soap Making" },       // only first soap
        { img: shoeLast, desc: "Footwear" },
        { img: sewingCard, desc: "Dress Making" },
        { img: durag, desc: "Durag" },
        { img: braiding, desc: "Hair Braiding" },
      ].map((item, idx) => (
        <div key={idx} className="rounded-lg overflow-hidden shadow-lg">
          <div className="h-[220px] md:h-[240px] w-full">
            <img
              src={item.img}
              alt={item.desc}
              className="w-full h-full object-cover object-center"
            />
          </div>
          <p className="mt-2 text-gray-700 font-medium">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>

<section className="py-24 bg-white">
  <div className="max-w-6xl mx-auto px-6 text-center">
    <h2 className="text-4xl font-semibold mb-12">Our Learners' Gallery</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {galleryImages.map((img, idx) => (
        <div key={idx} className="h-[150px] md:h-[180px] rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
          <img
            src={img}
            alt={`Gallery ${idx + 1}`}
            className="w-full h-full md:object-cover object-contain object-center"
          />
        </div>
      ))}
    </div>
  </div>
</section>


      {/* ================= STORE TEASER ================= */}
      <section className="py-24 flex items-center bg-white px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-semibold mb-6">
              Learn at your own pace
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Access recorded trainings, business guides, and digital tools from our store.
            </p>

            <Link
              to="/store"
              className="inline-block bg-black text-white px-8 py-4 text-sm uppercase tracking-wide hover:opacity-90 transition"
            >
              Visit Store
            </Link>
          </div>

          <div className="h-[360px] rounded-lg overflow-hidden flex items-center justify-center">
            <img
              src={storeVisualImg}
              alt="Store Visual"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24 flex items-center bg-[#FAFAFA] text-center px-6">
        <div className="max-w-3xl mx-auto w-full">
          <h2 className="text-4xl font-semibold mb-8">Start building something real</h2>
          <p className="text-gray-600 text-lg mb-10">
            Learn a skill. Grow a business. Create long-term value.
          </p>
          <Link
            to="/trainings"
            className="bg-red-600 text-white px-8 py-3 text-sm uppercase tracking-wide hover:opacity-90 transition"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}
