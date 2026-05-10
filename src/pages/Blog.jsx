import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../auth/supabaseClient.js";

export default function Blog() {

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const fetchBlogs = async () => {

      const { data, error } =
        await supabase
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
    <main className="container-p py-10">

      {/* Header */}
      <div className="max-w-3xl">
        <h1 className="text-5xl font-bold">
          AI Interview Blogs
        </h1>

        <p className="text-muted mt-4 text-lg">
          Frontend interview preparation,
          communication tips, React,
          JavaScript, AI tools, and career growth.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="mt-10">
          <p className="text-muted">
            Loading blogs...
          </p>
        </div>
      )}

      {/* Empty */}
      {!loading && !blogs.length && (
        <div className="card mt-10">
          <h3 className="text-2xl font-bold">
            No blogs yet
          </h3>

          <p className="text-muted mt-3">
            Generate blogs from admin panel.
          </p>
        </div>
      )}

      {/* Blog Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">

        {blogs.map((blog) => (
          <Link
            key={blog.id}
            to={`/blog/${blog.slug}`}
            className="group card overflow-hidden hover:-translate-y-1 transition-all duration-300"
          >

            {/* Image */}
            <div className="aspect-video rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-4xl font-bold">
              AI
            </div>

            {/* Content */}
            <div className="mt-6">

              <div className="flex items-center gap-3 text-sm text-muted">

                <span className="rounded-full bg-primary/10 px-3 py-1">
                  {blog.category || "General"}
                </span>

                <span>
                  {new Date(
                    blog.created_at
                  ).toLocaleDateString()}
                </span>

              </div>

              <h2 className="text-2xl font-bold mt-4 group-hover:text-indigo-400 transition">
                {blog.title}
              </h2>

              <p className="text-muted mt-4 line-clamp-3">
                {blog.description}
              </p>

              <div className="mt-6 flex items-center justify-between">

                <span className="text-sm text-indigo-400">
                  Read article →
                </span>

              </div>

            </div>

          </Link>
        ))}

      </div>

    </main>
  );
}