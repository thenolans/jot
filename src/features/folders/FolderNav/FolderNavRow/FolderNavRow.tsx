import type { ReactNode } from 'react'

import { cx } from '@/lib/cx'

import { type FolderNavVariant, folderNavVariants } from '../folderNavVariants'

type FolderNavRowProps = {
  variant: FolderNavVariant
  /** How deep the folder is: 0 at the top level. */
  depth?: number
  /** It's what the notes grid shows. */
  active?: boolean
  /** The button that shows or hides the folders inside; a space when there's none. */
  toggle?: ReactNode
  /** The link to the folder's notes, or the field naming it. */
  children: ReactNode
  /** The count and the actions, at the end. */
  end?: ReactNode
}

/** A row of a `FolderNav`, indented by its depth. */
export default function FolderNavRow({
  variant,
  depth = 0,
  active = false,
  toggle,
  children,
  end,
}: FolderNavRowProps) {
  const { row, inset, indent } = folderNavVariants[variant]

  return (
    <div
      className={cx(
        // A bar down the left edge marks the active row; the others keep its width, so nothing shifts.
        'group flex items-center border-l-3',
        row,
        active
          ? 'border-l-accent bg-accent-soft text-accent'
          : 'border-l-transparent text-ink hover:bg-border-soft',
      )}
      style={{ paddingLeft: inset + depth * indent }}
    >
      {toggle ?? <span className="size-6 flex-none" />}
      {children}
      {end}
    </div>
  )
}
