import Icon from '@/components/icons/Icon'
import type { IconProps } from '@/components/icons/types'

export default function LogOutIcon({ size = 16, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <path d="M8 3.5 H4.5 a1 1 0 0 0 -1 1 v11 a1 1 0 0 0 1 1 H8 M12.5 13.5 L16 10 L12.5 6.5 M16 10 H7.5" />
    </Icon>
  )
}
