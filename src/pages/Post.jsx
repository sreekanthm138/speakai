import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../auth/supabaseClient.js";

export default function Post() {
  const { slug } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error(error);
      } else {
        setBlog(data);
      }

      setLoading(false);
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <main className="container-p py-12 min-h-screen">
        <div className="card">
          <p>Loading article...</p>
        </div>
      </main>
    );
  }

  if (!blog) {
    return (
      <main className="container-p py-12 min-h-screen">
        <div className="card">
          <h1 className="text-4xl font-bold">Blog not found</h1>
        </div>
      </main>
    );
  }

  const sections = blog.content?.split("##").filter(Boolean);

  return (
    <main className="min-h-screen bg-[#070b17] text-white">
      {/* HERO */}
      <section className="container-p pt-14 pb-10">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition"
        >
          ← Back to Blog
        </Link>

        <div className="grid lg:grid-cols-2 gap-10 items-center mt-10">
          {/* LEFT */}
          <div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted mb-6">
              <span className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-1 text-indigo-300">
                {blog.category || "General"}
              </span>

              <span>{new Date(blog.created_at).toLocaleDateString()}</span>

              <span>12 min read</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              {blog.title}
            </h1>

            <p className="text-xl text-gray-300 mt-8 leading-relaxed max-w-2xl">
              {blog.description}
            </p>

            {/* AUTHOR */}
            <div className="flex items-center gap-5 mt-10 border-t border-white/10 pt-6">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-lg">
                AI
              </div>

              <div>
                <h4 className="font-semibold text-lg">SpeakAI Team</h4>

                <p className="text-sm text-gray-400">AI Interview Coach</p>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-10 min-h-[320px] flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent_70%)]" />

              <div className="relative z-10 text-center">
                <div className="text-8xl font-bold text-indigo-400 opacity-90">
                  AI
                </div>

                <p className="text-gray-300 mt-6 text-lg">
                  Frontend Interview Preparation
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="container-p pb-20">
        <div className="grid lg:grid-cols-[280px_1fr] gap-10 items-start">
          {/* SIDEBAR */}
          <aside className="sticky top-28 hidden lg:block">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <h3 className="text-2xl font-bold mb-6">On This Page</h3>

              <div className="space-y-4">
                {sections?.map((section, i) => {
                  const title = section.split("\n")[0].replace(/#/g, "").trim();

                  return (
                    <a
                      key={i}
                      href={`#section-${i}`}
                      className="block text-gray-400 hover:text-indigo-400 transition leading-relaxed"
                    >
                      {i + 1}. {title}
                    </a>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* ARTICLE */}
          <article className="space-y-10">
            {sections?.map((section, i) => {
              const lines = section.split("\n").filter(Boolean);

              const heading = lines[0].replace(/#/g, "").trim();

              const body = lines.slice(1).join("\n\n");

              return (
                <div
                  key={i}
                  id={`section-${i}`}
                  className={`${
                    body.trim()
                      ? "rounded-3xl border border-white/10 bg-white/[0.03] p-8 lg:p-10 backdrop-blur-xl"
                      : "py-4"
                  }`}
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-12 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500" />

                    <h2 className="text-3xl lg:text-4xl font-bold leading-tight">
                      {heading}
                    </h2>
                  </div>

                  <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-p:leading-8 prose-li:text-gray-300 prose-headings:text-white">
                    <pre className="whitespace-pre-wrap font-sans text-[17px] leading-8 text-gray-300 overflow-x-auto">
                      {body}
                    </pre>
                  </div>
                </div>
              );
            })}

            {/* CTA */}
            <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-10 text-center">
              <h3 className="text-4xl font-bold">
                Practice AI Mock Interviews
              </h3>

              <p className="text-gray-300 mt-5 text-lg max-w-2xl mx-auto leading-relaxed">
                Improve communication, React interview preparation, JavaScript
                concepts, and frontend confidence using SpeakAI.
              </p>

              <Link
                to="/coach"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 px-8 py-4 text-lg font-semibold mt-8 hover:scale-105 transition"
              >
                Start Mock Interview
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
