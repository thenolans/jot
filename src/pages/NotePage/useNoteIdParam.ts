import { useParams } from 'react-router'

/** The `:noteId` route param as a note id, or `undefined` when it isn't a valid one. */
export function useNoteIdParam() {
  const noteId = Number(useParams().noteId)
  return Number.isInteger(noteId) && noteId > 0 ? noteId : undefined
}
