import React, { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    location: "",
    call: "",
    whatsapp: "",
    product: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send data to Google Sheet via your Web App URL
    fetch(
      "https://script.google.com/macros/s/AKfycbx0z0Ex-dxJpdPEZOZ4_Z8pw2plTxWTXsRvOjLWLF1ehw-r1MdXqxXwj8AKvTEXIz76kA/exec",
      {
        method: "POST",
        body: JSON.stringify(formData),
      }
    )
      .then(() => {
        // Redirect to WhatsApp group after successful submission
        window.location.href =
          "https://chat.whatsapp.com/HpS3bYpWejM7L2sfVOSvek?mode=gi_t";
      })
      .catch((err) => alert("Submission failed: " + err));
  };

  return (
    <section className="min-h-screen bg-white px-6 py-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-semibold mb-6">Join Our WhatsApp Group</h1>
        <p className="text-gray-600 mb-6">
          Fill in your details below. After submission, you will be added to our general WhatsApp group.
        </p>

        {/* Warning notice */}
        <p className="text-gray-700 mb-6 text-sm">
          ⚠️ <span className="font-semibold">Talk to admins only — beware of scammers!</span>
          <br />
          You can also{" "}
          <a
            href="https://wa.me/+233544930276"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#E11D48] hover:text-[#FF3366]"
          >
            contact an admin directly
          </a>
          .
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 border p-6 rounded shadow-md bg-gray-50"
        >
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
          <input
            type="text"
            name="product"
            placeholder="Product / Training Name"
            required
            value={formData.product}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />
          <textarea
            name="message"
            placeholder="Additional Message (optional)"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <button
            type="submit"
            className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
          >
            Join WhatsApp Group
          </button>
        </form>
      </div>
    </section>
  );
}
