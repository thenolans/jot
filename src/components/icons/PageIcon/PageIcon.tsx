import Icon from '@/components/icons/Icon'
import type { IconProps } from '@/components/icons/types'

/** A single page with a folded corner, for the notes filed in no folder. */
export default function PageIcon({ size = 16, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <path d="M5 3 H11.5 L16 7.5 V15 A2 2 0 0 1 14 17 H6 A2 2 0 0 1 4 15 V4 A1 1 0 0 1 5 3 Z" />
      <path d="M11 3 V8 H16" />
    </Icon>
  )
}
