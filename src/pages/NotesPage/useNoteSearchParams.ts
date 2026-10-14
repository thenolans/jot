import { type To, useSearchParams } from 'react-router'

import {
  folderIdParam,
  type NotePageState,
  notePath,
  paths,
  sharedParam,
} from '@/app/paths'

/**
 * The note filters and page, kept in the URL (`?q=…&folder=…&page=…`, or `shared=1` in place of a folder)
 * so they survive reloads and can be linked to.
 */
export function useNoteSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q')?.trim() ?? ''
  const folderId = folderIdParam(searchParams)
  const shared = sharedParam(searchParams)
  const pageParam = Number(searchParams.get('page'))
  const page = Number.isInteger(pageParam) && pageParam > 1 ? pageParam : 1

  // Changing the filters starts again from the first page.
  const updateFilters = (changes: Record<string, string | null>) =>
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current)
        next.delete('page')
        for (const [key, value] of Object.entries(changes)) {
          if (value) next.set(key, value)
          else next.delete(key)
        }
        return next
      },
      { replace: true },
    )

  return {
    query,
    folderId,
    /** Showing the notes shared with the user. */
    shared,
    page,
    /** The list at `page`, with the same filters. */
    pageTo: (page: number): To => {
      const next = new URLSearchParams(searchParams)
      if (page > 1) next.set('page', String(page))
      else next.delete('page')
      return { search: next.toString() }
    },
    /** A note, open over the list with the same filters and page. */
    noteTo: (id: number): To => ({
      pathname: notePath(id),
      search: searchParams.toString(),
    }),
    /** Link props for a new note: it opens over the list, in the folder shown. */
    newNoteLink: {
      to: { pathname: paths.newNote, search: searchParams.toString() },
      state: { fromList: true, folderId } satisfies NotePageState,
      preventScrollReset: true,
    },
    clearFilters: () => updateFilters({ q: null, folder: null, shared: null }),
    /** Drops the search, staying in the folder shown. */
    clearQuery: () => updateFilters({ q: null }),
    /** Shows every folder's notes, keeping the search. */
    clearFolder: () => updateFilters({ folder: null }),
  }
}
