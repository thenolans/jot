import Icon from '@/components/icons/Icon'
import type { IconProps } from '@/components/icons/types'

/** An arrow pointing right, for moving something elsewhere. */
export default function ArrowRightIcon({ size = 16, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <path d="M3 10 H15 M10.5 5.5 L15 10 L10.5 14.5" />
    </Icon>
  )
}
