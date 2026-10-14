import Icon from '@/components/icons/Icon'
import type { IconProps } from '@/components/icons/types'

/** Two people, for something shared with others. */
export default function UsersIcon({ size = 16, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <circle cx="7.5" cy="7" r="2.8" />
      <path d="M2.5 16 c0.7-3 2.6-4.3 5-4.3 s4.3 1.3 5 4.3" />
      <path d="M12.5 4.6 a2.8 2.8 0 0 1 0 4.8" />
      <path d="M14.6 11.9 c1.5 0.6 2.5 1.9 2.9 4.1" />
    </Icon>
  )
}
