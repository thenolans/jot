import Icon from '@/components/icons/Icon'
import type { IconProps } from '@/components/icons/types'

/** Two columns of dots, marking something that can be dragged. */
export default function GripIcon({ size = 16, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      {[4, 10, 16].flatMap((y) =>
        [7, 13].map((x) => (
          <circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r="1.75"
            fill="currentColor"
            stroke="none"
          />
        )),
      )}
    </Icon>
  )
}
