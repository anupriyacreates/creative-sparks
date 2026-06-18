import { useEffect, useRef } from 'react'

// Scroll-only navigation: a wheel scroll or a vertical swipe moves between
// quotes. Nothing else (clicks, keys) advances the experience.
export function useGlobalInput({ next, prev, enabled = true }) {
  const handlers = useRef({})
  handlers.current = { next, prev }

  useEffect(() => {
    if (!enabled) return undefined

    // Debounce wheel so one scroll gesture advances exactly one quote.
    let wheelLock = false
    const onWheel = (e) => {
      if (wheelLock || Math.abs(e.deltaY) < 12) return
      wheelLock = true
      const h = handlers.current
      if (e.deltaY > 0) h.next()
      else h.prev()
      setTimeout(() => {
        wheelLock = false
      }, 550)
    }

    let touchStartY = null
    const onTouchStart = (e) => {
      touchStartY = e.touches[0]?.clientY ?? null
    }
    const onTouchEnd = (e) => {
      if (touchStartY == null) return
      const dy = (e.changedTouches[0]?.clientY ?? touchStartY) - touchStartY
      if (Math.abs(dy) < 40) return
      const h = handlers.current
      if (dy < 0) h.next()
      else h.prev()
      touchStartY = null
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [enabled])
}
