import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../auth/supabaseClient.js";

export default function Post() {
  const { slug } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [headings, setHeadings] = useState([]);

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
        const parser = new DOMParser();

        const doc = parser.parseFromString(data.content, "text/html");

        const extractedHeadings = [...doc.querySelectorAll("h2")].map(
          (heading, index) => {
            const id = `section-${index}`;

            heading.id = id;

            return {
              id,
              text: heading.textContent,
            };
          },
        );

        setHeadings(extractedHeadings);

        data.content = doc.body.innerHTML;

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
                {headings.map((heading, i) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    className="block text-gray-400 hover:text-indigo-400 transition leading-relaxed"
                  >
                    {i + 1}. {heading.text}
                  </a>
                ))}
              </div>
            </div>
          </aside>

          {/* ARTICLE */}
          <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 lg:p-12 backdrop-blur-xl">
            <div
              className="prose prose-invert max-w-none
    prose-headings:text-white
    prose-p:text-gray-300
    prose-p:leading-8
    prose-li:text-gray-300
    prose-strong:text-white
    prose-a:text-indigo-400
    prose-blockquote:border-indigo-500
    prose-blockquote:text-gray-300
    prose-code:text-indigo-300
    prose-pre:bg-black/30"
              dangerouslySetInnerHTML={{
                __html: blog.content,
              }}
            />
          </article>
        </div>
      </section>
    </main>
  );
}
