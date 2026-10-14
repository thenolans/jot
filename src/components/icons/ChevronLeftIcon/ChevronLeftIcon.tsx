import Icon from '@/components/icons/Icon'
import type { IconProps } from '@/components/icons/types'

export default function ChevronLeftIcon({ size = 16, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <path d="M12.5 4 L6.5 10 L12.5 16" />
    </Icon>
  )
}
