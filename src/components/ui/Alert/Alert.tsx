import type { ComponentProps } from 'react'

import { cx } from '@/lib/cx'

const sizeClassNames = {
  /** A tinted box, for an error about a whole form or dialog. */
  md: 'rounded-sm bg-danger-soft px-4 py-2 text-base',
  /** A line of text, for an error under a single control or row. */
  sm: 'text-sm',
}

type AlertProps = Omit<ComponentProps<'p'>, 'role'> & {
  size?: keyof typeof sizeClassNames
}

/** An error message that screen readers announce as soon as it appears. */
export default function Alert({
  size = 'md',
  className,
  ...props
}: AlertProps) {
  return (
    <p
      role="alert"
      className={cx('text-danger', sizeClassNames[size], className)}
      {...props}
    />
  )
}
