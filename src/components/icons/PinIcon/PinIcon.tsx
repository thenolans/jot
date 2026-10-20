import Icon from '@/components/icons/Icon'
import type { IconProps } from '@/components/icons/types'

type PinIconProps = IconProps & {
  /** Filled in, for something pinned. */
  filled?: boolean
}

/** A pushpin, for pinning something ahead of the rest. */
export default function PinIcon({
  size = 16,
  filled = false,
  className,
}: PinIconProps) {
  return (
    <Icon size={size} className={className}>
      <path d="M6.5 2.5h7" />
      <path
        d="M8 2.5h4v5l3 3.5v1.5H5V11l3-3.5Z"
        fill={filled ? 'currentColor' : undefined}
      />
      <path d="M10 12.5V18" />
    </Icon>
  )
}
