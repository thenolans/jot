/**
 * Whether the API can be reached. The browser's `navigator.onLine` only knows about the device's own
 * connection, so a weak signal in a store still reads as online. Requests that can't reach the API
 * report it here too, and while it's offline the API is checked again every so often.
 */

type Listener = (isOnline: boolean) => void

/** How often to check whether the API can be reached again while it can't. */
const RECHECK_INTERVAL = 15_000

/** Whether the device itself says it has no connection. */
const isDeviceOffline = () =>
  typeof navigator !== 'undefined' && navigator.onLine === false

let isOnline = !isDeviceOffline()
const listeners = new Set<Listener>()
let recheckTimer: ReturnType<typeof setTimeout> | undefined

function setOnline(next: boolean) {
  clearTimeout(recheckTimer)
  if (!next) recheckTimer = setTimeout(recheck, RECHECK_INTERVAL)
  if (next === isOnline) return
  isOnline = next
  for (const listener of listeners) listener(next)
}

/** Asks the API for anything: any reply short of a gateway error means it can be reached. */
async function recheck() {
  if (isDeviceOffline()) return setOnline(false)
  try {
    const response = await fetch('/api/', {
      method: 'HEAD',
      cache: 'no-store',
    })
    setOnline(response.status < 502)
  } catch {
    setOnline(false)
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('offline', () => setOnline(false))
  window.addEventListener('online', () => void recheck())
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && !isOnline) void recheck()
  })
  if (!isOnline) setOnline(false)
}

export const connectivity = {
  isOnline: () => isOnline,

  /** Calls `listener` whenever the API becomes reachable or unreachable; returns a function to stop. */
  subscribe(listener: Listener) {
    listeners.add(listener)
    return () => void listeners.delete(listener)
  },

  /** A request got an answer from the API. */
  reportReachable: () => setOnline(true),

  /** A request couldn't reach the API. */
  reportUnreachable: () => setOnline(false),
}
