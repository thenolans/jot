import Icon from '@/components/icons/Icon'
import type { IconProps } from '@/components/icons/types'

/** Three dots in a column, for a button that opens a menu of actions. */
export default function MoreVerticalIcon({ size = 16, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <circle cx="10" cy="4" r="0.5" />
      <circle cx="10" cy="10" r="0.5" />
      <circle cx="10" cy="16" r="0.5" />
    </Icon>
  )
}
