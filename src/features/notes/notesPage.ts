import { privateFolderIds } from '@/features/folders/folderTree'
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
 * edited first, pinned notes ahead of the rest (except in a search), with a folder's notes only those filed directly in it, unfiled notes only the user's own
 * in no folder, and notes in private folders only in their folders. `null` past the last page.
 */
export function notesPage(
  notes: Note[],
  folders: Folder[],
  { query = '', folderId = null, unfiled = false, shared = null }: NoteFilters,
  page: number,
): Page<Note> | null {
  const lowerQuery = query.trim().toLowerCase()
  const hidden = folderId === null ? privateFolderIds(folders) : null
  const matches = notes
    .filter(
      (note) =>
        (folderId === null || note.folderId === folderId) &&
        !(unfiled && (note.folderId !== null || isSharedWithUser(note))) &&
        !(hidden && note.folderId !== null && hidden.has(note.folderId)) &&
        (shared === null || isSharedWithUser(note) === shared) &&
        (!lowerQuery || mentions(note, lowerQuery)),
    )
    .sort(
      (a, b) =>
        (lowerQuery ? 0 : Number(b.isPinned) - Number(a.isPinned)) ||
        Date.parse(b.updatedAt) - Date.parse(a.updatedAt) ||
        b.id - a.id,
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
