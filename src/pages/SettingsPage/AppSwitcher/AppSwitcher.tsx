import SettingsSection from '../SettingsSection'
import AppLink from './AppLink'
import { otherApps } from './apps'

/** Links to our other apps, in the browser only; the installed app leaves them out. */
export default function AppSwitcher() {
  return (
    <SettingsSection title="Switch apps" className="standalone:hidden">
      {otherApps.map((app) => (
        <AppLink key={app.href} app={app} />
      ))}
    </SettingsSection>
  )
}
