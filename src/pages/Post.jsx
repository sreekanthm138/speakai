import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { blogs } from '../data/blogs'

export default function Post() {
  const { slug } = useParams()

  const blog = blogs.find((b) => b.slug === slug)

  if (!blog) {
    return (
      <main className="container-p py-12">
        <h1>Article not found</h1>
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
      </Helmet>

      <main className="container-p py-12 max-w-4xl">
        <article className="card">
          <h1 className="text-4xl font-bold">
            {blog.title}
          </h1>

          <p className="text-muted mt-4">
            {blog.description}
          </p>

          <div className="prose prose-invert max-w-none mt-8 whitespace-pre-line">
            {blog.content}
          </div>
        </article>
      </main>
    </>
  )
}