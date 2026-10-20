import { useId } from 'react'
import { Link, type LinkProps } from 'react-router'

import PinIcon from '@/components/icons/PinIcon'
import UsersIcon from '@/components/icons/UsersIcon'
import Card from '@/components/ui/Card'
import Heading from '@/components/ui/Heading'
import IconButton from '@/components/ui/IconButton'
import { displayName } from '@/features/auth/displayName'
import UserAvatar from '@/features/auth/UserAvatar'
import { cx } from '@/lib/cx'
import { plural } from '@/lib/plural'

import { isSharedByUser, isSharedWithUser } from '../access'
import NoteMarkdown from '../NoteMarkdown'
import { notePreview, previewLines } from '../notePreview'
import type { Note } from '../types'
import { usePinNote } from '../usePinNote'

// Written out in full so Tailwind generates them.
const lineClampClassNames = {
  3: 'line-clamp-3',
  5: 'line-clamp-5',
  7: 'line-clamp-7',
  9: 'line-clamp-9',
}

// Room for the icons in the top corner, by how many there are.
const cornerPaddingClassNames = ['', 'pr-8', 'pr-16']

type NoteCardProps = Omit<LinkProps, 'children'> & {
  note: Note
}

/**
 * A note in the grid, linking to it: its title, if it has one, and the start of its text, rendered from
 * its markdown. A note shared with the user has the avatar of whoever shared it in its corner, and one
 * the user has shared has an icon of two people there. The user's own notes have a pin button in the
 * corner, shown while the card is hovered or focused, or always once it's pinned. With a touch screen
 * there's no hover, so it shows only once pinned, as a mark that opens the note like the rest of the
 * card; notes are pinned from their menu instead.
 */
export default function NoteCard({ note, className, ...props }: NoteCardProps) {
  const { mutate: pinNote } = usePinNote()
  const canPin = !isSharedWithUser(note)
  const preview = notePreview(note.content)
  const titleId = useId()
  const previewId = useId()
  const sharingId = useId()
  const sharing = isSharedWithUser(note)
    ? `Shared by ${displayName(note.owner)}`
    : isSharedByUser(note)
      ? `Shared with ${plural(note.shareCount, 'person', 'people')}`
      : null
  const cornerPadding =
    cornerPaddingClassNames[Number(canPin) + Number(!!sharing)]
  const describedBy = [note.title && preview && previewId, sharing && sharingId]
    .filter(Boolean)
    .join(' ')

  // The link is named by the title, with the preview read after it, since browsers don't name a link
  // from what's inside an article. An untitled note is named by its preview.
  // The pin button sits beside the link rather than in it, since a link can't hold a button.
  return (
    <div className={cx('group relative', className)}>
      <Link
        aria-labelledby={note.title ? titleId : preview ? previewId : undefined}
        aria-describedby={describedBy || undefined}
        aria-label={note.title || preview ? undefined : 'Empty note'}
        className="block rounded-sm outline-none focus-visible:shadow-focus"
        {...props}
      >
        <Card
          as="article"
          className="relative p-6 transition-colors group-hover:border-accent-mid"
        >
          {sharing && (
            <span
              title={sharing}
              className={cx('absolute top-6', canPin ? 'right-14' : 'right-6')}
            >
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
              // Clears the icons in the corner.
              className={cx('mb-2 break-words', cornerPadding)}
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
                !note.title && cornerPadding,
              )}
            />
          )}
        </Card>
      </Link>
      {canPin && (
        <IconButton
          size="sm"
          aria-label="Pin note"
          aria-pressed={note.isPinned}
          title={note.isPinned ? 'Unpin' : 'Pin'}
          onClick={() => pinNote({ id: note.id, isPinned: !note.isPinned })}
          className={cx(
            'absolute top-6 right-6',
            note.isPinned
              ? 'text-accent hover:text-accent pointer-coarse:pointer-events-none'
              : 'opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 focus-visible:opacity-100 pointer-coarse:hidden',
          )}
        >
          <PinIcon filled={note.isPinned} />
        </IconButton>
      )}
    </div>
  )
}
