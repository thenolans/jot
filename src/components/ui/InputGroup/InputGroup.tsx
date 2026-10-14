import { type ReactNode, useId } from 'react'

import FieldNote from '@/components/ui/FieldNote'
import { cx } from '@/lib/cx'

import { InputGroupContext } from './inputGroupContext'

type InputGroupProps = {
  /** Names the group for screen readers; its fields' visible labels are hidden. */
  label: string
  /** One message for the whole group, shown under it. */
  error?: string
  /** Classes for the box, which lays out the fields (e.g. a grid). */
  className?: string
  children: ReactNode
}

/**
 * Fields joined into one box, like a row of quantity, unit and name. Fields inside it hide their labels
 * and notes, and the group shows one error for them all. Each keeps its input's border and states, so
 * the layout overlaps neighbouring borders (`-ml-px`, `-mt-px`) and rounds only the outer corners, by
 * the fields' `className`s.
 */
export default function InputGroup({
  label,
  error,
  className,
  children,
}: InputGroupProps) {
  const errorId = `${useId()}-error`

  return (
    <div>
      <div
        role="group"
        aria-label={label}
        className={cx('rounded-sm', className)}
      >
        <InputGroupContext value={{ errorId: error ? errorId : undefined }}>
          {children}
        </InputGroupContext>
      </div>
      {error && (
        <FieldNote id={errorId} error className="mt-2">
          {error}
        </FieldNote>
      )}
    </div>
  )
}
