import Icon from '@/components/icons/Icon'
import type { IconProps } from '@/components/icons/types'

export default function PlusIcon({ size = 12, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <path d="M10 4 V16 M4 10 H16" />
    </Icon>
  )
}
