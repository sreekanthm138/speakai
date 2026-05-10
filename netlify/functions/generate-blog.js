export async function handler(event) {
  try {
    const { topic } = JSON.parse(event.body || "{}");

    const prompt = `
You are an expert SEO blog writer.

Generate a professional blog article.

Return STRICT JSON:

{
  "slug": string,
  "title": string,
  "description": string,
  "category": string,
  "keywords": string,
  "image": string,
  "content": string
}

Rules:
- SEO optimized
- professional formatting
- beginner friendly
- detailed explanations
- headings included
- interview focused
- modern frontend topics

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
