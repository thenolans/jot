import { withDescendants } from '@/features/folders/folderTree'
import type { Folder } from '@/features/folders/types'
import type { Page } from '@/lib/api'

import { isSharedWithUser } from './access'
import { NOTE_PAGE_SIZE } from './api'
import type { Note, NoteFilters } from './types'

/** Whether `note` mentions `query` (already lowercase) in its title or text, ignoring case, as the API matches. */
const mentions = (note: Note, query: string) =>
  note.title.toLowerCase().includes(query) ||
  note.content.toLowerCase().includes(query)

/**
 * One page of `notes` matching `filters`, worked out on the device the way the API would: most recently
 * edited first, with a folder's notes including those in the folders inside it. `null` past the last page.
 */
export function notesPage(
  notes: Note[],
  folders: Folder[],
  { query = '', folderId = null, shared = null }: NoteFilters,
  page: number,
): Page<Note> | null {
  const lowerQuery = query.trim().toLowerCase()
  const inFolder = folderId === null ? null : withDescendants(folders, folderId)
  const matches = notes
    .filter(
      (note) =>
        (!inFolder ||
          (note.folderId !== null && inFolder.has(note.folderId))) &&
        (shared === null || isSharedWithUser(note) === shared) &&
        (!lowerQuery || mentions(note, lowerQuery)),
    )
    .sort(
      (a, b) =>
        Date.parse(b.updatedAt) - Date.parse(a.updatedAt) || b.id - a.id,
    )

  const start = (page - 1) * NOTE_PAGE_SIZE
  if (page > 1 && start >= matches.length) return null
  return {
    count: matches.length,
    // Only the API's pages link to others.
    next: null,
    previous: null,
    results: matches.slice(start, start + NOTE_PAGE_SIZE),
  }
}
