import type { ComponentProps } from 'react'

import { cx } from '@/lib/cx'

/**
 * The grab handle at the top of a modal that's a sheet on phones; hidden from `md`, where it's centered.
 * It doesn't drag, so give it an `onClick` that closes the sheet.
 */
export default function SheetHandle({
  className,
  ...props
}: Omit<ComponentProps<'div'>, 'children' | 'aria-hidden'>) {
  return (
    <div
      aria-hidden
      className={cx(
        'flex cursor-pointer justify-center py-2 md:hidden',
        className,
      )}
      {...props}
    >
      <div className="h-1 w-10 rounded-full bg-border" />
    </div>
  )
}
