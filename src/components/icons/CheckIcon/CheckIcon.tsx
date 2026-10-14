import Icon from '@/components/icons/Icon'
import type { IconProps } from '@/components/icons/types'

export default function CheckIcon({ size = 12, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <path d="M4 10.5 L8 14.5 L16 5.5" />
    </Icon>
  )
}
