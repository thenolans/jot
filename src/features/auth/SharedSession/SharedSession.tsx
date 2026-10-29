import { useEffect } from 'react'

import { authToken } from '@/lib/authToken'

import { fetchCurrentUser } from '../api'
import { useSetSession } from '../useSetSession'

/**
 * Follows the sign-in our apps share (see `authToken`): when another app signs in or out, or the API
 * ends the session, this one switches to match. Renders nothing.
 */
export default function SharedSession() {
  const setSession = useSetSession()

  useEffect(() => {
    async function follow() {
      if (!authToken.get()) return setSession(null)
      // Offline the new user can't be loaded, so the session stays as it is until the next change.
      const user = await fetchCurrentUser().catch(() => undefined)
      if (user !== undefined) setSession(user)
    }
    return authToken.subscribe(() => void follow())
  }, [setSession])

  return null
}
