// netlify/functions/gen-questions.js
const PRIMARY_MODEL  = process.env.OPENAI_PRIMARY_MODEL  || 'gpt-4o-mini';
const FALLBACK_MODEL = process.env.OPENAI_FALLBACK_MODEL || 'gpt-3.5-turbo';
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

export default async (req) => {
  if (req.method === 'GET') {
    return json({ ok: true, hint: 'POST { role, type, difficulty, count }' });
  }
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const { role = 'Software Engineer', type = 'behavioral', difficulty = 'mixed', count = 5 } = await req.json() || {};
    if (process.env.MOCK_AI === 'true') {
      return json({ questions: mock(role, type, count) });
    }

    const prompt = `
Generate ${count} ${type} interview questions for the role "${role}".
- Difficulty: ${difficulty}
- Output strict JSON: {"questions":["Q1","Q2",...]} 
- Only questions, concise, no numbering text.
    `.trim();

    const models = [PRIMARY_MODEL, FALLBACK_MODEL];
    let lastErr = null;
    for (const model of models) {
      try {
        const data = await callOpenAI({ model, messages: [{ role: 'user', content: prompt }], temperature: 0.3 });
        const text = data.choices?.[0]?.message?.content || '{}';
        const m = text.match(/\{[\s\S]*\}$/);
        const parsed = m ? JSON.parse(m[0]) : JSON.parse(text);
        if (!Array.isArray(parsed.questions)) throw new Error('Bad format from model');
        return json({ questions: parsed.questions.slice(0, count) });
      } catch (e) {
        lastErr = e;
        if (!/429|insufficient_quota/i.test(String(e))) break; // only fallback on rate/quota
      }
    }
    return json({ error: 'AI_unavailable', message: 'Question generator temporarily unavailable.', detail: brief(lastErr) }, 503);
  } catch (e) {
    return json({ error: 'server', detail: e.message }, 500);
  }
};

// helpers
function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });
}
async function callOpenAI(body) {
  const r = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const t = await r.text();
  if (!r.ok) throw new Error(t);
  return JSON.parse(t);
}
function brief(e){ try{return (e?.message || String(e)).slice(0,300)}catch{return 'unknown'} }
function mock(role, type, count){
  const base = [
    `Tell me about a time you handled a difficult ${type} situation.`,
    `Describe a recent challenge in ${role} and how you solved it.`,
    `How do you prioritize tasks when everything is urgent?`,
    `A mistake you made and what you learned?`,
    `How do you handle feedback or conflict in a team?`
  ];
  return base.slice(0, count);
}
