import Icon from '@/components/icons/Icon'
import type { IconProps } from '@/components/icons/types'

/** An arrow turning back on itself, for starting something over. */
export default function ResetIcon({ size = 16, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <path d="M3.5 10 A6.5 6.5 0 1 0 5.4 5.4" />
      <path d="M3.5 3 V7.5 H8" />
    </Icon>
  )
}
