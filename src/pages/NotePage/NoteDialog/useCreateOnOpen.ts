import { useEffect, useEffectEvent, useRef } from 'react'

import type { NewNote } from '@/features/notes/types'
import { useCreateNote } from '@/features/notes/useCreateNote'
import { errorMessage } from '@/lib/api'

/**
 * Creates `note` when the dialog opens, unless it's `null`, then calls `onCreated` with its id. Returns
 * why it couldn't be created, and a way to try again.
 */
export function useCreateOnOpen(
  note: NewNote | null,
  onCreated: (id: number) => void,
) {
  const { mutate, error } = useCreateNote()

  const create = () => {
    if (note) mutate(note, { onSuccess: ({ id }) => onCreated(id) })
  }
  const createOnOpen = useEffectEvent(create)

  // Once only, though React mounts the dialog twice in development.
  const started = useRef(false)
  useEffect(() => {
    if (started.current) return
    started.current = true
    createOnOpen()
  }, [])

  return {
    createError: error ? errorMessage(error) : null,
    retryCreate: create,
  }
}
