import { useCallback, useRef, useState } from 'react'
import { quotes as ALL } from '../data/quotes.js'

// Fisher-Yates shuffle into a new array.
function shuffle(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Owns the current quote. Quotes are dealt from a shuffled deck so that within
// a session no quote repeats until every quote has been shown; then the deck
// reshuffles (avoiding an immediate back-to-back repeat across the boundary).
// `sequence` records the dealt order so prev/next can walk the history.
export function useQuoteEngine() {
  // Remaining undealt quotes for this cycle, mutated as we deal.
  const deckRef = useRef(null)
  if (deckRef.current === null) {
    deckRef.current = shuffle(ALL)
  }

  const dealNext = useCallback((lastShown) => {
    if (deckRef.current.length === 0) {
      // Exhausted — reshuffle. Avoid repeating the just-shown quote first.
      let next = shuffle(ALL)
      if (next.length > 1 && next[0] === lastShown) {
        const j = 1 + Math.floor(Math.random() * (next.length - 1))
        ;[next[0], next[j]] = [next[j], next[0]]
      }
      deckRef.current = next
    }
    return deckRef.current.shift()
  }, [])

  const [sequence, setSequence] = useState(() => [deckRef.current.shift()])
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  const current = sequence[index]

  const next = useCallback(() => {
    setDirection(1)
    if (index < sequence.length - 1) {
      // walk forward through already-seen history
      setIndex(index + 1)
    } else {
      const q = dealNext(sequence[index])
      setSequence((s) => [...s, q])
      setIndex(sequence.length)
    }
  }, [index, sequence, dealNext])

  const prev = useCallback(() => {
    setDirection(-1)
    setIndex((i) => Math.max(0, i - 1))
  }, [])

  return {
    current,
    direction,
    canPrev: index > 0,
    next,
    prev,
  }
}
