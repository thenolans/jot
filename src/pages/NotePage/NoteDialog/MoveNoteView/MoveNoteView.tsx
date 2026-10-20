import Button from '@/components/ui/Button'
import ErrorRetry from '@/components/ui/ErrorRetry'
import ModalSubview from '@/components/ui/ModalSubview'
import FolderPicker, { pickedFolderId } from '@/features/folders/FolderPicker'
import { useFolders } from '@/features/folders/useFolders'
import type { Note } from '@/features/notes/types'
import { useMoveNote } from '@/features/notes/useMoveNote'
import { useFormAction } from '@/hooks/useFormAction'

type MoveNoteViewProps = {
  note: Note
  /** Goes back to the note, as moving it does once it's moved. */
  onBack: () => void
  className?: string
}

const fields = ['folderId'] as const

/** Picks the folder to move the note to, in place of it in the dialog. */
export default function MoveNoteView({
  note,
  onBack,
  className,
}: MoveNoteViewProps) {
  const { folders, isLoading, error, reload } = useFolders()
  const { mutate: move } = useMoveNote()
  // It moves straight away, online or off, so there's nothing to wait for.
  const [, formAction] = useFormAction(fields, async ({ folderId }) => {
    const to = pickedFolderId(folderId)
    if (to !== note.folderId) move({ id: note.id, folderId: to })
    onBack()
  })

  return (
    <ModalSubview
      title={note.title ? `Move “${note.title}”` : 'Move note'}
      onBack={onBack}
      className={className}
    >
      {folders ? (
        <form action={formAction} className="flex flex-col gap-4">
          <FolderPicker
            name="folderId"
            label="Move to"
            folders={folders}
            current={note.folderId}
            noneLabel="No folder"
          />
          <Button type="submit" block>
            Move note
          </Button>
        </form>
      ) : isLoading ? (
        <p role="status" className="text-muted">
          Loading folders…
        </p>
      ) : (
        error && <ErrorRetry onRetry={reload}>{error}</ErrorRetry>
      )}
    </ModalSubview>
  )
}
