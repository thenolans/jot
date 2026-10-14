import ErrorRetry from '@/components/ui/ErrorRetry'
import Skeleton from '@/components/ui/Skeleton'
import { cx } from '@/lib/cx'

import { useShares } from '../useShares'
import SharePersonRow from './SharePersonRow'

type ShareListProps = {
  /** The note whose people to list, one of the user's own. */
  noteId: number
  /** Classes for each row (and the loading and error states), e.g. to pad them inside a card. */
  rowClassName?: string
}

/** Everyone a note is shared with, each with their access and a way to remove them. Shows nothing while it's shared with no one. */
export default function ShareList({ noteId, rowClassName }: ShareListProps) {
  const { shares, isLoading, error, reload } = useShares(noteId)

  if (isLoading) {
    return (
      <div
        className={cx(
          'flex animate-pulse items-center gap-4 py-2',
          rowClassName,
        )}
        aria-hidden="true"
      >
        <Skeleton shape="block" className="size-8 rounded-full" />
        <Skeleton className="h-4 w-40" />
      </div>
    )
  }

  if (error) {
    return (
      <ErrorRetry onRetry={reload} className={rowClassName}>
        {error}
      </ErrorRetry>
    )
  }

  if (shares.length === 0) return null

  return (
    <ul className="divide-y divide-border-soft">
      {shares.map((share) => (
        <SharePersonRow key={share.id} share={share} className={rowClassName} />
      ))}
    </ul>
  )
}
