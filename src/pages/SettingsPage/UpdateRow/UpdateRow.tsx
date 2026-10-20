import { useState } from 'react'

import { updateApp } from '@/app/serviceWorker'
import ResetIcon from '@/components/icons/ResetIcon'
import Button from '@/components/ui/Button'
import { useIsOnline } from '@/hooks/useIsOnline'

import SettingsRow from '../SettingsRow'

type Status = 'idle' | 'checking' | 'updating' | 'current' | 'failed'

const descriptions: Record<Status, string> = {
  idle: 'Load the latest version',
  checking: 'Checking…',
  updating: 'Updating…',
  current: 'You have the latest version',
  failed: "Couldn't check for updates",
}

/** Checks for a newer version of the app and reloads into it, which refreshing alone doesn't do. */
export default function UpdateRow() {
  const isOnline = useIsOnline()
  const [status, setStatus] = useState<Status>('idle')
  const isBusy = status === 'checking' || status === 'updating'

  const handleCheck = async () => {
    setStatus('checking')
    try {
      // The page reloads once the new version takes over, so `updating` stays until then.
      setStatus((await updateApp()) ? 'updating' : 'current')
    } catch {
      setStatus('failed')
    }
  }

  return (
    <SettingsRow
      Icon={ResetIcon}
      title="Updates"
      description={
        isOnline || isBusy
          ? descriptions[status]
          : "Available when you're online"
      }
    >
      <Button
        variant="secondary"
        size="sm"
        onClick={() => void handleCheck()}
        disabled={!isOnline || isBusy}
        className="flex-none"
      >
        Check
      </Button>
    </SettingsRow>
  )
}
