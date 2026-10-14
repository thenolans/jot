import TrashIcon from '@/components/icons/TrashIcon'
import Button from '@/components/ui/Button'
import ModalSubview from '@/components/ui/ModalSubview'
import type { Note } from '@/features/notes/types'

type DeleteNoteViewProps = {
  note: Note
  onBack: () => void
  onDelete: () => void
  className?: string
}

/** Asks whether to delete the note, in place of it in the dialog. */
export default function DeleteNoteView({
  note,
  onBack,
  onDelete,
  className,
}: DeleteNoteViewProps) {
  return (
    <ModalSubview title="Delete note" onBack={onBack} className={className}>
      <p className="text-base text-muted">
        {note.title ? `Delete “${note.title}”?` : 'Delete this note?'} This
        can't be undone.
      </p>
      <Button variant="danger" block onClick={onDelete}>
        <TrashIcon />
        Delete note
      </Button>
    </ModalSubview>
  )
}
