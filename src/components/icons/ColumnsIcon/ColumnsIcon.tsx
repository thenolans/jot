import Icon from '@/components/icons/Icon'
import type { IconProps } from '@/components/icons/types'

/** A frame split into two columns, for how notes are laid out. */
export default function ColumnsIcon({ size = 16, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <rect x="3" y="3" width="14" height="14" rx="3" />
      <path d="M10 3 V17" />
    </Icon>
  )
}
