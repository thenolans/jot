/**
 * The API token of whoever is signed in, kept in a cookie on `thenolans.io` that all our apps there
 * share: signing in to one signs in to them all, and signing out of one signs out of them all. On any
 * other host (localhost) the cookie is the host's own.
 *
 * The app keeps using the token its session started with until it looks at the cookie again, which
 * it does each time it comes back into view, so another app signing in never switches users under
 * data already on screen. Listeners hear when the token changes that way, or when the API rejects it.
 */

const COOKIE_NAME = 'thenolans_token'
const SHARED_DOMAIN = 'thenolans.io'
/** 400 days, the longest Chrome keeps a cookie. It's set again on each launch, so it only runs out unused. */
const MAX_AGE_SECONDS = 400 * 24 * 60 * 60

type Listener = () => void

function readCookie() {
  if (typeof document === 'undefined') return null
  for (const pair of document.cookie.split(';')) {
    const [name, value = ''] = pair.trim().split('=')
    if (name === COOKIE_NAME) return decodeURIComponent(value) || null
  }
  return null
}

function writeCookie(value: string | null) {
  if (typeof document === 'undefined') return
  const { hostname, protocol } = location
  const attributes = [
    'Path=/',
    'SameSite=Lax',
    `Max-Age=${value ? MAX_AGE_SECONDS : 0}`,
    (hostname === SHARED_DOMAIN || hostname.endsWith(`.${SHARED_DOMAIN}`)) &&
      `Domain=${SHARED_DOMAIN}`,
    protocol === 'https:' && 'Secure',
  ].filter(Boolean)
  document.cookie = [
    `${COOKIE_NAME}=${value ? encodeURIComponent(value) : ''}`,
    ...attributes,
  ].join('; ')
}

let token = readCookie()
const listeners = new Set<Listener>()

/** Takes up whatever token the cookie holds now, telling listeners if it differs from the one in use. */
function sync() {
  const latest = readCookie()
  if (latest === token) return
  token = latest
  for (const listener of listeners) listener()
}

if (typeof document !== 'undefined') {
  // Renewed on launch, so a sign-in in regular use never expires.
  if (token) writeCookie(token)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') sync()
  })
}

export const authToken = {
  get: () => token,

  /** Signs in with `value`, or out with `null`, in every app sharing the cookie. */
  set(value: string | null) {
    token = value
    writeCookie(value)
  },

  /**
   * The API rejected `rejected` (its session ended, maybe by signing out in another app). The cookie
   * is cleared if it still holds that token; otherwise its newer token is taken up.
   */
  reject(rejected: string) {
    if (readCookie() === rejected) writeCookie(null)
    sync()
  },

  /**
   * Calls `listener` when the token changes other than through `set`: another app signed in or
   * out, or the API rejected it. Returns a function to stop.
   */
  subscribe(listener: Listener) {
    listeners.add(listener)
    return () => void listeners.delete(listener)
  },
}
