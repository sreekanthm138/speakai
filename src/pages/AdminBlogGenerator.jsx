import { useState } from "react";
import { supabase } from "../auth/supabaseClient.js";

export default function AdminBlogGenerator() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  const [generated, setGenerated] = useState(null);

  const generateBlog = async () => {
    if (!topic.trim()) return;

    setLoading(true);

    try {
      const r = await fetch("/.netlify/functions/generate-blog", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          topic,
        }),
      });

      const data = await r.json();

      setGenerated(data);
    } catch (e) {
      console.error(e);

      alert("Blog generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const saveBlog = async () => {
    if (!generated) return;

    const { error } = await supabase.from("blogs").insert([
      {
        slug: generated.slug,
        title: generated.title,
        description: generated.description,
        category: generated.category,
        keywords: generated.keywords,
        content: generated.content,
        image: generated.image,
      },
    ]);

    if (error) {
      console.error(error);
      alert("Failed to save blog");
      return;
    }

    alert("Blog saved successfully!");
  };

  return (
    <main className="container-p py-10 max-w-5xl">
      <div className="card">
        <h1 className="text-4xl font-bold">AI Blog Generator</h1>

        <p className="text-muted mt-3">
          Generate SEO blogs using AI and publish instantly.
        </p>

        {/* Topic */}
        <div className="mt-8">
          <label className="block mb-2">Blog Topic</label>

          <input
            className="input"
            placeholder="React useEffect Interview Questions"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        {/* Generate */}
        <button className="btn btn-primary mt-6" onClick={generateBlog}>
          {loading ? "Generating..." : "Generate Blog"}
        </button>
      </div>

      {/* Preview */}
      {generated && (
        <div className="card mt-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold">{generated.title}</h2>

              <p className="text-muted mt-3">{generated.description}</p>
            </div>

            <button className="btn btn-primary" onClick={saveBlog}>
              Save Blog
            </button>
          </div>

          <div className="mt-10 prose prose-invert max-w-none">
            <pre className="whitespace-pre-wrap font-sans">
              {generated.content}
            </pre>
          </div>
        </div>
      )}
    </main>
  );
}
