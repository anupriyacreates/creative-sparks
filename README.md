# Creative Sparks ✨

A quirky, scroll-only single-page site that "pops" short quotes about creativity — from
books, thinkers, designers, musicians, and films — one full screen at a time, each paired
with a playful illustration on a vibrant tropical backdrop.

## Highlights

- **Landing grid** that spells **HELLO / CREATIVE!** across colorful illustrated tiles.
  Hover a letter to ripple the surrounding cells; hover an illustration tile to reveal a heart.
- **Scroll-only navigation** — scroll (or swipe) to move between quotes; a custom cursor
  cycles through motivating lines.
- **Quote stage** with a centered illustration + quote, randomized "pop" entrance animations,
  a per-quote tropical color, a cursor-reactive doodle tilt, and a drifting ambient gradient.
- **~100 curated quotes** with attribution, and a **home button** to return to the landing.

## Tech

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + [Framer Motion](https://www.framer.com/motion/)
- Illustrations from [Open Doodles](https://www.opendoodles.com/) (CC0 public domain)
- Fonts: Fraunces + Space Grotesk (Google Fonts)

## Getting started

```bash
npm install
npm run dev      # serves on http://localhost:4242
```

Other scripts:

```bash
npm run build    # production build to dist/
npm run preview  # preview the production build
node scripts/fetch-doodles.mjs   # re-download/convert the Open Doodles SVGs into public/doodles/
```

## Project structure

```
src/
  App.jsx                 # app shell, palette, landing↔quote state
  data/quotes.js          # curated quotes { text, author, source, category, doodle }
  data/doodles.js         # doodle key -> /doodles/*.svg
  hooks/                  # quote engine, scroll input, cursor parallax
  components/             # Landing, QuoteStage, Doodle, ScrollCursor, Ambient
public/doodles/           # Open Doodles SVGs (CC0)
```

## Credits

- Illustrations: **Open Doodles** by Pablo Stanley — CC0 / public domain.
- Quotes are short attributed quotations from their respective authors and works, used for
  commentary and inspiration.
