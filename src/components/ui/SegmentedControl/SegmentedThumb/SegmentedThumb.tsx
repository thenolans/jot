import { segmentedThumbClassName } from '../segmentedClassNames'

type SegmentedThumbProps = {
  /** The active segment's position. */
  index: number
  /** How many segments there are. */
  count: number
}

/**
 * The sliding thumb for segments in equal columns on a raised track: place it first in a `relative` grid with `auto-cols-fr grid-flow-col`.
 * It's one column wide and moves a whole column per step, so it needs no measuring.
 */
export default function SegmentedThumb({ index, count }: SegmentedThumbProps) {
  return (
    <span
      aria-hidden="true"
      className={segmentedThumbClassName(
        {},
        'absolute inset-y-0 left-0 transition-transform duration-slide ease-out-quint motion-reduce:transition-none',
      )}
      style={{
        width: `${100 / count}%`,
        transform: `translateX(${index * 100}%)`,
      }}
    />
  )
}
