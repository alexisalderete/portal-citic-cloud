import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/portal/', // Esto es crucial para que los assets se carguen correctamente
  build: {
    outDir: '../public_html/portal', // Ajustar segun estructura
    assetsDir: './assets',
  }
})
