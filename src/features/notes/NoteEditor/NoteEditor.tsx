import { useRef, useState } from 'react'
import { flushSync } from 'react-dom'

import ArrowRightIcon from '@/components/icons/ArrowRightIcon'
import EyeIcon from '@/components/icons/EyeIcon'
import PencilIcon from '@/components/icons/PencilIcon'
import PinIcon from '@/components/icons/PinIcon'
import ShareIcon from '@/components/icons/ShareIcon'
import TrashIcon from '@/components/icons/TrashIcon'
import Button from '@/components/ui/Button'
import CloseButton from '@/components/ui/CloseButton'
import Eyebrow from '@/components/ui/Eyebrow'
import Menu, { MenuDivider, MenuItem } from '@/components/ui/Menu'
import SegmentedControl from '@/components/ui/SegmentedControl'
import { firstName } from '@/features/auth/displayName'
import UserAvatar from '@/features/auth/UserAvatar'
import { cx } from '@/lib/cx'

import { canEditNote, isSharedWithUser, sharedByLabel } from '../access'
import NoteBodyInput from '../NoteBodyInput'
import NoteMarkdown from '../NoteMarkdown'
import PinButton from '../PinButton'
import type { Note } from '../types'
import { usePinNote } from '../usePinNote'
import { useNoteAutosave } from './useNoteAutosave'
import { useNoteSaveStatus } from './useNoteSaveStatus'

type Mode = 'read' | 'edit'

const modeOptions = [
  { value: 'read', label: 'Read', icon: <EyeIcon /> },
  { value: 'edit', label: 'Edit', icon: <PencilIcon /> },
] as const

// Shared to view, the title is a heading in place of the input, styled alike.
const titleClassName =
  'min-w-0 flex-1 bg-transparent font-display text-xl font-bold text-ink-strong outline-none placeholder:text-faint focus-visible:shadow-none'

/** "Oct 14", or "Oct 14, 2025" when it's not this year. */
function formatDate(date: string) {
  const day = new Date(date)
  return day.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year:
      day.getFullYear() === new Date().getFullYear() ? undefined : 'numeric',
  })
}

type NoteEditorProps = {
  note: Note
  /** Called by the close and Done buttons. */
  onDone: () => void
  /** Called by Share in the note's menu, to pick who to share it with. */
  onShare: () => void
  /** Called by Move in the note's menu, to pick a folder. */
  onMove: () => void
  /** Called by Delete in the note's menu, to confirm it. */
  onDelete: () => void
  /** Just created: the text takes focus, and closing the note with nothing written deletes it. */
  isNew?: boolean
  /**
   * The note is being refreshed since it was opened, so it may have been edited elsewhere: the title and
   * text can't be edited until it's back, so nothing typed is based on an older version.
   */
  isChecking?: boolean
  className?: string
}

/**
 * A note open to read or edit: its title, editable in either mode, then its text, rendered from its
 * markdown to read or as markdown to edit. Changes save as they're typed, so there's nothing to submit.
 * Its owner can pin it from the button beside the title or from its menu. A note shared with the user
 * says who shared it, in place of the menu (only its owner can pin, share, move or delete it), and one
 * they can only view stays in read mode.
 */
export default function NoteEditor({
  note,
  onDone,
  onShare,
  onMove,
  onDelete,
  isNew = false,
  isChecking = false,
  className,
}: NoteEditorProps) {
  const canEdit = canEditNote(note)
  const [chosenMode, setMode] = useState<Mode>('edit')
  const mode = canEdit ? chosenMode : 'read'
  const [draft, change] = useNoteAutosave(note, isNew)
  const saveStatus = useNoteSaveStatus(note.id)
  const { mutate: pinNote } = usePinNote()
  const togglePin = () => pinNote({ id: note.id, isPinned: !note.isPinned })
  const bodyRef = useRef<HTMLTextAreaElement>(null)

  const startWriting = () => {
    flushSync(() => setMode('edit'))
    bodyRef.current?.focus()
  }

  const statusText = () => {
    if (!canEdit) return 'View only'
    if (isChecking) return 'Checking for changes…'
    if (saveStatus === 'saving') return 'Saving…'
    if (saveStatus === 'waiting') return "Saves when you're back online"
    if (saveStatus === 'failed')
      return "Couldn't save. Keep typing to try again."
    return `${note.isPinned ? 'Pinned · ' : ''}Edited ${formatDate(note.updatedAt)}`
  }

  // The title and text are borderless, like the page they're written on, and their caret marks focus,
  // so they go without the focus ring.
  return (
    <div className={cx('flex min-h-0 flex-col', className)}>
      <div className="flex items-center gap-4 px-6">
        {canEdit ? (
          <input
            name="title"
            aria-label="Title"
            value={draft.title}
            readOnly={isChecking}
            onChange={(event) => change({ title: event.target.value })}
            maxLength={255}
            placeholder="Title"
            className={titleClassName}
          />
        ) : (
          <h2
            className={cx(
              titleClassName,
              'truncate',
              !note.title && 'text-faint',
            )}
          >
            {note.title || 'Untitled'}
          </h2>
        )}
        {canEdit && (
          <SegmentedControl
            label="Show the note"
            options={modeOptions}
            value={mode}
            onChange={setMode}
            iconsOnlyOnPhones
            className="flex-none"
          />
        )}
        {!isSharedWithUser(note) && <PinButton size="lg" note={note} />}
        <CloseButton onClick={onDone} />
      </div>

      {mode === 'edit' ? (
        <NoteBodyInput
          ref={bodyRef}
          autoFocus={isNew}
          name="content"
          aria-label="Note"
          value={draft.content}
          readOnly={isChecking}
          onChange={(event) => change({ content: event.target.value })}
          placeholder="Write in markdown…"
          className="field-sizing-content min-h-0 flex-1 resize-none bg-transparent px-6 py-4 leading-relaxed text-ink outline-none placeholder:text-faint focus-visible:shadow-none"
        />
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4 text-ink">
          {draft.content.trim() ? (
            <NoteMarkdown content={draft.content} />
          ) : !canEdit ? (
            <p className="text-faint italic">Empty note.</p>
          ) : (
            <button
              type="button"
              onClick={startWriting}
              className="cursor-text text-faint italic"
            >
              Empty note. Switch to Edit to start writing.
            </button>
          )}
        </div>
      )}

      {/* The note's actions sit on the left, the status beside Done on the right. */}
      <div className="flex items-center gap-4 border-t border-border-soft px-6 py-4">
        {isSharedWithUser(note) ? (
          <p
            title={sharedByLabel(note)}
            className="flex min-w-0 items-center gap-2 text-sm text-muted"
          >
            <UserAvatar user={note.owner} className="size-6 text-xs" />
            <span className="truncate">
              <span className="sr-only">Shared by </span>
              <span aria-hidden="true">From </span>
              {firstName(note.owner)}
            </span>
          </p>
        ) : (
          <Menu label="Note actions" placement="top start" className="-ml-2">
            <MenuItem icon={<PinIcon />} onAction={togglePin}>
              {note.isPinned ? 'Unpin' : 'Pin to top'}
            </MenuItem>
            <MenuItem icon={<ShareIcon />} onAction={onShare}>
              Share…
            </MenuItem>
            <MenuItem icon={<ArrowRightIcon />} onAction={onMove}>
              Move to…
            </MenuItem>
            <MenuDivider />
            <MenuItem variant="danger" icon={<TrashIcon />} onAction={onDelete}>
              Delete note
            </MenuItem>
          </Menu>
        )}
        <Eyebrow
          as="p"
          role="status"
          className={cx(
            'flex-1 text-right',
            saveStatus === 'failed' && 'text-danger',
          )}
        >
          {statusText()}
        </Eyebrow>
        <Button onClick={onDone} className="flex-none">
          Done
        </Button>
      </div>
    </div>
  )
}
