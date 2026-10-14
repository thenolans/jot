import Icon from '@/components/icons/Icon'
import type { IconProps } from '@/components/icons/types'

export default function ThemeIcon({ size = 16, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <circle cx="10" cy="10" r="7" />
      <path d="M10 3 a7 7 0 0 1 0 14 z" fill="currentColor" stroke="none" />
    </Icon>
  )
}
