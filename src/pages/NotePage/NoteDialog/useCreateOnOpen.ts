import { useEffect, useEffectEvent, useRef } from 'react'

import type { NewNote } from '@/features/notes/types'
import { useCreateNote } from '@/features/notes/useCreateNote'

/**
 * Creates `note` when the dialog opens, unless it's `null`, then calls `onCreated` with its id. It's
 * there straight away, online or off (see `useCreateNote`).
 */
export function useCreateOnOpen(
  note: NewNote | null,
  onCreated: (id: number) => void,
) {
  const create = useCreateNote()
  const createOnOpen = useEffectEvent(() => {
    if (note) onCreated(create(note))
  })

  // Once only, though React mounts the dialog twice in development.
  const started = useRef(false)
  useEffect(() => {
    if (started.current) return
    started.current = true
    createOnOpen()
  }, [])
}
