import { Link } from 'react-router'

import ArrowRightIcon from '@/components/icons/ArrowRightIcon'
import ChevronRightIcon from '@/components/icons/ChevronRightIcon'
import FolderIcon from '@/components/icons/FolderIcon'
import FolderPlusIcon from '@/components/icons/FolderPlusIcon'
import PencilIcon from '@/components/icons/PencilIcon'
import TrashIcon from '@/components/icons/TrashIcon'
import IconButton from '@/components/ui/IconButton'
import Menu, { MenuDivider, MenuItem } from '@/components/ui/Menu'
import { cx } from '@/lib/cx'

import type { FolderNode } from '../../folderTree'
import FolderCount from '../FolderCount'
import FolderNavRow from '../FolderNavRow'
import type { FolderNavState } from '../folderNavState'
import { folderNavVariants } from '../folderNavVariants'

type FolderItemProps = {
  folder: FolderNode
  depth: number
  nav: FolderNavState
}

// In the sidebar, with a mouse, a folder's actions show in place of its count while it's hovered or has
// focus, or their menu is open; they're always there to tap. The button is see-through rather than gone,
// so a menu closing can still hand focus back to it, which a dialog opened from the menu waits for.
const hoverOnly = {
  slot: 'group/actions pointer-fine:grid pointer-fine:*:col-start-1 pointer-fine:*:row-start-1',
  count:
    'pointer-fine:group-focus-within:invisible pointer-fine:group-hover:invisible pointer-fine:group-has-aria-expanded/actions:invisible',
  menu: 'pointer-fine:opacity-0 pointer-fine:group-focus-within:opacity-100 pointer-fine:group-hover:opacity-100 pointer-fine:aria-expanded:opacity-100',
}

/** A folder in a `FolderNav`, then the folders inside it while it's open. */
export default function FolderItem({ folder, depth, nav }: FolderItemProps) {
  const { variant } = nav
  const isActive = nav.activeFolderId === folder.id
  const isOpen = nav.isOpen(folder.id)
  const hasChildren = folder.children.length > 0
  const { label, iconSize } = folderNavVariants[variant]
  const isSidebar = variant === 'sidebar'

  const toggle = hasChildren ? (
    <IconButton
      size="sm"
      onClick={() => nav.toggle(folder.id)}
      aria-expanded={isOpen}
      aria-label={`Folders in ${folder.name}`}
      className="text-muted"
    >
      <ChevronRightIcon
        size={12}
        className={cx(
          'transition-transform motion-reduce:transition-none',
          isOpen && 'rotate-90',
        )}
      />
    </IconButton>
  ) : undefined

  return (
    <li>
      <FolderNavRow
        variant={variant}
        depth={depth}
        active={isActive}
        toggle={toggle}
        end={
          <span
            className={cx(
              'flex flex-none items-center gap-1',
              isSidebar && hoverOnly.slot,
            )}
          >
            <Menu
              label={`Actions for ${folder.name}`}
              placement="bottom end"
              size={isSidebar ? 'sm' : 'md'}
              className={cx(isSidebar && hoverOnly.menu)}
            >
              <MenuItem
                icon={<PencilIcon />}
                onAction={() => nav.rename(folder)}
              >
                Rename
              </MenuItem>
              <MenuItem
                icon={<FolderPlusIcon />}
                onAction={() => nav.createIn(folder)}
              >
                New subfolder
              </MenuItem>
              <MenuItem
                icon={<ArrowRightIcon />}
                onAction={() => nav.move(folder)}
              >
                Move to…
              </MenuItem>
              <MenuDivider />
              <MenuItem
                variant="danger"
                icon={<TrashIcon />}
                onAction={() => nav.remove(folder)}
              >
                Delete folder
              </MenuItem>
            </Menu>
            <FolderCount
              count={folder.noteCount}
              variant={variant}
              active={isActive}
              className={cx(isSidebar && hoverOnly.count)}
            />
          </span>
        }
      >
        <Link
          to={nav.folderTo(folder.id)}
          onClick={nav.onNavigate}
          aria-current={isActive ? 'page' : undefined}
          className={cx(
            'flex min-w-0 flex-1 items-center self-stretch rounded-xs',
            label,
            depth === 0 ? 'font-display font-semibold' : 'font-medium',
          )}
        >
          <FolderIcon
            size={iconSize}
            className={cx(
              'flex-none',
              isActive || depth === 0 ? 'text-accent' : 'text-faint',
            )}
          />
          <span className="truncate">{folder.name}</span>
        </Link>
      </FolderNavRow>

      {hasChildren && isOpen && (
        <ul>
          {folder.children.map((child) => (
            <FolderItem
              key={child.id}
              folder={child}
              depth={depth + 1}
              nav={nav}
            />
          ))}
        </ul>
      )}
    </li>
  )
}
