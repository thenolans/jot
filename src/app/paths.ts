export const paths = {
  landing: '/',
  login: '/login',
  register: '/register',
  notes: '/notes',
  /** A note, open over the notes grid. */
  note: '/notes/:noteId',
  /** A new note: the note route creates one, then swaps in its address. */
  newNote: '/notes/new',
  settings: '/settings',
} as const

export const notePath = (id: number) => `${paths.notes}/${id}`

/** Every note matching `query`. */
export const noteSearchPath = (query: string) =>
  `${paths.notes}?${new URLSearchParams({ q: query })}`

/** A folder's notes. */
export const folderNotesPath = (id: number) =>
  `${paths.notes}?${new URLSearchParams({ folder: String(id) })}`

/** The folder the notes grid is narrowed to, from its `folder` search param, or `null` for every note. */
export function folderIdParam(searchParams: URLSearchParams) {
  const folderId = Number(searchParams.get('folder'))
  return Number.isInteger(folderId) && folderId > 0 ? folderId : null
}

/** Router state a link to a note can pass. */
export type NotePageState = {
  /** Opened from the notes grid, so closing the note goes back to it. */
  fromList?: boolean
  /** For a new note, the folder to create it in. */
  folderId?: number | null
  /** For a new note, the title to start it with. */
  title?: string
  /** Created by opening `paths.newNote`, so closing it while it's still empty deletes it. */
  isNew?: boolean
}
