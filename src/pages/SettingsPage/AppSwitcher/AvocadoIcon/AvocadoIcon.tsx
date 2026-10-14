import Icon from '@/components/icons/Icon'
import type { IconProps } from '@/components/icons/types'

type AvocadoIconProps = IconProps & {
  /** A text color class for the pit; the outline takes the text color. */
  detailClassName?: string
}

/** Avocado's logo: an avocado half with its pit. */
export default function AvocadoIcon({
  size = 20,
  className,
  detailClassName,
}: AvocadoIconProps) {
  return (
    <Icon
      size={size}
      viewBox="0 0 52 52"
      strokeWidth="4.2"
      className={className}
    >
      <path d="M20 10 C14 18 12 26 14 33 a13 11 0 0 0 24 4 C42 28 36 16 20 10 Z" />
      <circle
        className={detailClassName}
        cx="28"
        cy="30"
        r="4.5"
        fill="currentColor"
        stroke="none"
      />
    </Icon>
  )
}
