import type { ComponentProps, ElementType } from 'react'

import { cx } from '@/lib/cx'

type EyebrowElement = 'span' | 'p' | 'dt' | 'h2' | 'h3'

type EyebrowProps<T extends EyebrowElement> = {
  /** A heading level when it titles a group, otherwise whatever fits where it sits. */
  as?: T
} & Omit<ComponentProps<T>, 'as'>

/** A small uppercase label: a group's name, a stat's label or a short note. */
export default function Eyebrow<T extends EyebrowElement = 'span'>({
  as,
  className,
  ...props
}: EyebrowProps<T>) {
  const Element = (as ?? 'span') as ElementType

  return (
    <Element
      className={cx(
        'text-xs font-medium tracking-wider text-faint uppercase',
        className,
      )}
      {...props}
    />
  )
}
