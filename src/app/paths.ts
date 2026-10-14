export const paths = {
  landing: '/',
  login: '/login',
  register: '/register',
  notes: '/notes',
  /** A note, open over the notes grid. */
  note: '/notes/:noteId',
  settings: '/settings',
} as const

export const notePath = (id: number) => `${paths.notes}/${id}`

/** Router state a link to a note can pass. */
export type NotePageState = {
  /** Opened from the notes grid, so closing the note goes back to it. */
  fromList?: boolean
}
