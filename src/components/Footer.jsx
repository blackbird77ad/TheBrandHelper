import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black text-white">

      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-4 gap-16">

        {/* Brand */}
        <div>
          <h3 className="text-lg font-semibold mb-6">
            Brand<span className="text-[#E11D48]">Helper</span>
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Skills, services, and systems designed
            to help individuals and businesses grow sustainably.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-xs uppercase tracking-wide text-red-600 mb-6">
            Navigation
          </h4>
          <ul className="space-y-4 text-sm">
            <li><Link to="/" className="hover:text-[#A78BFA] transition">Home</Link></li>
            <li><Link to="/trainings" className="hover:text-[#A78BFA] transition">Trainings</Link></li>
            <li><Link to="/services" className="hover:text-[#A78BFA] transition">Services</Link></li>
            <li><Link to="/about" className="hover:text-[#A78BFA] transition">About</Link></li>
          </ul>
        </div>

        {/* Offerings */}
        <div>
          <h4 className="text-xs uppercase tracking-wide text-red-600 mb-6">
            What we do
          </h4>
          <ul className="space-y-4 text-sm text-gray-300">
            <li>Skill Trainings</li>
             <li>Business Support</li>
            <li>Website Development</li>
            <li>Ads Management</li>
           
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xs uppercase tracking-wide text-red-600 mb-6">
            Contact
          </h4>
          <p className="text-sm text-gray-300"> Email: info@brandhelper.com</p>
          <p className="text-sm text-gray-300">Call or Whatsapp: +233 544930276</p>
           <p className="text-sm text-gray-300">Call or Whatsapp: +233 548894600</p>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-white/10 text-center py-6 text-xs text-gray-400">
        © {new Date().getFullYear()} The Brand Helper. All rights reserved.
      <div className="text-xs text-red-600">Contact Developer: blackbird77ad@gmail.com</div>
      </div>

    </footer>
  );
}
