import Icon from '@/components/icons/Icon'
import type { IconProps } from '@/components/icons/types'

export default function ShareIcon({ size = 16, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <path d="M3.5 9 V15 a1.5 1.5 0 0 0 1.5 1.5 H15 a1.5 1.5 0 0 0 1.5-1.5 V9" />
      <path d="M10 12.5 V3 M6.5 6.5 L10 3 L13.5 6.5" />
    </Icon>
  )
}
