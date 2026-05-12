import React from "react";

function InterviewSetup({
  role,
  setRole,
  skill,
  setSkill,
  qType,
  setQType,
  difficulty,
  setDifficulty,
  count,
  setCount,
  generate,
  questionsLoading,
  controlsDirty,
  resumeText,
  setResumeText,
  ROLE_SKILLS,
  hasInterviewStarted,
}) {
  return (
    <aside className={hasInterviewStarted ? "space-y-4" : "space-y-4"}>
      {/* HEADER */}
      <div>
        <h1
          className={
            hasInterviewStarted
              ? "text-[42px] leading-[1.1] font-bold"
              : "text-[42px] leading-[1.1] font-bold"
          }
        >
          AI Interview Coach
        </h1>

        {!hasInterviewStarted && (
          <p className="text-muted mt-2 leading-6">
            Practice role-specific interviews...
          </p>
        )}
      </div>

      {/* SETUP */}
      <div className="card w-full p4 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl leading-tight font-bold">
              Interview Setup
            </h2>

            <p className="text-sm text-muted mt-1">
              Configure your personalized AI mock interview.
            </p>
          </div>

          <div
            className={`rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-300 transition-all duration-300 ${
              hasInterviewStarted ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
            }`}
          >
            AI Session Active
          </div>
        </div>

        {/* FORM GRID */}
        <div
          className={
            hasInterviewStarted ? "space-y-4" : "grid md:grid-cols-2 gap-4"
          }
        >
          {/* Role */}
          <div>
            <label className="block mb-1.5 text-sm">Role</label>

            <select
              className="input bg-[#111827] text-white"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setSkill("");
              }}
            >
              <option value="">Select Target Role</option>

              <option value="Software Engineer">Software Engineer</option>

              <option value="Product Manager">Product Manager</option>

              <option value="Data Analyst">Data Analyst</option>

              <option value="BPO/Support">BPO/Support</option>

              <option value="Marketing">Marketing</option>

              <option value="Sales">Sales</option>

              <option value="Designer">Designer</option>
            </select>
          </div>

          {/* Skill */}
          <div>
            <label className="block mb-1.5 text-sm">Skill</label>

            <select
              className="input bg-[#111827] text-white"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              disabled={!role}
            >
              <option value="">
                {role ? "Select Skill" : "Select Role First"}
              </option>

              {ROLE_SKILLS[role]?.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block mb-1.5 text-sm">Question Type</label>

            <select
              className="input bg-[#111827] text-white"
              value={qType}
              onChange={(e) => setQType(e.target.value)}
            >
              <option value="">Select Interview Type</option>

              <option value="behavioral">Behavioral</option>

              <option value="technical">Technical</option>

              <option value="mixed">Mixed</option>
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block mb-1.5 text-sm">Difficulty</label>

            <select
              className="input bg-[#111827] text-white"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="">Select Difficulty</option>

              <option value="easy">Easy</option>

              <option value="medium">Medium</option>

              <option value="hard">Hard</option>

              <option value="mixed">Mixed</option>
            </select>
          </div>

          {/* Count */}
          <div>
            <label className="block mb-1.5 text-sm">Questions</label>

            <select
              className="input bg-[#111827] text-white"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
            >
              <option value="">Select Question Count</option>

              <option value="3">3 Questions</option>

              <option value="5">5 Questions</option>

              <option value="8">8 Questions</option>
            </select>
          </div>

          {/* Resume */}
          <div>
            <label className="block mb-1.5 text-sm">Resume Context</label>

            <textarea
              className={`input ${
                hasInterviewStarted ? "min-h-[180px]" : "min-h-[92px]"
              }`}
              placeholder="Paste your resume here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
          </div>
        </div>

        {/* Resume Success */}
        {resumeText && (
          <div className="mt-5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 px-4 py-3 text-sm text-indigo-300">
            Resume context added successfully.
          </div>
        )}

        {/* CTA */}
        <div className="mt-auto pt-5 flex justify-end">
          <button
            className="btn btn-primary min-w-[220px] shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
            onClick={generate}
            disabled={
              !role ||
              !skill ||
              !qType ||
              !difficulty ||
              !count ||
              questionsLoading
            }
          >
            {questionsLoading
              ? "Generating Questions..."
              : controlsDirty
                ? "Generate Interview"
                : "Questions Ready"}
          </button>
        </div>
      </div>
    </aside>
  );
}

export default InterviewSetup;
