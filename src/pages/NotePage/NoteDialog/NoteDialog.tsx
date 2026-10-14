import { useRef } from 'react'

import CloseIcon from '@/components/icons/CloseIcon'
import Button from '@/components/ui/Button'
import ErrorRetry from '@/components/ui/ErrorRetry'
import Heading from '@/components/ui/Heading'
import IconButton from '@/components/ui/IconButton'
import ModalShell, {
  closeModal,
  useModalView,
} from '@/components/ui/ModalShell'
import SheetHandle from '@/components/ui/SheetHandle'
import Skeleton from '@/components/ui/Skeleton'
import NoteEditor from '@/features/notes/NoteEditor'
import type { NewNote } from '@/features/notes/types'
import { useDeleteNote } from '@/features/notes/useDeleteNote'
import { useNote } from '@/features/notes/useNote'
import { cx } from '@/lib/cx'

import DeleteNoteView from './DeleteNoteView'
import MoveNoteView from './MoveNoteView'
import { useCreateOnOpen } from './useCreateOnOpen'

type NoteDialogProps = {
  /** The note to open, or `'new'` to create one. */
  noteId: number | 'new'
  /** What a new note starts with. */
  newNote: NewNote
  /** Called with a new note's id once it's created, to open it. */
  onCreated: (id: number) => void
  /** The note was just created, so closing it with nothing written deletes it. */
  isNew?: boolean
  /** Called once it has closed, so it can be removed. */
  onClose: () => void
}

/**
 * The note in a modal panel. Below `md` it's a sheet that slides up from the bottom edge and fills the
 * screen below a gap; from `md` it's centered, growing with the note up to a limit, past which the note
 * scrolls. Its menu's actions open in the panel in place of the note, which shrinks to fit them.
 */
export default function NoteDialog({
  noteId,
  newNote,
  onCreated,
  isNew = false,
  onClose,
}: NoteDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const isCreating = noteId === 'new'
  const { note, isNotFound, isLoading, error, reload } = useNote(
    isCreating ? null : noteId,
  )
  useCreateOnOpen(isCreating ? newNote : null, onCreated)

  const { view, isMainView, show, back, viewClassName } = useModalView<
    'note' | 'move' | 'delete'
  >(dialogRef, 'note')
  const { mutate: deleteNote } = useDeleteNote()

  const close = () => closeModal(dialogRef.current)

  // The note is deleted once the dialog has closed, so it doesn't vanish from under the closing panel.
  const deleteAndClose = async (id: number) => {
    await close()
    deleteNote(id)
  }

  return (
    <ModalShell
      dialogRef={dialogRef}
      aria-label={
        view === 'delete'
          ? 'Delete note'
          : view === 'move'
            ? 'Move note'
            : note?.title || (isCreating || isNew ? 'New note' : 'Note')
      }
      onClose={onClose}
      onEscape={isMainView ? undefined : back}
      // The gap above the sheet leaves some of the grid in view, and a tap there closes it. Clip, not
      // hidden: hidden still scrolls to show the focused field, which cancels the slide.
      className="flex items-end justify-center overflow-clip pt-12 md:items-center md:p-4"
      // Showing the note, it fills the sheet, and at `md` and up it's at least tall enough to write in and
      // at most 720px; other views fit their content.
      panelClassName={cx(
        'flex max-h-full w-full flex-col max-md:rounded-b-none max-md:pb-safe-area max-md:motion-safe:animate-sheet-in max-md:motion-safe:in-data-closing:animate-sheet-out md:pt-4',
        isMainView
          ? 'max-md:h-full md:max-h-180 md:min-h-80 md:max-w-2xl'
          : 'md:max-w-md',
      )}
    >
      <SheetHandle onClick={close} className="flex-none" />

      {note ? (
        <>
          {/* Hidden rather than removed while another view shows, so it keeps what's typed. */}
          <NoteEditor
            note={note}
            onDone={close}
            onMove={() => show('move')}
            onDelete={() => show('delete')}
            isNew={isNew}
            className={cx('flex-1', viewClassName, !isMainView && 'hidden')}
          />
          {view === 'move' && (
            <MoveNoteView note={note} onBack={back} className={viewClassName} />
          )}
          {view === 'delete' && (
            <DeleteNoteView
              note={note}
              onBack={back}
              onDelete={() => deleteAndClose(note.id)}
              className={viewClassName}
            />
          )}
        </>
      ) : (
        <div className="flex flex-1 flex-col gap-4 px-6 pb-6">
          <IconButton
            size="lg"
            onClick={close}
            aria-label="Close"
            className="-mr-2 self-end"
          >
            <CloseIcon size={20} />
          </IconButton>
          {isLoading ? (
            <>
              <p role="status" className="sr-only">
                {isCreating ? 'Creating note' : 'Loading note'}
              </p>
              <div aria-hidden className="flex animate-pulse flex-col gap-4">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4" />
                <Skeleton className="h-4" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </>
          ) : isNotFound ? (
            <div className="flex flex-col items-start gap-4">
              <Heading as="h2" variant="subsection">
                This note isn't here
              </Heading>
              <p className="text-muted">
                It may have been deleted, or the link is wrong.
              </p>
              <Button onClick={close}>Back to notes</Button>
            </div>
          ) : (
            error && <ErrorRetry onRetry={reload}>{error}</ErrorRetry>
          )}
        </div>
      )}
    </ModalShell>
  )
}
