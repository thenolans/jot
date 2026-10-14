import { useRef } from 'react'

import CloseIcon from '@/components/icons/CloseIcon'
import Button from '@/components/ui/Button'
import ErrorRetry from '@/components/ui/ErrorRetry'
import Heading from '@/components/ui/Heading'
import IconButton from '@/components/ui/IconButton'
import ModalShell, { closeModal } from '@/components/ui/ModalShell'
import Skeleton from '@/components/ui/Skeleton'
import NoteEditor from '@/features/notes/NoteEditor'
import type { NewNote } from '@/features/notes/types'
import { useNote } from '@/features/notes/useNote'

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
 * scrolls.
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
  const { createError, retryCreate } = useCreateOnOpen(
    isCreating ? newNote : null,
    onCreated,
  )

  const close = () => closeModal(dialogRef.current)

  return (
    <ModalShell
      dialogRef={dialogRef}
      aria-label={note?.title || (isCreating || isNew ? 'New note' : 'Note')}
      onClose={onClose}
      // The gap above the sheet leaves some of the grid in view, and a tap there closes it. Clip, not
      // hidden: hidden still scrolls to show the focused field, which cancels the slide.
      className="flex items-end justify-center overflow-clip pt-12 md:items-center md:p-4"
      // At `md` and up it's at least tall enough to write in, and at most 720px, and it rises into place
      // rather than dropping in like a popover.
      panelClassName="flex max-h-full w-full flex-col md:min-h-80 md:max-w-2xl md:max-h-180 md:pt-4 md:motion-safe:animate-lift-in md:motion-safe:in-data-closing:animate-lift-out max-md:h-full max-md:rounded-b-none max-md:pb-safe-area max-md:motion-safe:animate-sheet-in max-md:motion-safe:in-data-closing:animate-sheet-out"
    >
      {/* A grab handle marks the sheet; it doesn't drag, so a press on it closes the sheet. */}
      <div
        aria-hidden
        onClick={close}
        className="flex flex-none cursor-pointer justify-center py-2 md:hidden"
      >
        <div className="h-1 w-10 rounded-full bg-border" />
      </div>

      {note ? (
        <NoteEditor
          note={note}
          onDone={close}
          isNew={isNew}
          className="flex-1"
        />
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
          {createError ? (
            <ErrorRetry onRetry={retryCreate}>{createError}</ErrorRetry>
          ) : isLoading ? (
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
