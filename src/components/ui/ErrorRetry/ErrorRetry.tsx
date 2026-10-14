import type { ReactNode } from 'react'

import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import { cx } from '@/lib/cx'

type ErrorRetryProps = {
  children: ReactNode
  onRetry: () => void
  className?: string
}

/** An error with a button to try again, for when something fails to load. */
export default function ErrorRetry({
  children,
  onRetry,
  className,
}: ErrorRetryProps) {
  return (
    <div className={cx('flex flex-col items-start gap-4', className)}>
      <Alert>{children}</Alert>
      <Button variant="secondary" size="sm" onClick={onRetry}>
        Try again
      </Button>
    </div>
  )
}
