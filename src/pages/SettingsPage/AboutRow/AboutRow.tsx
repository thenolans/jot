import { appVersion } from '@/app/version'
import Logo from '@/components/ui/Logo'

/** The app's name and the version that's running. */
export default function AboutRow() {
  return (
    <div className="flex items-center justify-between gap-4 p-4">
      <Logo />
      <div className="text-xs text-muted">Version {appVersion}</div>
    </div>
  )
}
