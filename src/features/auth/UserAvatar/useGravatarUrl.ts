import { useEffect, useState } from 'react'

/** Large enough to stay sharp at avatar sizes on high-density screens. */
const GRAVATAR_SIZE = 128

/**
 * Gravatar's image URL for `email`, once it's been worked out (it's addressed by a hash of the email).
 * With `d=404` the image fails to load when the address has no Gravatar, so the avatar falls back.
 */
export function useGravatarUrl(email: string | undefined) {
  const [result, setResult] = useState<{
    email: string
    url: string | null
  } | null>(null)

  useEffect(() => {
    if (!email) return
    let ignore = false
    gravatarHash(email)
      .then(
        (hash) =>
          `https://www.gravatar.com/avatar/${hash}?s=${GRAVATAR_SIZE}&d=404`,
      )
      // Hashing needs a secure context (https or localhost); without one there's no picture.
      .catch(() => null)
      .then((url) => {
        if (!ignore) setResult({ email, url })
      })
    return () => {
      ignore = true
    }
  }, [email])

  return result && result.email === email ? result.url : null
}

async function gravatarHash(email: string) {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(email.trim().toLowerCase()),
  )
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('')
}
