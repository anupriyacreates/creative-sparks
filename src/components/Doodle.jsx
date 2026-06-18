import { useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { doodlePath } from '../data/doodles.js'
import { DOODLE_INTROS, randomFrom } from '../animations.js'
import { usePointerParallax } from '../hooks/usePointerParallax.js'

// The big Open Doodles illustration for the current quote. It pops in with a
// random exciting entrance, floats gently, and (on pointer devices) tilts
// toward the cursor via a wrapper transform that's independent of the img's
// own entrance/float animation.
export default function Doodle({ doodleKey, reduce }) {
  const intro = useMemo(() => randomFrom(DOODLE_INTROS), [])
  const tiltRef = useRef(null)
  usePointerParallax(tiltRef, { reduce })

  if (reduce) {
    return (
      <div className="doodle-tilt">
        <motion.img
          className="doodle"
          src={doodlePath(doodleKey)}
          alt=""
          draggable={false}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    )
  }

  return (
    <div className="doodle-tilt" ref={tiltRef}>
      <motion.img
        className="doodle"
        src={doodlePath(doodleKey)}
        alt=""
        draggable={false}
        style={{ transformPerspective: 1000 }}
        initial={intro.initial}
        animate={{ opacity: 1, ...intro.settle, y: [0, -16, 0] }}
        exit={{ opacity: 0, scale: 0.6, rotate: 12, transition: { duration: 0.25 } }}
        transition={{
          ...intro.transition,
          opacity: { duration: 0.3 },
          y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.7 },
        }}
      />
    </div>
  )
}
