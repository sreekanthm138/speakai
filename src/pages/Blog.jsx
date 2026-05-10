import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../auth/supabaseClient.js";
import { Helmet } from "react-helmet-async";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error(error);
      } else {
        setBlogs(data || []);
      }

      setLoading(false);
    };

    fetchBlogs();
  }, []);

  return (
    <>
      <Helmet>
        <title>AI Interview Blogs | SpeakAI</title>

        <meta
          name="description"
          content="Frontend interview preparation blogs, React interview questions, JavaScript concepts, HR interview guides, and AI interview coaching."
        />
      </Helmet>

      <main className="container-p py-10">
        {/* Header */}
        <div className="max-w-3xl">
          <h1 className="text-5xl font-bold">AI Interview Blogs</h1>

          <p className="text-muted mt-4 text-lg">
            Frontend interview preparation, communication tips, React,
            JavaScript, AI tools, and career growth.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-10">
            <p className="text-muted">Loading blogs...</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !blogs.length && (
          <div className="card mt-10">
            <h3 className="text-2xl font-bold">No blogs yet</h3>

            <p className="text-muted mt-3">Generate blogs from admin panel.</p>
          </div>
        )}

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              to={`/blog/${blog.slug}`}
              className="group rounded-[32px] border border-white/10 bg-white/[0.03] p-6 overflow-hidden hover:-translate-y-1 hover:border-indigo-500/20 transition-all duration-300"
            >
              {/* Image */}
              {/* Cover Image */}
              <div className="overflow-hidden rounded-3xl">
                <img
                  src={
                    blog.cover_image ||
                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
                  }
                  alt={blog.title}
                  className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="mt-6">
                <div className="flex items-center gap-3 text-sm text-muted">
                  <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-indigo-300">
                    {blog.category || "General"}
                  </span>

                  <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                </div>

                <h2 className="text-2xl font-bold mt-4 group-hover:text-indigo-400 transition">
                  {blog.title}
                </h2>

                <p className="text-muted mt-4 line-clamp-3">
                  {blog.description}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm font-medium text-indigo-400 group-hover:translate-x-1 transition">
                    Read article →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
