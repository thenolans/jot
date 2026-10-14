import type { ComponentProps } from 'react'

import { cx } from '@/lib/cx'

/** A keyboard key or shortcut, e.g. "⌘K" or "Esc". */
export default function Kbd({ className, ...props }: ComponentProps<'kbd'>) {
  return (
    <kbd
      className={cx(
        'flex-none rounded-xs border border-border px-1 py-px font-body text-xs font-medium text-faint',
        className,
      )}
      {...props}
    />
  )
}
