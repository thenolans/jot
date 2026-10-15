import type { Person } from '@/features/auth/types'

/** What the signed-in user can do with a note: anything as its owner, or what it was shared with them for. */
export type NoteAccess = 'owner' | 'edit' | 'view'

export type Note = {
  id: number
  /** `''` when the note has no title. */
  title: string
  /** The note's text, in markdown. */
  content: string
  /** The folder it's filed in, or `null` when it's in none or isn't the user's. */
  folderId: number | null
  access: NoteAccess
  /** Who the note belongs to: the user, or whoever shared it with them. */
  owner: Person
  /** How many people the user has shared their note with; 0 for a note shared with them. */
  shareCount: number
  createdAt: string
  /** When it was last edited. */
  updatedAt: string
}

/** What the note list is narrowed to. */
export type NoteFilters = {
  /** Text to match in note titles and content. */
  query?: string
  /**
   * The folder notes must be filed directly in (not in a folder inside it), or `null` for every note
   * outside the private folders.
   */
  folderId?: number | null
  /** Only notes shared with the user (`true`), only their own (`false`), or both (`null`). */
  shared?: boolean | null
}

/** What can be changed about a note from its editor. */
export type NoteChanges = Partial<Pick<Note, 'title' | 'content'>>

/** What a new note starts with; anything left out starts empty. */
export type NewNote = Partial<Pick<Note, 'title' | 'content' | 'folderId'>>
