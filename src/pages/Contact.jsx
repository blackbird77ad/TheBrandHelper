import React, { useState } from "react";

const WHATSAPP_URL = "https://chat.whatsapp.com/HpS3JYpWejM7L2sfVOSvek?mode=gi_t";
const ADMIN_WHATSAPP = "https://wa.me/+233544930276";
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx0z0Ex-dxJpdPEZOZ4_Z8pw2plTxWTXsRvOjLWLF1ehw-r1MdXqxXwj8AKvTEXIz76kA/exec";

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    category: "",
    item: "",
    message: "",
  });

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
    Product: [], // User types product name
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = JSON.stringify(formData);

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: payload,
      });

      const result = await response.json();

      // Redirect user to general WhatsApp group
      window.location.href = WHATSAPP_URL;

    } catch (err) {
      alert("Form submission failed: " + err);
    }
  };

  return (
    <section className="min-h-screen bg-white px-6 py-20">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-4xl font-semibold mb-4">Register / Contact</h1>

        {/* Warning notice */}
        <p className="text-gray-600 mb-6 text-sm">
          By submitting this form, you will be added to our general WhatsApp group.
          <span className="font-semibold text-red-600">
          <br />⚠️ Beware of scammers and frauds — always communicate only with the admins!
          </span>
          <br />
          You can also <a href={ADMIN_WHATSAPP} target="_blank" rel="noopener noreferrer" className="text-[#E11D48] hover:text-[#FF3366]">contact an admin directly</a>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

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
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          {/* Category Selection */}
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Item selection */}
          {formData.category && formData.category !== "Product" && (
            <select
              name="item"
              value={formData.item}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded"
            >
              <option value="">Select {formData.category}</option>
              {items[formData.category].map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          )}

          {/* Product input */}
          {formData.category === "Product" && (
            <input
              type="text"
              name="item"
              placeholder="Enter product name"
              required
              value={formData.item}
              onChange={handleChange}
              className="w-full border p-3 rounded"
            />
          )}

          <textarea
            name="message"
            placeholder="Additional message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <button
            type="submit"
            className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
          >
            Submit & Join WhatsApp
          </button>
        </form>
      </div>
    </section>
  );
}
