import Icon from '@/components/icons/Icon'
import type { IconProps } from '@/components/icons/types'

/** A page with lines of text, for all of the user's notes. */
export default function NotesIcon({ size = 16, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <rect x="3" y="3" width="14" height="14" rx="3" />
      <path d="M6.5 8 H13.5 M6.5 12 H11" />
    </Icon>
  )
}
