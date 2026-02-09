export default function Contact() {
  return (
    <section className="min-h-screen bg-white px-6 py-20">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl font-bold mb-6">Contact Us</h2>
 
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

        <form
          name="contact"
          method="POST"
          data-netlify="true"
          className="space-y-4"
        >
          <input type="hidden" name="form-name" value="contact" />

          <input
            type="text"
            name="name"
            placeholder="Your name"
            required
            className="w-full border p-3 rounded"
          />

          <input
            type="email"
            name="email"
            placeholder="Your email"
            required
            className="w-full border p-3 rounded"
          />

          <textarea
            name="message"
            placeholder="Your message"
            rows="5"
            required
            className="w-full border p-3 rounded"
          />

          <button className="bg-black text-white px-6 py-3 rounded">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
