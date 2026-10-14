import PageHeader from '@/components/ui/PageHeader'
import PageTitle from '@/components/ui/PageTitle'
import RegisterForm from '@/features/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <>
      <PageTitle>Create an account</PageTitle>
      <PageHeader
        size="sm"
        title="Create your account"
        description="Jot it down, then sort it into folders."
      />
      <RegisterForm />
    </>
  )
}
