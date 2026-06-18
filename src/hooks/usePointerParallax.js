import { useEffect } from 'react'

// Tilts/parallaxes a target element toward the pointer. Writes a transform onto
// the given ref on each animation frame. No-op on touch devices or when the
// user prefers reduced motion.
export function usePointerParallax(ref, { maxTilt = 10, maxShift = 14, reduce = false } = {}) {
  useEffect(() => {
    if (reduce) return undefined
    if (typeof window !== 'undefined' && window.matchMedia?.('(hover: none)').matches) {
      return undefined
    }

    let raf = 0
    let tx = 0
    let ty = 0 // current (eased) values
    let targetX = 0
    let targetY = 0

    const onMove = (e) => {
      // -1..1 from screen center
      targetX = (e.clientX / window.innerWidth) * 2 - 1
      targetY = (e.clientY / window.innerHeight) * 2 - 1
      if (!raf) raf = requestAnimationFrame(tick)
    }

    const tick = () => {
      tx += (targetX - tx) * 0.12
      ty += (targetY - ty) * 0.12
      const el = ref.current
      if (el) {
        el.style.transform =
          `perspective(800px) rotateY(${tx * maxTilt}deg) rotateX(${-ty * maxTilt}deg) ` +
          `translate3d(${tx * maxShift}px, ${ty * maxShift}px, 0)`
      }
      if (Math.abs(targetX - tx) > 0.001 || Math.abs(targetY - ty) > 0.001) {
        raf = requestAnimationFrame(tick)
      } else {
        raf = 0
      }
    }

    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [ref, maxTilt, maxShift, reduce])
}
