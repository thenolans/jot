import type { ComponentProps } from 'react'

import { cx } from '@/lib/cx'

type FieldNoteProps = ComponentProps<'p'> & {
  /** Referenced by the field's `aria-describedby`. */
  id: string
  /** Shows the note as an error rather than a hint. */
  error?: boolean
}

/** A hint or error message under a form field. */
export default function FieldNote({
  error,
  className,
  ...props
}: FieldNoteProps) {
  return (
    <p
      className={cx('text-sm', error ? 'text-danger' : 'text-muted', className)}
      {...props}
    />
  )
}
