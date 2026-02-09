import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Contact() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const source = searchParams.get("source") || "contact page";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    message: "",
  });

  const navigate = useNavigate();

  // Auto-copy phone to WhatsApp if empty
  useEffect(() => {
    if (formData.phone && !formData.whatsapp) {
      setFormData((prev) => ({ ...prev, whatsapp: prev.phone }));
    }
  }, [formData.phone]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Encode data for Netlify
    const encode = (data) =>
      Object.keys(data)
        .map(
          (key) =>
            encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
        )
        .join("&");

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode({ "form-name": "contact", source, ...formData }),
    })
      .then(() => {
        navigate("/success");
      })
      .catch((error) => alert(error));
  };

  return (
    <section className="min-h-screen bg-white px-6 py-20">
      <div className="max-w-2xl mx-auto">

        {/* HERO */}
        <section className="min-h-[50vh] flex items-center bg-[#F5F5F5] mb-10">
          <div className="max-w-5xl mx-auto px-6">
            <h1 className="text-5xl font-semibold mb-6">Get in Touch</h1>
            <p className="text-gray-600 text-lg">
              Questions, registrations, or partnerships — we’d love to hear from you.
            </p>
          </div>
        </section>

        {/* FORM */}
        <form
          name="contact"
          method="POST"
          data-netlify="true"
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input type="hidden" name="form-name" value="contact" />
          <input type="hidden" name="source" value={source} />

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Your Phone Number"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <input
            type="tel"
            name="whatsapp"
            placeholder="Your WhatsApp Number (optional)"
            value={formData.whatsapp}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <button
            type="submit"
            className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
