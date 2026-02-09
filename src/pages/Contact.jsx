export default function Contact() {
  return (
    <section className="bg-white">
      {/* HERO */}
      <div className="min-h-[50vh] flex items-center bg-[#F5F5F5]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-semibold mb-6">
            Get in touch
          </h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Questions, registrations, or partnerships —  
            we’d love to hear from you.
          </p>
        </div>
      </div>

      {/* FORM */}
      <div className="max-w-2xl mx-auto px-6 py-20">
        <form
          name="contact"
          method="POST"
          action="/success"
          data-netlify="true"
          className="space-y-6"
        >
          <input type="hidden" name="form-name" value="contact" />

          <div>
            <label className="block text-sm font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Message
            </label>
            <textarea
              name="message"
              rows="5"
              required
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:border-black"
            />
          </div>

          <button
            type="submit"
            className="bg-black text-white px-8 py-3 rounded-md hover:opacity-90 transition"
          >
            Send message
          </button>
        </form>
      </div>
    </section>
  );
}
