const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { role, skill, qType, answers } = await req.json();

    const prompt = `
Analyze this complete mock interview.

Role:
${role}

Skill:
${skill}

Interview Type:
${qType}

Questions Answered:
${answers.length}

Interview Data:
${JSON.stringify(answers)}

Evaluate:
- technical communication
- confidence
- STAR storytelling
- clarity
- interview readiness

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

    const parsed = JSON.parse(text);

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
