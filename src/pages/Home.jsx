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
          className="container-p py-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold">How SpeakAI Works</h2>

            <p className="text-muted mt-4 text-lg">
              Practice interviews in a realistic AI-powered environment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="relative card text-center">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-primary flex items-center justify-center font-bold">
                1
              </div>

              <div className="pt-8">
                <div className="text-5xl mb-4">🎯</div>

                <h3 className="text-2xl font-bold">Select Role & Skill</h3>

                <p className="text-muted mt-4">
                  Choose frontend engineering, React, JavaScript, behavioral
                  interviews, and more.
                </p>
              </div>
            </div>

            <div className="relative card text-center">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-primary flex items-center justify-center font-bold">
                2
              </div>

              <div className="pt-8">
                <div className="text-5xl mb-4">🎤</div>

                <h3 className="text-2xl font-bold">Answer with Voice</h3>

                <p className="text-muted mt-4">
                  Practice speaking naturally and improve communication
                  confidence.
                </p>
              </div>
            </div>

            <div className="relative card text-center">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-primary flex items-center justify-center font-bold">
                3
              </div>

              <div className="pt-8">
                <div className="text-5xl mb-4">🤖</div>

                <h3 className="text-2xl font-bold">Get AI Feedback</h3>

                <p className="text-muted mt-4">
                  Receive instant feedback on clarity, STAR structure,
                  confidence, and technical explanations.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Add Interview Categories Section */}
        <motion.section
          className="container-p py-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold">
              Practice Every Interview Type
            </h2>

            <p className="text-muted mt-4 text-lg">
              Prepare for technical and behavioral interviews with AI coaching.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
            {[
              "React Interviews",
              "JavaScript Interviews",
              "Frontend Engineering",
              "Behavioral Interviews",
              "HR Round Practice",
              "Communication Skills",
              "System Design",
              "Mock AI Interviews",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border bg-card/50 backdrop-blur p-6 text-center hover:-translate-y-1 transition"
              >
                <h3 className="font-semibold">{item}</h3>
              </div>
            ))}
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
