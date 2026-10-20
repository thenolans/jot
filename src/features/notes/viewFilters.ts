import type { NoteFilters } from './types'

/** One of the notes grid's views (a folder, the unfiled notes, those shared with the user, or all of them), plus a search. */
export type NotesViewFilters = {
  query?: string
  folderId?: number | null
  unfiled?: boolean
  /** The view of notes shared with the user. */
  shared?: boolean
}

/**
 * The note list filters for a view of the grid. All leaves out the notes shared with the user, since
 * they have a view of their own, but a search of all the notes takes them in too.
 */
export function viewFilters({
  query = '',
  folderId = null,
  unfiled = false,
  shared = false,
}: NotesViewFilters): Required<NoteFilters> {
  const isAll = folderId === null && !unfiled && !shared
  return {
    query,
    folderId,
    unfiled,
    shared: shared || (isAll && !query ? false : null),
  }
}
