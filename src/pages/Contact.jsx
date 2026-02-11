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
    Training: ["Sewing & Fashion", "Braiding & Hair Business", "Shoe Making", "Soap & Skincare", "Importation", "Ads & Digital Promotion"],
    Service: ["Website Design", "Website Management", "Business Email Setup", "Ads Management", "Brand Strategy", "Consulting & Business Coaching"],
    Product: [],
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Encode data for x-www-form-urlencoded
    const encode = (data) =>
      Object.keys(data)
        .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
        .join("&");

    try {
      // Send data to Apps Script
      await fetch(
        "https://script.google.com/macros/s/AKfycbxVQ4bpjy0IZ8896DWpSrYk1x_nATnVPzQbOX3rAQR7e7yUk9YoloWmWMwhxcOxmVgymQ/exec",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: encode(formData),
        }
      );

      // Always redirect to /success
      setSubmitting(false);
      navigate("/success");
    } catch (err) {
      // Even if fetch fails, redirect anyway
      console.error("Fetch error:", err);
      setSubmitting(false);
      navigate("/success");
    }
  };

  return (
    <section className="min-h-screen bg-white px-6 py-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-semibold mb-4">Register / Contact</h1>
        <p className="text-gray-600 mb-6 text-sm">
          By submitting this form, you will be added to our WhatsApp group.
          <span className="font-semibold text-red-600"><br />⚠️ Communicate only with admins!</span>
          <br />
          You can also{" "}
          <a href="https://wa.me/+233544930276" target="_blank" rel="noopener noreferrer" className="text-[#E11D48] hover:text-[#FF3366]">
            contact an admin directly
          </a>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="fullName" placeholder="Full Name" required value={formData.fullName} onChange={handleChange} className="w-full border p-3 rounded" />
          <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleChange} className="w-full border p-3 rounded" />

          <select name="category" value={formData.category} onChange={handleChange} required className="w-full border p-3 rounded">
            <option value="">Select Category</option>
            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          {formData.category && formData.category !== "Product" && (
            <select name="item" value={formData.item} onChange={handleChange} required className="w-full border p-3 rounded">
              <option value="">Select {formData.category}</option>
              {items[formData.category].map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          )}

          {formData.category === "Product" && (
            <input type="text" name="item" placeholder="Enter product name" required value={formData.item} onChange={handleChange} className="w-full border p-3 rounded" />
          )}

          <textarea name="message" placeholder="Additional message" rows="4" value={formData.message} onChange={handleChange} className="w-full border p-3 rounded" />

          <button type="submit" disabled={submitting} className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition">
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </section>
  );
}
