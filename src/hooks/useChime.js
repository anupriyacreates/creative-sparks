import { useCallback, useRef, useState } from 'react'

// A soft, asset-free chime via the Web Audio API. Audio is enabled only after
// the user clicks the toggle (browser autoplay policy needs a real gesture).
const NOTES = [523.25, 587.33, 659.25, 783.99, 880.0] // C5 D5 E5 G5 A5 (pentatonic)

export function useChime() {
  const [enabled, setEnabled] = useState(false)
  const ctxRef = useRef(null)
  const noteRef = useRef(0)

  const ensureCtx = () => {
    if (!ctxRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext
      if (AC) ctxRef.current = new AC()
    }
    return ctxRef.current
  }

  const toggle = useCallback(() => {
    setEnabled((on) => {
      const next = !on
      if (next) {
        const ctx = ensureCtx()
        ctx?.resume?.() // unlock on this user gesture
      }
      return next
    })
  }, [])

  const play = useCallback(() => {
    const ctx = ctxRef.current
    if (!ctx) return
    const now = ctx.currentTime
    // step through the pentatonic scale so successive quotes feel melodic
    const freq = NOTES[noteRef.current % NOTES.length]
    noteRef.current += 1

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1)
    osc.connect(gain).connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 1.2)
  }, [])

  return { enabled, toggle, play }
}
