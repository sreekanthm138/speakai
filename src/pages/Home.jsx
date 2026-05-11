import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

function Feature({ emoji, title, desc }) {
  return (
    <div className="card card-hover">
      <div className="text-3xl mb-2">{emoji}</div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-muted">{desc}</p>
    </div>
  );
}

function FAQ({ q, a }) {
  return (
    <details className="card">
      <summary className="cursor-pointer font-semibold">{q}</summary>
      <p className="text-muted mt-2">{a}</p>
    </details>
  );
}

export default function Home() {
  return (
    <>
      <Helmet>
        <title>SpeakAI — AI Interview Coach & Mock Interview Practice</title>

        <meta
          name="description"
          content="Practice AI-powered mock interviews for React, JavaScript, frontend engineering, communication skills, and behavioral interviews using SpeakAI."
        />

        <meta
          name="keywords"
          content="AI interview coach, mock interview practice, React interview questions, JavaScript interview preparation, frontend interview AI"
        />

        <link rel="canonical" href="https://speakai.in/" />
      </Helmet>
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden py-24">
          <div className="absolute inset-0 -z-10 opacity-30 blur-3xl">
            <div className="h-96 w-96 rounded-full bg-primary/30 mx-auto" />
          </div>

          <div className="container-p max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-14 items-center">
              {/* LEFT */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1 text-sm mb-6">
                  🚀 AI-Powered Interview Preparation
                </div>

                <h1 className="text-5xl sm:text-6xl font-bold leading-tight">
                  Practice Mock Interviews with{" "}
                  <span className="text-primary">AI Coaching</span>
                </h1>

                <p className="text-xl text-muted mt-6 leading-relaxed">
                  Improve communication, confidence, React interviews,
                  JavaScript concepts, frontend engineering skills, and
                  behavioral answers using SpeakAI.
                </p>

                {/* CTA */}
                <div className="flex flex-wrap gap-4 mt-8">
                  <Link to="/coach" className="btn btn-primary">
                    Start Mock Interview
                  </Link>

                  <Link to="/blog" className="btn">
                    Explore Blogs
                  </Link>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-8 mt-10">
                  <div>
                    <h3 className="text-3xl font-bold">AI</h3>

                    <p className="text-muted">Real-time feedback</p>
                  </div>

                  <div>
                    <h3 className="text-3xl font-bold">React</h3>

                    <p className="text-muted">Frontend interview prep</p>
                  </div>

                  <div>
                    <h3 className="text-3xl font-bold">STAR</h3>

                    <p className="text-muted">Behavioral coaching</p>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="relative">
                <div className="rounded-3xl border bg-card/50 backdrop-blur p-8 shadow-2xl">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <h3 className="font-semibold">AI Mock Interview</h3>

                      <p className="text-sm text-muted">
                        React Frontend Engineer
                      </p>
                    </div>

                    <div className="h-3 w-3 rounded-full bg-indigo-500" />
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="rounded-2xl bg-background p-4 border">
                      <p className="font-medium">
                        Explain useEffect cleanup function.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-primary/10 p-4 border border-primary/20">
                      <p className="text-sm">AI Feedback:</p>

                      <p className="mt-2">
                        Good explanation. You covered unmount cleanup correctly,
                        but also mention dependency array behavior for a
                        stronger answer.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <div className="h-2 flex-1 rounded-full bg-primary" />
                    <span className="text-sm text-muted">
                      Communication Score: 8.5/10
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <motion.section
          className="container-p py-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold">
              Everything You Need to Crack Interviews
            </h2>

            <p className="text-muted mt-4 text-lg">
              Practice technical, behavioral, and communication interviews with
              AI-powered coaching.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-14">
            <div className="card">
              <div className="text-4xl mb-4">🎤</div>

              <h3 className="text-2xl font-bold">Voice-Based Practice</h3>

              <p className="text-muted mt-3">
                Practice speaking answers naturally and improve confidence.
              </p>
            </div>

            <div className="card">
              <div className="text-4xl mb-4">🤖</div>

              <h3 className="text-2xl font-bold">AI Feedback</h3>

              <p className="text-muted mt-3">
                Get instant feedback on communication, fillers, STAR method, and
                clarity.
              </p>
            </div>

            <div className="card">
              <div className="text-4xl mb-4">💻</div>

              <h3 className="text-2xl font-bold">Frontend Interview Prep</h3>

              <p className="text-muted mt-3">
                Practice React, JavaScript, frontend engineering, and system
                design questions.
              </p>
            </div>
          </div>
        </motion.section>

        {/* How It Works */}
        <motion.section
          className="relative py-24 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Background Glow */}
          <div className="absolute inset-0 -z-10 opacity-40">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/20 blur-3xl rounded-full" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-violet-500/20 blur-3xl rounded-full" />
          </div>

          <div className="container-p max-w-7xl mx-auto">
            {/* Heading */}
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-primary font-semibold tracking-widest uppercase mb-4">
                How It Works
              </p>

              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Your Path to Interview Confidence
              </h2>

              <p className="text-muted mt-5 text-lg">
                Three simple steps to improve your speaking and ace interviews.
              </p>
            </div>

            {/* Steps */}
            <div className="relative grid md:grid-cols-3 gap-8 mt-20">
              {/* Line Connector */}
              <div className="hidden md:block absolute top-10 left-[18%] right-[18%] border-t border-dashed border-primary/40" />

              {/* STEP 1 */}
              <div className="relative">
                {/* Number */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10">
                  <div className="h-16 w-16 rounded-full border-4 border-primary/40 bg-background shadow-[0_0_30px_rgba(139,92,246,0.6)] flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">01</span>
                  </div>
                </div>

                <div className="rounded-3xl border border-primary/20 bg-card/60 backdrop-blur-xl p-10 text-center hover:-translate-y-2 transition duration-300 shadow-xl">
                  <div className="text-6xl mb-6">🎯</div>

                  <h3 className="text-3xl font-bold">Select Role & Skill</h3>

                  <p className="text-muted mt-5 leading-relaxed text-lg">
                    Choose your role, skills, and interview type. We customize
                    the experience just for you.
                  </p>
                </div>
              </div>

              {/* STEP 2 */}
              <div className="relative">
                {/* Arrow */}
                {/* <div className="hidden md:flex absolute -left-5 top-4 h-12 w-12 rounded-full bg-primary items-center justify-center shadow-lg">
                  <span className="text-2xl text-white">→</span>
                </div> */}

                {/* Number */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10">
                  <div className="h-16 w-16 rounded-full border-4 border-primary/40 bg-background shadow-[0_0_30px_rgba(139,92,246,0.6)] flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">02</span>
                  </div>
                </div>

                <div className="rounded-3xl border border-primary/20 bg-card/60 backdrop-blur-xl p-10 text-center hover:-translate-y-2 transition duration-300 shadow-xl">
                  <div className="text-6xl mb-6">🎤</div>

                  <h3 className="text-3xl font-bold">Answer with Voice</h3>

                  <p className="text-muted mt-5 leading-relaxed text-lg">
                    Speak your answers naturally. Our AI listens, analyzes, and
                    provides real-time insights.
                  </p>
                </div>
              </div>

              {/* STEP 3 */}
              <div className="relative">
                {/* Arrow */}
                {/* <div className="hidden md:flex absolute -left-5 top-4 h-12 w-12 rounded-full bg-primary items-center justify-center shadow-lg">
                  <span className="text-2xl text-white">→</span>
                </div> */}

                {/* Number */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10">
                  <div className="h-16 w-16 rounded-full border-4 border-primary/40 bg-background shadow-[0_0_30px_rgba(139,92,246,0.6)] flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">03</span>
                  </div>
                </div>

                <div className="rounded-3xl border border-primary/20 bg-card/60 backdrop-blur-xl p-10 text-center hover:-translate-y-2 transition duration-300 shadow-xl">
                  <div className="text-6xl mb-6">🤖</div>

                  <h3 className="text-3xl font-bold">Get AI Feedback</h3>

                  <p className="text-muted mt-5 leading-relaxed text-lg">
                    Receive instant, actionable feedback on confidence, clarity,
                    structure, and communication.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Add Interview Categories Section */}
        {/* Interview Categories */}
        <motion.section
          className="relative py-16 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Background Glow */}
          <div className="absolute inset-0 -z-10 opacity-40">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/20 blur-3xl rounded-full" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-violet-500/20 blur-3xl rounded-full" />
          </div>

          <div className="w-full">
            {/* Heading */}
            <div className="text-center max-w-4xl mx-auto px-6">
              <p className="text-primary font-semibold tracking-[0.3em] uppercase mb-3">
                Interview Categories
              </p>

              <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                Practice Every Interview Type
              </h2>

              <p className="text-muted mt-4 text-lg">
                Prepare for technical, behavioral, and communication interviews
                with AI-powered coaching.
              </p>
            </div>

            {/* Row 1 */}
            <div className="relative mt-12 overflow-hidden">
              {/* Left Gradient */}
              <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-background to-transparent" />

              {/* Right Gradient */}
              <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-background to-transparent" />

              <motion.div
                className="flex gap-4 w-max"
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                  repeat: Infinity,
                  ease: "linear",
                  duration: 45,
                }}
              >
                {[
                  "⚛️ React Interviews",
                  "🟨 JavaScript",
                  "💻 Frontend Engineering",
                  "🤖 AI Mock Interviews",
                  "🧠 System Design",
                  "🎯 Behavioral Interviews",
                  "🗣️ Communication Skills",
                  "📦 Redux",
                  "🧩 DSA",
                  "🔥 TypeScript",
                ]
                  .concat([
                    "⚛️ React Interviews",
                    "🟨 JavaScript",
                    "💻 Frontend Engineering",
                    "🤖 AI Mock Interviews",
                    "🧠 System Design",
                    "🎯 Behavioral Interviews",
                    "🗣️ Communication Skills",
                    "📦 Redux",
                    "🧩 DSA",
                    "🔥 TypeScript",
                  ])
                  .map((item, index) => (
                    <div
                      key={index}
                      className="group min-w-[240px] rounded-2xl border border-white/10 bg-card/40 backdrop-blur-xl px-6 py-5 flex items-center justify-center text-center hover:border-primary/50 transition duration-300"
                    >
                      <h3 className="text-lg font-semibold group-hover:text-primary transition">
                        {item}
                      </h3>
                    </div>
                  ))}
              </motion.div>
            </div>

            {/* Row 2 */}
            <div className="relative mt-4 overflow-hidden">
              {/* Left Gradient */}
              <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-background to-transparent" />

              {/* Right Gradient */}
              <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-background to-transparent" />

              <motion.div
                className="flex gap-4 w-max"
                animate={{ x: ["-50%", "0%"] }}
                transition={{
                  repeat: Infinity,
                  ease: "linear",
                  duration: 55,
                }}
              >
                {[
                  "🎤 HR Round Practice",
                  "🚀 Leadership Interviews",
                  "📱 Mobile Development",
                  "🌐 Web Development",
                  "⚙️ Node.js",
                  "🔷 Angular",
                  "🧪 Coding Challenges",
                  "📊 Product Interviews",
                  "☁️ Cloud Fundamentals",
                  "🧠 Problem Solving",
                ]
                  .concat([
                    "🎤 HR Round Practice",
                    "🚀 Leadership Interviews",
                    "📱 Mobile Development",
                    "🌐 Web Development",
                    "⚙️ Node.js",
                    "🔷 Angular",
                    "🧪 Coding Challenges",
                    "📊 Product Interviews",
                    "☁️ Cloud Fundamentals",
                    "🧠 Problem Solving",
                  ])
                  .map((item, index) => (
                    <div
                      key={index}
                      className="group min-w-[240px] rounded-2xl border border-white/10 bg-card/40 backdrop-blur-xl px-6 py-5 flex items-center justify-center text-center hover:border-primary/50 transition duration-300"
                    >
                      <h3 className="text-lg font-semibold group-hover:text-primary transition">
                        {item}
                      </h3>
                    </div>
                  ))}
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Add Testimonials Section */}
        <motion.section
          className="container-p py-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold">Loved by Interview Learners</h2>

            <p className="text-muted mt-4 text-lg">
              Practice smarter with AI-powered feedback.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-14">
            <div className="card">
              <p className="text-lg leading-relaxed">
                “SpeakAI helped me improve confidence in frontend interviews and
                communication.”
              </p>

              <div className="mt-6">
                <h4 className="font-semibold">Frontend Developer</h4>

                <p className="text-sm text-muted">React Engineer</p>
              </div>
            </div>

            <div className="card">
              <p className="text-lg leading-relaxed">
                “The AI feedback on STAR method and fillers was extremely
                useful.”
              </p>

              <div className="mt-6">
                <h4 className="font-semibold">Software Engineer</h4>

                <p className="text-sm text-muted">Interview Candidate</p>
              </div>
            </div>

            <div className="card">
              <p className="text-lg leading-relaxed">
                “One of the best tools for practicing React and JavaScript
                interview questions.”
              </p>

              <div className="mt-6">
                <h4 className="font-semibold">Frontend Learner</h4>

                <p className="text-sm text-muted">AI Mock Interview User</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Add FAQ Section */}
        <motion.section
          className="container-p py-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold">Frequently Asked Questions</h2>
          </div>

          <div className="max-w-4xl mx-auto mt-14 space-y-5">
            <div className="card">
              <h3 className="text-xl font-bold">Is SpeakAI free to use?</h3>

              <p className="text-muted mt-3">
                Yes. Many features are currently free while we improve the
                platform.
              </p>
            </div>

            <div className="card">
              <h3 className="text-xl font-bold">
                Does SpeakAI support technical interviews?
              </h3>

              <p className="text-muted mt-3">
                Yes. You can practice React, JavaScript, frontend engineering,
                and behavioral interviews.
              </p>
            </div>

            <div className="card">
              <h3 className="text-xl font-bold">
                Does SpeakAI analyze communication?
              </h3>

              <p className="text-muted mt-3">
                Yes. AI feedback includes fillers, clarity, STAR method, and
                confidence analysis.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Final CTA Section */}
        <motion.section
          className="container-p py-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="rounded-3xl border bg-card/50 backdrop-blur p-12 text-center max-w-5xl mx-auto">
            <h2 className="text-5xl font-bold leading-tight">
              Start Practicing Interviews with AI
            </h2>

            <p className="text-xl text-muted mt-6 max-w-3xl mx-auto">
              Improve communication, frontend engineering interviews, behavioral
              answers, and confidence using SpeakAI.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <Link to="/coach" className="btn btn-primary">
                Start AI Interview
              </Link>

              <Link to="/blog" className="btn">
                Read Interview Blogs
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
