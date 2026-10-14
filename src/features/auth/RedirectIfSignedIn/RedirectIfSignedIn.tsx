import { Navigate, Outlet, useLocation } from 'react-router'

import type { RedirectState } from '../types'
import { useCurrentUser } from '../useCurrentUser'

type RedirectIfSignedInProps = {
  /** Where signed-in users go, unless `RequireAuth` sent them here from another page. */
  to: string
}

/**
 * Layout route for pages meant for signed-out users. Signing in or registering on one of them
 * changes the session, so this is also what takes the user into the app afterwards.
 */
export default function RedirectIfSignedIn({ to }: RedirectIfSignedInProps) {
  const { user, isLoading } = useCurrentUser()
  const location = useLocation()

  if (isLoading) return null
  if (user) {
    const from = (location.state as RedirectState | null)?.from
    return <Navigate to={from ?? to} replace />
  }
  return <Outlet />
}
