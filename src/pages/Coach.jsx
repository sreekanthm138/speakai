import { useEffect, useMemo, useRef, useState } from "react";
import MicButton from "../components/MicButton.jsx";
import { wordsPerMinute, fillerCounts, starGuess } from "../util/metrics.js";

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

  // Countdown
  const [useCountdown, setUseCountdown] = useState(true);
  const [limit, setLimit] = useState(90); // 60/90/120

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
  const key = JSON.stringify({ role, qType, difficulty, count });

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
        body: JSON.stringify({ role, type: qType, difficulty, count }),
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, question: currentQuestion, transcript }),
      });
      const data = await r.json();
      setFeedback(data);
    } catch (e) {
      console.error(e);
      alert("AI feedback failed. Try again.");
    } finally {
      setLoading(false);
    }
  };
  const saveSession = () => {
    if (!transcript.trim()) {
      alert("Nothing to save — record or type an answer first.");
      return;
    }
    const entry = {
      ts: Date.now(),
      role,
      question: currentQuestion,
      transcript,
      metrics,
      feedback,
    };
    const old = JSON.parse(localStorage.getItem("speakai_sessions") || "[]");
    localStorage.setItem(
      "speakai_sessions",
      JSON.stringify([entry, ...old].slice(0, 50))
    );
    alert("Session saved ✅");
  };
  /* --------------------------------- Metrics --------------------------------- */
  const metrics = useMemo(
    () => ({
      wpm: wordsPerMinute(transcript, Math.max(1, seconds)),
      fillers: fillerCounts(transcript),
      star: starGuess(transcript),
      duration: seconds,
    }),
    [transcript, seconds]
  );

  const prettyTime = (s) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const remaining = Math.max(0, limit - seconds);

  /* ----------------------------------- UI ------------------------------------ */
  return (
    <main className="container-p section max-w-4xl">
      <h1 className="h1 mb-2">AI Interview Coach</h1>
      <p className="lead">
        Generate role-specific questions, record your answer, see live metrics,
        and get AI feedback.
      </p>

      {/* SETUP & QUESTION GENERATION */}
      <div className="card">
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block mb-1">Role</label>
            <select
              className="input"
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

          <div>
            <label className="block mb-1">Question type</label>
            <select
              className="input"
              value={qType}
              onChange={(e) => setQType(e.target.value)}
            >
              <option value="behavioral">Behavioral</option>
              <option value="technical">Technical</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Difficulty</label>
            <select
              className="input"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">How many?</label>
            <select
              className="input"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
            >
              <option value="3">3</option>
              <option value="5">5</option>
              <option value="8">8</option>
            </select>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            className="btn btn-primary"
            onClick={generate}
            disabled={!controlsDirty}
            title={
              controlsDirty ? "Generate new questions" : "Already up to date"
            }
          >
            ⚡ {controlsDirty ? "Generate questions" : "Questions ready"}
          </button>
          {qList.length > 0 && (
            <span className="text-sm text-muted">
              {qList.length} ready • Question {qIndex + 1} / {qList.length}
            </span>
          )}
        </div>

        {qList.length > 0 && (
          <>
            <label className="block mt-4 mb-2 font-semibold">
              Pick a question
            </label>

            <ul className="grid gap-2">
              {qList.map((q, i) => (
                <li
                  key={i}
                  className={`card p-3 cursor-pointer ${
                    i === qIndex ? "ring-2 ring-brand" : ""
                  }`}
                  onClick={() => setQIndex(i)}
                >
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="qpick"
                      checked={i === qIndex}
                      onChange={() => setQIndex(i)}
                      className="mt-1"
                    />
                    <span className="text-sm">{q}</span>
                  </label>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3 mt-3 text-sm text-muted">
              <span>
                Selected:{" "}
                <span className="text-text font-medium">
                  Q {iSafe(qIndex)} / {qList.length}
                </span>
              </span>
              <button
                type="button"
                className="btn border !py-1 !px-2"
                onClick={() => navigator.clipboard?.writeText(currentQuestion)}
                title="Copy selected question"
              >
                Copy question
              </button>
            </div>
          </>
        )}
      </div>

      {/* MIC / TIMER / TRANSCRIPT */}
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="card">
          {/* Countdown controls */}
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={useCountdown}
                onChange={(e) => setUseCountdown(e.target.checked)}
              />
              <span>Auto-stop at</span>
            </label>
            <select
              className="input !w-auto"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              disabled={!useCountdown}
            >
              <option value={60}>60s</option>
              <option value={90}>90s</option>
              <option value={120}>120s</option>
            </select>

            <div className="text-sm text-muted">
              {status === "recording" && useCountdown
                ? `Time left: ${prettyTime(remaining)}`
                : `Timer: ${prettyTime(seconds)}`}
            </div>
          </div>

          {/* Mic controls */}
          <div className="mt-3 flex flex-wrap gap-2 items-center">
            <MicButton
              ref={micRef}
              onTranscriptAppend={handleAppend}
              onInterim={setInterim}
              onState={setStatus}
            />
            <button className="btn border" onClick={resetAll}>
              ↺ Reset
            </button>
            {status === "recording" && (
              <button
                className="btn border"
                onClick={() => micRef.current?.stop?.()}
              >
                ⏹ Force stop
              </button>
            )}
          </div>

          <div className="text-sm text-muted mt-2">
            Status: {status} • Time: {prettyTime(seconds)}
          </div>
          {status === "unsupported" && (
            <p className="text-sm text-muted mt-1">
              Tip: Use Chrome on HTTPS for microphone transcription. You can
              still type your answer below.
            </p>
          )}
        </div>

        <div className="card">
          <label className="block mb-1">Transcript</label>
          <textarea
            className="input"
            rows="10"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Your spoken answer will appear here. You can also type/edit it."
          />
          {interim && (
            <p className="text-sm italic mt-2" style={{ color: "#9ca3af" }}>
              Live: {interim}
            </p>
          )}
          <div className="mt-2 flex gap-2">
            <button
              className="btn btn-primary"
              onClick={askAI}
              disabled={loading || !transcript.trim() || status === "recording"}
              title={
                status === "recording"
                  ? "Stop recording to enable feedback"
                  : ""
              }
            >
              {loading ? "Analyzing…" : "Get AI Feedback"}
            </button>
            <button className="btn border" onClick={saveSession}>
              Save Session
            </button>
          </div>
          {status === "recording" && (
            <div className="text-xs text-muted mt-1">
              ⏺️ Recording… Stop to enable feedback.
            </div>
          )}
        </div>
      </div>

      {/* METRICS */}
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <div className="card">
          <div className="text-sm text-muted">Words per minute</div>
          <div className="text-3xl font-bold">{metrics.wpm}</div>
          <div className="text-sm text-muted">
            Target: 120–160 for interviews
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-muted">Filler words</div>
          <div className="text-3xl font-bold">{metrics.fillers.total}</div>
          <div className="text-sm text-muted">
            {metrics.fillers.hits.length
              ? metrics.fillers.hits
                  .map((h) => `${h.filler}×${h.count}`)
                  .join(" · ")
              : "Clean!"}
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-muted">STAR coverage</div>
          <div className="text-3xl font-bold">
            {metrics.star.hasSTAR
              ? "✅ Good"
              : "⚠️ Missing " + metrics.star.missing.join(", ")}
          </div>
          <div className="text-sm text-muted">
            Aim to hit S-T-A-R in 60–120s
          </div>
        </div>
      </div>

      {/* FEEDBACK */}
      {feedback && (
        <div className="card mt-6">
          <h3 className="text-xl font-semibold mb-2">
            AI Feedback — Score {feedback.score ?? "-"} / 10
          </h3>
          {feedback.summary && <p className="mb-3">{feedback.summary}</p>}
          {!!(feedback.strengths && feedback.strengths.length) && (
            <>
              <h4 className="font-semibold">Strengths</h4>
              <ul className="list-disc pl-6 text-muted">
                {feedback.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </>
          )}
          {!!(feedback.improvements && feedback.improvements.length) && (
            <>
              <h4 className="font-semibold mt-3">Improvements</h4>
              <ul className="list-disc pl-6 text-muted">
                {feedback.improvements.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </>
          )}
          {feedback.star && (
            <p className="text-sm text-muted mt-2">
              STAR:{" "}
              {feedback.star.hasSTAR
                ? "Complete"
                : `Missing ${feedback.star.missing?.join(", ") || ""}`}
            </p>
          )}
          {feedback.speaking && (
            <p className="text-sm text-muted">
              AI WPM: {feedback.speaking.wpm} • Clarity:{" "}
              {feedback.speaking.clarityNote}
            </p>
          )}
          {feedback.error && (
            <p className="text-sm text-muted mt-2">
              Note: {feedback.message || String(feedback.error)}
            </p>
          )}
        </div>
      )}

      {/* SAVED SESSIONS */}
      <div className="card mt-6">
        <h3 className="font-semibold">Saved Sessions</h3>
        <SavedSessions />
      </div>
    </main>
  );
}

/* ------------------------------- Subcomponents ------------------------------- */

function SavedSessions() {
  const [items, setItems] = useState(() =>
    JSON.parse(localStorage.getItem("speakai_sessions") || "[]")
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
