import { matchMutation, useMutationState } from '@tanstack/react-query'

import { isSameId } from '@/lib/localIds'

import {
  type CreateNote,
  createNoteMutationKey,
  type UpdateNote,
  updateNoteMutationKey,
} from '../mutations'
import type { Note } from '../types'

/**
 * Where the latest save of the note with `id` (or making it, for a new one) has got to: `'saving'`, `'waiting'` for the connection,
 * `'failed'`, `'copied'` (it was edited elsewhere too, and the two couldn't be merged, so it was saved as a
 * copy), or `'saved'` (also when there's been none).
 */
export function useNoteSaveStatus(id: number) {
  const states = useMutationState({
    filters: {
      predicate: (mutation) => {
        const isSave =
          matchMutation({ mutationKey: updateNoteMutationKey }, mutation) ||
          matchMutation({ mutationKey: createNoteMutationKey }, mutation)
        const variables = mutation.state.variables as
          UpdateNote | CreateNote | undefined
        return isSave && !!variables && isSameId(variables.id, id)
      },
    },
    select: (mutation) => mutation.state,
  })
  const latest = states.at(-1)

  if (latest?.isPaused) return 'waiting'
  if (latest?.status === 'pending') return 'saving'
  if (latest?.status === 'error') return 'failed'
  const saved = latest?.data as Note | undefined
  if (saved && !isSameId(saved.id, id)) return 'copied'
  return 'saved'
}
