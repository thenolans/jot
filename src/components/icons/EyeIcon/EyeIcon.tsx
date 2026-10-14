import Icon from '@/components/icons/Icon'
import type { IconProps } from '@/components/icons/types'

export default function EyeIcon({ size = 16, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <path d="M2 10 C4 5 8 3 10 3 C12 3 16 5 18 10 C16 15 12 17 10 17 C8 17 4 15 2 10 Z" />
      <circle cx="10" cy="10" r="2.6" />
    </Icon>
  )
}
