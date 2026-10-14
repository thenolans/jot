import Avatar from '@/components/ui/Avatar'

import { displayName } from '../displayName'
import type { Person } from '../types'
import { useGravatarUrl } from './useGravatarUrl'

type UserAvatarProps = {
  user: Person | null
  className?: string
}

/** A person's Gravatar, or else the initial of their name, or of their email when they have no name. */
export default function UserAvatar({ user, className }: UserAvatarProps) {
  const gravatarUrl = useGravatarUrl(user?.email ?? undefined)
  const initial = (user ? displayName(user) : '?').charAt(0).toUpperCase()

  return <Avatar initial={initial} src={gravatarUrl} className={className} />
}
