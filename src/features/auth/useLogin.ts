import { useMutation } from '@tanstack/react-query'

import { login } from './api'
import { useSetSession } from './useSetSession'

export function useLogin() {
  const setSession = useSetSession()

  return useMutation({ mutationFn: login, onSuccess: setSession })
}
