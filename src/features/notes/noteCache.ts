import type { QueryClient } from '@tanstack/react-query'

import type { Page } from '@/lib/api'
import { isSameId } from '@/lib/localIds'

import { localList, noteQueries } from './queries'
import type { Note, NoteFilters } from './types'

type CacheChange = {
  /** Changes a note, or takes it out for `null`. */
  edit?: (note: Note) => Note | null
  /** A new note, to add. */
  add?: Note
}

/**
 * Shows a change to the user's notes everywhere they're cached, straight away: in the copy of every note,
 * in each note loaded on its own, and on each page of the list. The pages are worked out again from the
 * copy (so a note joins or leaves them as it would on the API), or without it, edited where they are.
 */
export function updateCachedNotes(
  queryClient: QueryClient,
  { edit = (note) => note, add }: CacheChange,
) {
  const editAll = (notes: Note[]) =>
    notes.map(edit).filter((note) => note !== null)

  queryClient.setQueryData(
    noteQueries.offlineCopy().queryKey,
    (notes) => notes && editAll(add ? [add, ...notes] : notes),
  )

  const cache = queryClient.getQueryCache()
  if (add) queryClient.setQueryData(noteQueries.detail(add.id).queryKey, add)
  for (const query of cache.findAll({ queryKey: noteQueries.details() })) {
    const note = query.state.data as Note | undefined
    if (!note) continue
    const edited = edit(note)
    if (edited) queryClient.setQueryData(query.queryKey, edited)
    else queryClient.removeQueries({ queryKey: query.queryKey, exact: true })
  }

  for (const query of cache.findAll({ queryKey: noteQueries.lists() })) {
    const page = query.state.data as Page<Note> | undefined
    if (!page) continue
    const { page: pageNumber, ...filters } = query
      .queryKey[2] as NoteFilters & {
      page: number
    }
    const results = editAll(page.results)
    queryClient.setQueryData(
      query.queryKey,
      localList(queryClient, filters, pageNumber) ?? {
        ...page,
        count: page.count - (page.results.length - results.length),
        results,
      },
    )
  }
}

/** The note with `id` as cached: in the copy of every note, as loaded on its own, or on a page of the list. */
export function findCachedNote(queryClient: QueryClient, id: number) {
  const isIt = (note: Note | undefined) => !!note && isSameId(note.id, id)
  const copies = [
    ...(queryClient.getQueryData(noteQueries.offlineCopy().queryKey) ?? []),
    ...queryClient
      .getQueriesData<Note>({ queryKey: noteQueries.details() })
      .map(([, note]) => note),
    ...queryClient
      .getQueriesData<Page<Note>>({ queryKey: noteQueries.lists() })
      .flatMap(([, page]) => page?.results ?? []),
  ]
  return copies.find(isIt)
}
