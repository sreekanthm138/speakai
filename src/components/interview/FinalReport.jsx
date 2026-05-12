import React from "react";

function FinalReport({ finalReport, setSkill, setQType }) {
  return (
    <div className="card border-indigo-500/20 bg-indigo-500/5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm text-indigo-300">AI Interview Summary</p>

          <h2 className="text-2xl font-bold mt-2">
            {finalReport.overallScore}/10
          </h2>
        </div>

        <div className="rounded-3xl bg-indigo-500/10 px-6 py-4">
          <p className="text-sm text-muted">Hiring Recommendation</p>

          <p className="text-xl font-bold mt-1">{finalReport.recommendation}</p>
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
          <h3 className="text-xl font-bold mb-4 text-indigo-300">Strengths</h3>

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
        <p className="text-sm text-indigo-300 mb-2">Improvement Roadmap</p>

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

        <h3 className="text-3xl font-bold mt-3">Practice Another Interview</h3>

        <p className="text-muted mt-4 max-w-2xl mx-auto">
          Build confidence with more AI-powered interview simulations tailored
          to your target role.
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
  );
}

export default FinalReport;
