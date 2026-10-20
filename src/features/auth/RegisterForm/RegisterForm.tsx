import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import PasswordField from '@/components/ui/PasswordField'
import TextField from '@/components/ui/TextField'
import { useFormAction } from '@/hooks/useFormAction'
import { useFormValidation } from '@/hooks/useFormValidation'

import { useRegister } from '../useRegister'

const fields = ['name', 'email', 'password'] as const

const MIN_PASSWORD_LENGTH = 8

export default function RegisterForm() {
  const register = useRegister()
  const [state, formAction, isPending] = useFormAction(
    fields,
    register.mutateAsync,
  )
  const validation = useFormValidation()

  return (
    <form
      action={formAction}
      {...validation.formProps}
      className="flex flex-col gap-4"
    >
      {state.message && <Alert>{state.message}</Alert>}
      <TextField
        label="Display name"
        name="name"
        autoComplete="nickname"
        required
        defaultValue={state.values.name}
        error={validation.errors.name ?? state.fieldErrors.name}
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        defaultValue={state.values.email}
        error={validation.errors.email ?? state.fieldErrors.email}
      />
      <PasswordField
        label="Password"
        name="password"
        autoComplete="new-password"
        required
        minLength={MIN_PASSWORD_LENGTH}
        hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}
        error={validation.errors.password ?? state.fieldErrors.password}
      />
      <Button type="submit" block disabled={isPending}>
        {isPending ? 'Creating account…' : 'Create account'}
      </Button>
    </form>
  )
}
