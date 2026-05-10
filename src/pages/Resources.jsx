import {
  BookOpen,
  Brain,
  Download,
  FileText,
  Mic,
  Sparkles,
  Code2,
  LayoutDashboard,
} from "lucide-react";

import { Link } from "react-router-dom";

const featuredResources = [
  {
    title: "50 React Interview Questions",
    desc: "Most asked React questions from beginner to advanced.",
    icon: <Code2 size={26} />,
    tag: "Frontend",
    link: "/blog/react-interview-questions",
  },

  {
    title: "STAR Answer Templates",
    desc: "Behavioral interview frameworks with examples.",
    icon: <Brain size={26} />,
    tag: "Communication",
    link: "/blog/star-method-interview-guide",
  },

  {
    title: "Frontend Roadmap 2026",
    desc: "Complete frontend engineering preparation path.",
    icon: <LayoutDashboard size={26} />,
    tag: "Career",
    link: "/blog/frontend-roadmap-2026",
  },
];

const learningTracks = [
  {
    title: "Frontend Engineering",
    topics: [
      "JavaScript",
      "React",
      "TypeScript",
      "Performance",
      "System Design",
    ],
  },

  {
    title: "Communication & HR",
    topics: [
      "STAR Method",
      "Confidence",
      "Behavioral Questions",
      "Leadership",
      "Team Collaboration",
    ],
  },

  {
    title: "AI Interview Preparation",
    topics: [
      "AI Mock Interviews",
      "Resume Analysis",
      "Speech Feedback",
      "Voice Confidence",
      "Follow-up Questions",
    ],
  },
];

const aiTools = [
  {
    name: "ChatGPT",
    url: "https://chat.openai.com",
  },

  {
    name: "GitHub Copilot",
    url: "https://github.com/features/copilot",
  },

  {
    name: "Cursor AI",
    url: "https://cursor.com",
  },

  {
    name: "Perplexity AI",
    url: "https://perplexity.ai",
  },

  {
    name: "Deepgram",
    url: "https://deepgram.com",
  },

  {
    name: "ElevenLabs",
    url: "https://elevenlabs.io",
  },
];

const downloads = [
  "React Interview PDF",
  "JavaScript Cheatsheet",
  "Frontend Resume Template",
  "Behavioral Answers Guide",
];

export default function Resources() {
  return (
    <main className="min-h-screen bg-[#070b17] text-white">
      {/* HERO */}
      <section className="container-p py-20">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
            <Sparkles size={16} />
            AI Interview Learning Hub
          </div>

          <h1 className="mt-8 text-5xl lg:text-7xl font-bold leading-tight">
            Resources to Crack
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {" "}
              Modern Interviews
            </span>
          </h1>

          <p className="mt-8 text-xl text-gray-300 leading-relaxed max-w-3xl">
            Frontend interview preparation, communication improvement, AI tools,
            resume guidance, and curated learning resources for engineers.
          </p>
        </div>
      </section>

      {/* FEATURED */}
      <section className="container-p pb-20">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-10">
          <div>
            <h2 className="text-4xl font-bold">Featured Resources</h2>

            <p className="text-gray-400 mt-3">
              Curated preparation material for interview success.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {featuredResources.map((item) => (
            <Link
              to={item.link}
              key={item.title}
              className="group rounded-3xl border border-white/10 bg-white/[0.03] p-8 hover:border-indigo-500/20 hover:bg-white/[0.05] transition duration-300 block"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-300">
                {item.icon}
              </div>

              <div className="mt-8">
                <div className="inline-flex rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300">
                  {item.tag}
                </div>

                <h3 className="mt-5 text-2xl font-bold group-hover:text-indigo-300 transition">
                  {item.title}
                </h3>

                <p className="mt-4 text-gray-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* LEARNING TRACKS */}
      <section className="container-p pb-20">
        <h2 className="text-4xl font-bold">Learning Tracks</h2>

        <p className="text-gray-400 mt-4">
          Structured preparation paths to improve interview readiness.
        </p>

        <div className="grid lg:grid-cols-3 gap-8 mt-12">
          {learningTracks.map((track) => (
            <div
              key={track.title}
              className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent p-8"
            >
              <h3 className="text-2xl font-bold">{track.title}</h3>

              <div className="mt-8 space-y-4">
                {track.topics.map((topic) => (
                  <div
                    key={topic}
                    className="flex items-center gap-3 text-gray-300"
                  >
                    <div className="h-2 w-2 rounded-full bg-indigo-400" />

                    {topic}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI TOOLS */}
      <section className="container-p pb-20">
        <div className="rounded-[32px] border border-white/10 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-10">
          <div className="flex items-center gap-3">
            <Mic className="text-indigo-300" />

            <h2 className="text-4xl font-bold">AI Tools Directory</h2>
          </div>

          <p className="text-gray-300 mt-5 max-w-3xl">
            Recommended AI tools for productivity, communication, coding
            interviews, resume improvement, and frontend development.
          </p>

          <div className="flex flex-wrap gap-4 mt-10">
            {aiTools.map((tool) => (
              <a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-gray-300 hover:border-indigo-500/20 hover:text-white transition"
              >
                {tool.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* DOWNLOADS */}
      <section className="container-p pb-20">
        <div className="flex items-center gap-3">
          <Download className="text-indigo-300" />

          <h2 className="text-4xl font-bold">Free Downloads</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-12">
          {downloads.map((item) => (
            <div
              key={item}
              className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.03] p-6 hover:border-indigo-500/20 transition"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
                  <FileText size={24} />
                </div>

                <div>
                  <h3 className="text-xl font-semibold">{item}</h3>

                  <p className="text-gray-400 text-sm mt-1">
                    PDF / Printable resource
                  </p>
                </div>
              </div>

              <button className="rounded-2xl border border-white/10 px-5 py-2 text-sm hover:bg-white/5 transition">
                Download
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* BLOG CTA */}
      <section className="container-p pb-24">
        <div className="rounded-[36px] border border-indigo-500/20 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-14 text-center">
          <BookOpen className="mx-auto text-indigo-300" size={40} />

          <h2 className="mt-8 text-5xl font-bold">
            Explore AI Interview Blogs
          </h2>

          <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Read modern frontend interview guides, JavaScript concepts, React
            preparation strategies, and AI communication tips.
          </p>

          <Link
            to="/blog"
            className="inline-flex items-center rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-4 font-semibold text-white mt-10 hover:scale-105 transition"
          >
            Explore Blogs
          </Link>
        </div>
      </section>
    </main>
  );
}
