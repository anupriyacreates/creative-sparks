import { useEffect, useRef, useState } from 'react'

const TRAIL = 3 // number of lagging dots

// A custom cursor: hides the native pointer and shows a small text label that
// follows the mouse, with a few dots trailing behind it. When given multiple
// phrases it cycles through them with a blink.
export default function ScrollCursor({ phrases }) {
  const list = Array.isArray(phrases) ? phrases : [phrases]
  const cycling = list.length > 1
  const [idx, setIdx] = useState(0)
  const labelRef = useRef(null)
  const dotRefs = useRef([])

  // Rotate through the motivating phrases.
  useEffect(() => {
    if (!cycling) return undefined
    setIdx(0)
    const id = setInterval(() => setIdx((i) => (i + 1) % list.length), 1800)
    return () => clearInterval(id)
  }, [cycling, list.length])

  useEffect(() => {
    const labelEl = labelRef.current
    const dots = dotRefs.current
    if (!labelEl) return undefined

    let mouseX = -100
    let mouseY = -100
    let visible = false
    const pts = Array.from({ length: TRAIL }, () => ({ x: mouseX, y: mouseY }))

    const move = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      labelEl.style.transform = `translate(${mouseX}px, ${mouseY}px)`
      if (!visible) {
        visible = true
        labelEl.style.opacity = '1'
        dots.forEach((d) => d && (d.style.opacity = ''))
      }
    }
    const hide = () => {
      visible = false
      labelEl.style.opacity = '0'
      dots.forEach((d) => d && (d.style.opacity = '0'))
    }

    let raf = 0
    const tick = () => {
      let px = mouseX
      let py = mouseY
      for (let i = 0; i < pts.length; i++) {
        pts[i].x += (px - pts[i].x) * 0.3
        pts[i].y += (py - pts[i].y) * 0.3
        const d = dots[i]
        if (d) d.style.transform = `translate(${pts[i].x}px, ${pts[i].y}px)`
        px = pts[i].x
        py = pts[i].y
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    window.addEventListener('mousemove', move)
    document.addEventListener('mouseleave', hide)
    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseleave', hide)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      {Array.from({ length: TRAIL }).map((_, i) => (
        <div
          key={i}
          ref={(el) => (dotRefs.current[i] = el)}
          className="trail-dot"
          aria-hidden="true"
          style={{ opacity: 0 }}
        />
      ))}
      <div ref={labelRef} className="scroll-cursor" aria-hidden="true">
        {/* key restarts the blink animation on each phrase change */}
        <span key={idx} className={`cursor-text ${cycling ? 'blink' : ''}`}>
          {list[idx]}
        </span>
      </div>
    </>
  )
}
