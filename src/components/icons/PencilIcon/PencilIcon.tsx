import Icon from '@/components/icons/Icon'
import type { IconProps } from '@/components/icons/types'

export default function PencilIcon({ size = 16, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <path d="M13.5 3.5 a2.1 2.1 0 0 1 3 3 L7 16 L3 17 L4 13 Z" />
      <path d="M11.5 5.5 L14.5 8.5" />
    </Icon>
  )
}
