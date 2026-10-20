import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import PasswordField from '@/components/ui/PasswordField'
import TextField from '@/components/ui/TextField'
import { useFormAction } from '@/hooks/useFormAction'
import { useFormValidation } from '@/hooks/useFormValidation'

import { useLogin } from '../useLogin'

const fields = ['email', 'password'] as const

export default function LoginForm() {
  const login = useLogin()
  const [state, formAction, isPending] = useFormAction(
    fields,
    login.mutateAsync,
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
        autoComplete="current-password"
        required
        error={validation.errors.password ?? state.fieldErrors.password}
      />
      <Button type="submit" block disabled={isPending}>
        {isPending ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  )
}
