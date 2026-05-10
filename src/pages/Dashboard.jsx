import { useEffect, useState } from "react";
import { supabase } from "../auth/supabaseClient.js";

export default function Dashboard() {
  const [sessions, setSessions] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSessions = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("user_sessions")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error(error);
      } else {
        setSessions(data || []);
      }

      setLoading(false);
    };

    loadSessions();
  }, []);

  const avgScore = sessions.length
    ? Math.round(
        sessions.reduce((sum, s) => sum + (s.feedback?.score || 0), 0) /
          sessions.length,
      )
    : 0;

  return (
    <main className="container-p py-10">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-5xl font-bold">Dashboard</h1>

          <p className="text-muted mt-4">Track your interview progress.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mt-10">
        <div className="card">
          <p className="text-muted">Total Interviews</p>

          <h2 className="text-5xl font-bold mt-4">{sessions.length}</h2>
        </div>

        <div className="card">
          <p className="text-muted">Average AI Score</p>

          <h2 className="text-5xl font-bold mt-4">{avgScore}/10</h2>
        </div>

        <div className="card">
          <p className="text-muted">Latest Role</p>

          <h2 className="text-3xl font-bold mt-4">
            {sessions[0]?.role || "-"}
          </h2>
        </div>
      </div>

      {/* Sessions */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold">Recent Sessions</h2>

        {loading && <p className="mt-6">Loading...</p>}

        <div className="space-y-6 mt-8">
          {sessions.map((session) => (
            <div key={session.id} className="card">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="text-2xl font-bold">{session.role}</h3>

                  <p className="text-muted mt-2">{session.skill}</p>
                </div>

                <div className="rounded-2xl bg-primary/10 px-4 py-2 text-lg">
                  {session.feedback?.score || 0}/10
                </div>
              </div>

              <p className="text-muted mt-6 leading-relaxed">
                {session.feedback?.summary}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
