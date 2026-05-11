import { useEffect, useMemo, useState } from "react";
import { supabase } from "../auth/supabaseClient.js";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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
          ascending: true,
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
        sessions.reduce(
          (sum, s) =>
            sum +
            (s.feedback?.overallScore ||
              s.feedback?.score ||
              0),
          0
        ) / sessions.length
      )
    : 0;

  const bestSkill = useMemo(() => {

    const skills = {};

    sessions.forEach((s) => {
      if (!s.skill) return;

      skills[s.skill] =
        (skills[s.skill] || 0) + 1;
    });

    return Object.keys(skills).sort(
      (a, b) => skills[b] - skills[a]
    )[0];

  }, [sessions]);

  const readiness =
    avgScore >= 8
      ? "Interview Ready"
      : avgScore >= 6
      ? "Intermediate"
      : avgScore >= 4
      ? "Beginner"
      : "Needs Practice";

  const chartData = sessions.map((s, i) => ({
    name: `#${i + 1}`,
    score:
      s.feedback?.overallScore ||
      s.feedback?.score ||
      0,
  }));

  return (
    <main className="container-p py-12">

      {/* HERO */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">

        <p className="text-indigo-300 text-sm">
          AI Interview Dashboard
        </p>

        <h1 className="text-3xl font-bold mt-3">
          Welcome back
        </h1>

        <p className="text-muted mt-2 max-w-2xl">
          Track your interview performance,
          communication growth, and AI-powered
          readiness journey.
        </p>

      </div>

      {/* STATS */}
      <div className="grid lg:grid-cols-4 gap-6 mt-10">

        <div className="card">
          <p className="text-muted">
            Total Interviews
          </p>

          <h2 className="text-3xl font-bold mt-4">
            {sessions.length}
          </h2>
        </div>

        <div className="card">
          <p className="text-muted">
            Average AI Score
          </p>

          <h2 className="text-3xl font-bold mt-4">
            {avgScore}/10
          </h2>
        </div>

        <div className="card">
          <p className="text-muted">
            Strongest Skill
          </p>

          <h2 className="text-2xl font-bold mt-4">
            {bestSkill || "-"}
          </h2>
        </div>

        <div className="card">
          <p className="text-muted">
            Interview Readiness
          </p>

          <h2 className="text-2xl font-bold mt-4">
            {readiness}
          </h2>
        </div>

      </div>

      {/* PERFORMANCE TREND */}
      <div className="card mt-10">

        <div className="flex items-center justify-between mb-8">

          <div>
            <h2 className="text-2xl font-bold">
              Performance Trend
            </h2>

            <p className="text-muted mt-2">
              Track your AI interview growth over time.
            </p>
          </div>

        </div>

        <div className="h-[240px]">

          <ResponsiveContainer width="100%" height="100%">

            <LineChart data={chartData}>

              <XAxis dataKey="name" />

              <YAxis domain={[0, 10]} />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="score"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* SESSIONS */}
      <div className="mt-12">

        <div className="flex items-center justify-between gap-4 flex-wrap">

          <div>
            <h2 className="text-3xl font-bold">
              Recent Sessions
            </h2>

            <p className="text-muted mt-2">
              Review your past interview performances.
            </p>
          </div>

        </div>

        {loading && (
          <p className="mt-8">
            Loading sessions...
          </p>
        )}

        {!loading && !sessions.length && (
          <div className="card mt-8 text-center py-16">

            <h3 className="text-2xl font-bold">
              No interviews yet
            </h3>

            <p className="text-muted mt-4">
              Start your first AI-powered mock interview.
            </p>

          </div>
        )}

        <div className="space-y-6 mt-8">

          {sessions
            .slice()
            .reverse()
            .map((session) => {

              const score =
                session.feedback?.overallScore ||
                session.feedback?.score ||
                0;

              return (

                <div
                  key={session.id}
                  className="card hover:border-indigo-500/30 transition-all duration-300"
                >

                  <div className="flex items-start justify-between gap-6 flex-wrap">

                    <div>

                      <div className="flex items-center gap-3 flex-wrap">

                        <h3 className="text-2xl font-bold">
                          {session.role}
                        </h3>

                        <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-sm">

                          {session.skill}

                        </span>

                      </div>

                      <p className="text-muted mt-3">

                        {new Date(
                          session.created_at
                        ).toLocaleString()}

                      </p>

                    </div>

                    <div className="rounded-2xl bg-primary/10 px-5 py-3 text-2xl font-bold">

                      {score}/10

                    </div>

                  </div>

                  <p className="text-muted mt-6 leading-7">

                    {session.feedback?.summary}

                  </p>

                  {!!session.feedback?.recommendation && (
                    <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">

                      <p className="text-sm text-emerald-300 mb-2">
                        AI Recommendation
                      </p>

                      <p className="text-muted leading-7">

                        {session.feedback.recommendation}

                      </p>

                    </div>
                  )}

                </div>

              );

            })}

        </div>

      </div>

    </main>
  );
}
