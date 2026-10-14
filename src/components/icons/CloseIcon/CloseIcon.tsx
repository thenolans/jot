import Icon from '@/components/icons/Icon'
import type { IconProps } from '@/components/icons/types'

export default function CloseIcon({ size = 12, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <path d="M4 4 L16 16 M16 4 L4 16" />
    </Icon>
  )
}
