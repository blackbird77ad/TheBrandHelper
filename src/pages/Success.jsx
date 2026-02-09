import React from "react";
import { Link } from "react-router-dom";

export default function Success() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold mb-4">Thank you! 🎉</h1>
        <p className="text-gray-600 mb-6">
          Your submission has been received. We'll contact you shortly.
        </p>
        <Link
          to="/"
          className="inline-block bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}
