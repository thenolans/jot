import { useMutation } from '@tanstack/react-query'

import { register } from './api'
import { useSetSession } from './useSetSession'

/** Creates an account and signs in to it. */
export function useRegister() {
  const setSession = useSetSession()

  return useMutation({ mutationFn: register, onSuccess: setSession })
}
