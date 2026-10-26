import type { Person } from '@/features/auth/types'
import {
  api,
  ApiError,
  type Page,
  rekeyFieldErrors,
  withQuery,
} from '@/lib/api'

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
  is_pinned: boolean
  is_checklist: boolean
  revision: number
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
    isPinned: response.is_pinned,
    isChecklist: response.is_checklist,
    revision: response.revision,
    createdAt: response.created_at,
    updatedAt: response.updated_at,
  }
}

/** The longest title the API takes. */
export const NOTE_TITLE_MAX_LENGTH = 255

/** Notes per page of the list. Divides evenly into 2 or 3 columns. */
export const NOTE_PAGE_SIZE = 24

/**
 * One page of the signed-in user's notes and those shared with them, most recently edited first, with
 * their pinned notes ahead of the rest (except in a search). Without a folder, notes in private folders
 * are left out. Fails with a 404 past the last page.
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

/** Changes the given fields of a note, returning it as saved. */
async function patchNote(id: number, body: object): Promise<Note> {
  return toNote(await api.patch<NoteResponse>(`/jot/notes/${id}/`, body))
}

/**
 * Changes a note's title, text or whether it's a checklist, returning it as saved. Given the `revision` the
 * changes are based on, it fails with a 409 (`isEditedElsewhere`) when the note has been edited since.
 */
export function updateNote(
  id: number,
  { isChecklist, ...changes }: NoteChanges,
  revision?: number,
): Promise<Note> {
  return patchNote(id, { ...changes, is_checklist: isChecklist, revision })
}

/** Whether a save failed because the note has been edited since the revision it was based on. */
export function isEditedElsewhere(error: unknown) {
  return error instanceof ApiError && error.status === 409
}

/** Moves a note into a folder, or out of any for `null`, returning it as saved. */
export async function moveNote(
  id: number,
  folderId: number | null,
): Promise<Note> {
  try {
    return await patchNote(id, { folder_id: folderId })
  } catch (error) {
    throw rekeyFieldErrors(error, { folder_id: 'folderId' })
  }
}

/** Pins one of the signed-in user's own notes ahead of the rest, or unpins it, returning it as saved. */
export function pinNote(id: number, isPinned: boolean): Promise<Note> {
  return patchNote(id, { is_pinned: isPinned })
}

/** Creates a note for the signed-in user, returning it as saved. */
export async function createNote({
  title,
  content,
  folderId,
  isChecklist,
}: NewNote): Promise<Note> {
  return toNote(
    await api.post<NoteResponse>('/jot/notes/', {
      title,
      content,
      folder_id: folderId,
      is_checklist: isChecklist,
    }),
  )
}

/** Deletes one of the signed-in user's own notes. */
export async function deleteNote(id: number): Promise<void> {
  await api.delete(`/jot/notes/${id}/`)
}
