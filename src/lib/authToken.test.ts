import { afterEach, describe, expect, it, vi } from 'vitest'

/** A stand-in for the browser's cookie jar, keeping each cookie's name and value. */
function stubBrowser({ hostname = 'avocado.thenolans.io', cookie = '' } = {}) {
  const jar = new Map<string, string>()
  for (const pair of cookie.split('; ').filter(Boolean)) {
    const [name, value] = pair.split('=')
    jar.set(name, value)
  }
  const written: string[] = []
  const visibilityListeners: (() => void)[] = []
  vi.stubGlobal('location', { hostname, protocol: 'https:' })
  vi.stubGlobal('document', {
    visibilityState: 'visible',
    get cookie() {
      return [...jar].map(([name, value]) => `${name}=${value}`).join('; ')
    },
    set cookie(line: string) {
      written.push(line)
      const [pair] = line.split('; ')
      const [name, value] = pair.split('=')
      if (line.includes('Max-Age=0')) jar.delete(name)
      else jar.set(name, value)
    },
    addEventListener: (_type: string, listener: () => void) =>
      visibilityListeners.push(listener),
  })
  return {
    jar,
    written,
    /** The app comes back into view. */
    show: () => visibilityListeners.forEach((listener) => listener()),
  }
}

async function loadAuthToken() {
  vi.resetModules()
  return (await import('./authToken')).authToken
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('authToken', () => {
  it('starts with the token in the cookie, renewing it', async () => {
    const browser = stubBrowser({ cookie: 'other=1; thenolans_token=abc' })
    const authToken = await loadAuthToken()
    expect(authToken.get()).toBe('abc')
    expect(browser.written).toEqual([
      'thenolans_token=abc; Path=/; SameSite=Lax; Max-Age=34560000; Domain=thenolans.io; Secure',
    ])
  })

  it('shares the cookie across thenolans.io but keeps it to the host elsewhere', async () => {
    const shared = stubBrowser()
    ;(await loadAuthToken()).set('abc')
    expect(shared.written[0]).toContain('Domain=thenolans.io')

    const local = stubBrowser({ hostname: 'localhost' })
    ;(await loadAuthToken()).set('abc')
    expect(local.written[0]).not.toContain('Domain')
  })

  it('clears the cookie on sign-out', async () => {
    const browser = stubBrowser({ cookie: 'thenolans_token=abc' })
    const authToken = await loadAuthToken()
    authToken.set(null)
    expect(authToken.get()).toBeNull()
    expect(browser.jar.has('thenolans_token')).toBe(false)
  })

  it('takes up another app signing in or out when it comes back into view', async () => {
    const browser = stubBrowser({ cookie: 'thenolans_token=abc' })
    const authToken = await loadAuthToken()
    const listener = vi.fn()
    authToken.subscribe(listener)

    browser.jar.set('thenolans_token', 'def')
    expect(authToken.get()).toBe('abc')
    browser.show()
    expect(authToken.get()).toBe('def')

    browser.jar.delete('thenolans_token')
    browser.show()
    expect(authToken.get()).toBeNull()
    browser.show()
    expect(listener).toHaveBeenCalledTimes(2)
  })

  it('clears a rejected token, unless another app has replaced it', async () => {
    const browser = stubBrowser({ cookie: 'thenolans_token=abc' })
    const authToken = await loadAuthToken()
    const listener = vi.fn()
    authToken.subscribe(listener)

    browser.jar.set('thenolans_token', 'def')
    authToken.reject('abc')
    expect(authToken.get()).toBe('def')
    expect(browser.jar.get('thenolans_token')).toBe('def')

    authToken.reject('def')
    expect(authToken.get()).toBeNull()
    expect(browser.jar.has('thenolans_token')).toBe(false)
    expect(listener).toHaveBeenCalledTimes(2)
  })
})
