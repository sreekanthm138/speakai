export async function handler(event) {
  try {
    const { topic } = JSON.parse(event.body || "{}");

    const prompt = `
You are an expert SEO blog writer, educator, and industry mentor.

Write high-quality educational articles that are easy to understand, professionally structured, and engaging for readers.

Return STRICT JSON ONLY.

{
  "slug": string,
  "title": string,
  "description": string,
  "category": string,
  "keywords": string,
  "image": string,
  "content": string
}

IMPORTANT CONTENT RULES:

- content MUST be valid semantic HTML
- use only h2, h3, p, ul, ol, li, strong, blockquote, pre, code
- DO NOT return markdown
- DO NOT use ## headings
- DO NOT use \`\`\`
- DO NOT wrap content in <html> or <body>
- every section should use proper headings
- paragraphs must use <p>
- code examples must use <pre><code>
- write modern frontend interview content
- SEO optimized
- beginner friendly
- professional formatting
- detailed explanations
- use real examples
- interview focused

Topic:
${topic}
`.trim();
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },

      body: JSON.stringify({
        model: "gpt-4.1-mini",
        response_format: {
          type: "json_object",
        },
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.7,
      }),
    });

    const data = await response.json();

    const text = data.choices?.[0]?.message?.content || "{}";

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    return {
      statusCode: 200,

      body: JSON.stringify(parsed),
    };
  } catch (e) {
    console.error(e);

    return {
      statusCode: 500,

      body: JSON.stringify({
        error: "Generation failed",
      }),
    };
  }
}
