import Icon from '@/components/icons/Icon'
import type { IconProps } from '@/components/icons/types'

type ScoopIconProps = IconProps & {
  /** A text color class for the sprinkles; the scoop and cone take the text color. */
  detailClassName?: string
}

/** Scoop's logo: a tilted cone with sprinkles on its scoop. */
export default function ScoopIcon({
  size = 20,
  className,
  detailClassName,
}: ScoopIconProps) {
  return (
    <Icon size={size} viewBox="5 6 72 72" strokeWidth="6" className={className}>
      <g transform="rotate(-7 42 42) translate(0 -3.5)">
        <path d="M20 35 A22 22 0 0 1 64 35 a4.6 4.6 0 0 1 -1 9 H21 a4.6 4.6 0 0 1 -1 -9 Z" />
        <path d="M25 45 L38.5 76.5 Q42 81 45.5 76.5 L59 45" />
        <path
          className={detailClassName}
          strokeWidth="5"
          d="M31 32 L35.5 28 M42 22.5 L47.5 24 M47.5 33 L52 36"
        />
      </g>
    </Icon>
  )
}
