import Icon from '@/components/icons/Icon'
import type { IconProps } from '@/components/icons/types'

export default function ChevronRightIcon({ size = 16, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <path d="M7.5 4 L13.5 10 L7.5 16" />
    </Icon>
  )
}
