import Icon from '@/components/icons/Icon'
import type { IconProps } from '@/components/icons/types'

type DabberIconProps = IconProps & {
  /** A text color class for the dab; the card takes the text color. */
  detailClassName?: string
}

/** Dabber's logo: a tilted bingo card with a dab on the free space. */
export default function DabberIcon({
  size = 20,
  className,
  detailClassName,
}: DabberIconProps) {
  return (
    <Icon
      size={size}
      viewBox="0 0 52 52"
      strokeWidth="4.2"
      className={className}
    >
      <g transform="rotate(-8 26 26)">
        <rect x="9" y="9" width="34" height="34" rx="4" />
        <path d="M20.3 9v34M31.7 9v34M9 20.3h34M9 31.7h34" />
        <path
          className={detailClassName}
          fill="currentColor"
          stroke="none"
          transform="translate(-0.4 0.2) scale(1.08) translate(-1.9 -2)"
          d="M26 18.6c2.3-.4 3.4 1.6 5 2.4 1.9.9 3.9 1.6 3.9 4.1 0 2.2-1.8 3-2.6 4.6-.9 1.9-1.4 4.1-4.1 4.3-2.4.2-3.6-1.5-5.3-2.6-1.7-1.1-3.9-1.7-4-4.1-.1-2.4 1.9-3.4 3-5.1 1.1-1.6 1.7-3.3 4.1-3.6Z"
        />
      </g>
    </Icon>
  )
}
