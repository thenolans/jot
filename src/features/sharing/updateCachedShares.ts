import type { QueryClient } from '@tanstack/react-query'

import { updateCachedNotes } from '@/features/notes/noteCache'

import { sharingQueries } from './queries'
import type { Share } from './types'

/**
 * Applies a change the API has made to the cached list of who a note is shared with, and to the note's
 * count of them, so the notes grid shows whether it's shared.
 */
export function updateCachedShares(
  queryClient: QueryClient,
  noteId: number,
  update: (shares: Share[]) => Share[],
) {
  const shares = queryClient.setQueryData(
    sharingQueries.list(noteId).queryKey,
    (shares) => shares && update(shares),
  )
  if (shares)
    updateCachedNotes(queryClient, {
      edit: (note) =>
        note.id === noteId ? { ...note, shareCount: shares.length } : note,
    })
}
