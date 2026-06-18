import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { quotes as ALL } from '../data/quotes.js'

const AUTOPLAY_MS = 7000

function pickRandom(pool, exclude) {
  if (pool.length <= 1) return pool[0]
  let q = exclude
  while (q === exclude) q = pool[Math.floor(Math.random() * pool.length)]
  return q
}

// Owns the current quote and all the ways to move between quotes.
// Guarantees the immediately-previous quote never repeats back-to-back,
// keeps a visited history for prev/next, and drives the autoplay timer.
export function useQuoteEngine() {
  const [filter, setFilter] = useState('all')

  const pool = useMemo(
    () => (filter === 'all' ? ALL : ALL.filter((q) => q.category === filter)),
    [filter],
  )

  const [history, setHistory] = useState(() => [pickRandom(ALL)])
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [autoplay, setAutoplay] = useState(false)

  const current = history[index]

  // Advance to a brand-new random quote (truncates any forward history).
  const spark = useCallback(() => {
    setDirection(1)
    setHistory((h) => {
      const next = pickRandom(pool, h[index])
      const trimmed = h.slice(0, index + 1)
      setIndex(trimmed.length)
      return [...trimmed, next]
    })
  }, [pool, index])

  // Next: replay forward history if any, otherwise spark a fresh one.
  const next = useCallback(() => {
    setDirection(1)
    if (index < history.length - 1) {
      setIndex((i) => i + 1)
    } else {
      spark()
    }
  }, [index, history.length, spark])

  const prev = useCallback(() => {
    setDirection(-1)
    setIndex((i) => Math.max(0, i - 1))
  }, [])

  const toggleAutoplay = useCallback(() => setAutoplay((a) => !a), [])
  const pauseAutoplay = useCallback(() => setAutoplay(false), [])

  // Switching source filters resets to a fresh pick from the new pool.
  const changeFilter = useCallback((key) => {
    setFilter(key)
    setDirection(1)
    const nextPool = key === 'all' ? ALL : ALL.filter((q) => q.category === key)
    setHistory([pickRandom(nextPool)])
    setIndex(0)
  }, [])

  // Autoplay loop — re-armed whenever the quote or toggle changes.
  const sparkRef = useRef(spark)
  sparkRef.current = spark
  useEffect(() => {
    if (!autoplay) return undefined
    const id = setInterval(() => sparkRef.current(), AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [autoplay, current])

  return {
    current,
    direction,
    filter,
    autoplay,
    canPrev: index > 0,
    spark,
    next,
    prev,
    toggleAutoplay,
    pauseAutoplay,
    changeFilter,
  }
}
