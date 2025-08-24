import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'

/**
 * MicButton
 * - Uses Web Speech API (Chrome recommended, HTTPS or localhost)
 * - Emits final chunks via onTranscriptAppend(finalText)
 * - Emits interim text via onInterim(interimText)
 * - Emits state via onState('recording'|'idle'|'error'|'unsupported')
 * - Exposes start/stop via ref
 */
const MicButton = forwardRef(function MicButton({ onTranscriptAppend, onInterim, onState }, ref) {
  const recRef = useRef(null)
  const interimRef = useRef('')
  const [active, setActive] = useState(false)
  const [supported, setSupported] = useState(true)

  // Simple beep using Web Audio API
  const beep = (freq = 880, ms = 120, type = 'sine', gain = 0.06) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = type
      o.frequency.value = freq
      o.connect(g)
      g.connect(ctx.destination)
      g.gain.value = gain
      o.start()
      setTimeout(() => { o.stop(); ctx.close() }, ms)
    } catch {}
  }

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      setSupported(false)
      onState?.('unsupported')
      return
    }

    const rec = new SR()
    rec.continuous = true
    rec.interimResults = true
    rec.lang = 'en-US'

    rec.onstart = () => {
      onState?.('recording')
      setActive(true)
      beep(880, 120) // start beep
    }

    rec.onresult = (e) => {
      let finalChunk = ''
      let interimChunk = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i]
        if (r.isFinal) finalChunk += r[0].transcript + ' '
        else interimChunk += r[0].transcript + ' '
      }
      if (finalChunk.trim()) onTranscriptAppend?.(finalChunk.trim())
      interimRef.current = interimChunk.trim()
      onInterim?.(interimRef.current)
    }

    rec.onerror = (err) => {
      console.error('Speech error:', err)
      onState?.('error')
      setActive(false)
      onInterim?.('')
    }

    rec.onend = () => {
      // Flush any leftover interim as final text
      if (interimRef.current) {
        onTranscriptAppend?.(interimRef.current)
        interimRef.current = ''
      }
      onInterim?.('')
      onState?.('idle')
      setActive(false)
      beep(440, 120) // stop beep
    }

    recRef.current = rec
    return () => {
      try { rec.stop() } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const start = () => {
    if (!recRef.current) {
      setSupported(false)
      onState?.('unsupported')
      alert('Speech recognition not supported. Use Chrome on HTTPS or type your answer.')
      return
    }
    if (active) return
    try { recRef.current.start() } catch (e) { console.error(e) }
  }

  const stop = () => {
    if (!recRef.current) return
    try { recRef.current.stop() } catch (e) { console.error(e) }
  }

  useImperativeHandle(ref, () => ({
    start,
    stop,
    isActive: () => active
  }))

  if (!supported) {
    return (
      <div className="text-sm text-muted">
        🎤 Speech recognition not supported. Use Chrome on HTTPS, or type your answer below.
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {!active ? (
        <button className="btn btn-primary" onClick={start}>🎤 Start recording</button>
      ) : (
        <button className="btn border" onClick={stop}>⏹ Stop</button>
      )}
    </div>
  )
})

export default MicButton
