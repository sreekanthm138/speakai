import React from "react";

function InterviewSessionBar({
  role,
  qIndex,
  qList,
  difficultyQ,
  interviewSeconds,
  formatInterviewTime,
}) {
  return (
    // {/* Interview Session Bar */}
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

              <p className="font-semibold mt-1">{difficultyQ}</p>
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
  );
}

export default InterviewSessionBar;
