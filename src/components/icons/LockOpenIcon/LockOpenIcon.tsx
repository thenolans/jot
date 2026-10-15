import Icon from '@/components/icons/Icon'
import type { IconProps } from '@/components/icons/types'

export default function LockOpenIcon({ size = 16, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <rect x="4" y="9" width="12" height="8" rx="2" />
      <path d="M7 9 V6.5 a3 3 0 0 1 5.8-1" />
    </Icon>
  )
}
