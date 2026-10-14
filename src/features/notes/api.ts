import { api, type Page, rekeyFieldErrors, withQuery } from '@/lib/api'

import type { NewNote, Note, NoteChanges, NoteFilters } from './types'

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

/** One of the signed-in user's notes. Fails with a 404 when there's no such note, or it isn't theirs. */
export async function fetchNote(id: number): Promise<Note> {
  return toNote(await api.get<NoteResponse>(`/jot/notes/${id}/`))
}

/** Changes a note's title or text, returning it as saved. */
export async function updateNote(
  id: number,
  changes: NoteChanges,
): Promise<Note> {
  return toNote(await api.patch<NoteResponse>(`/jot/notes/${id}/`, changes))
}

/** Moves a note into a folder, or out of any for `null`, returning it as saved. */
export async function moveNote(
  id: number,
  folderId: number | null,
): Promise<Note> {
  try {
    return toNote(
      await api.patch<NoteResponse>(`/jot/notes/${id}/`, {
        folder_id: folderId,
      }),
    )
  } catch (error) {
    throw rekeyFieldErrors(error, { folder_id: 'folderId' })
  }
}

/** Creates a note for the signed-in user, returning it as saved. */
export async function createNote({
  title,
  content,
  folderId,
}: NewNote): Promise<Note> {
  return toNote(
    await api.post<NoteResponse>('/jot/notes/', {
      title,
      content,
      folder_id: folderId,
    }),
  )
}

/** Deletes one of the signed-in user's notes. */
export async function deleteNote(id: number): Promise<void> {
  await api.delete(`/jot/notes/${id}/`)
}
