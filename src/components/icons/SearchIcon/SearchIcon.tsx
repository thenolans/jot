import Icon from '@/components/icons/Icon'
import type { IconProps } from '@/components/icons/types'

export default function SearchIcon({ size = 16, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <circle cx="8.5" cy="8.5" r="5.5" />
      <path d="M12.5 12.5 L17 17" />
    </Icon>
  )
}
