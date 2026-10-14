import type { ReactNode } from 'react'

import JotIcon from '@/components/icons/JotIcon'
import Heading from '@/components/ui/Heading'

type EmptyStateProps = {
  title: string
  children: ReactNode
  /** A way forward, such as a button. */
  action?: ReactNode
}

/** Fills a page's main area when there's nothing to show. */
export default function EmptyState({
  title,
  children,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-4 pt-24 pb-32 text-center">
      <JotIcon size={48} className="mb-4 text-accent" />
      <Heading as="h2" variant="title">
        {title}
      </Heading>
      <p className="mt-2 max-w-xs text-lg leading-relaxed text-muted">
        {children}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
