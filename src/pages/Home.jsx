import { Link } from 'react-router-dom'

function Feature({ emoji, title, desc }) {
  return (
    <div className="card card-hover">
      <div className="text-3xl mb-2">{emoji}</div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-muted">{desc}</p>
    </div>
  )
}

function FAQ({ q, a }) {
  return (
    <details className="card">
      <summary className="cursor-pointer font-semibold">{q}</summary>
      <p className="text-muted mt-2">{a}</p>
    </details>
  )
}

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <section className="container-p section text-center">
        <div className="badge mx-auto mb-4">New · 50 Free AI Interview Prompts</div>
        <h1 className="h1">
          Speak smarter. <span className="text-brand">Interview better.</span>
        </h1>
        <p className="lead max-w-2xl mx-auto">
          Practical AI tools and templates to improve your communication and interview
          performance — fast.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link className="btn btn-primary" to="/free-prompts">🎁 Get the Free PDF</Link>
          <Link className="btn btn-ghost border border-border" to="/blog">Explore the Blog</Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container-p grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Feature emoji="🎤" title="AI Interview Practice" desc="Mock prompts and scoring frameworks that actually help you improve." />
        <Feature emoji="🗣️" title="Speaking Confidence" desc="Short daily drills to reduce filler words and fix pacing." />
        <Feature emoji="⚙️" title="Tool Reviews" desc="We test the essentials: STT, notes, and prep tools — no fluff." />
      </section>

      {/* SOCIAL PROOF */}
      <section className="container-p section">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">“Got shortlisted after using your prompts.”</h3>
            <p className="text-muted">Clean STAR answers, faster prep. — <strong>Arjun, CS student</strong></p>
          </div>
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">“Speaking drills reduced my filler words.”</h3>
            <p className="text-muted">Felt more confident in HR rounds. — <strong>Nikita, Analyst</strong></p>
          </div>
        </div>
      </section>

      {/* LATEST BLOG */}
      <section className="container-p section">
        <h2 className="h2 mb-4">Latest from the blog</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a className="card card-hover" href="/blog/ai-interview-tips">
            <h3 className="font-semibold">10 AI prompts to practice interviews at home</h3>
            <p className="text-muted">Simulate HR, technical, and behavioral rounds.</p>
            <span className="text-brand font-semibold">Read →</span>
          </a>
          <a className="card card-hover" href="/blog/best-ai-tools-interview-prep">
            <h3 className="font-semibold">Best Free AI Tools for Interview Prep (2025)</h3>
            <p className="text-muted">Top free apps to practice questions.</p>
            <span className="text-brand font-semibold">Read →</span>
          </a>
          <a className="card card-hover" href="/blog/chatgpt-prompts-hr-interviews">
            <h3 className="font-semibold">25 ChatGPT Prompts to Practice HR Interviews</h3>
            <p className="text-muted">Copy-paste and practice.</p>
            <span className="text-brand font-semibold">Read →</span>
          </a>
          <a className="card card-hover" href="/blog/speech-to-text-apps-india">
            <h3 className="font-semibold">Top 7 Speech-to-Text Apps in India (Tested)</h3>
            <p className="text-muted">Our hands-on review.</p>
            <span className="text-brand font-semibold">Read →</span>
          </a>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="container-p section text-center">
        <div className="card inline-block text-left">
          <h3 className="text-xl font-semibold mb-2">Get the weekly SpeakAI newsletter</h3>
          <p className="text-muted">One high-value email. Prompts, scripts, and tool picks.</p>
          <form
            name="subscribe"
            method="POST"
            data-netlify="true"
            className="mt-3 flex flex-col sm:flex-row gap-2"
          >
            <input className="input" type="email" name="email" placeholder="you@example.com" required />
            <button className="btn btn-primary" type="submit">Subscribe</button>
          </form>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-p section">
        <h2 className="h2 mb-4">FAQ</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <FAQ q="Is this really free?" a="Yes — the PDF prompts are free. You’ll also get one helpful newsletter per week." />
          <FAQ q="Do I need a paid AI tool?" a="No. All prompts work with free chatbots too." />
          <FAQ q="Will this help with English speaking?" a="Yes. We include drills for clarity, pace, and filler words." />
          <FAQ q="How do you make money?" a="Optional services, affiliate picks, and a future low-cost course." />
        </div>
      </section>
    </main>
  )
}
