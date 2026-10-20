import type { ComponentType, ReactNode } from 'react'
import { Link, type To } from 'react-router'

import type { IconProps } from '@/components/icons/types'
import { cx } from '@/lib/cx'

import FolderCount from '../FolderCount'
import FolderNavRow from '../FolderNavRow'
import { type FolderNavVariant, folderNavVariants } from '../folderNavVariants'

/** A list of notes a `FolderNav` links to that isn't a folder: all of them, the unfiled ones or those shared. */
export type FolderNavView = {
  /** Where its notes are listed. */
  to: To
  /** The notes grid shows it. */
  isActive: boolean
  /** How many notes it holds, once known. */
  count?: number
}

type FolderNavLinkProps = {
  variant: FolderNavVariant
  view: FolderNavView
  Icon: ComponentType<IconProps>
  /** Called as it's picked. */
  onNavigate?: () => void
  /** Its name. */
  children: ReactNode
}

/** A `FolderNav` row for a view that isn't a folder, with its count. */
export default function FolderNavLink({
  variant,
  view,
  Icon,
  onNavigate,
  children,
}: FolderNavLinkProps) {
  const { label, iconSize } = folderNavVariants[variant]

  return (
    <FolderNavRow variant={variant} active={view.isActive}>
      <Link
        to={view.to}
        onClick={onNavigate}
        aria-current={view.isActive ? 'page' : undefined}
        className={cx(
          'flex min-w-0 flex-1 items-center self-stretch rounded-xs font-display font-semibold',
          label,
        )}
      >
        <Icon size={iconSize} className="flex-none text-accent" />
        <span className="truncate">{children}</span>
      </Link>
      {view.count !== undefined && (
        <FolderCount
          count={view.count}
          variant={variant}
          active={view.isActive}
        />
      )}
    </FolderNavRow>
  )
}
