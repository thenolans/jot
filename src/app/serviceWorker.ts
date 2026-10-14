import { registerSW } from 'virtual:pwa-register'

import { router } from '@/app/router'

/** How often an app left open checks for a new version. */
const UPDATE_CHECK_INTERVAL = 60 * 60 * 1000

/**
 * Registers the service worker, which caches the app so it opens offline (see `vite.config.ts`). A new
 * version downloads in the background and takes over on the next navigation, which reloads the page
 * it lands on, so it never interrupts what's on screen.
 */
export function registerServiceWorker() {
  let isUpdateReady = false
  const update = registerSW({
    onNeedRefresh: () => {
      isUpdateReady = true
    },
    onRegisteredSW: (_url, registration) => {
      if (!registration) return
      setInterval(
        () => void registration.update().catch(() => {}),
        UPDATE_CHECK_INTERVAL,
      )
    },
  })

  let { location } = router.state
  router.subscribe((state) => {
    if (state.location === location) return
    location = state.location
    if (isUpdateReady) void update(true)
  })
}
