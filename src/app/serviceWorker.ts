import { registerSW } from 'virtual:pwa-register'

import { router } from '@/app/router'

/** How often an app left open checks for a new version. */
const UPDATE_CHECK_INTERVAL = 60 * 60 * 1000

let registration: ServiceWorkerRegistration | undefined

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
    onRegisteredSW: (_url, registered) => {
      if (!registered) return
      registration = registered
      setInterval(
        () => void registered.update().catch(() => {}),
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

/** Resolves once a new version has finished downloading, whether or not it installed. */
function installed(worker: ServiceWorker) {
  return new Promise<void>((resolve) => {
    const settle = () => {
      if (worker.state !== 'installing') resolve()
    }
    worker.addEventListener('statechange', settle)
    settle()
  })
}

/**
 * Asks for a newer version of the app now and, if there is one, switches to it and reloads. A reload
 * alone never does this: the version running keeps control until every window of the app is closed.
 * Resolves to `false` when the app is already up to date (or there's no service worker, as in
 * development); rejects when the check can't reach the server.
 */
export async function updateApp() {
  if (!registration) return false
  await registration.update()
  if (registration.installing) await installed(registration.installing)
  const { waiting } = registration
  if (!waiting) return false

  navigator.serviceWorker.addEventListener(
    'controllerchange',
    () => window.location.reload(),
    { once: true },
  )
  waiting.postMessage({ type: 'SKIP_WAITING' })
  return true
}
