import type { ComponentProps } from 'react'

import PinIcon from '@/components/icons/PinIcon'
import IconButton, {
  type IconButtonStyleProps,
} from '@/components/ui/IconButton'
import { cx } from '@/lib/cx'

import type { Note } from '../types'
import { usePinNote } from '../usePinNote'

type PinButtonProps = Pick<IconButtonStyleProps, 'size'> &
  Omit<
    ComponentProps<'button'>,
    'children' | 'aria-label' | 'aria-pressed' | 'title' | 'onClick'
  > & {
    note: Pick<Note, 'id' | 'isPinned'>
  }

/** Pins the user's note ahead of the rest, or unpins it; accent-colored, with a filled pin, while pinned. */
export default function PinButton({
  note,
  size,
  className,
  ...props
}: PinButtonProps) {
  const { mutate: pinNote } = usePinNote()
  return (
    <IconButton
      size={size}
      aria-label="Pin note"
      aria-pressed={note.isPinned}
      title={note.isPinned ? 'Unpin' : 'Pin'}
      onClick={() => pinNote({ id: note.id, isPinned: !note.isPinned })}
      className={cx(
        note.isPinned && 'text-accent hover:text-accent',
        className,
      )}
      {...props}
    >
      <PinIcon size={size === 'lg' ? 20 : 16} filled={note.isPinned} />
    </IconButton>
  )
}
