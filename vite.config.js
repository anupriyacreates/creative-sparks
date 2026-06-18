import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev server runs on 4242 (deliberately NOT Vite's default 5173).
// `base` serves the production build from the GitHub Pages project sub-path.
export default defineConfig({
  base: '/creative-sparks/',
  plugins: [react()],
  server: {
    port: 4242,
    open: true,
    strictPort: true,
  },
})
