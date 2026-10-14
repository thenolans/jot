import { useMutationState } from '@tanstack/react-query'

import CloudOffIcon from '@/components/icons/CloudOffIcon'
import { useIsOnline } from '@/hooks/useIsOnline'
import { plural } from '@/lib/plural'

/**
 * Shows that the app is offline, and how many changes wait for the connection, as an icon beside the
 * logo. Nothing shows while online.
 */
export default function ConnectionStatus({
  className,
}: {
  className?: string
}) {
  const isOnline = useIsOnline()
  const waiting = useMutationState({
    filters: { predicate: (mutation) => mutation.state.isPaused },
  }).length

  const label = isOnline
    ? ''
    : waiting
      ? `Offline. ${plural(waiting, 'change')} will save when you're back online.`
      : "Offline. Showing what's saved on this device."

  return (
    <span role="status" className={className}>
      {!isOnline && (
        <span title={label} className="flex text-muted">
          <CloudOffIcon size={16} />
          <span className="sr-only">{label}</span>
        </span>
      )}
    </span>
  )
}
