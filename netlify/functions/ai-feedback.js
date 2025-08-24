// netlify/functions/ai-feedback.js

const PRIMARY_MODEL = process.env.OPENAI_PRIMARY_MODEL || 'gpt-4o-mini'
const FALLBACK_MODEL = process.env.OPENAI_FALLBACK_MODEL || 'gpt-3.5-turbo'
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'

export default async (req) => {
  // Optional GET health-check so you can open it in the browser
  if (req.method === 'GET') {
    return json({ ok: true, hint: 'Use POST with JSON body: { role, question, transcript }' })
  }
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 })

  try {
    const { role, question, transcript } = await req.json()
    if (!transcript || typeof transcript !== 'string') {
      return json({ error: 'No transcript' }, 400)
    }

    const prompt = `
You are an interview coach. Evaluate the candidate's spoken answer.
Return strict JSON with keys: score (0-10), summary, strengths[], improvements[], star:{hasSTAR, missing:['S','T','A','R']}, speaking:{wpm, fillerHits[], clarityNote}.

Role: ${role || 'General'}
Question: ${question || 'N/A'}
Answer (verbatim): """${transcript}"""
    `.trim()

    // Try primary -> fallback with small retries
    const modelsToTry = [PRIMARY_MODEL, FALLBACK_MODEL]
    let lastErr = null

    for (const model of modelsToTry) {
      try {
        const parsed = await callOpenAIWithRetry({
          model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.2,
        })
        return json(parsed)
      } catch (e) {
        lastErr = e
        // If NOT a quota/429 error, no point trying fallback
        if (!isQuotaOr429(e)) break
        // else loop and try next model
      }
    }

    // If we reach here, everything failed
    return json({
      error: 'AI_unavailable',
      message:
        'Our AI coach is temporarily unavailable due to API limits. Please retry in a bit, or upgrade billing on the configured provider.',
      detail: briefError(lastErr),
    }, 503)

  } catch (e) {
    return json({ error: 'server', detail: e.message }, 500)
  }
}

// ---- helpers ----

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function isQuotaOr429(err) {
  const msg = typeof err === 'string' ? err : (err?.message || JSON.stringify(err))
  return /insufficient_quota|rate limit|429/i.test(msg)
}

function briefError(e) {
  try {
    if (typeof e === 'string') return e.slice(0, 500)
    if (e?.responseText) return String(e.responseText).slice(0, 500)
    return (e?.message || JSON.stringify(e)).slice(0, 500)
  } catch {
    return 'unknown'
  }
}

async function callOpenAIWithRetry(body, tries = 3) {
  let attempt = 0, lastText = ''
  while (attempt < tries) {
    attempt++
    const r = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    lastText = await r.text()
    if (r.ok) {
      const data = JSON.parse(lastText)
      const text = data.choices?.[0]?.message?.content || '{}'
      // try to extract JSON if the model added extra prose
      const match = text.match(/\{[\s\S]*\}$/)
      const parsed = match ? JSON.parse(match[0]) : JSON.parse(text)
      return parsed
    }

    // For 429/5xx, backoff and retry
    if (r.status === 429 || r.status >= 500) {
      await sleep(200 * attempt + Math.random() * 200) // tiny jitter
      continue
    }

    // For other errors, throw immediately
    throw new Error(lastText)
  }
  // All retries failed
  throw new Error(lastText || 'OpenAI request failed')
}

function sleep(ms) { return new Promise(res => setTimeout(res, ms)) }
