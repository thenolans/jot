import { paths } from '@/app/paths'
import ColumnsIcon from '@/components/icons/ColumnsIcon'
import LogOutIcon from '@/components/icons/LogOutIcon'
import ThemeIcon from '@/components/icons/ThemeIcon'
import UserIcon from '@/components/icons/UserIcon'
import Button from '@/components/ui/Button'
import PageContainer from '@/components/ui/PageContainer'
import PageTitle from '@/components/ui/PageTitle'
import SegmentedControl from '@/components/ui/SegmentedControl'
import SubpageTopBar from '@/components/ui/SubpageTopBar'
import { displayDetails } from '@/features/auth/displayName'
import { useCurrentUser } from '@/features/auth/useCurrentUser'
import { useLogout } from '@/features/auth/useLogout'
import type { NoteLayout } from '@/features/notes/noteLayout'
import { useNoteLayout } from '@/features/notes/useNoteLayout'
import type { Theme } from '@/features/theme/theme'
import { useTheme } from '@/features/theme/useTheme'

import AboutRow from './AboutRow'
import AppSwitcher from './AppSwitcher'
import SettingsRow from './SettingsRow'
import SettingsSection from './SettingsSection'
import UpdateRow from './UpdateRow'

const themeOptions = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'auto', label: 'Auto' },
] satisfies { value: Theme; label: string }[]

const noteLayoutOptions = [
  { value: 'full', label: 'Full' },
  { value: 'compact', label: 'Compact' },
] satisfies { value: NoteLayout; label: string }[]

export default function SettingsPage() {
  const { user } = useCurrentUser()
  const logout = useLogout()
  const [theme, setTheme] = useTheme()
  const [noteLayout, setNoteLayout] = useNoteLayout()
  const account = user ? displayDetails(user) : undefined

  // Signing out leaves the app through `RequireAuth`. It happens locally even if the API can't be
  // reached, so there's nothing to report; the button stays disabled until the page goes.
  const handleLogout = () => logout.mutate()

  return (
    <div className="min-h-screen">
      <PageTitle>Settings</PageTitle>
      <SubpageTopBar title="Settings" fallbackPath={paths.notes} />

      <PageContainer as="main" width="form" className="flex flex-col gap-4">
        <SettingsSection>
          <AboutRow />
          <SettingsRow Icon={ThemeIcon} title="Theme">
            <SegmentedControl
              label="Theme"
              options={themeOptions}
              value={theme}
              onChange={setTheme}
            />
          </SettingsRow>
          <SettingsRow
            Icon={ColumnsIcon}
            title="Note layout"
            description="On phones"
          >
            <SegmentedControl
              label="Note layout"
              options={noteLayoutOptions}
              value={noteLayout}
              onChange={setNoteLayout}
            />
          </SettingsRow>
        </SettingsSection>

        <SettingsSection title="Account">
          <SettingsRow
            Icon={UserIcon}
            title={account?.title ?? ''}
            description={account?.subtitle}
          >
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLogout}
              disabled={!logout.isIdle}
              className="flex-none"
            >
              <LogOutIcon />
              Log out
            </Button>
          </SettingsRow>
        </SettingsSection>

        <AppSwitcher />

        <SettingsSection title="Updates">
          <UpdateRow />
        </SettingsSection>
      </PageContainer>
    </div>
  )
}
