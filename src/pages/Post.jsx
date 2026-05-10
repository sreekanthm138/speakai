import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { blogs } from '../data/blogs'

export default function Post() {
  const { slug } = useParams()

  const blog = blogs.find((b) => b.slug === slug)

  if (!blog) {
    return (
      <main className="container-p py-16">
        <h1 className="text-4xl font-bold">
          Article not found
        </h1>
      </main>
    )
  }

  return (
    <>
      <Helmet>
        <title>{blog.title} | SpeakAI</title>

        <meta
          name="description"
          content={blog.description}
        />

        <meta
          name="keywords"
          content={blog.keywords}
        />

        <link
          rel="canonical"
          href={`https://speakai.in/blog/${blog.slug}`}
        />

        {/* Open Graph */}
        <meta property="og:title" content={blog.title} />

        <meta
          property="og:description"
          content={blog.description}
        />

        <meta
          property="og:image"
          content={`https://speakai.in${blog.image}`}
        />

        {/* FAQ Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: blog.title,
            description: blog.description,
            image: `https://speakai.in${blog.image}`,
            author: {
              '@type': 'Organization',
              name: 'SpeakAI'
            }
          })}
        </script>
      </Helmet>

      <main className="container-p py-14">
        <article className="max-w-4xl mx-auto">

          {/* Top Meta */}
          <div className="flex items-center gap-3 text-sm text-muted mb-5">
            <span>{blog.category}</span>
            <span>•</span>
            <span>{blog.readTime}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
            {blog.title}
          </h1>

          {/* Description */}
          <p className="text-xl text-muted mt-6 leading-relaxed">
            {blog.description}
          </p>

          {/* Hero Image */}
          <img
            src={blog.image}
            alt={blog.title}
            className="rounded-3xl mt-10 mb-12 w-full object-cover"
          />

          {/* Article Content */}
          <div className="prose prose-invert prose-lg max-w-none whitespace-pre-line">
            {blog.content}
          </div>

          {/* CTA */}
          <div className="mt-16 rounded-3xl border bg-card/50 backdrop-blur p-8 text-center">
            <h3 className="text-3xl font-bold">
              Practice Interviews with AI
            </h3>

            <p className="text-muted mt-4 max-w-2xl mx-auto">
              Improve communication, confidence,
              and technical interview skills
              using SpeakAI.
            </p>

            <Link
              to="/coach"
              className="btn btn-primary mt-6 inline-flex"
            >
              Start AI Mock Interview
            </Link>
          </div>

        </article>
      </main>
    </>
  )
}