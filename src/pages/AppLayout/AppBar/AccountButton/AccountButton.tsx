import { Link } from 'react-router'

import { paths } from '@/app/paths'
import { useCurrentUser } from '@/features/auth/useCurrentUser'
import UserAvatar from '@/features/auth/UserAvatar'
import { cx } from '@/lib/cx'

/** The signed-in user's avatar, linking to settings. */
export default function AccountButton({ className }: { className?: string }) {
  const { user } = useCurrentUser()

  return (
    <Link
      to={paths.settings}
      aria-label="Account settings"
      title="Account settings"
      className={cx('rounded-full', className)}
    >
      <UserAvatar user={user} />
    </Link>
  )
}
