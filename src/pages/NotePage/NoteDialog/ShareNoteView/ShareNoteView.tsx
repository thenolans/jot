import Button from '@/components/ui/Button'
import ModalSubview from '@/components/ui/ModalSubview'
import type { Note } from '@/features/notes/types'
import ShareInviteForm from '@/features/sharing/ShareInviteForm'
import ShareList from '@/features/sharing/ShareList'
import { useIsOnline } from '@/hooks/useIsOnline'
import { isLocalId } from '@/lib/localIds'

type ShareNoteViewProps = {
  note: Note
  /** Goes back to the note. */
  onBack: () => void
  className?: string
}

/**
 * Who the note is shared with, and a form to share it with someone else, in place of the note in the
 * dialog. Each change saves as it's made, so Done just goes back. Sharing needs the API, so it waits
 * until the note is saved and the connection is back.
 */
export default function ShareNoteView({
  note,
  onBack,
  className,
}: ShareNoteViewProps) {
  const isOnline = useIsOnline()

  return (
    <ModalSubview
      title={note.title ? `Share “${note.title}”` : 'Share note'}
      onBack={onBack}
      className={className}
    >
      {isLocalId(note.id) || !isOnline ? (
        <p className="text-base text-muted">
          Sharing needs a connection. You can share this note once you're back
          online.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          <ShareInviteForm noteId={note.id} />
          <ShareList noteId={note.id} />
        </div>
      )}
      <Button block onClick={onBack}>
        Done
      </Button>
    </ModalSubview>
  )
}
