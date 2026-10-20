import Card from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton'
import { cx } from '@/lib/cx'

type NoteCardSkeletonProps = {
  /** Lines of preview to stand in for, so a grid of them varies in height like the notes do. */
  lines: number
  /** Matches a compact `NoteCard`. */
  compact?: boolean
  className?: string
}

/** Stands in for a `NoteCard` while notes load. */
export default function NoteCardSkeleton({
  lines,
  compact = false,
  className,
}: NoteCardSkeletonProps) {
  return (
    <Card
      aria-hidden="true"
      className={cx(
        'flex animate-pulse flex-col gap-2 p-6',
        compact && 'max-sm:p-4',
        className,
      )}
    >
      <Skeleton
        className={cx('mb-2 h-5 w-2/3', compact && 'max-sm:mb-1 max-sm:h-4')}
      />
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          className={cx('h-3', index === lines - 1 ? 'w-1/2' : 'w-full')}
        />
      ))}
    </Card>
  )
}
