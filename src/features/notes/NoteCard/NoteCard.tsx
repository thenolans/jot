import Card from '@/components/ui/Card'
import Heading from '@/components/ui/Heading'
import { cx } from '@/lib/cx'

import { notePreview, previewLines } from '../notePreview'
import type { Note } from '../types'

// Written out in full so Tailwind generates them.
const lineClampClassNames = {
  3: 'line-clamp-3',
  5: 'line-clamp-5',
  7: 'line-clamp-7',
  9: 'line-clamp-9',
}

type NoteCardProps = {
  note: Note
  className?: string
}

/** A note in the grid: its title, if it has one, and the start of its text, without the markdown. */
export default function NoteCard({ note, className }: NoteCardProps) {
  const preview = notePreview(note.content)

  return (
    <Card as="article" className={cx('p-6', className)}>
      {note.title && (
        <Heading as="h2" variant="card" className="mb-2 break-words">
          {note.title}
        </Heading>
      )}
      {preview && (
        <p
          className={cx(
            'text-sm leading-relaxed break-words whitespace-pre-wrap text-ink',
            lineClampClassNames[previewLines(preview)],
          )}
        >
          {preview}
        </p>
      )}
    </Card>
  )
}
