// Small corner control to enable/disable the per-quote chime. This is the one
// click control on the otherwise scroll-only site; clicks are swallowed so they
// never interfere with navigation.
export default function SoundToggle({ enabled, onToggle }) {
  return (
    <button
      className={`sound-toggle ${enabled ? 'is-on' : ''}`}
      onClick={(e) => {
        e.stopPropagation()
        onToggle()
      }}
      aria-pressed={enabled}
      aria-label={enabled ? 'Mute sound' : 'Enable sound'}
      title={enabled ? 'Sound on' : 'Sound off'}
    >
      {enabled ? '♪' : '♪̸'}
    </button>
  )
}
