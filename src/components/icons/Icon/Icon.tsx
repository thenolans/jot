import type { ComponentProps } from 'react'

type IconProps = Omit<ComponentProps<'svg'>, 'width' | 'height'> & {
  size?: number
}

/**
 * The shared frame for icons: a 20-unit square drawn in rounded strokes of the
 * text color, so every icon has the same weight at the same size. Icons pass
 * only their shapes; a shape that should be filled sets its own `fill`.
 */
export default function Icon({ size = 16, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}
