// Doodle key -> public asset path. All art is Open Doodles (CC0 public domain),
// converted to standalone SVGs by scripts/fetch-doodles.mjs.
const keys = [
  'reading',
  'sitreading',
  'dancing',
  'groovy',
  'meditating',
  'floating',
  'coffee',
  'jumping',
  'sprinting',
  'swinging',
  'loving',
  'strolling',
  'selfie',
  'running',
  'moshing',
]

export const doodles = Object.fromEntries(keys.map((k) => [k, `/doodles/${k}.svg`]))

export function doodlePath(key) {
  return doodles[key] || doodles.dancing
}
