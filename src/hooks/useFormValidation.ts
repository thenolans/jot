import { type FormEvent, useState } from 'react'

export type FormValidation = ReturnType<typeof useFormValidation>

type Field = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

function isField(element: unknown): element is Field {
  return (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement
  )
}

/** A message for the first constraint (`required`, `type`, `minLength`, …) the field fails. */
function messageFor(field: Field) {
  const { validity } = field
  const label = field.labels?.[0]?.textContent ?? 'This field'

  if (validity.valueMissing) return `${label} is required.`
  if (validity.typeMismatch && field.type === 'email')
    return 'Enter a valid email address.'
  if (validity.typeMismatch && field.type === 'url') return 'Enter a valid URL.'
  if (validity.tooShort && 'minLength' in field)
    return `Use at least ${field.minLength} characters.`
  if (validity.tooLong && 'maxLength' in field)
    return `Use at most ${field.maxLength} characters.`
  // A `pattern` says what it expects with `data-pattern-message`.
  if (validity.patternMismatch && field.dataset.patternMessage)
    return field.dataset.patternMessage
  if (validity.badInput && field.type === 'number') return 'Enter a number.'
  if (validity.rangeUnderflow && 'min' in field)
    return `Enter ${field.min} or more.`
  if (validity.rangeOverflow && 'max' in field)
    return `Enter ${field.max} or less.`
  if (validity.stepMismatch && field.type === 'number')
    return 'Enter a whole number.'
  return field.validationMessage
}

/**
 * Validates a form with the browser's built-in constraints (`required`, `type="email"`, `minLength`, …)
 * but shows the messages in our own UI instead of the browser's bubbles.
 *
 * Fields are checked on submit; an invalid form doesn't submit and focuses its first invalid field.
 * Once a field shows an error, it's re-checked as the user types. Spread `formProps` onto the `<form>`
 * and pass `errors[name]` to each field.
 */
export function useFormValidation() {
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({})

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const invalid = [...event.currentTarget.elements]
      .filter(isField)
      .filter((field) => !field.validity.valid)
    setErrors(
      Object.fromEntries(
        invalid.map((field) => [field.name, messageFor(field)]),
      ),
    )

    if (invalid.length > 0) {
      event.preventDefault()
      invalid[0].focus()
    }
  }

  function onInput(event: FormEvent<HTMLFormElement>) {
    const field = event.target
    if (!isField(field) || !errors[field.name]) return

    setErrors((current) => {
      const next = { ...current }
      if (field.validity.valid) delete next[field.name]
      else next[field.name] = messageFor(field)
      return next
    })
  }

  return { errors, formProps: { noValidate: true, onSubmit, onInput } }
}
