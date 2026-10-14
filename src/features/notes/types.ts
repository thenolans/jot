export type Note = {
  id: number
  /** `''` when the note has no title. */
  title: string
  /** The note's text, in markdown. */
  content: string
  /** The folder it's filed in, or `null` when it's in none. */
  folderId: number | null
  createdAt: string
  /** When it was last edited. */
  updatedAt: string
}

/** What the note list is narrowed to. */
export type NoteFilters = {
  /** Text to match in note titles and content. */
  query?: string
  /** The folder notes must be in (directly or in a folder inside it), or `null` for every note. */
  folderId?: number | null
}

/** What can be changed about a note from its editor. */
export type NoteChanges = Partial<Pick<Note, 'title' | 'content'>>
