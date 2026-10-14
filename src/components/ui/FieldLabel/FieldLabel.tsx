import type { ComponentProps, ElementType } from 'react'

import { cx } from '@/lib/cx'

type FieldLabelElement = 'label' | 'legend' | 'p'

type FieldLabelProps<T extends FieldLabelElement> = {
  /** A `label` for one control, a `legend` for a fieldset, or a `p` heading a group of controls. */
  as?: T
} & Omit<ComponentProps<T>, 'as'>

/** The visible name above a form field or group of fields. */
export default function FieldLabel<T extends FieldLabelElement = 'label'>({
  as,
  className,
  ...props
}: FieldLabelProps<T>) {
  const Element = (as ?? 'label') as ElementType

  return (
    <Element
      className={cx('font-display text-sm font-bold text-ink', className)}
      {...props}
    />
  )
}
