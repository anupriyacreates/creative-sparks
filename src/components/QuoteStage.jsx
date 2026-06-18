import { useMemo } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Doodle from './Doodle.jsx'
import { STAGE_INTROS, STAGE_EXITS, STAGE_REST, randomFrom } from '../animations.js'

// One quote card. It mounts fresh per quote (via the key in QuoteStage), so a
// new random entrance + exit is chosen on every appearance.
function QuoteCard({ quote }) {
  const reduce = useReducedMotion()
  const intro = useMemo(() => randomFrom(STAGE_INTROS), [])
  const exit = useMemo(() => randomFrom(STAGE_EXITS), [])

  const motionProps = reduce
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0, transition: { duration: 0.2 } },
        transition: { duration: 0.3 },
      }
    : {
        initial: intro.initial,
        animate: STAGE_REST,
        exit,
        transition: intro.transition,
      }

  return (
    <motion.div className="card" style={{ transformPerspective: 1200 }} {...motionProps}>
      <div className="doodle-wrap">
        <Doodle doodleKey={quote.doodle} reduce={reduce} />
      </div>

      <blockquote className="quote">
        <p className="quote-text">{quote.text}</p>
        <footer className="attribution">
          <span className="author">{quote.author}</span>
          {quote.source && quote.source !== quote.author && (
            <span className="source">{quote.source}</span>
          )}
        </footer>
      </blockquote>
    </motion.div>
  )
}

// The full-screen stage. One quote + doodle take over the screen at a time;
// scrolling moves between quotes (handled globally in App).
export default function QuoteStage({ quote }) {
  return (
    <main className="stage" role="presentation">
      <AnimatePresence mode="wait">
        <QuoteCard key={quote.text} quote={quote} />
      </AnimatePresence>
    </main>
  )
}
