import type { ComponentProps } from 'react'

import Field, { type FieldProps } from '@/components/ui/Field'

type TextFieldProps = Omit<ComponentProps<'input'>, 'id'> & FieldProps

/** A labelled text input with an optional hint and error message, standalone or in an `InputGroup`. */
export default function TextField({
  label,
  hint,
  error,
  invalid,
  hideLabel,
  controlClassName,
  className,
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
      controlClassName={controlClassName}
      className={className}
    >
      {(control) => <input type={type} {...control} {...props} />}
    </Field>
  )
}
