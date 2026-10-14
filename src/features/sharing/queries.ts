import { queryOptions } from '@tanstack/react-query'

import { fetchShares } from './api'

/** Query definitions for sharing. Keys nest under `['sharing']`. */
export const sharingQueries = {
  all: () => ['sharing'] as const,

  /** Who one of the user's notes is shared with. */
  list: (noteId: number) =>
    queryOptions({
      queryKey: [...sharingQueries.all(), 'note', noteId] as const,
      queryFn: () => fetchShares(noteId),
    }),
}
