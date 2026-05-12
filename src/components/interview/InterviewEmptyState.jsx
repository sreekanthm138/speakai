import React from "react";
import { Sparkles, Mic, Brain, BarChart3 } from "lucide-react";

function InterviewEmptyState() {
  return (
<div className="card relative overflow-hidden h-fit p-4 mt-auto">
      {/* Glow */}
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
          <Sparkles size={16} />
          AI Mock Interview
        </div>

        {/* Heading */}
        <h2 className="mt-6 text-[30px] leading-[1.15] font-bold leading-tight max-w-md">
          Practice smarter with AI-powered interview coaching
        </h2>

        <p className="mt-4 text-muted leading-7 max-w-lg">
          Generate personalized interview questions, improve communication,
          analyze speaking patterns, and receive detailed hiring-readiness
          feedback instantly.
        </p>

        {/* Feature cards */}
        <div className="mt-6 grid gap-2.5">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 flex items-start gap-4">
            <div className="h-9 w-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-300">
              <Mic size={20} />
            </div>

            <div>
              <h3 className="font-semibold">Real Interview Simulation</h3>

              <p className="text-sm text-muted mt-1 leading-6">
                Answer AI-generated questions exactly like a real interview.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 flex items-start gap-4">
            <div className="h-9 w-9 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-300">
              <Brain size={20} />
            </div>

            <div>
              <h3 className="font-semibold">AI Communication Analysis</h3>

              <p className="text-sm text-muted mt-1 leading-6">
                Improve clarity, confidence, STAR storytelling, and fluency.
              </p>
            </div>
          </div>

          
        </div>
      </div>

     
    </div>
  );
}

export default InterviewEmptyState;