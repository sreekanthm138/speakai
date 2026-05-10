import { useEffect, useMemo, useRef, useState } from "react";
import MicButton from "../components/MicButton.jsx";
import { wordsPerMinute, fillerCounts, starGuess } from "../util/metrics.js";
import { Helmet } from "react-helmet-async";
import ProgressDashboard from "../components/ProgressDashboard";
import { supabase } from "../auth/supabaseClient.js";

const ROLE_SKILLS = {
  "Software Engineer": [
    "JavaScript",
    "React",
    "Node.js",
    "Java",
    "Python",
    "DSA",
    "System Design",
    "HTML/CSS",
    "TypeScript",
  ],

  "Product Manager": [
    "Product Sense",
    "Roadmaps",
    "Analytics",
    "Prioritization",
    "Stakeholder Management",
  ],

  "Data Analyst": ["SQL", "Python", "Excel", "Power BI", "Statistics"],

  "BPO/Support": [
    "Customer Handling",
    "Communication",
    "Escalation",
    "Email Support",
  ],
};
/* -------------------- Local cache for generated question sets -------------------- */
const CACHE_KEY = "speakai_qbank_v1";
const ttlMs = 7 * 24 * 60 * 60 * 1000; // 7 days

function getCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
  } catch {
    return {};
  }
}
function setCache(obj) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(obj));
}
function cacheGet(key) {
  const all = getCache();
  const hit = all[key];
  if (!hit) return null;
  if (Date.now() - hit.ts > ttlMs) {
    delete all[key];
    setCache(all);
    return null;
  }
  return hit.data;
}
function cacheSet(key, data) {
  const all = getCache();
  all[key] = { ts: Date.now(), data };
  setCache(all);
}

/* --------------------------------- Component ---------------------------------- */
export default function Coach() {
  // Question generator controls
  const [role, setRole] = useState("Software Engineer");
  const [skill, setSkill] = useState(ROLE_SKILLS["Software Engineer"][0]);
  const [qType, setQType] = useState("behavioral"); // behavioral | technical | mixed
  const [difficulty, setDifficulty] = useState("mixed"); // easy | medium | hard | mixed
  const [count, setCount] = useState(5);

  // Generated questions & selection
  const [qList, setQList] = useState([]); // array of strings
  const [qIndex, setQIndex] = useState(0); // current pointer
  const currentQuestion = qList[qIndex] || "";

  // Track when params changed but we haven't generated/loaded yet
  const [lastGenKey, setLastGenKey] = useState(null);
  const [controlsDirty, setControlsDirty] = useState(false);

  // Mic / transcript / timer / feedback
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState(""); // live (not-final)
  const [status, setStatus] = useState("idle"); // idle | recording | error | unsupported
  const [seconds, setSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [savedSessions, setSavedSessions] = useState([]);
  // Countdown
  const [useCountdown, setUseCountdown] = useState(true);
  const [limit, setLimit] = useState(90); // 60/90/120
  // Follow-up
  const [followUpQuestion, setFollowUpQuestion] = useState("");
  const [resumeText, setResumeText] = useState("");
  // Refs
  const micRef = useRef(null);
  const timer = useRef(null);
  const iSafe = (i) => (Number.isFinite(i) ? i + 1 : 0);

  /* ------------------------------ Timer handling ------------------------------ */
  useEffect(() => {
    if (status === "recording") {
      if (timer.current) clearInterval(timer.current);
      timer.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [status]);

  // Auto-stop when countdown limit reached
  useEffect(() => {
    if (status === "recording" && useCountdown && seconds >= limit) {
      micRef.current?.stop?.(); // triggers onend in MicButton → flush + idle
    }
  }, [status, useCountdown, seconds, limit]);

  /* ---------------------- Generate / cache question sets ---------------------- */
  const key = JSON.stringify({ role, skill, qType, difficulty, count });

  // When params change, try to load from cache; otherwise mark dirty (enable Generate)
  useEffect(() => {
    if (key === lastGenKey) {
      setControlsDirty(false);
      return;
    }
    const cached = cacheGet(key);
    if (cached?.length) {
      setQList(cached);
      setQIndex(0);
      setLastGenKey(key);
      setControlsDirty(false); // up to date from cache
    } else {
      setControlsDirty(true); // need to generate
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, qType, difficulty, count]);

  const generate = async () => {
    if (!controlsDirty) return; // nothing to do
    try {
      const r = await fetch("/.netlify/functions/gen-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          skill,
          type: qType,
          difficulty,
          count,
          resumeText,
        }),
      });
      const data = await r.json();
      if (Array.isArray(data.questions) && data.questions.length) {
        setQList(data.questions);
        setQIndex(0);
        cacheSet(key, data.questions);
        setLastGenKey(key);
        setControlsDirty(false);
      } else {
        alert(data.message || "Failed to generate questions. Try again.");
      }
    } catch (e) {
      console.error(e);
      alert("Could not reach question generator.");
    }
  };

  /* -------------------------- Transcript & AI feedback ------------------------ */
  const handleAppend = (finalText) => {
    setTranscript((t) => (t ? (t + " " + finalText).trim() : finalText));
  };

  const resetAll = () => {
    setTranscript("");
    setInterim("");
    setSeconds(0);
    setFeedback(null);
  };

  const askAI = async () => {
    if (status === "recording") {
      alert("Stop recording first.");
      return;
    }

    if (!transcript.trim()) return;

    setLoading(true);
    setFeedback(null);

    try {
      const r = await fetch("/.netlify/functions/ai-feedback", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          role,
          skill,
          question: currentQuestion,
          transcript,
        }),
      });

      const data = await r.json();

      setFeedback(data);

      setFollowUpQuestion(data.followUpQuestion || "");
    } catch (e) {
      console.error(e);
      alert("AI feedback failed. Try again.");
    } finally {
      setLoading(false);
    }
  };
  const saveSession = async () => {
    if (!feedback) return;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { error } = await supabase.from("user_sessions").insert([
        {
          user_id: user.id,

          role,

          skill,

          question: currentQuestion,

          transcript,

          feedback,

          metrics,
        },
      ]);

      if (error) {
        console.error(error);
        alert("Failed to save session");
        return;
      }

      alert("Session saved!");
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    const stored = localStorage.getItem("speakai-sessions");

    if (stored) {
      setSavedSessions(JSON.parse(stored));
    }
  }, []);
  /* --------------------------------- Metrics --------------------------------- */
  const metrics = useMemo(
    () => ({
      wpm: wordsPerMinute(transcript, Math.max(1, seconds)),
      fillers: fillerCounts(transcript),
      star: starGuess(transcript),
      duration: seconds,
    }),
    [transcript, seconds],
  );

  const prettyTime = (s) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const remaining = Math.max(0, limit - seconds);

  /* ----------------------------------- UI ------------------------------------ */
  return (
    <>
      <Helmet>
        <title>AI Mock Interview Practice | SpeakAI</title>

        <meta
          name="description"
          content="Practice AI-powered mock interviews for React, JavaScript, frontend engineering, communication, and behavioral rounds."
        />

        <link rel="canonical" href="https://speakai.in/coach" />
      </Helmet>
      <main className="container-p py-10">
        <div className="grid lg:grid-cols-[340px_1fr] gap-8">
          {/* LEFT SIDEBAR */}
          <aside className="space-y-6">
            {/* HEADER */}
            <div>
              <h1 className="text-4xl font-bold">AI Interview Coach</h1>

              <p className="text-muted mt-3">
                Practice role-specific interviews, improve communication, and
                receive AI-powered feedback.
              </p>
            </div>

            {/* SETUP */}
            <div className="card">
              <h2 className="text-2xl font-bold">Interview Setup</h2>

              <div className="grid gap-4 mt-5">
                {/* Role */}
                <div>
                  <label className="block mb-2 text-sm">Role</label>

                  <select
                    className="input bg-[#111827] text-white"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option>Software Engineer</option>
                    <option>Product Manager</option>
                    <option>Data Analyst</option>
                    <option>BPO/Support</option>
                    <option>Marketing</option>
                    <option>Sales</option>
                    <option>Designer</option>
                  </select>
                </div>

                {/* Skill */}
                <div>
                  <label className="block mb-2 text-sm">Skill</label>

                  <select
                    className="input bg-[#111827] text-white"
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                  >
                    {ROLE_SKILLS[role]?.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="border-t border-white/10 my-2" />

                <h3 className="text-lg font-semibold mt-2">
                  Question Settings
                </h3>
                {/* Type */}
                <div>
                  <label className="block mb-2 text-sm">Question Type</label>

                  <select
                    className="input bg-[#111827] text-white"
                    value={qType}
                    onChange={(e) => setQType(e.target.value)}
                  >
                    <option value="behavioral">Behavioral</option>

                    <option value="technical">Technical</option>

                    <option value="mixed">Mixed</option>
                  </select>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block mb-2 text-sm">Difficulty</label>

                  <select
                    className="input bg-[#111827] text-white"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>

                {/* Count */}
                <div>
                  <label className="block mb-2 text-sm">Questions</label>

                  <select
                    className="input bg-[#111827] text-white"
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                  >
                    <option value="3">3</option>
                    <option value="5">5</option>
                    <option value="8">8</option>
                  </select>
                </div>

                {/* Generate */}
                <button
                  className="btn btn-primary mt-2"
                  onClick={generate}
                  disabled={!controlsDirty}
                >
                  {controlsDirty ? "Generate Questions" : "Questions Ready"}
                </button>
              </div>
            </div>
            {/* Resume Upload */}
            <div className="card">
              <h3 className="text-xl font-bold">Resume Context</h3>

              <p className="text-sm text-muted mt-2">
                Paste resume content to generate personalized interview
                questions.
              </p>

              <textarea
                className="input mt-5 min-h-[260px]"
                rows="8"
                placeholder="Paste your resume here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            </div>
            {resumeText && (
              <div className="mt-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 px-4 py-3 text-sm text-indigo-400">
                Resume context added successfully.
              </div>
            )}

            {/* QUESTIONS */}
            <div className="card">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Questions</h3>

                <span className="text-sm text-muted">{qList.length}</span>
              </div>

              <div className="mt-5 space-y-3 max-h-[450px] overflow-y-auto">
                {qList.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setQIndex(i)}
                    className={`group w-full rounded-2xl border p-4 text-left transition-all duration-300 ${
                      i === qIndex
                        ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                        : "border-white/10 hover:bg-white/[0.06] hover:-translate-y-1"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-6 w-6 rounded-full bg-primary/20 text-xs flex items-center justify-center">
                        {i + 1}
                      </div>

                      <span className="text-xs text-muted">Question</span>
                    </div>

                    <p className="line-clamp-3 text-sm transition group-hover:text-white">
                      {q}
                    </p>
                  </button>
                ))}

                {!qList.length && (
                  <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center">
                    <p className="text-muted">
                      Generate AI-powered interview questions to begin your mock
                      interview.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* RIGHT CONTENT */}
          <section className="space-y-6">
            {/* CURRENT QUESTION */}
            <div className="card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-muted">Current Question</p>

                  <div className="flex items-center gap-3 mt-2">
                    <div className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300">
                      Question {qIndex + 1} of {qList.length || 1}
                    </div>

                    <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted">
                      {difficulty}
                    </div>
                  </div>

                  <h2 className="text-2xl lg:text-3xl font-bold leading-snug mt-5 max-w-5xl">
                    {currentQuestion || "Select a question"}
                  </h2>
                </div>

                <div className="rounded-2xl bg-primary/10 px-4 py-2 text-sm whitespace-nowrap">
                  AI Interview
                </div>
              </div>
            </div>

            {/* RECORDING */}
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">Your Answer</h3>

                  <p className="text-muted text-sm mt-1">
                    Speak naturally and explain clearly.
                  </p>
                </div>

                <div className="text-sm text-muted">
                  {status === "recording" && useCountdown
                    ? `Time Left: ${prettyTime(remaining)}`
                    : `Timer: ${prettyTime(seconds)}`}
                </div>
              </div>

              {/* Wave Placeholder */}
              {/* Voice Visualizer */}
              <div className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-white/[0.01] p-8">
                <div className="flex items-center justify-center gap-2 h-24">
                  {[...Array(24)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full ${
                        status === "recording"
                          ? "animate-pulse bg-indigo-400"
                          : "bg-white/20"
                      }`}
                      style={{
                        height:
                          status === "recording"
                            ? `${20 + (i % 5) * 12}px`
                            : "20px",

                        animationDelay: `${i * 0.05}s`,
                      }}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-center mt-6">
                  <div
                    className={`flex items-center gap-3 rounded-full px-4 py-2 ${
                      status === "recording"
                        ? "bg-red-500/10"
                        : "bg-indigo-500/10"
                    }`}
                  >
                    <div
                      className={`h-3 w-3 rounded-full ${
                        status === "recording"
                          ? "bg-red-500 animate-pulse"
                          : "bg-indigo-500"
                      }`}
                    />

                    <span className="text-sm">
                      {status === "recording"
                        ? "Recording Live"
                        : "Ready to Record"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap gap-3 mt-8">
                <MicButton
                  ref={micRef}
                  onTranscriptAppend={handleAppend}
                  onInterim={setInterim}
                  onState={setStatus}
                />

                {status === "recording" && (
                  <button
                    className="rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-3 font-semibold text-red-300 hover:bg-red-500/20 transition"
                    onClick={() => micRef.current?.stop?.()}
                  >
                    Stop Recording
                  </button>
                )}

                <button
                  className="rounded-2xl border border-white/10 px-6 py-3 text-gray-400 hover:bg-white/5 transition"
                  onClick={resetAll}
                >
                  Reset
                </button>

                <button
                  className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 px-6 py-3 font-semibold text-indigo-300 hover:bg-indigo-500/20 transition"
                  onClick={askAI}
                  disabled={
                    loading || !transcript.trim() || status === "recording"
                  }
                >
                  {loading ? "Analyzing..." : "Get AI Feedback"}
                </button>
              </div>
            </div>

            {/* TRANSCRIPT */}
            <div className="card">
              <h3 className="text-2xl font-bold">Transcript</h3>

              <textarea
                className="input mt-5 min-h-[260px]"
                rows="10"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Your spoken answer will appear here..."
              />

              {interim && (
                <p className="text-sm italic mt-3 text-muted">
                  Live: {interim}
                </p>
              )}
            </div>

            {/* METRICS */}
            {/* METRICS */}
            <div className="grid md:grid-cols-3 gap-4">
              {/* WPM */}
              <div className="card relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-1 bg-indigo-500" />

                <p className="text-sm text-muted">Words Per Minute</p>

                <div className="flex items-end justify-between mt-4">
                  <h3 className="text-5xl font-bold">{metrics.wpm}</h3>

                  <div className="h-14 w-14 rounded-full border-4 border-indigo-500 flex items-center justify-center text-sm">
                    WPM
                  </div>
                </div>

                <div className="mt-5 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-indigo-500"
                    style={{
                      width: `${(Math.min(metrics.wpm, 160) / 160) * 100}%`,
                    }}
                  />
                </div>

                <p className="text-sm text-muted mt-3">Ideal range: 120–160</p>
              </div>

              {/* Fillers */}
              <div className="card relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-1 bg-red-500" />

                <p className="text-sm text-muted">Filler Words</p>

                <div className="flex items-end justify-between mt-4">
                  <h3 className="text-5xl font-bold">
                    {metrics.fillers.total}
                  </h3>

                  <div className="h-14 w-14 rounded-full border-4 border-red-500 flex items-center justify-center text-sm">
                    Uh
                  </div>
                </div>

                <div className="mt-5 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-red-500"
                    style={{
                      width: `${Math.min(metrics.fillers.total, 10) * 10}%`,
                    }}
                  />
                </div>

                <p className="text-sm text-muted mt-3">
                  {metrics.fillers.hits.length
                    ? metrics.fillers.hits
                        .map((h) => `${h.filler}×${h.count}`)
                        .join(" · ")
                    : "Excellent clarity"}
                </p>
              </div>

              {/* STAR */}
              <div className="card relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-1 bg-indigo-500" />

                <p className="text-sm text-muted">STAR Structure</p>

                <div className="flex items-end justify-between mt-4">
                  <h3 className="text-3xl font-bold">
                    {metrics.star.hasSTAR ? "Strong" : "Weak"}
                  </h3>

                  <div
                    className={`h-14 w-14 rounded-full border-4 flex items-center justify-center text-sm ${
                      metrics.star.hasSTAR
                        ? "border-indigo-500"
                        : "border-yellow-500"
                    }`}
                  >
                    STAR
                  </div>
                </div>

                <div className="mt-5 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full ${
                      metrics.star.hasSTAR
                        ? "bg-indigo-500 w-full"
                        : "bg-yellow-500 w-1/2"
                    }`}
                  />
                </div>

                <p className="text-sm text-muted mt-3">
                  Situation · Task · Action · Result
                </p>
              </div>
            </div>

            {/* AI FEEDBACK */}
            <div className="card">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">AI Feedback</h3>

                {feedback?.score && (
                  <div className="flex items-center gap-3">
                    <div className="relative h-14 w-14 rounded-full border-4 border-primary flex items-center justify-center font-bold">
                      {feedback.score}
                    </div>

                    <div>
                      <p className="text-sm text-muted">Overall Score</p>

                      <p className="font-semibold">AI Analysis</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 p-5 min-h-[220px]">
                {loading ? (
                  <div className="space-y-3 animate-pulse">
                    <div className="h-4 rounded bg-white/10" />
                    <div className="h-4 rounded bg-white/10 w-5/6" />
                    <div className="h-4 rounded bg-white/10 w-4/6" />
                  </div>
                ) : feedback ? (
                  <div className="space-y-5">
                    {/* Summary */}
                    {/* Score Breakdown */}
                    {feedback.scores && (
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          {
                            label: "Confidence",
                            value: feedback.scores.confidence,
                            color: "bg-indigo-500",
                          },

                          {
                            label: "Clarity",
                            value: feedback.scores.clarity,
                            color: "bg-blue-500",
                          },

                          {
                            label: "Technical Depth",
                            value: feedback.scores.technical,
                            color: "bg-purple-500",
                          },

                          {
                            label: "Communication",
                            value: feedback.scores.communication,
                            color: "bg-indigo-500",
                          },

                          {
                            label: "STAR Structure",
                            value: feedback.scores.star,
                            color: "bg-yellow-500",
                          },
                        ].map((item) => (
                          <div
                            key={item.label}
                            className="rounded-2xl border border-white/10 bg-white/5 p-5"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold">{item.label}</h4>

                              <span className="text-sm text-muted">
                                {item.value}/10
                              </span>
                            </div>

                            {/* Progress */}
                            <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                              <div
                                className={`h-full ${item.color} transition-all duration-700`}
                                style={{
                                  width: `${item.value * 10}%`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {feedback.summary && (
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                        <h4 className="font-semibold mb-3 text-lg">Summary</h4>

                        <p className="text-muted leading-relaxed">
                          {feedback.summary}
                        </p>
                      </div>
                    )}

                    {/* Strengths */}
                    {!!feedback.strengths?.length && (
                      <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5">
                        <h4 className="font-semibold mb-3 text-lg text-indigo-400">
                          Strengths
                        </h4>

                        <ul className="list-disc pl-5 text-muted space-y-2">
                          {feedback.strengths.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Improvements */}
                    {!!feedback.improvements?.length && (
                      <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">
                        <h4 className="font-semibold mb-3 text-lg text-yellow-400">
                          Improvements
                        </h4>

                        <ul className="list-disc pl-5 text-muted space-y-2">
                          {feedback.improvements.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
                      <h4 className="text-xl font-bold mb-3">
                        AI Recommendation
                      </h4>

                      <p className="text-muted leading-relaxed">
                        Practice shorter and more structured answers. Focus on
                        reducing filler words and improving STAR method
                        storytelling.
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted">
                    AI feedback will appear here after analysis.
                  </p>
                )}
              </div>
            </div>
            <button className="btn btn-primary mt-6" onClick={saveSession}>
              Save Session
            </button>
            {/* Follow-up Question */}
            {followUpQuestion && (
              <div className="card border-primary/20 bg-primary/5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted">AI Follow-up Question</p>

                    <h3 className="text-2xl font-bold mt-3 leading-relaxed">
                      {followUpQuestion}
                    </h3>
                  </div>

                  <div className="rounded-2xl bg-primary/10 px-4 py-2 text-sm whitespace-nowrap">
                    Adaptive AI
                  </div>
                </div>

                <button
                  className="btn btn-primary mt-6"
                  onClick={() => {
                    const updated = [...qList, followUpQuestion];

                    setQList(updated);

                    setQIndex(updated.length - 1);

                    setFollowUpQuestion("");

                    setTranscript("");

                    setInterim("");

                    setFeedback(null);

                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                >
                  Continue Interview
                </button>
              </div>
            )}
            <ProgressDashboard sessions={savedSessions} />
            {/* SAVED SESSIONS */}
            <div className="card">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-2xl font-bold">Saved Sessions</h3>

                <button className="btn border" onClick={saveSession}>
                  Save Current Session
                </button>
              </div>

              <SavedSessions />
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

/* ------------------------------- Subcomponents ------------------------------- */

function SavedSessions() {
  const [items, setItems] = useState(() =>
    JSON.parse(localStorage.getItem("speakai_sessions") || "[]"),
  );
  const clear = () => {
    localStorage.removeItem("speakai_sessions");
    setItems([]);
  };
  if (!items.length)
    return <p className="text-muted">No saved sessions yet.</p>;
  return (
    <>
      <button className="btn border mb-3" onClick={clear}>
        Clear all
      </button>
      <div className="grid md:grid-cols-2 gap-3">
        {items.map((s, idx) => (
          <div className="card" key={idx}>
            <div className="text-sm text-muted">
              {new Date(s.ts).toLocaleString()}
            </div>
            <div className="font-semibold">{s.role}</div>
            <div className="text-sm">{s.question}</div>
            <div className="text-sm text-muted mt-1">
              WPM {s.metrics?.wpm} • Fillers {s.metrics?.fillers?.total} • STAR{" "}
              {s.metrics?.star?.hasSTAR ? "✅" : "⚠️"}
            </div>
            <details className="mt-2">
              <summary className="cursor-pointer">Transcript</summary>
              <p className="text-sm mt-1">{s.transcript}</p>
            </details>
          </div>
        ))}
      </div>
    </>
  );
}
