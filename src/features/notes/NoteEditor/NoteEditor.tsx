import { useRef, useState } from 'react'
import { flushSync } from 'react-dom'

import CloseIcon from '@/components/icons/CloseIcon'
import EyeIcon from '@/components/icons/EyeIcon'
import PencilIcon from '@/components/icons/PencilIcon'
import Button from '@/components/ui/Button'
import Eyebrow from '@/components/ui/Eyebrow'
import IconButton from '@/components/ui/IconButton'
import SegmentedControl from '@/components/ui/SegmentedControl'
import { cx } from '@/lib/cx'

import NoteBodyInput from '../NoteBodyInput'
import NoteMarkdown from '../NoteMarkdown'
import type { Note } from '../types'
import { useNoteAutosave } from './useNoteAutosave'
import { useNoteSaveStatus } from './useNoteSaveStatus'

type Mode = 'read' | 'edit'

const modeOptions = [
  { value: 'read', label: 'Read', icon: <EyeIcon /> },
  { value: 'edit', label: 'Edit', icon: <PencilIcon /> },
] as const

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
  className?: string
}

/**
 * A note open to read or edit: its title, editable in either mode, then its text, rendered from its
 * markdown to read or as markdown to edit. Changes save as they're typed, so there's nothing to submit.
 */
export default function NoteEditor({
  note,
  onDone,
  className,
}: NoteEditorProps) {
  const [mode, setMode] = useState<Mode>('edit')
  const [draft, change] = useNoteAutosave(note)
  const saveStatus = useNoteSaveStatus(note.id)
  const bodyRef = useRef<HTMLTextAreaElement>(null)

  const startWriting = () => {
    flushSync(() => setMode('edit'))
    bodyRef.current?.focus()
  }

  // The title and text are borderless, like the page they're written on, and their caret marks focus,
  // so they go without the focus ring.
  return (
    <div className={cx('flex min-h-0 flex-col', className)}>
      <div className="flex items-center gap-4 px-6">
        <input
          name="title"
          aria-label="Title"
          value={draft.title}
          onChange={(event) => change({ title: event.target.value })}
          maxLength={255}
          placeholder="Title"
          className="min-w-0 flex-1 bg-transparent font-display text-xl font-bold text-ink-strong outline-none placeholder:text-faint focus-visible:shadow-none"
        />
        <SegmentedControl
          label="Show the note"
          options={modeOptions}
          value={mode}
          onChange={setMode}
          iconsOnlyOnPhones
          className="flex-none"
        />
        <IconButton
          size="lg"
          onClick={onDone}
          aria-label="Close"
          className="-mr-2"
        >
          <CloseIcon size={20} />
        </IconButton>
      </div>

      {mode === 'edit' ? (
        <NoteBodyInput
          ref={bodyRef}
          name="content"
          aria-label="Note"
          value={draft.content}
          onChange={(event) => change({ content: event.target.value })}
          placeholder="Write in markdown…"
          className="field-sizing-content min-h-0 flex-1 resize-none bg-transparent px-6 py-4 leading-relaxed text-ink outline-none placeholder:text-faint focus-visible:shadow-none"
        />
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4 text-ink">
          {draft.content.trim() ? (
            <NoteMarkdown content={draft.content} />
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

      {/* The status sits beside Done, on the right, leaving the left for the note's actions. */}
      <div className="flex items-center justify-end gap-4 border-t border-border-soft px-6 py-4">
        <Eyebrow
          as="p"
          role="status"
          className={cx('text-right', saveStatus === 'failed' && 'text-danger')}
        >
          {saveStatus === 'saving'
            ? 'Saving…'
            : saveStatus === 'waiting'
              ? "Saves when you're back online"
              : saveStatus === 'failed'
                ? "Couldn't save. Keep typing to try again."
                : `Edited ${formatDate(note.updatedAt)}`}
        </Eyebrow>
        <Button onClick={onDone} className="flex-none">
          Done
        </Button>
      </div>
    </div>
  )
}
