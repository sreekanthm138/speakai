import { useEffect, useMemo, useRef, useState } from "react";
import MicButton from "../components/MicButton.jsx";
import { wordsPerMinute, fillerCounts, starGuess } from "../util/metrics.js";
import { Helmet } from "react-helmet-async";
import ProgressDashboard from "../components/ProgressDashboard";
import { supabase } from "../auth/supabaseClient.js";
import InterviewEmptyState from "../components/interview/InterviewEmptyState.jsx";
import InterviewSessionBar from "../components/interview/InterviewSessionBar";
import InterviewSetup from "../components/interview/InterviewSetup";
import InterviewWorkspace from "../components/interview/InterviewWorkspace";
import FeedbackModal from "../components/interview/FeedbackModal";

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
  const [role, setRole] = useState("");
  const [skill, setSkill] = useState("");
  const [qType, setQType] = useState(""); // behavioral | technical | mixed
  const [difficulty, setDifficulty] = useState(""); // easy | medium | hard | mixed
  const [count, setCount] = useState("");

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
  const [questionsLoading, setQuestionsLoading] = useState(false);
  // Refs
  const micRef = useRef(null);
  const timer = useRef(null);
  const iSafe = (i) => (Number.isFinite(i) ? i + 1 : 0);
  const hasInterviewStarted = qList.length > 0;

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
  }, [role, qType, difficulty, count, skill]);

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
    if (!hasInterviewStarted) return;

    const interval = setInterval(() => {
      setInterviewSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [hasInterviewStarted]);

  const generate = async () => {
    if (!controlsDirty) return; // nothing to do
    setQuestionsLoading(true);
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

        // RESET ENTIRE INTERVIEW SESSION
        setQIndex(0);

        setInterviewSeconds(0);

        setCompletedAnswers([]);

        setFeedback(null);

        setFinalReport(null);

        setTranscript("");

        setInterim("");
        setShowFeedbackModal(false);

        cacheSet(key, data.questions);

        setLastGenKey(key);

        setControlsDirty(false);
      } else {
        alert(data.message || "Failed to generate questions. Try again.");
      }
    } catch (e) {
      console.error(e);
      alert("Could not reach question generator.");
    } finally {
      setQuestionsLoading(false);
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
      setInterviewSeconds(0);
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
  const difficultyQ = qIndex <= 1 ? "Easy" : qIndex <= 3 ? "Medium" : "Hard";
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
      <main className="container-p py-5">
        {hasInterviewStarted && (
          <InterviewSessionBar
            hasInterviewStarted={hasInterviewStarted}
            role={role}
            qIndex={qIndex}
            qList={qList}
            difficultyQ={difficultyQ}
            interviewSeconds={interviewSeconds}
            formatInterviewTime={formatInterviewTime}
          />
        )}

        <div
          className={
            hasInterviewStarted
              ? "grid lg:grid-cols-[300px_1fr] gap-5 items-start"
              : "grid lg:grid-cols-[1.45fr_0.72fr] gap-6 items-start max-w-7xl mx-auto"
          }
        >
          <InterviewSetup
            role={role}
            setRole={setRole}
            skill={skill}
            setSkill={setSkill}
            qType={qType}
            setQType={setQType}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            count={count}
            setCount={setCount}
            generate={generate}
            questionsLoading={questionsLoading}
            controlsDirty={controlsDirty}
            ROLE_SKILLS={ROLE_SKILLS}
            hasInterviewStarted={hasInterviewStarted}
          />
          {hasInterviewStarted ? (
            <InterviewWorkspace
              qList={qList}
              qIndex={qIndex}
              setQIndex={setQIndex}
              transcript={transcript}
              interim={interim}
              feedback={feedback}
              metrics={metrics}
              currentQuestion={currentQuestion}
              status={status}
              setStatus={setStatus}
              seconds={seconds}
              handleAppend={handleAppend}
              resetAll={resetAll}
              loading={loading}
              feedbackLoading={feedbackLoading}
              askAI={askAI}
              micRef={micRef}
              setTranscript={setTranscript}
              setInterim={setInterim}
              followUpQuestion={followUpQuestion}
              useCountdown={useCountdown}
              setUseCountdown={setUseCountdown}
              limit={limit}
              setLimit={setLimit}
              remaining={remaining}
              prettyTime={prettyTime}
            />
          ) : (
            
              <InterviewEmptyState />
            
          )}
          {questionsLoading && (
            <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center">
              <div className="h-24 w-24 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />

              <h2 className="text-4xl font-bold mt-10">
                Generating Interview Questions...
              </h2>

              <p className="text-muted mt-4 max-w-md text-center leading-7">
                AI is preparing personalized interview questions based on your
                selected role, skill, and interview type.
              </p>
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
        </div>
        {showFeedbackModal && feedback && (
          <FeedbackModal
            showFeedbackModal={showFeedbackModal}
            setShowFeedbackModal={setShowFeedbackModal}
            feedback={feedback}
            metrics={metrics}
            qIndex={qIndex}
            qList={qList}
            completedAnswers={completedAnswers}
            setCompletedAnswers={setCompletedAnswers}
            currentQuestion={currentQuestion}
            transcript={transcript}
            moveToNextQuestion={moveToNextQuestion}
            generateFinalReport={generateFinalReport}
            finalLoading={finalLoading}
            setTranscript={setTranscript}
            setInterim={setInterim}
            setFeedback={setFeedback}
            setSeconds={setSeconds}
            finalReport={finalReport}
          />
        )}
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
