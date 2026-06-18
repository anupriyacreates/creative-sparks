import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev server runs on 4242 (deliberately NOT Vite's default 5173).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4242,
    open: true,
    strictPort: true,
  },
})
