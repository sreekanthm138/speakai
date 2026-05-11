const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { role, skill, qType, answers } = await req.json();
    const validAnswers = answers.filter((a) => !a.feedback?.error);
    const prompt = `
Analyze this complete mock interview.

Role:
${role}

Skill:
${skill}

Interview Type:
${qType}

Questions Answered:
${validAnswers.length}

Interview Data:
${JSON.stringify(validAnswers)}

Evaluate:
- technical knowledge depth
- communication clarity
- confidence level
- STAR storytelling quality
- interview readiness
- speaking quality
- filler word usage
- explanation structure
- practical understanding

Return strict JSON:

{
  "overallScore": 8,
  "recommendation": "Ready for Mid-Level Interviews",
  "summary": "Overall strong communication...",
  "strengths": [
    "Clear communication",
    "Good React fundamentals"
  ],
  "improvements": [
    "Reduce filler words",
    "Improve STAR storytelling"
  ]
}

IMPORTANT:
Return ONLY valid JSON.
Do NOT use markdown.
Do NOT wrap response in \`\`\`json.

`;

    const r = await fetch(OPENAI_URL, {
      method: "POST",

      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,

        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        model: "gpt-4o-mini",

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.3,
      }),
    });

    const data = await r.json();

    const text = data.choices?.[0]?.message?.content || "{}";

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed = {};

    try {
      const match = cleaned.match(/\{[\s\S]*\}$/);
      parsed = match ? JSON.parse(match[0]) : JSON.parse(cleaned);
    } catch {
      parsed = {
        overallScore: 6,
        recommendation: "Needs More Practice",
        summary: "Unable to fully generate AI report.",
        strengths: [],
        improvements: ["Practice more interview questions"],
      };
    }

    return new Response(JSON.stringify(parsed), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({
        error: e.message,
      }),
      {
        status: 500,
      },
    );
  }
};
