import Icon from '@/components/icons/Icon'
import type { IconProps } from '@/components/icons/types'

type FramerIconProps = IconProps & {
  /** A text color class for the inner mat; the frame takes the text color. */
  detailClassName?: string
}

/** Framer's logo: a tilted frame around a mat. */
export default function FramerIcon({
  size = 20,
  className,
  detailClassName,
}: FramerIconProps) {
  return (
    <Icon
      size={size}
      viewBox="0 0 52 52"
      strokeWidth="4.2"
      className={className}
    >
      <g transform="rotate(-8 26 26)">
        <rect x="8" y="12" width="36" height="28" />
        <rect
          className={detailClassName}
          x="15"
          y="19"
          width="22"
          height="14"
        />
      </g>
    </Icon>
  )
}
