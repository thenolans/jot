import Icon from '@/components/icons/Icon'
import type { IconProps } from '@/components/icons/types'

export default function CloudOffIcon({ size = 16, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <path d="M18.8 14.1 A4.2 4.2 0 0 0 15 8.3 H14 A6.7 6.7 0 0 0 8.1 3.3" />
      <path d="M4.2 4.2 A6.7 6.7 0 0 0 7.5 16.7 H15 A4.2 4.2 0 0 0 16.4 16.4" />
      <path d="M2.5 2.5 L17.5 17.5" />
    </Icon>
  )
}
