import { useSortable } from '@dnd-kit/react/sortable'

import GripIcon from '@/components/icons/GripIcon'
import IconButton from '@/components/ui/IconButton'
import { cx } from '@/lib/cx'

import ChecklistRow, { type ChecklistRowProps } from '../ChecklistRow'

type SortableChecklistRowProps = Omit<
  ChecklistRowProps,
  'handle' | 'isDragging' | 'rowRef'
> & {
  id: number
  index: number
}

/**
 * A checklist item that can be dragged into a new place by its handle, with the pointer or, from the
 * keyboard, Space then the arrow keys. The handle is the only place a drag starts, so the item's box
 * and text work as usual.
 */
export default function SortableChecklistRow({
  id,
  index,
  ...props
}: SortableChecklistRowProps) {
  const { ref, handleRef, isDragging } = useSortable({ id, index })

  return (
    <ChecklistRow
      {...props}
      rowRef={ref}
      isDragging={isDragging}
      handle={
        // Cancels the padding, lining the grip up with the note's edge.
        <IconButton
          ref={handleRef}
          aria-label={`Move ${props.item.text || 'item'}`}
          className={cx(
            '-ml-2 cursor-grab touch-none',
            isDragging &&
              'cursor-grabbing bg-accent-soft text-accent hover:bg-accent-soft hover:text-accent',
          )}
        >
          <GripIcon />
        </IconButton>
      }
    />
  )
}
