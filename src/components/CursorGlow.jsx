import { useEffect, useRef } from 'react'

// A subtle radial glow that follows the pointer (or touch point). It's a
// full-screen overlay whose gradient center is updated via CSS variables on
// each animation frame; mix-blend-mode keeps it soft over any background.
export default function CursorGlow() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    let raf = 0
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2

    const apply = () => {
      raf = 0
      el.style.setProperty('--gx', `${x}px`)
      el.style.setProperty('--gy', `${y}px`)
      el.style.opacity = '1'
    }
    const set = (cx, cy) => {
      x = cx
      y = cy
      if (!raf) raf = requestAnimationFrame(apply)
    }

    const onMouse = (e) => set(e.clientX, e.clientY)
    const onTouch = (e) => {
      const t = e.touches[0]
      if (t) set(t.clientX, t.clientY)
    }

    window.addEventListener('mousemove', onMouse)
    window.addEventListener('touchstart', onTouch, { passive: true })
    window.addEventListener('touchmove', onTouch, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('touchstart', onTouch)
      window.removeEventListener('touchmove', onTouch)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return <div ref={ref} className="cursor-glow" aria-hidden="true" />
}
