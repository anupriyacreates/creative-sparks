// A fixed atmosphere layer behind the quote: a slow drifting gradient tinted
// from the current palette. Purely decorative.
export default function Ambient() {
  return (
    <div className="ambient" aria-hidden="true">
      <div className="ambient-gradient" />
    </div>
  )
}
