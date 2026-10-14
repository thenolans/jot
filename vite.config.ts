import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { Features } from 'lightningcss'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  css: {
    // The build's CSS minifier would otherwise rewrite `light-dark()` into variables that resolve once
    // on `:root`, so tokens stop following `scheme-light` (the sign-in brand panel).
    // Tailwind already leaves `light-dark()` native for the same reason.
    lightningcss: { exclude: Features.LightDark },
  },
  server: {
    // The app calls the API at `/api` on its own origin. In development, forward those calls to
    // thenolans-api running locally. It only accepts its own host name, hence `changeOrigin`.
    proxy: {
      '/api': {
        target: 'http://api.thenolans.local:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  test: {
    include: ['src/**/*.test.ts'],
  },
})
