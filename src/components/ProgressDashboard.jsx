export default function ProgressDashboard({
  sessions = []
}) {

  if (!sessions.length) {
    return (
      <div className="card">
        <h3 className="text-2xl font-bold">
          Progress Dashboard
        </h3>

        <p className="text-muted mt-4">
          Complete interview sessions to track your progress.
        </p>
      </div>
    );
  }

  const totalSessions = sessions.length;

  const avgWpm = Math.round(
    sessions.reduce(
      (sum, s) => sum + (s.metrics?.wpm || 0),
      0
    ) / totalSessions
  );

  const avgFillers = Math.round(
    sessions.reduce(
      (sum, s) =>
        sum + (s.metrics?.fillers?.total || 0),
      0
    ) / totalSessions
  );

  const starCount = sessions.filter(
    (s) => s.metrics?.star?.hasSTAR
  ).length;

  const avgScore = Math.round(
    sessions.reduce(
      (sum, s) => sum + (s.feedback?.score || 0),
      0
    ) / totalSessions
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="card">
        <h3 className="text-3xl font-bold">
          Progress Dashboard
        </h3>

        <p className="text-muted mt-3">
          Track communication growth and interview performance.
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">

        {/* Sessions */}
        <div className="card">
          <p className="text-sm text-muted">
            Sessions
          </p>

          <h3 className="text-5xl font-bold mt-3">
            {totalSessions}
          </h3>
        </div>

        {/* WPM */}
        <div className="card">
          <p className="text-sm text-muted">
            Avg WPM
          </p>

          <h3 className="text-5xl font-bold mt-3">
            {avgWpm}
          </h3>
        </div>

        {/* Fillers */}
        <div className="card">
          <p className="text-sm text-muted">
            Avg Fillers
          </p>

          <h3 className="text-5xl font-bold mt-3">
            {avgFillers}
          </h3>
        </div>

        {/* Score */}
        <div className="card">
          <p className="text-sm text-muted">
            Avg AI Score
          </p>

          <h3 className="text-5xl font-bold mt-3">
            {avgScore}/10
          </h3>
        </div>

      </div>

      {/* STAR Progress */}
      <div className="card">

        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-bold">
            STAR Method Usage
          </h4>

          <span className="text-sm text-muted">
            {starCount}/{totalSessions}
          </span>
        </div>

        <div className="h-4 rounded-full bg-white/10 overflow-hidden">

          <div
            className="h-full bg-indigo-500"
            style={{
              width: `${(starCount / totalSessions) * 100}%`
            }}
          />

        </div>

      </div>

      {/* Recent Sessions */}
      <div className="card">

        <h4 className="text-2xl font-bold mb-6">
          Recent Sessions
        </h4>

        <div className="space-y-4">

          {sessions
            .slice()
            .reverse()
            .slice(0, 5)
            .map((session, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 p-5"
              >

                <div className="flex items-center justify-between gap-4">

                  <div>
                    <h5 className="font-semibold">
                      {session.role}
                    </h5>

                    <p className="text-sm text-muted mt-1">
                      {session.skill}
                    </p>
                  </div>

                  <div className="text-right">

                    <div className="rounded-xl bg-primary/10 px-3 py-1 text-sm">
                      {session.feedback?.score || 0}/10
                    </div>

                    <p className="text-xs text-muted mt-2">
                      {new Date(
                        session.date
                      ).toLocaleDateString()}
                    </p>

                  </div>

                </div>

              </div>
            ))}

        </div>

      </div>

    </div>
  );
}