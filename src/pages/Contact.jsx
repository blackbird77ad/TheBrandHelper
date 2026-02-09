import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Contact() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const source = searchParams.get("source") || "contact page";

  const [formData, setFormData] = useState({
    fullName: "",
    location: "",
    call: "",
    whatsapp: "",
    message: "",
  });

  const navigate = useNavigate();

  // Auto-copy call to WhatsApp if empty
  useEffect(() => {
    if (formData.call && !formData.whatsapp) {
      setFormData((prev) => ({ ...prev, whatsapp: prev.call }));
    }
  }, [formData.call]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const encode = (data) =>
      Object.keys(data)
        .map(
          (key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
        )
        .join("&");

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode({ "form-name": "contact", source, ...formData }),
    })
      .then(() => navigate("/success"))
      .catch((err) => alert(err));
  };

  return (
    <section className="min-h-screen bg-white px-6 py-20">
      <div className="max-w-2xl mx-auto">
        <Helmet>
        <title>Contact | The BrandHelper – Get in Touch</title>
        <meta name="description" content="Contact The BrandHelper for training registration, business services, or partnerships. We’d love to hear from you." />
        <meta property="og:title" content="Contact – The BrandHelper" />
        <meta property="og:description" content="Reach out for training registration, business services, or inquiries." />
        <meta property="og:image" content="/assets/og-contact.png" />
      </Helmet>
        <section className="min-h-[50vh] flex items-center bg-[#F5F5F5] mb-10">
          <div className="max-w-5xl mx-auto px-6">
            <h1 className="text-5xl font-semibold mb-6">Get in Touch</h1>
            <p className="text-gray-600 text-lg">
              Questions, registrations, or partnerships — we’d love to hear from you.
            </p>
          </div>
        </section>

        <form
          name="contact"
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input type="hidden" name="form-name" value="contact" />
          <input type="hidden" name="source" value={source} />
          <input type="hidden" name="bot-field" />

          {/* ALL FIELDS MUST EXIST IN STATIC HTML */}
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            required
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            required
            value={formData.location}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />
          <input
            type="tel"
            name="call"
            placeholder="Call Number"
            required
            value={formData.call}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />
          <input
            type="tel"
            name="whatsapp"
            placeholder="WhatsApp Number"
            required
            value={formData.whatsapp}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            required
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
