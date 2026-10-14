import Icon from '@/components/icons/Icon'
import type { IconProps } from '@/components/icons/types'

type TomeOfScoringIconProps = IconProps & {
  /** A text color class for the bookmark; the book takes the text color. */
  detailClassName?: string
}

/** Tome of Scoring's logo: a tilted book with a bookmark. */
export default function TomeOfScoringIcon({
  size = 20,
  className,
  detailClassName,
}: TomeOfScoringIconProps) {
  return (
    <Icon
      size={size}
      viewBox="0 0 52 52"
      strokeWidth="4.2"
      className={className}
    >
      <g transform="rotate(-8 26 26)">
        <rect x="10" y="8" width="32" height="36" rx="2" />
        <path d="M16.5 8 v36" strokeWidth="3.2" strokeLinecap="butt" />
        <path
          className={detailClassName}
          d="M34 7 v15 l-4-3.2 -4 3.2 v-15 Z"
          fill="currentColor"
          strokeWidth="2.4"
        />
      </g>
    </Icon>
  )
}
