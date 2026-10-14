import Icon from '@/components/icons/Icon'
import type { IconProps } from '@/components/icons/types'

export default function UserIcon({ size = 16, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <circle cx="10" cy="7" r="3.2" />
      <path d="M4 17 c1-3.6 3.2-5 6-5 s5 1.4 6 5" />
    </Icon>
  )
}
