import type { ComponentProps, ReactNode } from 'react'

import Field, { type FieldProps } from '@/components/ui/Field'
import { cx } from '@/lib/cx'

type TextFieldProps = Omit<ComponentProps<'input'>, 'id'> &
  FieldProps & {
    /** A short unit shown inside the input's right edge, like `"` for inches. Name the unit in the label too. */
    suffix?: ReactNode
  }

/** A labelled text input with an optional hint and error message, standalone or in an `InputGroup`. */
export default function TextField({
  label,
  hint,
  error,
  invalid,
  hideLabel,
  controlClassName,
  className,
  suffix,
  type = 'text',
  ...props
}: TextFieldProps) {
  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      invalid={invalid}
      hideLabel={hideLabel}
      controlClassName={cx(suffix != null && 'pr-8', controlClassName)}
      className={className}
    >
      {(control) =>
        suffix == null ? (
          <input type={type} {...control} {...props} />
        ) : (
          <div className="relative">
            <input type={type} {...control} {...props} />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-faint"
            >
              {suffix}
            </span>
          </div>
        )
      }
    </Field>
  )
}
