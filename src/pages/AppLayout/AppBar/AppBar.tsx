import { Link } from 'react-router'

import { paths } from '@/app/paths'
import Logo from '@/components/ui/Logo'
import TopBar from '@/components/ui/TopBar'

import AccountButton from './AccountButton'
import ConnectionStatus from './ConnectionStatus'

/** The signed-in app's top bar: logo and whether it's offline, and the account. */
export default function AppBar() {
  return (
    <TopBar className="justify-between print:hidden">
      <div className="flex items-center gap-2">
        <Link to={paths.notes} className="rounded-sm">
          <Logo />
        </Link>
        <ConnectionStatus />
      </div>

      <AccountButton />
    </TopBar>
  )
}
