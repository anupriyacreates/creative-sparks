// Minimal chrome: just an autoplay toggle parked in the corner, plus a faint
// hint so people know the whole screen is interactive. Clicks here are
// swallowed so they don't spark a new quote underneath.
const swallow = (e) => e.stopPropagation()

export default function Controls({ autoplay, onToggleAutoplay }) {
  return (
    <>
      <button
        className={`autoplay-corner ${autoplay ? 'is-on' : ''}`}
        onClick={(e) => {
          swallow(e)
          onToggleAutoplay()
        }}
        aria-pressed={autoplay}
        aria-label={autoplay ? 'Pause autoplay' : 'Start autoplay'}
        title="Autoplay (P)"
      >
        {autoplay ? '❚❚' : '▶'}
      </button>

      <p className="hint" onClick={swallow}>
        click anywhere · scroll · <kbd>←</kbd> <kbd>→</kbd>
      </p>
    </>
  )
}
