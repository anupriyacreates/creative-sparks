// Pools of entrance/exit animations. A fresh one is picked at random for every
// quote and doodle so each appearance feels different and exciting.

export function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Where every quote card settles once it has animated in.
export const STAGE_REST = {
  opacity: 1,
  x: 0,
  y: 0,
  scale: 1,
  rotate: 0,
  rotateX: 0,
  rotateY: 0,
  filter: 'blur(0px)',
}

export const STAGE_INTROS = [
  {
    initial: { opacity: 0, scale: 0.4 },
    transition: { type: 'spring', stiffness: 320, damping: 11 },
  },
  {
    initial: { opacity: 0, y: -280, rotate: -7 },
    transition: { type: 'spring', stiffness: 260, damping: 13 },
  },
  {
    initial: { opacity: 0, y: 280 },
    transition: { type: 'spring', stiffness: 240, damping: 16 },
  },
  {
    initial: { opacity: 0, x: -340, rotate: -4 },
    transition: { type: 'spring', stiffness: 230, damping: 18 },
  },
  {
    initial: { opacity: 0, x: 340, rotate: 4 },
    transition: { type: 'spring', stiffness: 230, damping: 18 },
  },
  {
    initial: { opacity: 0, scale: 0.3, rotate: -35 },
    transition: { type: 'spring', stiffness: 260, damping: 14 },
  },
  {
    initial: { opacity: 0, rotateX: 90 },
    transition: { type: 'spring', stiffness: 200, damping: 16 },
  },
  {
    initial: { opacity: 0, scale: 1.5, filter: 'blur(16px)' },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
  {
    initial: { opacity: 0, x: 220, rotate: 14, scale: 0.8 },
    transition: { type: 'spring', stiffness: 220, damping: 12 },
  },
]

export const STAGE_EXITS = [
  { opacity: 0, scale: 0.82, filter: 'blur(6px)', transition: { duration: 0.25 } },
  { opacity: 0, y: -140, rotate: -6, transition: { duration: 0.3, ease: 'easeIn' } },
  { opacity: 0, x: 180, rotate: 8, transition: { duration: 0.3, ease: 'easeIn' } },
  { opacity: 0, scale: 1.25, transition: { duration: 0.28, ease: 'easeIn' } },
]

// Doodle intros avoid the Y axis so the gentle floating loop can own it.
export const DOODLE_INTROS = [
  { initial: { opacity: 0, scale: 0.3, rotate: -30 }, settle: { scale: 1, rotate: 0 }, transition: { type: 'spring', stiffness: 240, damping: 12 } },
  { initial: { opacity: 0, scale: 1.6 }, settle: { scale: 1 }, transition: { type: 'spring', stiffness: 260, damping: 14 } },
  { initial: { opacity: 0, x: -300, rotate: -12 }, settle: { x: 0, rotate: 0 }, transition: { type: 'spring', stiffness: 220, damping: 16 } },
  { initial: { opacity: 0, x: 300, rotate: 12 }, settle: { x: 0, rotate: 0 }, transition: { type: 'spring', stiffness: 220, damping: 16 } },
  { initial: { opacity: 0, rotateY: 90 }, settle: { rotateY: 0 }, transition: { type: 'spring', stiffness: 200, damping: 15 } },
  { initial: { opacity: 0, scale: 0.6, rotate: 28 }, settle: { scale: 1, rotate: 0 }, transition: { type: 'spring', stiffness: 300, damping: 10 } },
]
