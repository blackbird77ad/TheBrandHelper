import React, { useState } from "react";

export default function StoreContact() {
  const [formData, setFormData] = useState({
    fullName: "",
    location: "",
    call: "",
    whatsapp: "",
    productOrTraining: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = "https://script.google.com/macros/s/AKfycbx0z0Ex-dxJpdPEZOZ4_Z8pw2plTxWTXsRvOjLWLF1ehw-r1MdXqxXwj8AKvTEXIz76kA/exec";

    fetch(url, {
      method: "POST",
      body: JSON.stringify(formData),
    })
      .then(() => {
        // Redirect to WhatsApp group after submission
        window.location.href = "https://chat.whatsapp.com/HpS3JYpWejM7L2sfVOSvek?mode=gi_t";
      })
      .catch((err) => alert("Something went wrong: " + err));
  };

  return (
    <section className="min-h-screen bg-white px-6 py-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-semibold mb-6 text-center">Join Our WhatsApp Group</h1>
        <p className="text-gray-600 mb-10 text-center">
          Fill in your details. After submission, you will be added to our WhatsApp group. 
          <br />
          <strong>⚠️ Talk to admins only — beware of scammers.</strong>
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
            name="productOrTraining"
            placeholder="Product or Training Name"
            required
            value={formData.productOrTraining}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <textarea
            name="message"
            placeholder="Your Message / Notes"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <button
            type="submit"
            className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition w-full"
          >
            Join WhatsApp Group
          </button>
        </form>
      </div>
    </section>
  );
}
