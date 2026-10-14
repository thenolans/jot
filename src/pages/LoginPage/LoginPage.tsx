import PageHeader from '@/components/ui/PageHeader'
import PageTitle from '@/components/ui/PageTitle'
import LoginForm from '@/features/auth/LoginForm'

export default function LoginPage() {
  return (
    <>
      <PageTitle>Sign in</PageTitle>
      <PageHeader
        size="sm"
        title="Welcome back"
        description="Sign in to get back to your notes."
      />
      <LoginForm />
    </>
  )
}
