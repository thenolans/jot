import SearchIcon from '@/components/icons/SearchIcon'
import Kbd from '@/components/ui/Kbd'
import { cx } from '@/lib/cx'
import { modKeyLabel } from '@/lib/platform'

import { searchShortcut } from '../../useSearchShortcut'

type SearchButtonProps = {
  /** The search the notes grid is narrowed to, shown in place of the placeholder, or `''`. */
  query: string
  onClick: () => void
}

/** Opens search from the app bar on wide screens. It looks like a search box, but types in a dialog. */
export default function SearchButton({ query, onClick }: SearchButtonProps) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-keyshortcuts={searchShortcut}
      title={`Search (${modKeyLabel}K)`}
      onClick={onClick}
      className="hidden h-10 w-xs max-w-full cursor-pointer items-center gap-2 rounded-full border border-border bg-surface px-4 text-base transition-colors hover:border-accent-mid md:flex"
    >
      <SearchIcon size={16} className="flex-none text-muted" />
      <span
        className={cx(
          'min-w-0 flex-1 truncate text-left',
          query ? 'text-ink' : 'text-faint',
        )}
      >
        {query ? `“${query}”` : 'Search notes…'}
      </span>
      <Kbd aria-hidden="true">{modKeyLabel}K</Kbd>
    </button>
  )
}
