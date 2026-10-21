import Icon from '@/components/icons/Icon'
import type { IconProps } from '@/components/icons/types'

/** A ticked box, for checklists. */
export default function ChecklistIcon({ size = 16, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <rect x="3" y="3" width="14" height="14" rx="3" />
      <path d="M6.5 10 L9 12.5 L13.5 7.5" />
    </Icon>
  )
}
