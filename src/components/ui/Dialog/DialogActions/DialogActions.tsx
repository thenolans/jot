import type { ComponentProps } from 'react'

import { cx } from '@/lib/cx'

/**
 * The row of buttons at the foot of a dialog, aligned to the end: Cancel first, then the action it
 * confirms. It wraps on a narrow sheet rather than overflowing.
 */
export default function DialogActions({
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      className={cx('mt-6 flex flex-wrap justify-end gap-2', className)}
      {...props}
    />
  )
}
