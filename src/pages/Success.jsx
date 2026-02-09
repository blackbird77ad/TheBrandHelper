export default function Success() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold mb-4">Message sent 🎉</h1>
        <p className="text-gray-600 mb-6">
          Thank you for contacting The BrandHelper. We’ll get back to you shortly.
        </p>
        <a
          href="/"
          className="inline-block bg-black text-white px-6 py-3 rounded"
        >
          Back to Home
        </a>
      </div>
    </section>
  );
}
