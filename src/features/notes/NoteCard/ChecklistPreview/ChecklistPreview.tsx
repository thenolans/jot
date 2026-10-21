import type { ComponentProps } from 'react'

import { cx } from '@/lib/cx'
import { plural } from '@/lib/plural'

import { checklistItems } from '../../checklist'

/** The most items a card lists. */
const MAX_ITEMS = 8

type ChecklistPreviewProps = Omit<ComponentProps<'div'>, 'children'> & {
  /** The checklist's markdown. */
  content: string
}

/**
 * A checklist's items for its card: the ones still to do, each beside an empty box (drawn, not an input,
 * since the card is a link), then how many more there are and how many are checked off.
 */
export default function ChecklistPreview({
  content,
  className,
  ...props
}: ChecklistPreviewProps) {
  const items = checklistItems(content).filter(({ text }) => text.trim())
  const todo = items.filter(({ done }) => !done)
  const completed = items.length - todo.length
  const more = todo.length - MAX_ITEMS

  return (
    <div className={cx('flex flex-col gap-1', className)} {...props}>
      {todo.length > 0 && (
        <ul className="flex flex-col gap-1">
          {todo.slice(0, MAX_ITEMS).map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="size-3 flex-none rounded-xs border-2 border-faint"
              />
              <span className="min-w-0 truncate">{item.text}</span>
            </li>
          ))}
        </ul>
      )}
      {more > 0 && <p className="text-faint">+ {more} more</p>}
      {completed > 0 && (
        <p className="text-faint">{plural(completed, 'completed item')}</p>
      )}
    </div>
  )
}
