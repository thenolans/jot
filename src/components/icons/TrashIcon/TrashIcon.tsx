import Icon from '@/components/icons/Icon'
import type { IconProps } from '@/components/icons/types'

export default function TrashIcon({ size = 16, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <path d="M3 5 H17" />
      <path d="M8 5 V3 H12 V5" />
      <path d="M5 5 L6 17 H14 L15 5" />
    </Icon>
  )
}
