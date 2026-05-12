import React from "react";

function InterviewWorkspace() {
  return (
    <section className="space-y-6">
      {/* CURRENT QUESTION */}
      {qList.length > 0 && (
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
      )}
      {!hasInterviewStarted && <InterviewEmptyState />}
      {/* RECORDING */}
      {qList.length > 0 && (
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
                  status === "recording" ? "bg-red-500/10" : "bg-indigo-500/10"
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
      )}

      {/* TRANSCRIPT */}
      {qList.length > 0 && (
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
                {status === "recording" ? "Listening..." : "Transcript Ready"}
              </span>
            </div>

            <p className="leading-7 text-gray-200 whitespace-pre-wrap">
              {transcript || "Start speaking to see your live transcript..."}

              {status === "recording" && (
                <span className="animate-pulse text-indigo-400">|</span>
              )}
            </p>
          </div>

          {interim && (
            <p className="text-sm italic mt-3 text-muted">Live: {interim}</p>
          )}
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
  );
}

export default InterviewWorkspace;
