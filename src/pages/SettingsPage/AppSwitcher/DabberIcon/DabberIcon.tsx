import Icon from '@/components/icons/Icon'
import type { IconProps } from '@/components/icons/types'

type DabberIconProps = IconProps & {
  /** A text color class for the dab; the card takes the text color. */
  detailClassName?: string
}

/** Dabber's logo: a tilted 2×2 bingo card with an ink blot on its bottom-right cell. */
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
        <path d="M26 9v34M9 26h34" />
        <path
          className={detailClassName}
          fill="currentColor"
          stroke="none"
          transform="translate(34.5 34.5) scale(0.32) translate(-20 -20)"
          d="M37.1 20.9C37.1 21.8 38 22.8 38.1 23.8C38.1 24.8 37.8 25.8 37.5 26.7C37.1 27.6 36.5 28.4 36 29.2C35.5 30 35 30.8 34.4 31.6C33.8 32.3 33.1 33 32.4 33.7C31.7 34.3 31 35 30.2 35.4C29.3 35.7 28.2 35.6 27.3 35.9C26.5 36.2 25.8 37 25 37.4C24.2 37.7 23.2 37.8 22.3 37.9C21.5 38 20.5 38 19.6 37.9C18.8 37.9 17.9 37.7 17 37.5C16.1 37.4 15.3 37.2 14.4 37C13.5 36.8 12.6 36.7 11.7 36.5C10.8 36.2 9.8 36 9 35.5C8.2 35 7.7 34.2 7 33.5C6.3 32.9 5.4 32.4 4.9 31.6C4.3 30.9 4 29.9 3.6 29C3.3 28.2 2.8 27.3 2.7 26.4C2.6 25.5 2.9 24.4 2.9 23.5C2.9 22.6 2.7 21.8 2.7 20.9C2.6 20 2.7 19.1 2.7 18.2C2.7 17.3 2.5 16.3 2.7 15.4C2.9 14.5 3.4 13.6 3.8 12.8C4.2 11.9 4.5 11 5.1 10.3C5.7 9.6 6.5 9.1 7.2 8.4C7.8 7.7 8.3 6.8 9.1 6.3C9.8 5.8 10.9 5.8 11.7 5.2C12.5 4.7 13 3.6 13.9 3.1C14.7 2.6 15.7 2.3 16.7 2.3C17.7 2.2 18.7 2.5 19.6 2.8C20.6 3.1 21.5 3.6 22.3 3.9C23.2 4.3 24 4.5 24.9 4.8C25.7 5.2 26.5 5.6 27.2 6C28 6.4 28.7 6.9 29.5 7.3C30.3 7.7 31.3 8 32 8.5C32.7 9.1 33 10 33.6 10.7C34.2 11.4 35 12 35.4 12.8C35.9 13.6 36 14.6 36.4 15.4C36.8 16.3 37.6 17.1 37.7 18C37.8 18.9 37 19.9 37.1 20.9Z"
        />
      </g>
    </Icon>
  )
}
