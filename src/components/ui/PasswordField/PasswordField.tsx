import { type ComponentProps, useState } from 'react'

import EyeIcon from '@/components/icons/EyeIcon'
import Field, { type FieldProps } from '@/components/ui/Field'
import IconButton from '@/components/ui/IconButton'
import { cx } from '@/lib/cx'

type PasswordFieldProps = Omit<ComponentProps<'input'>, 'id' | 'type'> &
  FieldProps

/** A labelled password input with an eye at its end that shows or hides what's typed. */
export default function PasswordField({
  label,
  hint,
  error,
  invalid,
  hideLabel,
  controlClassName,
  className,
  ...props
}: PasswordFieldProps) {
  const [shown, setShown] = useState(false)

  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      invalid={invalid}
      hideLabel={hideLabel}
      controlClassName={cx('pr-12', controlClassName)}
      className={className}
    >
      {(control) => (
        <div className="relative">
          <input type={shown ? 'text' : 'password'} {...control} {...props} />
          {/* Centred in the 40px input with 4px around it. */}
          <IconButton
            aria-label="Show password"
            aria-pressed={shown}
            onClick={() => setShown((value) => !value)}
            className="absolute top-1/2 right-1 -translate-y-1/2"
          >
            <EyeIcon size={20} shut={!shown} />
          </IconButton>
        </div>
      )}
    </Field>
  )
}
