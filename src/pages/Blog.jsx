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
              className="card hover:scale-[1.02] transition"
            >
              <h2 className="text-2xl font-bold">{blog.title}</h2>

              <p className="text-muted mt-3">{blog.description}</p>

              <Link
                to={`/blog/${blog.slug}`}
                className="btn btn-primary mt-5 inline-flex"
              >
                Read Article
              </Link>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
