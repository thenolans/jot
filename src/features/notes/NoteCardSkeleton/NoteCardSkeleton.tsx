import Card from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton'
import { cx } from '@/lib/cx'

type NoteCardSkeletonProps = {
  /** Lines of preview to stand in for, so a grid of them varies in height like the notes do. */
  lines: number
  className?: string
}

/** Stands in for a `NoteCard` while notes load. */
export default function NoteCardSkeleton({
  lines,
  className,
}: NoteCardSkeletonProps) {
  return (
    <Card
      aria-hidden="true"
      className={cx('flex animate-pulse flex-col gap-2 p-6', className)}
    >
      <Skeleton className="mb-2 h-5 w-2/3" />
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          className={cx('h-3', index === lines - 1 ? 'w-1/2' : 'w-full')}
        />
      ))}
    </Card>
  )
}
