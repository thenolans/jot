import { api, type Page, withQuery } from '@/lib/api'

import type { Note, NoteFilters } from './types'

/** A note as the API sends it. */
type NoteResponse = {
  id: number
  title: string
  content: string
  folder_id: number | null
  created_at: string
  updated_at: string
}

function toNote(response: NoteResponse): Note {
  return {
    id: response.id,
    title: response.title,
    content: response.content,
    folderId: response.folder_id,
    createdAt: response.created_at,
    updatedAt: response.updated_at,
  }
}

/** Notes per page of the list. Divides evenly into 2 or 3 columns. */
export const NOTE_PAGE_SIZE = 24

/**
 * One page of the signed-in user's notes, most recently edited first. Fails with a 404 past the last
 * page.
 */
export async function fetchNotes(
  { query, folderId }: NoteFilters,
  page = 1,
): Promise<Page<Note>> {
  const response = await api.get<Page<NoteResponse>>(
    withQuery('/jot/notes/', {
      q: query,
      folder_id: folderId,
      page: page > 1 ? page : null,
      page_size: NOTE_PAGE_SIZE,
    }),
  )
  return { ...response, results: response.results.map(toNote) }
}
