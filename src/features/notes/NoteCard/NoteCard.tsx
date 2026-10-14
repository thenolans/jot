import { useId } from 'react'
import { Link, type LinkProps } from 'react-router'

import UsersIcon from '@/components/icons/UsersIcon'
import Card from '@/components/ui/Card'
import Heading from '@/components/ui/Heading'
import { displayName } from '@/features/auth/displayName'
import UserAvatar from '@/features/auth/UserAvatar'
import { cx } from '@/lib/cx'
import { plural } from '@/lib/plural'

import { isSharedByUser, isSharedWithUser } from '../access'
import NoteMarkdown from '../NoteMarkdown'
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
 * A note in the grid, linking to it: its title, if it has one, and the start of its text, rendered from
 * its markdown. A note shared with the user has the avatar of whoever shared it in its corner, and one
 * the user has shared has an icon of two people there.
 */
export default function NoteCard({ note, className, ...props }: NoteCardProps) {
  const preview = notePreview(note.content)
  const titleId = useId()
  const previewId = useId()
  const sharingId = useId()
  const sharing = isSharedWithUser(note)
    ? `Shared by ${displayName(note.owner)}`
    : isSharedByUser(note)
      ? `Shared with ${plural(note.shareCount, 'person', 'people')}`
      : null
  const describedBy = [note.title && preview && previewId, sharing && sharingId]
    .filter(Boolean)
    .join(' ')

  // The link is named by the title, with the preview read after it, since browsers don't name a link
  // from what's inside an article. An untitled note is named by its preview.
  return (
    <Link
      aria-labelledby={note.title ? titleId : preview ? previewId : undefined}
      aria-describedby={describedBy || undefined}
      aria-label={note.title || preview ? undefined : 'Empty note'}
      className={cx(
        'group block rounded-sm outline-none focus-visible:shadow-focus',
        className,
      )}
      {...props}
    >
      <Card
        as="article"
        className="relative p-6 transition-colors group-hover:border-accent-mid"
      >
        {sharing && (
          <span title={sharing} className="absolute top-6 right-6">
            {isSharedWithUser(note) ? (
              <UserAvatar user={note.owner} className="size-6 text-xs" />
            ) : (
              <span
                aria-hidden="true"
                className="grid size-6 place-items-center rounded-full border border-accent-soft-border bg-accent-soft text-accent"
              >
                <UsersIcon size={16} />
              </span>
            )}
            <span id={sharingId} className="sr-only">
              {sharing}
            </span>
          </span>
        )}
        {note.title && (
          <Heading
            as="h2"
            variant="card"
            id={titleId}
            // Clears the icon in the corner.
            className={cx('mb-2 break-words', sharing && 'pr-8')}
          >
            {note.title}
          </Heading>
        )}
        {preview && (
          <NoteMarkdown
            id={previewId}
            variant="preview"
            content={note.content}
            className={cx(
              'text-sm',
              lineClampClassNames[previewLines(preview)],
              sharing && !note.title && 'pr-8',
            )}
          />
        )}
      </Card>
    </Link>
  )
}
