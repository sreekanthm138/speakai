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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [interviewSeconds, setInterviewSeconds] = useState(0);
  // Countdown
  const [useCountdown, setUseCountdown] = useState(true);
  const [limit, setLimit] = useState(90); // 60/90/120
  // Follow-up
  const [followUpQuestion, setFollowUpQuestion] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [completedAnswers, setCompletedAnswers] = useState([]);
  const [finalReport, setFinalReport] = useState(null);
  const [finalLoading, setFinalLoading] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
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

  useEffect(() => {
    if (status === "idle" && transcript.trim() && !loading) {
      const timeout = setTimeout(async () => {
        setIsAnalyzing(true);

        try {
          await askAI();
        } finally {
          setIsAnalyzing(false);
        }
      }, 800);

      return () => clearTimeout(timeout);
    }
  }, [status, transcript]);

  useEffect(() => {
    const interval = setInterval(() => {
      setInterviewSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
    setFeedbackLoading(true);
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
      setShowFeedbackModal(true);
    } catch (e) {
      console.error(e);
      alert("AI feedback failed. Try again.");
    } finally {
      setLoading(false);
      setFeedbackLoading(false);
    }
  };

  const generateFinalReport = async () => {
    if (!completedAnswers.length) return;
    console.log(completedAnswers);
    setFinalLoading(true);

    try {
      const r = await fetch("/.netlify/functions/final-report", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          role,
          skill,
          qType,
          answers: completedAnswers,
        }),
      });

      const data = await r.json();

      setFinalReport(data);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase.from("user_sessions").insert([
          {
            user_id: user.id,
            role,
            skill,
            question: `${qList.length} Question Mock Interview`,
            transcript: JSON.stringify(completedAnswers),
            feedback: data,
            metrics: {
              totalQuestions: qList.length,
              completed: true,
              interviewType: qType,
            },
          },
        ]);

        if (error) {
          console.error(error);
        }
      }
    } catch (e) {
      console.error(e);
      alert("Failed to generate report");
    } finally {
      setFinalLoading(false);
    }
  };

  const moveToNextQuestion = () => {
    setQIndex((prev) => prev + 1);
    setTranscript("");
    setInterim("");
    setFeedback(null);
    setSeconds(0);
    setNextCountdown(null);
    setAutoMoving(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // const saveSession = async () => {
  //   if (!feedback) return;

  //   try {
  //     const {
  //       data: { user },
  //     } = await supabase.auth.getUser();

  //     if (!user) return;

  //     const { error } = await supabase.from("user_sessions").insert([
  //       {
  //         user_id: user.id,

  //         role,

  //         skill,

  //         question: currentQuestion,

  //         transcript,

  //         feedback,

  //         metrics,
  //       },
  //     ]);

  //     if (error) {
  //       console.error(error);
  //       alert("Failed to save session");
  //       return;
  //     }

  //     alert("Session saved!");
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

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

  const formatInterviewTime = (secs) => {
    const mins = Math.floor(secs / 60);

    const sec = secs % 60;

    return `${mins}m ${sec}s`;
  };
  const difficulty = qIndex <= 1 ? "Easy" : qIndex <= 3 ? "Medium" : "Hard";
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
        {/* Interview Session Bar */}
        <div className="sticky top-20 z-30 mb-6">
          <div className="rounded-2xl border border-white/10 bg-[#0F172A]/90 backdrop-blur-xl px-5 py-4 shadow-lg">
            <div className="flex items-center justify-between gap-6 flex-wrap">
              {/* LEFT */}
              <div>
                <p className="text-xs uppercase tracking-wider text-indigo-300">
                  AI Interview Session
                </p>

                <h2 className="text-xl font-bold mt-1">
                  {role || "Frontend"} Interview
                </h2>
              </div>

              {/* CENTER */}
              <div className="flex items-center gap-6 flex-wrap">
                <div>
                  <p className="text-xs text-muted">Progress</p>

                  <p className="font-semibold mt-1">
                    Question {qIndex + 1}/{qList.length}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted">Difficulty</p>

                  <p className="font-semibold mt-1">{difficulty}</p>
                </div>

                <div>
                  <p className="text-xs text-muted">Elapsed Time</p>

                  <p className="font-semibold mt-1">
                    {formatInterviewTime(interviewSeconds)}
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />

                <p className="text-sm text-emerald-300">AI Coach Active</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid lg:grid-cols-[340px_1fr] gap-6">
          {/* LEFT SIDEBAR */}
          <aside className="space-y-6">
            {/* HEADER */}
            <div>
              <h1 className="text-3xl font-bold">AI Interview Coach</h1>

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

              <div className="mt-5 space-y-3 max-h-[450px] overflow-y-auto scrollbar-hide">
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
                  <div className="flex gap-2 mt-5">
                    {Array.from({ length: qList.length || 1 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                          i <= qIndex ? "bg-indigo-500" : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                  <h2 className="text-2xl lg:text-2xl font-bold leading-snug mt-5 max-w-5xl">
                    {currentQuestion || "Select a question"}
                  </h2>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300 whitespace-nowrap">
                  <div className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
                  Senior AI Interviewer
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
              <div className="mt-5 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-white/[0.01] p-6">
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
              <div className="flex flex-wrap gap-3 mt-5">
                <MicButton
                  ref={micRef}
                  onTranscriptAppend={handleAppend}
                  onInterim={setInterim}
                  onState={setStatus}
                />

                {status === "recording" && (
                  <button
                    className="rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-3 font-semibold text-red-300 hover:bg-red-500/20 transition"
                    onClick={() => {
                      micRef.current?.stop?.();
                    }}
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
              </div>
            </div>

            {/* TRANSCRIPT */}
            <div className="card">
              <h3 className="text-2xl font-bold">Transcript</h3>

              <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.03] p-6 min-h-[220px]">
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      status === "recording"
                        ? "bg-red-500 animate-pulse"
                        : "bg-indigo-400"
                    }`}
                  />

                  <span className="text-sm text-muted">
                    {status === "recording"
                      ? "Listening..."
                      : "Transcript Ready"}
                  </span>
                </div>

                <p className="leading-7 text-gray-200 whitespace-pre-wrap">
                  {transcript ||
                    "Start speaking to see your live transcript..."}

                  {status === "recording" && (
                    <span className="animate-pulse text-indigo-400">|</span>
                  )}
                </p>
              </div>

              {interim && (
                <p className="text-sm italic mt-3 text-muted">
                  Live: {interim}
                </p>
              )}
            </div>

            {finalReport && (
              <div className="card border-indigo-500/20 bg-indigo-500/5">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-sm text-indigo-300">
                      AI Interview Summary
                    </p>

                    <h2 className="text-2xl font-bold mt-2">
                      {finalReport.overallScore}/10
                    </h2>
                  </div>

                  <div className="rounded-3xl bg-indigo-500/10 px-6 py-4">
                    <p className="text-sm text-muted">Hiring Recommendation</p>

                    <p className="text-xl font-bold mt-1">
                      {finalReport.recommendation}
                    </p>
                  </div>
                </div>

                {/* Summary */}
                <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h3 className="text-xl font-bold mb-4">Final Summary</h3>

                  <p className="text-muted leading-7">{finalReport.summary}</p>
                </div>

                {/* Strengths */}
                {!!finalReport.strengths?.length && (
                  <div className="mt-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6">
                    <h3 className="text-xl font-bold mb-4 text-indigo-300">
                      Strengths
                    </h3>

                    <ul className="space-y-3 text-muted">
                      {finalReport.strengths.map((s, i) => (
                        <li key={i}>✓ {s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {!!finalReport.improvements?.length && (
                  <div className="mt-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-6">
                    <h3 className="text-xl font-bold mb-4 text-yellow-300">
                      Improvements
                    </h3>

                    <ul className="space-y-3 text-muted">
                      {finalReport.improvements.map((s, i) => (
                        <li key={i}>• {s}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Improvement Roadmap */}
                <div className="mt-5 rounded-3xl border border-indigo-500/20 bg-indigo-500/5 p-6">
                  <p className="text-sm text-indigo-300 mb-2">
                    Improvement Roadmap
                  </p>

                  <h3 className="text-2xl font-bold mb-6">Your Next Steps</h3>

                  <div className="space-y-5">
                    {finalReport.improvements?.map((item, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-sm font-bold text-indigo-300 shrink-0">
                          {i + 1}
                        </div>

                        <div>
                          <p className="text-white leading-7">{item}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Practice Again CTA */}
                <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
                  <p className="text-sm text-indigo-300">Continue Improving</p>

                  <h3 className="text-3xl font-bold mt-3">
                    Practice Another Interview
                  </h3>

                  <p className="text-muted mt-4 max-w-2xl mx-auto">
                    Build confidence with more AI-powered interview simulations
                    tailored to your target role.
                  </p>

                  <div className="flex flex-wrap justify-center gap-4 mt-5">
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setSkill("React");
                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });
                      }}
                    >
                      React Interview
                    </button>

                    <button
                      className="btn border"
                      onClick={() => {
                        setSkill("JavaScript");
                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });
                      }}
                    >
                      JavaScript
                    </button>

                    <button
                      className="btn border"
                      onClick={() => {
                        setQType("Behavioral");
                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });
                      }}
                    >
                      Behavioral
                    </button>
                  </div>
                </div>
              </div>
            )}
            {feedbackLoading && (
              <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center">
                <div className="h-20 w-20 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />

                <h2 className="text-3xl font-bold mt-5">
                  AI is analyzing your answer...
                </h2>

                <p className="text-muted mt-3">
                  Evaluating communication, clarity, confidence & STAR structure
                </p>
              </div>
            )}
            {showFeedbackModal && feedback && (
              <div className="fixed inset-0 z-50 p-6 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                <div className="w-full max-w-5xl rounded-3xl border border-white/10 bg-[#0B1120] overflow-hidden animate-in fade-in zoom-in-95 duration-300 shadow-[0_25px_80px_rgba(0,0,0,0.7)]">
                  {/* HEADER */}
                  <div className="px-7 py-4 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-indigo-300">
                          AI Interview Feedback
                        </p>

                        <h2 className="text-2xl font-bold mt-2">
                          {feedback.score}/10
                        </h2>
                      </div>

                      <div className="hidden md:block h-16 w-px bg-white/10" />

                      <div className="hidden md:flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-muted text-sm">
                            Confidence:
                          </span>

                          <span className="font-semibold">
                            {feedback.scores?.confidence || 0}/10
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-muted text-sm">Clarity:</span>

                          <span className="font-semibold">
                            {feedback.scores?.clarity || 0}/10
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-muted text-sm">
                            Communication:
                          </span>

                          <span className="font-semibold">
                            {feedback.scores?.communication || 0}/10
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      className="text-gray-400 hover:text-white text-3xl"
                      onClick={() => setShowFeedbackModal(false)}
                    >
                      ×
                    </button>
                  </div>

                  {/* CONTENT */}
                  <div className="grid lg:grid-cols-[320px_1fr] gap-6 p-6 max-h-[68vh] overflow-y-auto scrollbar-hide">
                    {/* LEFT SIDEBAR */}
                    <div className="space-y-5">
                      {/* WPM */}
                      <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5">
                        <p className="text-sm text-muted">Words Per Minute</p>

                        <h3 className="text-2xl font-bold mt-3">
                          {metrics?.wpm || 0}
                        </h3>

                        <p className="text-xs text-muted mt-3">
                          Ideal speaking pace: 110–160 WPM
                        </p>
                      </div>

                      {/* Fillers */}
                      <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">
                        <p className="text-sm text-muted">Filler Words</p>

                        <h3 className="text-2xl font-bold mt-3">
                          {metrics?.fillerCount || 0}
                        </h3>

                        <div className="flex flex-wrap gap-2 mt-4">
                          {metrics?.fillers?.length ? (
                            metrics.fillers.map((f, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-300 text-xs"
                              >
                                {f}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-muted">
                              Excellent clarity
                            </span>
                          )}
                        </div>
                      </div>

                      {/* STAR */}
                      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                        <p className="text-sm text-muted">STAR Structure</p>

                        <h3 className="text-2xl font-bold mt-3">
                          {feedback.star?.hasSTAR
                            ? "Strong"
                            : "Needs Improvement"}
                        </h3>

                        {!!feedback.star?.missing?.length && (
                          <div className="mt-4">
                            <p className="text-xs text-muted mb-2">Missing:</p>

                            <div className="flex flex-wrap gap-2">
                              {feedback.star.missing.map((m, i) => (
                                <span
                                  key={i}
                                  className="px-3 py-1 rounded-full bg-red-500/10 text-red-300 text-xs"
                                >
                                  {m}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Technical */}
                      <div className="rounded-2xl border border-pink-500/20 bg-pink-500/5 p-5">
                        <p className="text-sm text-muted">Technical Depth</p>

                        <h3 className="text-2xl font-bold mt-3">
                          {feedback.scores?.technical || 0}/10
                        </h3>
                      </div>
                    </div>

                    {/* RIGHT CONTENT */}
                    <div className="space-y-6">
                      {/* Summary */}
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                        <h3 className="text-2xl font-bold mb-5">Summary</h3>

                        <p className="text-muted leading-7 text-base">
                          {feedback.summary}
                        </p>
                      </div>

                      {/* Strengths */}
                      {!!feedback.strengths?.length && (
                        <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5">
                          <h3 className="text-2xl font-bold mb-5 text-indigo-300">
                            Strengths
                          </h3>

                          <ul className="space-y-4 text-muted">
                            {feedback.strengths.map((s, i) => (
                              <li key={i} className="leading-7">
                                ✓ {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Improvements */}
                      {!!feedback.improvements?.length && (
                        <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">
                          <h3 className="text-2xl font-bold mb-5 text-yellow-300">
                            Improvements
                          </h3>

                          <ul className="space-y-4 text-muted">
                            {feedback.improvements.map((s, i) => (
                              <li key={i} className="leading-7">
                                • {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Recommendation */}
                      {feedback.recommendation && (
                        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                          <h3 className="text-2xl font-bold mb-5 text-emerald-300">
                            AI Recommendation
                          </h3>

                          <p className="text-muted leading-7 text-base">
                            {feedback.recommendation}
                          </p>
                        </div>
                      )}

                      {/* Follow Up */}
                      {feedback.followUpQuestion && (
                        <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5">
                          <h3 className="text-2xl font-bold mb-5 text-purple-300">
                            Suggested Follow-up Question
                          </h3>

                          <p className="text-muted leading-7 text-base">
                            {feedback.followUpQuestion}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* FOOTER */}
                  <div className="px-4 py-4 border-t border-white/10 bg-[#0F172A] flex items-center justify-between flex-wrap gap-4">
                    <p className="text-sm text-muted">
                      AI Interview Coach Analysis
                    </p>

                    <div className="flex gap-4 flex-wrap">
                      {/* Retry */}
                      <button
                        className="btn border"
                        onClick={() => {
                          setTranscript("");

                          setInterim("");

                          setFeedback(null);

                          setShowFeedbackModal(false);

                          setSeconds(0);

                          window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                          });
                        }}
                      >
                        ↺ Retry Answer
                      </button>

                      {/* Next Question */}
                      {qIndex < qList.length - 1 && (
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            if (!feedback) return;

                            setCompletedAnswers((prev) => {
                              const filtered = prev.filter(
                                (a) => a.question !== currentQuestion,
                              );

                              return [
                                ...filtered,
                                {
                                  question: currentQuestion,
                                  transcript,
                                  feedback,
                                  metrics,
                                },
                              ];
                            });

                            setShowFeedbackModal(false);

                            moveToNextQuestion();
                          }}
                        >
                          Next Question →
                        </button>
                      )}

                      {/* Final Report */}
                      {qIndex === qList.length - 1 && (
                        <button
                          className="btn btn-primary"
                          disabled={finalLoading}
                          onClick={async () => {
                            const updatedAnswers = completedAnswers.filter(
                              (a) => a.question !== currentQuestion,
                            );

                            updatedAnswers.push({
                              question: currentQuestion,
                              transcript,
                              feedback,
                              metrics,
                            });

                            setCompletedAnswers(updatedAnswers);

                            setShowFeedbackModal(false);

                            setTimeout(() => {
                              generateFinalReport();
                            }, 300);
                          }}
                        >
                          {finalLoading
                            ? "Generating..."
                            : "Generate Final Report"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* <ProgressDashboard sessions={completedAnswers} /> */}
            {/* SAVED SESSIONS */}
            {/* <div className="card">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-2xl font-bold">Saved Sessions</h3>

                <button className="btn border" onClick={saveSession}>
                  Save Current Session
                </button>
              </div>

              <SavedSessions />
            </div> */}
          </section>
        </div>
      </main>
    </>
  );
}

/* ------------------------------- Subcomponents ------------------------------- */

// function SavedSessions() {
//   const [items, setItems] = useState(() =>
//     JSON.parse(localStorage.getItem("speakai_sessions") || "[]"),
//   );
//   const clear = () => {
//     localStorage.removeItem("speakai_sessions");
//     setItems([]);
//   };
//   if (!items.length)
//     return <p className="text-muted">No saved sessions yet.</p>;
//   return (
//     <>
//       <button className="btn border mb-3" onClick={clear}>
//         Clear all
//       </button>
//       <div className="grid md:grid-cols-2 gap-3">
//         {items.map((s, idx) => (
//           <div className="card" key={idx}>
//             <div className="text-sm text-muted">
//               {new Date(s.ts).toLocaleString()}
//             </div>
//             <div className="font-semibold">{s.role}</div>
//             <div className="text-sm">{s.question}</div>
//             <div className="text-sm text-muted mt-1">
//               WPM {s.metrics?.wpm} • Fillers {s.metrics?.fillers?.total} • STAR{" "}
//               {s.metrics?.star?.hasSTAR ? "✅" : "⚠️"}
//             </div>
//             <details className="mt-2">
//               <summary className="cursor-pointer">Transcript</summary>
//               <p className="text-sm mt-1">{s.transcript}</p>
//             </details>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// }
