import type { ReactNode } from 'react'

import { cx } from '@/lib/cx'

import { distributeColumns } from './distributeColumns'
import { useColumnCount } from './useColumnCount'

type NoteColumnsProps<T> = {
  items: T[]
  /** About how tall an item will be, in any unit, to balance the columns. */
  estimateHeight: (item: T) => number
  getKey: (item: T) => string | number
  renderItem: (item: T) => ReactNode
  className?: string
}

/**
 * Lays notes out as a masonry: side-by-side columns of cards of different heights, as many columns as
 * the window fits. It's one list to assistive tech, read a column at a time.
 */
export default function NoteColumns<T>({
  items,
  estimateHeight,
  getKey,
  renderItem,
  className,
}: NoteColumnsProps<T>) {
  const columns = distributeColumns(items, useColumnCount(), estimateHeight)

  return (
    <div role="list" className={cx('flex items-start gap-4', className)}>
      {columns.map((column, index) => (
        <div key={index} className="flex min-w-0 flex-1 flex-col gap-4">
          {column.map((item) => (
            <div key={getKey(item)} role="listitem">
              {renderItem(item)}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
