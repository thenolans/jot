import type { ComponentProps } from 'react'

import { cx } from '@/lib/cx'

const shapeClassNames = {
  /** A bar standing in for a line of text. */
  line: 'rounded-full bg-border-soft',
  /** A block standing in for an image. Corners are left to the `className`, so it can sit flush in a card. */
  block: 'bg-accent-soft',
}

type SkeletonProps = Omit<ComponentProps<'div'>, 'children'> & {
  shape?: keyof typeof shapeClassNames
}

/**
 * A placeholder shape for loading content. Put `animate-pulse` and `aria-hidden` on the
 * wrapper around a group of them, so they pulse together and stay out of the accessibility tree.
 */
export default function Skeleton({
  shape = 'line',
  className,
  ...props
}: SkeletonProps) {
  return <div className={cx(shapeClassNames[shape], className)} {...props} />
}
