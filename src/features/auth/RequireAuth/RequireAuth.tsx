import { useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'

import type { RedirectState } from '../types'
import { useCurrentUser } from '../useCurrentUser'

type RequireAuthProps = {
  /** Where signed-out visitors are sent; they return to the page they asked for after signing in. */
  redirectTo: string
  /** Where users go after signing out from inside the app. */
  afterSignOut: string
}

/** Layout route that only renders its children for a signed-in user. */
export default function RequireAuth({
  redirectTo,
  afterSignOut,
}: RequireAuthProps) {
  const { user, isLoading } = useCurrentUser()
  const location = useLocation()
  // Tells a sign-out apart from arriving signed out, so signing out doesn't land on the sign-in page.
  const [wasSignedIn, setWasSignedIn] = useState(false)
  if (user && !wasSignedIn) setWasSignedIn(true)

  if (isLoading) return null
  if (!user) {
    if (wasSignedIn) return <Navigate to={afterSignOut} replace />
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from: location } satisfies RedirectState}
      />
    )
  }
  return <Outlet />
}
