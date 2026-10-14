import { useMutation } from '@tanstack/react-query'

import { logout } from './api'
import { useSetSession } from './useSetSession'

/** Signs out. It happens locally even when the API can't be reached; the mutation still fails then. */
export function useLogout() {
  const setSession = useSetSession()

  return useMutation({ mutationFn: logout, onSettled: () => setSession(null) })
}
