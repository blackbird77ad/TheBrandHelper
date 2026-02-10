import React from "react"; 
import { Link } from "react-router-dom";

// Import images from src/photos
import websiteDesignImg from "../photos/responsivewebdesign-1.png";
import websiteManagementImg from "../photos/website-page-inner-hero-img-1.webp";
import businessEmailImg from "../photos/1691647829597.jpg";
import adsManagementImg from "../photos/Facebook-Ads.webp";
import brandStrategyImg from "../photos/how-to-run-multiple-ad-campaigns-on-facebook-rd5rn3hdqt26ovpxwhalq8rtc9ddf1lrxx09wum2ng.png";
import consultingImg from "../photos/branding-hero.jpeg";

export default function Services() {
  const services = [
    { name: "Website Design", image: websiteDesignImg },
    { name: "Website Management", image: websiteManagementImg },
    { name: "Business Email Setup", image: businessEmailImg },
    { name: "Ads Management", image: adsManagementImg },
    { name: "Brand Strategy", image: brandStrategyImg },
    { name: "Consulting & Business Coaching", image: consultingImg },
  ];

  return (
    <div className="bg-black text-white">

      {/* HERO */}
      <section className="min-h-[60vh] flex items-center">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-5xl font-semibold mb-6">Business Services</h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            For founders who want results without the learning curve.
          </p>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="bg-white text-black py-20">
        <div className="max-w-6xl mx-auto px-6 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">

          {services.map((service, i) => (
            <div key={i} className="border rounded-lg p-6 hover:shadow-lg transition flex flex-col justify-between bg-gray-50">
              
              {/* Service Image */}
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-48 object-cover rounded mb-4"
              />

              <h3 className="text-2xl font-semibold mb-4">{service.name}</h3>
              <p className="text-gray-700 mb-6">
                Professional, reliable support tailored to your business goals and growth stage.
              </p>

              <Link
                to={`/contact?source=${encodeURIComponent(service.name + " service")}`}
                className="uppercase text-sm tracking-wide border-b border-black hover:text-[#FF3366] transition"
              >
                Get Started →
              </Link>
            </div>

            
          ))}

        </div>
      </section>
      {/* STORE CTA */}
<section className="bg-[#F5F5F5] py-20 text-center text-black">
  <h2 className="text-3xl font-semibold mb-6">
    Not ready for done-for-you services?
  </h2>
  <p className="text-gray-600 mb-8">
    Explore our store for affordable self-paced resources.
  </p>

  <Link
    to="/store"
    className="border border-black px-8 py-4 uppercase text-sm hover:bg-black hover:text-white transition"
  >
    Visit Store
  </Link>
</section>

    </div>
  );
}
