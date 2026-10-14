import { useParams } from 'react-router'

/**
 * The `:noteId` route param as a note id (negative for a note made offline), `'new'` for a note to create
 * (`paths.newNote`), or `undefined` when it's neither.
 */
export function useNoteIdParam() {
  const param = useParams().noteId
  if (param === 'new') return 'new'
  const noteId = Number(param)
  return Number.isInteger(noteId) && noteId !== 0 ? noteId : undefined
}
