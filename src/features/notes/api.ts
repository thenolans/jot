import type { Person } from '@/features/auth/types'
import { api, type Page, rekeyFieldErrors, withQuery } from '@/lib/api'

import type {
  NewNote,
  Note,
  NoteAccess,
  NoteChanges,
  NoteFilters,
} from './types'

/** A note as the API sends it. */
type NoteResponse = {
  id: number
  title: string
  content: string
  folder_id: number | null
  access: NoteAccess
  owner: Person
  share_count: number
  created_at: string
  updated_at: string
}

function toNote(response: NoteResponse): Note {
  return {
    id: response.id,
    title: response.title,
    content: response.content,
    folderId: response.folder_id,
    access: response.access,
    owner: response.owner,
    shareCount: response.share_count,
    createdAt: response.created_at,
    updatedAt: response.updated_at,
  }
}

/** Notes per page of the list. Divides evenly into 2 or 3 columns. */
export const NOTE_PAGE_SIZE = 24

/**
 * One page of the signed-in user's notes and those shared with them, most recently edited first. Without
 * a folder, notes in private folders are left out. Fails with a 404 past the last page.
 */
export async function fetchNotes(
  { query, folderId, unfiled, shared }: NoteFilters,
  page = 1,
): Promise<Page<Note>> {
  const response = await api.get<Page<NoteResponse>>(
    withQuery('/jot/notes/', {
      q: query,
      folder_id: folderId,
      unfiled: unfiled || null,
      shared,
      page: page > 1 ? page : null,
      page_size: NOTE_PAGE_SIZE,
    }),
  )
  return { ...response, results: response.results.map(toNote) }
}

/** Notes per request for every note: the most the API sends at once. */
const ALL_NOTES_PAGE_SIZE = 1000

/**
 * Every note the signed-in user has or has been shared, most recently edited first, to keep on the device,
 * including those in private folders.
 */
export async function fetchAllNotes(): Promise<Note[]> {
  const notes: Note[] = []
  for (let page = 1; ; page++) {
    const response = await api.get<Page<NoteResponse>>(
      withQuery('/jot/notes/', {
        include_private: true,
        page: page > 1 ? page : null,
        page_size: ALL_NOTES_PAGE_SIZE,
      }),
    )
    notes.push(...response.results.map(toNote))
    if (!response.next) return notes
  }
}

/** A note the signed-in user has or has been shared. Fails with a 404 when there's no such note, or they can't see it. */
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

/** Deletes one of the signed-in user's own notes. */
export async function deleteNote(id: number): Promise<void> {
  await api.delete(`/jot/notes/${id}/`)
}
