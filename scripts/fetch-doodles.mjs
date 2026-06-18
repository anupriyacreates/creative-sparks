// Build-time helper: download Open Doodles (CC0 public domain) figures from the
// official source repo (fangpenlin/open-doodles) and convert each React/TSX
// component into a standalone, self-contained .svg in public/doodles/.
//
// The doodle components only use JSX-expression ids + {accentColor}/{inkColor}
// fills (no internal url(#...) refs), so the conversion is a small set of
// string transforms. Run with: node scripts/fetch-doodles.mjs
import { writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '..', 'public', 'doodles')
const RAW = 'https://raw.githubusercontent.com/fangpenlin/open-doodles/master/src/components/doodles'

// Doodle colors baked into the standalone SVGs. Backgrounds in the app are
// pastel/light, so a near-black ink reads well; the accent is a warm coral.
const INK = '#241c17'
const ACCENT = '#ff7a59'

// output-key -> repo component file name
const DOODLES = {
  reading: 'ReadingDoodle',
  sitreading: 'SitReadingDoodle',
  dancing: 'DancingDoodle',
  groovy: 'GroovyDoodle',
  meditating: 'MeditatingDoodle',
  floating: 'FloatDoodle',
  coffee: 'CoffeeDoddle', // (sic) — repo spelling
  jumping: 'JumpingDoodle',
  sprinting: 'SprintingDoodle',
  swinging: 'SwingingDoodle',
  loving: 'LovingDoodle',
  strolling: 'StrollingDoodle',
  selfie: 'SelfieDoodle',
  running: 'RunningDoodle',
  moshing: 'MoshingDoodle',
}

function toSvg(tsx) {
  // Grab the JSX inside render()'s `return ( ... )`.
  const start = tsx.indexOf('return (')
  if (start === -1) throw new Error('no return( found')
  const open = tsx.indexOf('<g', start)
  const close = tsx.lastIndexOf('</g>')
  if (open === -1 || close === -1) throw new Error('no <g> body found')
  let body = tsx.slice(open, close + '</g>'.length)

  body = body
    .replace(/\s+id=\{[^}]+\}/g, '')                 // drop dynamic ids (unused)
    .replace(/fill=\{accentColor\}/g, `fill="${ACCENT}"`)
    .replace(/fill=\{inkColor\}/g, `fill="${INK}"`)
    .replace(/fillRule=/g, 'fill-rule=')
    .replace(/strokeWidth=/g, 'stroke-width=')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 768" width="1024" height="768" role="img" aria-hidden="true">\n${body}\n</svg>\n`
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  const entries = Object.entries(DOODLES)
  let ok = 0
  for (const [key, comp] of entries) {
    const url = `${RAW}/${comp}.tsx`
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'creative-sparks-build' } })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const tsx = await res.text()
      const svg = toSvg(tsx)
      await writeFile(join(OUT_DIR, `${key}.svg`), svg, 'utf8')
      ok++
      console.log(`✓ ${key}.svg`)
    } catch (err) {
      console.error(`✗ ${key} (${comp}): ${err.message}`)
    }
  }
  console.log(`\nDone: ${ok}/${entries.length} doodles written to public/doodles/`)
}

main()
