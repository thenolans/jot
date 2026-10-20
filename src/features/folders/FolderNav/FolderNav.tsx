import { useMemo, useState } from 'react'
import type { To } from 'react-router'

import NotesIcon from '@/components/icons/NotesIcon'
import PageIcon from '@/components/icons/PageIcon'
import PlusIcon from '@/components/icons/PlusIcon'
import UserIcon from '@/components/icons/UserIcon'
import Button from '@/components/ui/Button'
import ErrorRetry from '@/components/ui/ErrorRetry'
import Eyebrow from '@/components/ui/Eyebrow'
import { afterMenuCloses } from '@/components/ui/Menu'
import Skeleton from '@/components/ui/Skeleton'
import { cx } from '@/lib/cx'

import FolderActionDialog from '../FolderActionDialog'
import type { FolderAction } from '../folderActions'
import { buildFolderTree } from '../folderTree'
import { useFolders } from '../useFolders'
import FolderItem from './FolderItem'
import FolderNavLink, { type FolderNavView } from './FolderNavLink'
import type { FolderNavState } from './folderNavState'
import type { FolderNavVariant } from './folderNavVariants'
import { useOpenFolders } from './useOpenFolders'

type FolderNavProps = {
  variant: FolderNavVariant
  /** The folder the notes grid shows, or `null` for one of the `views`. */
  activeFolderId: number | null
  /** Where a folder's notes are listed. */
  folderTo: (id: number) => To
  /**
   * The rows above the folders: all of the user's own notes, those filed in no folder, and those shared
   * with the user.
   */
  views: Record<'all' | 'unfiled' | 'shared', FolderNavView>
  /** Called as a folder is picked, e.g. to close the sheet it's in. */
  onNavigate?: () => void
  /**
   * Carries out an action picked in the nav (naming, moving or deleting a folder), e.g. in a view of the
   * sheet it's in. Without it, the nav opens each in a dialog.
   */
  onAction?: (action: FolderAction) => void
  className?: string
}

/**
 * All notes, then those filed in no folder (while the user has folders), then the notes shared with the
 * user (while there are any), then the user's folders as a tree
 * to pick from, each with the count of notes filed directly in it. Folders are made from its
 * button; their menus rename, nest, move and delete them.
 */
export default function FolderNav({
  variant,
  activeFolderId,
  folderTo,
  views,
  onNavigate,
  onAction,
  className,
}: FolderNavProps) {
  const { folders, isLoading, error, reload } = useFolders()
  const tree = useMemo(() => buildFolderTree(folders ?? []), [folders])
  const openFolders = useOpenFolders(folders, activeFolderId)
  const [dialog, setDialog] = useState<FolderAction | null>(null)

  // Picked from a folder's menu, a dialog waits for the menu to close, so focus goes into the dialog.
  const act = (action: FolderAction) =>
    onAction ? onAction(action) : afterMenuCloses(() => setDialog(action))
  const nav: FolderNavState = {
    variant,
    activeFolderId,
    folderTo,
    onNavigate,
    isOpen: openFolders.isOpen,
    toggle: openFolders.toggle,
    rename: (folder) => act({ kind: 'rename', folder }),
    createIn: (parent) => {
      // So the new folder shows inside it.
      openFolders.open(parent.id)
      act({ kind: 'create', parent })
    },
    move: (folder) => act({ kind: 'move', folder }),
    remove: (folder) => act({ kind: 'delete', folder }),
  }

  const isSidebar = variant === 'sidebar'

  return (
    <nav aria-label="Folders" className={cx('flex flex-col', className)}>
      <FolderNavLink
        variant={variant}
        view={views.all}
        Icon={NotesIcon}
        onNavigate={onNavigate}
      >
        All notes
      </FolderNavLink>

      {/* Without folders, every note is unfiled. */}
      {(views.unfiled.isActive || tree.length > 0) && (
        <FolderNavLink
          variant={variant}
          view={views.unfiled}
          Icon={PageIcon}
          onNavigate={onNavigate}
        >
          Unfiled
        </FolderNavLink>
      )}

      {(views.shared.isActive || !!views.shared.count) && (
        <FolderNavLink
          variant={variant}
          view={views.shared}
          Icon={UserIcon}
          onNavigate={onNavigate}
        >
          Shared with me
        </FolderNavLink>
      )}

      {isSidebar && (
        <div className="mt-2 flex items-center justify-between border-t border-border-soft pt-4 pb-2 pl-2">
          <Eyebrow as="h2">Folders</Eyebrow>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => act({ kind: 'create' })}
            className="-my-2 px-2"
          >
            <PlusIcon />
            Add
          </Button>
        </div>
      )}

      {isLoading ? (
        <div aria-hidden className="flex animate-pulse flex-col gap-4 p-2">
          {[3, 4, 2].map((quarters) => (
            <Skeleton
              key={quarters}
              className="h-3"
              style={{ width: `${quarters * 25}%` }}
            />
          ))}
        </div>
      ) : error ? (
        <ErrorRetry onRetry={reload} className="p-2">
          {error}
        </ErrorRetry>
      ) : (
        <ul>
          {tree.length === 0 && isSidebar && (
            <li className="px-2 py-1 text-sm text-faint">No folders yet</li>
          )}
          {tree.map((folder) => (
            <FolderItem key={folder.id} folder={folder} depth={0} nav={nav} />
          ))}
        </ul>
      )}

      {!isSidebar && !isLoading && !error && (
        <Button
          variant="ghost"
          onClick={() => act({ kind: 'create' })}
          className="h-12 justify-start px-0 text-base"
        >
          <span className="flex size-6 items-center justify-center rounded-full bg-accent-soft">
            <PlusIcon />
          </span>
          New folder
        </Button>
      )}

      {dialog && folders && (
        <FolderActionDialog
          action={dialog}
          folders={folders}
          onClose={() => setDialog(null)}
        />
      )}
    </nav>
  )
}
