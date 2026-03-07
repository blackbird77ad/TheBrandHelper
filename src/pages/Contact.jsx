import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    category: "",
    item: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const categories = ["Training", "Service", "Product"];
  const items = {
    Training: [
      "Sewing & Fashion",
      "Braiding & Hair Business",
      "Shoe Making",
      "Soap & Skincare",
      "Importation",
      "Ads & Digital Promotion",
    ],
    Service: [
      "Website Design",
      "Website Management",
      "Business Email Setup",
      "Ads Management",
      "Brand Strategy",
      "Consulting & Business Coaching",
    ],
    Product: [],
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const encode = (data) =>
      Object.keys(data)
        .map(
          (key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
        )
        .join("&");

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbwcL-pEQvT4XxPGhUncdtz1sBxNH6wk3VjH_BOJ3Z-tfCYGtOAdycqO6nqZdEDfdbbkpg/exec",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: encode(formData),
        }
      );
      setSubmitting(false);
      navigate("/success");
    } catch (err) {
      console.error("Fetch error:", err);
      setSubmitting(false);
      navigate("/success");
    }
  };

  return (
    <section className="min-h-screen bg-white px-6 py-20">
      <div className="max-w-3xl mx-auto">
        {/* Hero / Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Register / Contact Us
          </h1>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            Fill out the form below to join our WhatsApp group or reach an admin directly.
            <br />
            <span className="font-semibold text-red-600">
              ⚠️ Communicate only with admins!
            </span>
            <br />
            You can also{" "}
            <a
              href="https://wa.me/+233544930276"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E11D48] hover:text-[#FF3366] underline"
            >
              contact an admin directly
            </a>
            .
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 shadow-lg rounded-lg p-8 space-y-6"
        >
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            required
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-black focus:outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-black focus:outline-none"
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-black focus:outline-none"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {formData.category && formData.category !== "Product" && (
            <select
              name="item"
              value={formData.item}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-black focus:outline-none"
            >
              <option value="">Select {formData.category}</option>
              {items[formData.category].map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          )}

          {formData.category === "Product" && (
            <input
              type="text"
              name="item"
              placeholder="Enter product name"
              required
              value={formData.item}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-black focus:outline-none"
            />
          )}

          <textarea
            name="message"
            placeholder="Additional message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-black focus:outline-none"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-black text-white px-6 py-3 rounded font-semibold hover:bg-gray-800 transition"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </section>
  );
}
