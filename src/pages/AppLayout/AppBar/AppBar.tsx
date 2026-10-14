import { Link } from 'react-router'

import { paths } from '@/app/paths'
import Logo from '@/components/ui/Logo'
import TopBar from '@/components/ui/TopBar'

import AccountButton from './AccountButton'
import ConnectionStatus from './ConnectionStatus'
import SearchButton from './SearchButton'

type AppBarProps = {
  /** The search the notes grid is narrowed to, or `''`. */
  searchQuery: string
  onSearch: () => void
}

/** The signed-in app's top bar: logo and whether it's offline, search, and the account. */
export default function AppBar({ searchQuery, onSearch }: AppBarProps) {
  return (
    <TopBar className="grid grid-cols-[1fr_auto_1fr] gap-4 print:hidden">
      <div className="flex items-center gap-2 justify-self-start">
        <Link to={paths.notes} className="rounded-sm">
          <Logo />
        </Link>
        <ConnectionStatus />
      </div>

      <SearchButton query={searchQuery} onClick={onSearch} />

      <AccountButton className="col-start-3 justify-self-end" />
    </TopBar>
  )
}
