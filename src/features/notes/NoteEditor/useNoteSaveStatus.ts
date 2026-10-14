import { useMutationState } from '@tanstack/react-query'

import { type UpdateNote, updateNoteMutationKey } from '../mutations'

/**
 * Where the latest save of the note with `id` has got to: `'saving'`, `'waiting'` for the connection,
 * `'failed'`, or `'saved'` (also when there's been none).
 */
export function useNoteSaveStatus(id: number) {
  const states = useMutationState({
    filters: {
      mutationKey: updateNoteMutationKey,
      predicate: (mutation) =>
        (mutation.state.variables as UpdateNote | undefined)?.id === id,
    },
    select: (mutation) => mutation.state,
  })
  const latest = states.at(-1)

  if (latest?.isPaused) return 'waiting'
  if (latest?.status === 'pending') return 'saving'
  if (latest?.status === 'error') return 'failed'
  return 'saved'
}
