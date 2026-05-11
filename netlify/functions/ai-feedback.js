// netlify/functions/ai-feedback.js

const PRIMARY_MODEL = process.env.OPENAI_PRIMARY_MODEL || "gpt-4o-mini";
const FALLBACK_MODEL = process.env.OPENAI_FALLBACK_MODEL || "gpt-3.5-turbo";
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

export default async (req) => {
  // Optional GET health-check so you can open it in the browser
  if (req.method === "GET") {
    return json({
      ok: true,
      hint: "Use POST with JSON body: { role, question, transcript }",
    });
  }
  if (req.method !== "POST")
    return new Response("Method Not Allowed", { status: 405 });

  try {
    const { role, skill, question, transcript } = await req.json();
    if (!transcript || typeof transcript !== "string") {
      return json({ error: "No transcript" }, 400);
    }

    const prompt = `
You are an expert interview coach.

Evaluate the candidate's spoken answer.

Return STRICT JSON with:
{
  "score": number,

  "summary": string,
  "recommendation": string,
  "strengths": [],

  "improvements": [],
  "followUpQuestion": string,

  "scores": {
    "confidence": number,
    "clarity": number,
    "technical": number,
    "communication": number,
    "star": number
  },

  "star": {
    "hasSTAR": boolean,
    "missing": []
  },

  "speaking": {
    "wpm": number,
    "fillerHits": [],
    "clarityNote": string
  }
}

Role: ${role || "General"}
Skill: ${skill || "General"}
Question: ${question || "N/A"}

Candidate Answer:
"""${transcript}"""

Evaluation Rules:
- Judge technical correctness for the selected skill
- Evaluate communication clarity
- Check confidence and structure
- Mention missing concepts if answer is incomplete
- Keep improvements actionable

Generate a smart follow-up interview question based on:
- weak areas in the answer
- missing technical depth
- incomplete explanations
- behavioral clarity
- communication gaps

The follow-up question should feel like a real interviewer continuing the interview.

`.trim();

    // Try primary -> fallback with small retries
    const modelsToTry = [PRIMARY_MODEL, FALLBACK_MODEL];
    let lastErr = null;

    for (const model of modelsToTry) {
      try {
        const parsed = await callOpenAIWithRetry({
          model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.2,
        });
        return json(parsed);
      } catch (e) {
        lastErr = e;
        // If NOT a quota/429 error, no point trying fallback
        if (!isQuotaOr429(e)) break;
        // else loop and try next model
      }
    }

    // If we reach here, everything failed
    return json(
      {
        error: "AI_unavailable",
        message:
          "Our AI coach is temporarily unavailable due to API limits. Please retry in a bit, or upgrade billing on the configured provider.",
        detail: briefError(lastErr),
      },
      503,
    );
  } catch (e) {
    return json({ error: "server", detail: e.message }, 500);
  }
};

// ---- helpers ----

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function isQuotaOr429(err) {
  const msg =
    typeof err === "string" ? err : err?.message || JSON.stringify(err);
  return /insufficient_quota|rate limit|429/i.test(msg);
}

function briefError(e) {
  try {
    if (typeof e === "string") return e.slice(0, 500);
    if (e?.responseText) return String(e.responseText).slice(0, 500);
    return (e?.message || JSON.stringify(e)).slice(0, 500);
  } catch {
    return "unknown";
  }
}

async function callOpenAIWithRetry(body, tries = 3) {
  let attempt = 0,
    lastText = "";
  while (attempt < tries) {
    attempt++;
    const r = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    lastText = await r.text();
    if (r.ok) {
      const data = JSON.parse(lastText);

      const text = data.choices?.[0]?.message?.content || "{}";

      // remove markdown code blocks
      const cleaned = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      // extract json safely
      const match = cleaned.match(/\{[\s\S]*\}$/);

      let parsed = {};

      try {
        parsed = match ? JSON.parse(match[0]) : JSON.parse(cleaned);
      } catch (e) {
        console.log("AI JSON Parse Error:", cleaned);

        throw new Error("Invalid AI JSON response");
      }

      return parsed;
    }

    // For 429/5xx, backoff and retry
    if (r.status === 429 || r.status >= 500) {
      await sleep(200 * attempt + Math.random() * 200); // tiny jitter
      continue;
    }

    // For other errors, throw immediately
    throw new Error(lastText);
  }
  // All retries failed
  throw new Error(lastText || "OpenAI request failed");
}

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}
