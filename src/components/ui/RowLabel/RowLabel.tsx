import type { ReactNode } from 'react'

import { cx } from '@/lib/cx'

type RowLabelProps = {
  title: ReactNode
  description?: string
  /** Styles the title beyond its size, such as an app's own colors. */
  titleClassName?: string
}

/** A list row's title and the line under it, sized the same in every row. */
export default function RowLabel({
  title,
  description,
  titleClassName,
}: RowLabelProps) {
  return (
    <div className="min-w-0 flex-1">
      <div
        className={cx(
          'truncate font-display text-base font-semibold text-ink',
          titleClassName,
        )}
      >
        {title}
      </div>
      {description && (
        <div className="truncate text-sm text-muted">{description}</div>
      )}
    </div>
  )
}
