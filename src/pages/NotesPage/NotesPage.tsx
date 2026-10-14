import Button from '@/components/ui/Button'
import PageContainer from '@/components/ui/PageContainer'
import PageHeader from '@/components/ui/PageHeader'
import PageTitle from '@/components/ui/PageTitle'
import { useCurrentUser } from '@/features/auth/useCurrentUser'
import { useLogout } from '@/features/auth/useLogout'

/** Where signing in lands. A placeholder until the notes grid is built. */
export default function NotesPage() {
  const { user } = useCurrentUser()
  const logout = useLogout()

  // Signing out leaves the app through `RequireAuth`. It happens locally even if the API can't be
  // reached, so there's nothing to report; the button stays disabled until the page goes.
  const handleLogout = () => logout.mutate()

  return (
    <PageContainer as="main" width="wide">
      <PageTitle>Notes</PageTitle>
      <PageHeader
        title="Notes"
        description={user ? `Signed in as ${user.email}.` : undefined}
      />
      <Button
        variant="secondary"
        className="mt-6"
        disabled={logout.isPending}
        onClick={handleLogout}
      >
        Sign out
      </Button>
    </PageContainer>
  )
}
