import { useActionState } from 'react'

import { ApiError } from '@/lib/api'

type FormActionState<Field extends string> = {
  /** What was last submitted, so fields keep their values after a failed attempt. */
  values: Partial<Record<Field, string>>
  /** A problem with the submission as a whole, when it isn't about one field. */
  message?: string
  fieldErrors: Partial<Record<Field, string>>
}

/**
 * Runs a simple form as a form action: reads `fields` from the submission, passes them to `submit`,
 * and turns API errors into messages the form can show. Other errors go to the error boundary. After a
 * success the state starts afresh, so the (reset) form comes back empty.
 */
export function useFormAction<Field extends string>(
  fields: readonly Field[],
  submit: (values: Record<Field, string>) => Promise<unknown>,
) {
  const initialState: FormActionState<Field> = { values: {}, fieldErrors: {} }

  return useActionState(
    async (
      _previous: FormActionState<Field>,
      formData: FormData,
    ): Promise<FormActionState<Field>> => {
      const values = Object.fromEntries(
        fields.map((field) => [field, String(formData.get(field) ?? '')]),
      ) as Record<Field, string>

      try {
        await submit(values)
      } catch (error) {
        if (!(error instanceof ApiError)) throw error
        const fieldErrors = error.fieldErrors as Partial<Record<Field, string>>
        const hasFieldError = fields.some((field) => fieldErrors[field])
        return {
          values,
          fieldErrors,
          message: hasFieldError ? undefined : error.message,
        }
      }

      return initialState
    },
    initialState,
  )
}
