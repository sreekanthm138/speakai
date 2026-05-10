import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { blogs } from "../data/blogs";

export default function Blog() {
  return (
    <>
      <Helmet>
        <title>Interview Preparation Blogs | SpeakAI</title>

        <meta
          name="description"
          content="Read interview preparation blogs for React, JavaScript, frontend engineering, AI interviews, and communication practice."
        />
      </Helmet>

      <main className="container-p py-12">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold">Interview Preparation Blogs</h1>

          <p className="text-muted mt-3">
            Learn React, JavaScript, communication skills, and interview
            strategies with SpeakAI.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-10">
          {blogs.map((blog) => (
            <article
              key={blog.slug}
              className="group overflow-hidden rounded-3xl border bg-card/50 backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl"
            >
              {/* Image */}
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Meta */}
                <div className="flex items-center gap-3 text-sm text-muted mb-3">
                  <span>{blog.category}</span>
                  <span>•</span>
                  <span>{blog.readTime}</span>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold leading-tight">
                  {blog.title}
                </h2>

                {/* Description */}
                <p className="text-muted mt-4 line-clamp-3">
                  {blog.description}
                </p>

                {/* Button */}
                <Link
                  to={`/blog/${blog.slug}`}
                  className="btn btn-primary mt-6 inline-flex"
                >
                  Read Article
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
