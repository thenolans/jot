import { Navigate, useLocation, useNavigate } from 'react-router'

import { type NotePageState, notePath, paths } from '@/app/paths'

import NoteDialog from './NoteDialog'
import { useNoteIdParam } from './useNoteIdParam'

/**
 * A note, open over the notes grid to read or edit. Closing it goes back to the grid. At
 * `paths.newNote` it creates a note first, then swaps in that note's address.
 */
export default function NotePage() {
  const noteId = useNoteIdParam()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as NotePageState | null
  const backToList = { pathname: paths.notes, search: location.search }

  if (noteId === undefined) return <Navigate to={backToList} replace />

  // Opened from the grid, closing goes back, so Back doesn't reopen the note; from a link, it swaps
  // the note for the grid.
  const close = () => {
    if (state?.fromList) navigate(-1)
    else navigate(backToList, { replace: true, preventScrollReset: true })
  }

  const openCreated = (id: number) =>
    navigate(
      { pathname: notePath(id), search: location.search },
      {
        replace: true,
        state: { ...state, isNew: true } satisfies NotePageState,
        preventScrollReset: true,
      },
    )

  // A new note keeps the same dialog once it's created, rather than closing it and opening another.
  return (
    <NoteDialog
      key={state?.isNew ? 'new' : noteId}
      noteId={noteId}
      newNote={{ folderId: state?.folderId ?? null }}
      isNew={state?.isNew}
      onCreated={openCreated}
      onClose={close}
    />
  )
}
