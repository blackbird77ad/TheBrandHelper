import React from "react";

export default function Contact() {
  return (
    <div className="bg-white text-black">

      {/* HERO */}
      <section className="min-h-[50vh] flex items-center bg-[#F5F5F5]">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-5xl font-semibold mb-6">
            Get in touch
          </h1>
          <p className="text-gray-600 text-lg">
            Questions, registrations, or partnerships —
            we’d love to hear from you.
          </p>
        </div>
      </section>

      {/* FORM */}
      <section className="min-h-[70vh] py-20">
        <div className="max-w-3xl mx-auto px-6">
          <form className="space-y-6">

            <input
              type="text"
              placeholder="Full name"
              className="w-full border px-4 py-3"
            />

            <input
              type="email"
              placeholder="Email address"
              className="w-full border px-4 py-3"
            />

            <textarea
              rows="5"
              placeholder="Message"
              className="w-full border px-4 py-3"
            />

            <button
              type="submit"
              className="bg-[#E11D48] text-white px-8 py-4 uppercase tracking-wide hover:opacity-90 transition"
            >
              Send message
            </button>

          </form>
        </div>
      </section>

    </div>
  );
}
