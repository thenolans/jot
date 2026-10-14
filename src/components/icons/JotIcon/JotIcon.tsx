import Icon from '@/components/icons/Icon'
import type { IconProps } from '@/components/icons/types'
import { cx } from '@/lib/cx'

type JotIconProps = IconProps & {
  /** Stroke for the two lines of writing; the page and its folded corner take the text color. */
  linesClassName?: string
}

/** The note from the logo, drawn on its own larger grid with the logo's stroke. */
export default function JotIcon({
  size = 32,
  className,
  linesClassName,
}: JotIconProps) {
  return (
    <Icon
      size={size}
      viewBox="0 0 52 52"
      strokeWidth="3.4"
      className={className}
    >
      <g transform="rotate(-8 26 26)">
        <path d="M10 10 h32 v24 l-8 8 h-24 Z" />
        <path d="M42 34 h-8 v8 Z" fill="currentColor" />
        <path
          className={cx('stroke-accent-mid', linesClassName)}
          d="M17 20 h18 M17 28 h12"
        />
      </g>
    </Icon>
  )
}
