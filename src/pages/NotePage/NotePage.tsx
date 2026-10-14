import { Navigate, useLocation, useNavigate } from 'react-router'

import { type NotePageState, paths } from '@/app/paths'

import NoteDialog from './NoteDialog'
import { useNoteIdParam } from './useNoteIdParam'

/** A note, open over the notes grid to read or edit. Closing it goes back to the grid. */
export default function NotePage() {
  const noteId = useNoteIdParam()
  const navigate = useNavigate()
  const { search, state } = useLocation()
  const backToList = { pathname: paths.notes, search }

  if (noteId === undefined) return <Navigate to={backToList} replace />

  // Opened from the grid, closing goes back, so Back doesn't reopen the note; from a link, it swaps
  // the note for the grid.
  const close = () => {
    if ((state as NotePageState | null)?.fromList) navigate(-1)
    else navigate(backToList, { replace: true, preventScrollReset: true })
  }

  return <NoteDialog key={noteId} noteId={noteId} onClose={close} />
}
