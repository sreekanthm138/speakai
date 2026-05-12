import React from "react";

function FeedbackModal({
  feedback,
  metrics,
  showFeedbackModal,
  setShowFeedbackModal,
  qIndex,
  qList,
  completedAnswers,
  setCompletedAnswers,
  currentQuestion,
  transcript,
  moveToNextQuestion,
  generateFinalReport,
  finalLoading,
  setTranscript,
  setInterim,
  setFeedback,
  setSeconds,
}) {
  return (
    <div className="fixed inset-0 z-50 p-6 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-5xl h-[88vh] rounded-3xl border border-white/10 bg-[#0B1120] overflow-hidden animate-in fade-in zoom-in-95 duration-300 shadow-[0_25px_80px_rgba(0,0,0,0.7)] flex flex-col">
        {/* HEADER */}
        <div className="px-7 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm text-indigo-300">AI Interview Feedback</p>

              <h2 className="text-xl font-semibold mt-2">{feedback?.score}/10</h2>
            </div>

            <div className="hidden md:block h-16 w-px bg-white/10" />

            <div className="hidden md:flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-muted text-sm">Confidence:</span>

                <span className="font-semibold">
                  {feedback?.scores?.confidence || 0}/10
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-muted text-sm">Clarity:</span>

                <span className="font-semibold">
                  {feedback?.scores?.clarity || 0}/10
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-muted text-sm">Communication:</span>

                <span className="font-semibold">
                  {feedback?.scores?.communication || 0}/10
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
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="grid lg:grid-cols-[280px_1fr] gap-5 p-5">
            {/* LEFT SIDEBAR */}
            <div className="space-y-5">
              {/* WPM */}
              <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5">
                <p className="text-sm text-muted">Words Per Minute</p>

                <h3 className="text-xl font-semibold mt-3">{metrics?.wpm || 0}</h3>

                <p className="text-xs text-muted mt-3">
                  Ideal speaking pace: 110–160 WPM
                </p>
              </div>

              {/* Fillers */}
              <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">
                <p className="text-sm text-muted">Filler Words</p>

                <h3 className="text-xl font-semibold mt-3">
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

                <h3 className="text-xl font-semibold mt-3">
                  {feedback?.star?.hasSTAR ? "Strong" : "Needs Improvement"}
                </h3>

                {!!feedback?.star?.missing?.length && (
                  <div className="mt-4">
                    <p className="text-xs text-muted mb-2">Missing:</p>

                    <div className="flex flex-wrap gap-2">
                      {feedback?.star?.missing?.map((m, i) => (
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

                <h3 className="text-xl font-semibold mt-3">
                  {feedback?.scores?.technical || 0}/10
                </h3>
              </div>
            </div>

            {/* RIGHT CONTENT */}
            <div className="space-y-6">
              {/* Summary */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-xl font-semibold mb-5">Interview Coach Feedback</h3>

                <p className="text-muted leading-7 text-base">
                  {feedback?.summary}
                </p>
              </div>

              {/* Strengths */}
              {!!feedback?.strengths?.length && (
                <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5">
                  <h3 className="text-xl font-semibold mb-5 text-indigo-300">
                    Strengths
                  </h3>

                  <ul className="space-y-4 text-muted">
                    {feedback?.strengths?.map((s, i) => (
                      <li key={i} className="leading-7">
                        ✓ {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Improvements */}
              {!!feedback?.improvements?.length && (
                <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">
                  <h3 className="text-xl font-semibold mb-5 text-yellow-300">
                    Ways To Improve
                  </h3>

                  <ul className="space-y-4 text-muted">
                    {feedback?.improvements?.map((s, i) => (
                      <li key={i} className="leading-7">
                        • {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendation */}
              {feedback?.recommendation && (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                  <h3 className="text-xl font-semibold mb-5 text-emerald-300">
                    Recommended Next Steps
                  </h3>

                  <p className="text-muted leading-7 text-base">
                    {feedback?.recommendation}
                  </p>
                </div>
              )}

              {/* Follow Up */}
              {feedback?.followUpQuestion && (
                <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5">
                  <h3 className="text-xl font-semibold mb-5 text-purple-300">
                    Suggested Follow-up Question
                  </h3>

                  <p className="text-muted leading-7 text-base">
                    {feedback?.followUpQuestion}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-4 py-4 border-t border-white/10 bg-[#0F172A] flex items-center justify-between flex-wrap gap-4">
          <p className="text-sm text-muted">AI Interview Coach Analysis</p>

          <div className="flex gap-4 flex-wrap">
            {/* Retry */}
            <button
              className="btn border text-sm px-5 py-2.5"
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
                className="btn btn-primary text-sm px-5 py-2.5"
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
                {finalLoading ? "Generating..." : "Generate Final Report"}
              </button>
            )}
            {/* <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-start gap-3">
              <div className="h-3 w-3 rounded-full bg-emerald-400 mt-2 shrink-0" />

              <div>
                <p className="font-semibold text-emerald-300">
                  Interview saved successfully
                </p>

                <p className="text-sm text-muted mt-1 leading-6">
                  Your AI interview report and performance analytics are now
                  available in the Dashboard section.
                </p>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeedbackModal;
