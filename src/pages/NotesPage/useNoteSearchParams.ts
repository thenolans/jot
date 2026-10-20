import { type To, useSearchParams } from 'react-router'

import {
  folderIdParam,
  type NotePageState,
  notePath,
  notesViewParams,
  paths,
  sharedParam,
  unfiledParam,
} from '@/app/paths'
import { viewFilters } from '@/features/notes/viewFilters'

/**
 * The note filters and page, kept in the URL (`?q=…&folder=…&page=…`, or `unfiled=1` or `shared=1` in
 * place of a folder) so they survive reloads and can be linked to.
 */
export function useNoteSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = viewFilters({
    query: searchParams.get('q')?.trim() ?? '',
    folderId: folderIdParam(searchParams),
    unfiled: unfiledParam(searchParams),
    shared: sharedParam(searchParams),
  })
  const pageParam = Number(searchParams.get('page'))
  const page = Number.isInteger(pageParam) && pageParam > 1 ? pageParam : 1

  const updateParams = (
    update: (current: URLSearchParams) => URLSearchParams,
  ) => setSearchParams(update, { replace: true })

  return {
    /** The filters for `useNotes`. */
    filters,
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
      state: {
        fromList: true,
        folderId: filters.folderId,
      } satisfies NotePageState,
      preventScrollReset: true,
    },
    clearFilters: () =>
      updateParams((current) => {
        const next = notesViewParams(current)
        next.delete('q')
        return next
      }),
    /** Drops the search, staying in the folder shown. */
    clearQuery: () =>
      updateParams((current) => {
        const next = new URLSearchParams(current)
        next.delete('q')
        next.delete('page')
        return next
      }),
    /** Shows every folder's notes, keeping the search. */
    clearFolder: () => updateParams((current) => notesViewParams(current)),
  }
}
