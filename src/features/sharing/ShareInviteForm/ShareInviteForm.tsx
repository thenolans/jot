import { useId } from 'react'

import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import FieldNote from '@/components/ui/FieldNote'
import TextField from '@/components/ui/TextField'
import { useFormAction } from '@/hooks/useFormAction'
import { useFormValidation } from '@/hooks/useFormValidation'

import { useCreateShare } from '../useCreateShare'

const fields = ['email'] as const

type ShareInviteFormProps = {
  /** The note to share, one of the user's own. */
  noteId: number
  /** Called once the invite is saved. */
  onInvited?: () => void
  autoFocus?: boolean
}

/** Shares a note with someone by email. They start with view access, which the list of people can change. */
export default function ShareInviteForm({
  noteId,
  onInvited,
  autoFocus,
}: ShareInviteFormProps) {
  const { mutateAsync: createShare } = useCreateShare()
  const [state, formAction, isPending] = useFormAction(
    fields,
    async ({ email }) => {
      await createShare({ noteId, email, permission: 'view' })
      onInvited?.()
    },
  )
  const validation = useFormValidation()
  const errorId = `${useId()}-error`
  const error = validation.errors.email ?? state.fieldErrors.email

  return (
    <form action={formAction} {...validation.formProps}>
      {state.message && <Alert className="mb-4">{state.message}</Alert>}
      {/* The error goes under the whole row, so the button stays level with the input. */}
      <div className="flex items-end gap-2">
        <TextField
          label="Invite by email"
          name="email"
          type="email"
          autoComplete="off"
          placeholder="name@example.com"
          required
          autoFocus={autoFocus}
          defaultValue={state.values.email}
          invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="flex-1"
        />
        <Button type="submit" variant="secondary" disabled={isPending}>
          {isPending ? 'Inviting…' : 'Invite'}
        </Button>
      </div>
      {error && (
        <FieldNote id={errorId} error className="mt-2">
          {error}
        </FieldNote>
      )}
    </form>
  )
}
