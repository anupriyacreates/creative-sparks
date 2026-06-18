import { useEffect, useMemo, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { doodles, doodlePath } from '../data/doodles.js'

const KEYS = Object.keys(doodles)

// Every color used across the site — the quote-stage tropical set plus the
// extra vibrant tones from earlier iterations — each paired with a readable
// ink so the letters stay legible wherever they land.
const PALETTE = [
  { bg: '#ff6b3d', ink: '#3a0900' }, // papaya
  { bg: '#ffc93c', ink: '#5a3300' }, // mango
  { bg: '#1fe3bb', ink: '#013a2d' }, // turquoise
  { bg: '#19c8e6', ink: '#04313f' }, // lagoon
  { bg: '#b3f23d', ink: '#1d3a00' }, // lime
  { bg: '#ff5fa0', ink: '#46011f' }, // flamingo
  { bg: '#2bd576', ink: '#013420' }, // jungle
  { bg: '#ff5e5b', ink: '#3a0010' }, // hibiscus
  { bg: '#9b5cff', ink: '#f3ecff' }, // passionfruit
  { bg: '#ffd23f', ink: '#5a3a00' }, // sunshine
  { bg: '#ff3d7f', ink: '#46011f' }, // magenta
  { bg: '#0f5fb0', ink: '#eaf4ff' }, // cobalt
  { bg: '#e8472b', ink: '#fff2ee' }, // vermilion
]

const pick = (i) => PALETTE[(i * 4 + 1) % PALETTE.length]

const WORDS = ['HELLO', 'CREATIVE!']
const TARGET_TILE = 72 // px — smaller tiles

// Build grid geometry from the viewport and place each phrase letter into a
// specific tile, centered, on two stacked rows.
function buildLayout() {
  const w = typeof window === 'undefined' ? 1280 : window.innerWidth
  const h = typeof window === 'undefined' ? 800 : window.innerHeight
  const cols = Math.max(11, Math.min(24, Math.round(w / TARGET_TILE)))
  const rows = Math.max(7, Math.min(16, Math.round(h / TARGET_TILE)))

  const r1 = Math.floor(rows / 2) - 1
  const letters = {}
  WORDS.forEach((word, wi) => {
    const row = r1 + wi
    const start = Math.floor((cols - word.length) / 2)
    for (let k = 0; k < word.length; k++) {
      letters[`${row}-${start + k}`] = word[k]
    }
  })

  return { cols, rows, letters }
}

export default function Landing({ onEnter }) {
  const reduce = useReducedMotion()
  const fired = useRef(false)
  const { cols, rows, letters } = useMemo(buildLayout, [])

  const go = () => {
    if (fired.current) return
    fired.current = true
    onEnter()
  }

  // Only a scroll / swipe enters the experience.
  useEffect(() => {
    window.addEventListener('wheel', go, { passive: true })
    window.addEventListener('touchmove', go, { passive: true })
    return () => {
      window.removeEventListener('wheel', go)
      window.removeEventListener('touchmove', go)
    }
  }, [onEnter])

  // Hovering a letter "disrupts the harmony": nearby cells are pushed radially
  // outward (falling off with distance) and settle back on mouse-leave. DOM is
  // poked directly via refs so there's no per-hover React re-render.
  const tileRefs = useRef([])

  const applyDisrupt = (center) => {
    if (reduce) return
    const cr = Math.floor(center / cols)
    const cc = center % cols
    const cellW = window.innerWidth / cols
    const radius = 2.7
    const maxPush = cellW * 0.72
    tileRefs.current.forEach((el, i) => {
      if (!el) return
      if (i === center) {
        el.style.transform = 'scale(1.16)'
        el.style.zIndex = '5'
        return
      }
      const dc = (i % cols) - cc
      const dr = Math.floor(i / cols) - cr
      const dist = Math.hypot(dc, dr)
      if (dist > radius) {
        el.style.transform = ''
        el.style.zIndex = ''
        return
      }
      const f = 1 - dist / radius
      const push = maxPush * f
      const rot = (dc >= 0 ? 1 : -1) * f * 9
      el.style.transform =
        `translate(${(dc / dist) * push}px, ${(dr / dist) * push}px) ` +
        `scale(${1 - 0.08 * f}) rotate(${rot}deg)`
      el.style.zIndex = '4'
    })
  }

  const clearDisrupt = () => {
    tileRefs.current.forEach((el) => {
      if (el) {
        el.style.transform = ''
        el.style.zIndex = ''
      }
    })
  }

  const cells = []
  for (let i = 0; i < cols * rows; i++) {
    const row = Math.floor(i / cols)
    const col = i % cols
    const ch = letters[`${row}-${col}`]
    const delay = reduce ? '0s' : `${Math.min(i, 80) * 0.012}s`

    if (ch) {
      const pal = pick(i)
      const idx = i
      cells.push(
        <div
          key={i}
          ref={(el) => (tileRefs.current[idx] = el)}
          className="tile letter"
          style={{ backgroundColor: pal.bg, color: pal.ink, animationDelay: delay }}
          onMouseEnter={() => applyDisrupt(idx)}
          onMouseLeave={clearDisrupt}
        >
          <span>{ch}</span>
        </div>,
      )
    } else {
      const pal = pick(i)
      const solid = i % 7 === 3
      const idx = i
      cells.push(
        <div
          key={i}
          ref={(el) => (tileRefs.current[idx] = el)}
          className={`tile ${solid ? 'solid' : ''}`}
          style={{ backgroundColor: pal.bg, color: pal.ink, animationDelay: delay }}
        >
          {!solid && (
            <img
              className="tile-doodle"
              src={doodlePath(KEYS[(i * 3 + (i % 5)) % KEYS.length])}
              alt=""
              style={{ transform: `rotate(${((i % 5) - 2) * 5}deg)` }}
            />
          )}
          <svg className="tile-heart" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </svg>
        </div>,
      )
    }
  }

  return (
    <motion.div
      className="landing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <h1 className="sr-only">Hello, creative!</h1>
      <div
        className="tile-grid"
        aria-hidden="true"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {cells}
      </div>
    </motion.div>
  )
}
