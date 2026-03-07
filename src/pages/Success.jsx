import React from "react";
import { Link } from "react-router-dom";

const WHATSAPP_GROUP = "https://chat.whatsapp.com/HpS3JYpWejM7L2sfVOSvek?mode=gi_t";
const ADMIN_WHATSAPP = "https://wa.me/+233544930276";

export default function Success() {
  return (
    <section className="min-h-screen bg-white flex items-center justify-center px-6 py-20">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-semibold mb-6 text-black">Thank You!</h1>

        <p className="text-gray-700 mb-6 text-lg">
          Your submission has been received successfully. 🎉<br />
          We will review it and get back to you soon.
        </p>

        <p className="text-gray-600 mb-8 text-sm">
          ⚠️ Focus on admins only — be aware of scammers!<br />
          You can also{" "}
          <a
            href={ADMIN_WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#E11D48] hover:text-[#FF3366] font-semibold"
          >
            contact an admin directly
          </a>.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={WHATSAPP_GROUP}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] text-white px-6 py-3 rounded hover:opacity-90 transition"
          >
            Join WhatsApp Group
          </a>

          <a
            href={ADMIN_WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#128C7E] text-white px-6 py-3 rounded hover:opacity-90 transition"
          >
            Message Admin
          </a>

          <Link
            to="/"
            className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
