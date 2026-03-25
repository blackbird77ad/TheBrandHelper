import React from "react";
import { Link } from "react-router-dom";

const WHATSAPP_GROUP = "https://chat.whatsapp.com/HpS3JYpWejM7L2sfVOSvek?mode=gi_t";
const ADMIN_WHATSAPP = "https://wa.me/+233544930276";

export default function Success() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 py-20">
      <div className="max-w-2xl mx-auto text-center text-white">

        <div className="text-6xl mb-6">🎉</div>

        <h1 className="text-4xl font-extrabold mb-4">Brief Received!</h1>

        <p className="text-gray-300 text-lg mb-3 leading-relaxed">
          Thank you — we've received your project brief and will review it shortly.
        </p>
        <p className="text-gray-400 mb-10 text-sm">
          We typically respond within a few hours on WhatsApp, or within 24 hours by email.
        </p>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10 text-left">
          <p className="text-sm font-bold text-white mb-3">What happens next:</p>
          <div className="flex flex-col gap-3">
            {[
              "We review your brief and prepare questions if needed",
              "We reach out to schedule a free consultation call",
              "We align on scope, timeline, and exact pricing",
              "You approve — we start building",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {step}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 mb-10">
          <p className="text-yellow-300 text-sm">
            ⚠️ <span className="font-bold">Watch out for scammers.</span> Our team will only contact you from official channels. If in doubt, message the admin directly below.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={WHATSAPP_GROUP}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-white px-7 py-3 rounded-xl font-bold text-sm hover:bg-green-600 transition"
          >
            💬 Join WhatsApp Group
          </a>
          <a
            href={ADMIN_WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/10 border border-white/20 text-white px-7 py-3 rounded-xl font-bold text-sm hover:bg-white/20 transition"
          >
            Message Admin Directly
          </a>
          <Link
            to="/"
            className="bg-red-600 text-white px-7 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}