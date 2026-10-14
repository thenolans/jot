import { cx } from '@/lib/cx'

import { type FolderNavVariant, folderNavVariants } from '../folderNavVariants'

type FolderCountProps = {
  count: number
  variant: FolderNavVariant
  active: boolean
  className?: string
}

/** How many notes a `FolderNav` row holds. */
export default function FolderCount({
  count,
  variant,
  active,
  className,
}: FolderCountProps) {
  const styles = folderNavVariants[variant]

  return (
    <span
      className={cx(
        'flex flex-none items-center justify-center tabular-nums',
        styles.count,
        active ? styles.activeCount : styles.inactiveCount,
        className,
      )}
    >
      {count}
      <span className="sr-only"> {count === 1 ? 'note' : 'notes'}</span>
    </span>
  )
}
