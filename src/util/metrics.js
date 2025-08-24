// Simple speech metrics
const FILLERS = ['um', 'uh', 'er', 'ah', 'like', 'you know', 'basically', 'actually', 'so', 'right']

export function wordsPerMinute(text, seconds) {
  const words = (text || '').trim().split(/\s+/).filter(Boolean).length
  const mins = Math.max(seconds / 60, 0.0001)
  return Math.round(words / mins)
}

export function fillerCounts(text) {
  const lc = (text || '').toLowerCase()
  const hits = []
  let total = 0
  for (const f of FILLERS) {
    const re = new RegExp(`\\b${f.replace(' ', '\\s+')}\\b`, 'g')
    const m = lc.match(re)
    const c = m ? m.length : 0
    if (c > 0) hits.push({ filler: f, count: c })
    total += c
  }
  return { total, hits }
}

export function starGuess(text) {
  const lc = (text || '').toLowerCase()
  const hasS = /(situation|context|background)\b/.test(lc)
  const hasT = /(task|goal|challenge|objective)\b/.test(lc)
  const hasA = /(action|i decided|i did|i implemented)\b/.test(lc)
  const hasR = /(result|outcome|impact|metric)\b/.test(lc)
  const missing = []
  if (!hasS) missing.push('S')
  if (!hasT) missing.push('T')
  if (!hasA) missing.push('A')
  if (!hasR) missing.push('R')
  return { hasSTAR: missing.length === 0, missing }
}
