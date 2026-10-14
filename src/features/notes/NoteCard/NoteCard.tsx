import { useId } from 'react'
import { Link, type LinkProps } from 'react-router'

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

type NoteCardProps = Omit<LinkProps, 'children'> & {
  note: Note
}

/**
 * A note in the grid, linking to it: its title, if it has one, and the start of its text, without the
 * markdown.
 */
export default function NoteCard({ note, className, ...props }: NoteCardProps) {
  const preview = notePreview(note.content)
  const titleId = useId()
  const previewId = useId()

  // The link is named by the title, with the preview read after it, since browsers don't name a link
  // from what's inside an article. An untitled note is named by its preview.
  return (
    <Link
      aria-labelledby={note.title ? titleId : preview ? previewId : undefined}
      aria-describedby={note.title && preview ? previewId : undefined}
      aria-label={note.title || preview ? undefined : 'Empty note'}
      className={cx(
        'group block rounded-sm outline-none focus-visible:shadow-focus',
        className,
      )}
      {...props}
    >
      <Card
        as="article"
        className="p-6 transition-colors group-hover:border-accent-mid"
      >
        {note.title && (
          <Heading
            as="h2"
            variant="card"
            id={titleId}
            className="mb-2 break-words"
          >
            {note.title}
          </Heading>
        )}
        {preview && (
          <p
            id={previewId}
            className={cx(
              'text-sm leading-relaxed break-words whitespace-pre-wrap text-ink',
              lineClampClassNames[previewLines(preview)],
            )}
          >
            {preview}
          </p>
        )}
      </Card>
    </Link>
  )
}
