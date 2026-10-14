import { type ReactNode, useId } from 'react'

import FieldLabel from '@/components/ui/FieldLabel'
import FieldNote from '@/components/ui/FieldNote'
import { useInputGroup } from '@/components/ui/InputGroup'
import { cx } from '@/lib/cx'

import { inputClassName } from './inputClassName'

/** Props that tie a control to its field's label and note, and style it for where it sits. */
export type FieldControlProps = {
  id: string
  'aria-invalid': true | undefined
  'aria-describedby': string | undefined
  className: string
}

export type FieldProps = {
  label: string
  /** Guidance shown under the field, replaced by `error` when there is one. */
  hint?: string
  error?: string
  /** Marks the field invalid without a message, e.g. in an `InputGroup`, which shows its own. */
  invalid?: boolean
  /** Keeps the label for screen readers only, where the context makes the field clear, like a row in a list. */
  hideLabel?: boolean
  /** Classes for the control, after its own; `className` goes on the field's wrapper. */
  controlClassName?: string
  className?: string
}

type FieldWithControlProps = FieldProps & {
  /** Renders the control, spreading the given props onto it. `labelId` is the label's id. */
  children: (control: FieldControlProps, labelId: string) => ReactNode
}

/**
 * A label, control and optional hint or error message, wired together for screen readers. With
 * `hideLabel`, or in an `InputGroup`, the label is visually hidden and the group shows the error; the control keeps its
 * border and states, and takes its corners from `className`, which the group's layout sets.
 */
export default function Field({
  label,
  hint,
  error,
  invalid,
  hideLabel = false,
  controlClassName,
  className,
  children,
}: FieldWithControlProps) {
  const id = useId()
  const group = useInputGroup()
  const note = group ? undefined : (error ?? hint)
  const noteId = `${id}-note`
  const labelId = `${id}-label`

  return (
    <div
      className={cx(
        'flex flex-col',
        // Cells overlap their neighbours' borders, so the one in an invalid, hovered, focused or open state
        // is lifted above them to show its whole border and focus ring.
        group
          ? 'relative focus-within:z-3 hover:z-2 has-aria-invalid:z-1 has-data-open:z-3'
          : 'gap-2',
        className,
      )}
    >
      <FieldLabel
        id={labelId}
        htmlFor={id}
        className={group || hideLabel ? 'sr-only' : undefined}
      >
        {label}
      </FieldLabel>
      {children(
        {
          id,
          'aria-invalid': error || invalid ? true : undefined,
          'aria-describedby': group ? group.errorId : note ? noteId : undefined,
          className: inputClassName(
            { inGroup: Boolean(group) },
            controlClassName,
          ),
        },
        labelId,
      )}
      {note && (
        <FieldNote id={noteId} error={Boolean(error)}>
          {note}
        </FieldNote>
      )}
    </div>
  )
}
