import { useState } from "react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault()

  const formData = new FormData(e.target)

  const payload = {
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message')
  }

  try {
    const res = await fetch('/.netlify/functions/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (res.ok) {
      alert('Message sent successfully ✅')
      e.target.reset()
    }
  } catch (err) {
    console.error(err)
    alert('Failed to send message')
  }
}

  return (
    <main className="container-p py-14 max-w-6xl">
      {/* Hero */}
      <section className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border text-sm mb-4">
          💬 Contact SpeakAI
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
          Let’s build your interview confidence
        </h1>

        <p className="text-muted mt-4 text-lg">
          Questions, collaborations, feature requests, or feedback — we’d love
          to hear from you.
        </p>
      </section>

      {/* Contact cards */}
      <section className="grid md:grid-cols-3 gap-4 mt-10">
        <div className="card text-center">
          <div className="text-3xl mb-3">📧</div>
          <h3 className="font-semibold text-lg">Email</h3>
          <p className="text-muted mt-1">Reach us anytime via email</p>

          <a
            href="mailto:sreekanth.maramesi@gmail.com"
            className="btn btn-primary mt-4 inline-flex"
          >
            sreekanth.maramesi@gmail.com
          </a>
        </div>

        <div className="card text-center">
          <div className="text-3xl mb-3">💬</div>
          <h3 className="font-semibold text-lg">WhatsApp</h3>
          <p className="text-muted mt-1">Quick support and direct chat</p>

          <a
            href="https://wa.me/919110733750"
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary mt-4 inline-flex"
          >
            Chat on WhatsApp
          </a>
        </div>

        <div className="card text-center">
          <div className="text-3xl mb-3">🚀</div>
          <h3 className="font-semibold text-lg">Collaboration</h3>
          <p className="text-muted mt-1">Partnerships & interview workshops</p>

          <a
            href="mailto: sreekanth.maramesi@gmail.com"
            className="btn btn-primary mt-4 inline-flex"
          >
            Collaborate
          </a>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-3xl mx-auto mt-14">
        <div className="card">
          <h2 className="text-2xl font-bold">Send us a message</h2>

          <p className="text-muted mt-2">
            Fill out the form below and we’ll get back to you soon.
          </p>

          {submitted ? (
            <div className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
              <h3 className="font-semibold text-green-400">
                Message sent successfully ✅
              </h3>
              <p className="text-sm text-muted mt-1">
                Thank you for contacting SpeakAI.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <input type="hidden" name="form-name" value="contact" />

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium">Name</label>

                  <input
                    className="input"
                    type="text"
                    name="name"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Email
                  </label>

                  <input
                    className="input"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block mb-2 text-sm font-medium">
                  Message
                </label>

                <textarea
                  className="input"
                  name="message"
                  rows="6"
                  placeholder="Tell us how we can help..."
                  required
                />
              </div>

              <button
                className="btn btn-primary mt-5 w-full sm:w-auto"
                type="submit"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto mt-14">
        <h2 className="text-2xl font-bold text-center">
          Frequently Asked Questions
        </h2>

        <div className="grid gap-4 mt-6">
          <div className="card">
            <h3 className="font-semibold">Is SpeakAI free to use?</h3>

            <p className="text-muted mt-2">
              Yes, many features are free while we continue improving the
              platform.
            </p>
          </div>

          <div className="card">
            <h3 className="font-semibold">
              Does SpeakAI support technical interviews?
            </h3>

            <p className="text-muted mt-2">
              Yes. You can practice role-based and skill-based interview
              questions.
            </p>
          </div>

          <div className="card">
            <h3 className="font-semibold">
              Can I get AI feedback on communication?
            </h3>

            <p className="text-muted mt-2">
              Absolutely. SpeakAI analyzes clarity, pacing, fillers, and STAR
              structure.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
