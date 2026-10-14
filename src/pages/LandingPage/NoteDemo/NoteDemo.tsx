import { useState } from 'react'

import Card from '@/components/ui/Card'
import SegmentedControl from '@/components/ui/SegmentedControl'
import NoteBodyInput from '@/features/notes/NoteBodyInput'
import NoteMarkdown from '@/features/notes/NoteMarkdown'
import { cx } from '@/lib/cx'

type Mode = 'read' | 'edit'

const MODES: ReadonlyArray<{ value: Mode; label: string }> = [
  { value: 'read', label: 'Read' },
  { value: 'edit', label: 'Edit' },
]

const SAMPLE_BODY = `# Jot

A dead-simple markdown note. It supports:

- **Bold** and *italics*
- Bullet and numbered lists
- \`inline code\`

Edit this, then switch to Read to see it render.`

// The body's padding and type, shared by writing and reading so switching doesn't shift the text.
// Phones get 16px text (`text-lg`), since iOS zooms into a focused input whose text is smaller.
const bodyClassName =
  'min-h-0 flex-1 p-4 text-lg leading-relaxed text-muted sm:text-base'

/** A note to write in and read back, to show what writing in Jot is like. Nothing is saved. */
export default function NoteDemo() {
  const [title, setTitle] = useState('Try it')
  const [body, setBody] = useState(SAMPLE_BODY)
  const [mode, setMode] = useState<Mode>('edit')

  return (
    // A fixed height keeps the card from resizing between writing and reading.
    <Card
      as="section"
      className="flex h-116 w-full max-w-sm flex-col overflow-hidden rounded-md shadow-raised"
      aria-label="Try it: write a note"
    >
      <div className="flex flex-none items-center gap-2 border-b border-border-soft p-4">
        <input
          aria-label="Title"
          placeholder="Untitled"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="min-w-0 flex-1 bg-transparent font-display text-lg font-bold text-ink-strong placeholder:text-faint focus-visible:shadow-none"
        />
        <SegmentedControl
          label="Mode"
          options={MODES}
          value={mode}
          onChange={setMode}
        />
      </div>

      {mode === 'edit' ? (
        <NoteBodyInput
          aria-label="Note"
          placeholder="Write in markdown…"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          className={cx(
            bodyClassName,
            'resize-none bg-transparent placeholder:text-faint focus-visible:shadow-none',
          )}
        />
      ) : body.trim() ? (
        <NoteMarkdown
          content={body}
          className={cx(bodyClassName, 'overflow-y-auto')}
        />
      ) : (
        <p className={cx(bodyClassName, 'text-faint italic')}>
          Nothing here yet. Switch to Edit to start writing.
        </p>
      )}
    </Card>
  )
}
