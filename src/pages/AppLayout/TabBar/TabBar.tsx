import { Link } from 'react-router'

import { paths } from '@/app/paths'
import FolderIcon from '@/components/icons/FolderIcon'
import NotesIcon from '@/components/icons/NotesIcon'
import SearchIcon from '@/components/icons/SearchIcon'
import { cx } from '@/lib/cx'

type TabBarProps = {
  /** Every note is showing, rather than a folder's. */
  isAllNotes: boolean
  /** A folder is showing, or the folder sheet is open. */
  isFoldersActive: boolean
  onOpenFolders: () => void
  onSearch: () => void
}

const itemClassName = (active: boolean) =>
  cx(
    'flex min-w-16 cursor-pointer flex-col items-center gap-1 rounded-sm px-2 py-1 text-xs',
    active ? 'font-bold text-accent' : 'text-faint hover:text-muted',
  )

/**
 * Bottom navigation for narrow screens: every note, the folder sheet, or search. Wide screens have the
 * sidebar, and search in the app bar.
 */
export default function TabBar({
  isAllNotes,
  isFoldersActive,
  onOpenFolders,
  onSearch,
}: TabBarProps) {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-20 flex h-(--tab-bar-height) items-center justify-around border-t border-border bg-bar px-2 pb-safe-area backdrop-blur-sm md:hidden print:hidden"
    >
      <Link
        to={paths.notes}
        aria-current={isAllNotes ? 'page' : undefined}
        className={itemClassName(!isFoldersActive)}
      >
        <NotesIcon size={20} />
        Notes
      </Link>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={onOpenFolders}
        className={itemClassName(isFoldersActive)}
      >
        <FolderIcon size={20} />
        Folders
      </button>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={onSearch}
        className={itemClassName(false)}
      >
        <SearchIcon size={20} />
        Search
      </button>
    </nav>
  )
}
