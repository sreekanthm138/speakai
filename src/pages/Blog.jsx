import { Link } from "react-router-dom";
import { posts } from "../posts";
import { Helmet } from "react-helmet-async";

export default function Blog() {
  return (
    <>
      <Helmet>
        <title>Interview Preparation Blogs | SpeakAI</title>

        <meta
          name="description"
          content="Read interview preparation guides, React interview questions, communication tips, and AI interview coaching strategies."
        />

        <link rel="canonical" href="https://speakai.in/blog" />
      </Helmet>
      <main className="container-p section">
        <h1 className="h1">Blog</h1>
        <p className="lead">
          Actionable advice for interviews, public speaking, and AI apps.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {posts.map((p) => (
            <Link
              className="card card-hover"
              key={p.slug}
              to={`/blog/${p.slug}`}
            >
              <h3 className="font-semibold">{p.title}</h3>
              <p className="text-muted">{p.description}</p>
              <span className="text-brand font-semibold">Read →</span>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
