import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useQuoteEngine } from './hooks/useQuoteEngine.js'
import { useGlobalInput } from './hooks/useGlobalInput.js'
import QuoteStage from './components/QuoteStage.jsx'
import ScrollCursor from './components/ScrollCursor.jsx'
import CursorGlow from './components/CursorGlow.jsx'
import Ambient from './components/Ambient.jsx'
import Landing from './components/Landing.jsx'

// Vibrant tropical backgrounds, each with a deep matching ink so the big type
// stays punchy and readable. Chosen per-quote from a stable hash so the color
// feels intentional and never flickers between renders.
const PALETTE = [
  { bg: '#ff6b3d', ink: '#3a0900' }, // papaya
  { bg: '#ffc93c', ink: '#5a3300' }, // mango
  { bg: '#1fe3bb', ink: '#013a2d' }, // turquoise
  { bg: '#19c8e6', ink: '#04313f' }, // lagoon
  { bg: '#b3f23d', ink: '#1d3a00' }, // lime
  { bg: '#ff5fa0', ink: '#46011f' }, // flamingo
  { bg: '#2bd576', ink: '#013420' }, // jungle
  { bg: '#ff5e5b', ink: '#3a0010' }, // hibiscus
]

function hash(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0
  return Math.abs(h)
}

function paletteFor(quote) {
  return PALETTE[hash(quote.text) % PALETTE.length]
}

export default function App() {
  const engine = useQuoteEngine()
  const { current } = engine
  const [started, setStarted] = useState(false)

  useGlobalInput({
    next: engine.next,
    prev: engine.prev,
    enabled: started,
  })

  // Drive the background + text color from the current quote's palette.
  const palette = paletteFor(current)
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--bg', palette.bg)
    root.style.setProperty('--ink', palette.ink)
  }, [palette])

  return (
    <div className="app">
      {started && <Ambient />}
      <CursorGlow />
      <QuoteStage quote={current} />
      {started && (
        <button
          className="home-btn"
          onClick={(e) => {
            e.stopPropagation()
            setStarted(false)
          }}
          aria-label="Back to home"
          title="Home"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M12 3 2 11h3v9h6v-6h2v6h6v-9h3z" />
          </svg>
        </button>
      )}
      <AnimatePresence>
        {!started && <Landing key="landing" onEnter={() => setStarted(true)} />}
      </AnimatePresence>
      {/* touch-only cue (the cursor label is hidden on touch devices) */}
      <p className={`touch-hint ${started ? '' : 'on-dark'}`} aria-hidden="true">
        <span>{started ? 'swipe ↕' : 'swipe to begin'}</span>
      </p>
      <ScrollCursor
        phrases={
          started
            ? [
                'keep scrolling',
                'do it',
                'make art',
                'design…',
                'just start',
                'create',
                'stay curious',
                'make something',
                'keep going',
                'trust the mess',
              ]
            : 'scroll anywhere to begin'
        }
      />
    </div>
  )
}
