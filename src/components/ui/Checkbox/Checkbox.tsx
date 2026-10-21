import type { ComponentProps, ReactNode } from 'react'

import CheckIcon from '@/components/icons/CheckIcon'
import { cx } from '@/lib/cx'

type CheckboxProps = Omit<ComponentProps<'input'>, 'type'> & {
  /** Shown beside the box. Leave it out to label the box from elsewhere, with a `<label htmlFor>` for its `id`. */
  label?: ReactNode
}

export default function Checkbox({
  label,
  className,
  ...props
}: CheckboxProps) {
  return (
    <label
      className={cx(
        'flex cursor-pointer items-center gap-2 px-1 py-2',
        className,
      )}
    >
      <input type="checkbox" className="peer sr-only" {...props} />
      <span
        className="flex size-5 flex-none items-center justify-center rounded-xs border border-border text-on-accent transition-colors peer-checked:border-accent peer-checked:bg-accent peer-focus-visible:shadow-focus [&_svg]:invisible peer-checked:[&_svg]:visible"
        aria-hidden="true"
      >
        <CheckIcon size={16} />
      </span>
      {label && <span className="text-base text-ink">{label}</span>}
    </label>
  )
}
