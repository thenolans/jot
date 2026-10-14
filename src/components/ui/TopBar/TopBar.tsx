import type { ComponentProps } from 'react'

import { cx } from '@/lib/cx'

/**
 * The bar pinned to the top of app screens. Its height is fixed, so it doesn't shift between
 * screens whose bars hold different content; lay out the content with `className`.
 */
export default function TopBar({
  className,
  ...props
}: ComponentProps<'header'>) {
  return (
    <header
      className={cx(
        'sticky top-0 z-20 flex h-(--top-bar-height) items-center gap-4 border-b border-border bg-bar px-4 backdrop-blur-sm sm:px-6',
        className,
      )}
      {...props}
    />
  )
}
