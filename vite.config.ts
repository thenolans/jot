import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { Features } from 'lightningcss'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Makes the app installable and lets it open offline: a service worker caches the built app, and the
    // data the app keeps offline is saved separately (`src/app/queryPersister.ts`). Updates install in
    // the background and apply on the next navigation (`src/app/serviceWorker.ts`).
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      manifest: {
        id: '/',
        name: 'Jot',
        short_name: 'Jot',
        description: 'Markdown notes, filed in folders.',
        start_url: '/notes',
        scope: '/',
        display: 'standalone',
        // An installed app's Android navigation bar can't follow the page, and the manifest has one color
        // for both themes, so both match the tab bar in dark mode (--color-bar there) and light mode gets
        // a dark strip. Chrome 156+ paints the bar with theme_color; 153-155 leave it see-through over the
        // window, which takes background_color (also the launch screen's). The status bar follows the
        // theme-color tags in index.html.
        theme_color: '#0e1b1f',
        background_color: '#0e1b1f',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        // Pages are routes of the single-page app; the API is never answered from the cache.
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
      },
    }),
  ],
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
