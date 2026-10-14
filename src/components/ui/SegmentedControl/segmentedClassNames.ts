import { cx } from '@/lib/cx'

export type SegmentedStyleProps = {
  /** `raised` lifts the active segment on a sunken track; `accent` fills it with the accent color on a pill. */
  variant?: 'raised' | 'accent'
  /** Sets the track's height and the segments' text; give the track and its segments the same size. */
  size?: 'sm' | 'md'
}

export type SegmentedItemStyleProps = SegmentedStyleProps & {
  active?: boolean
}

type Variant = NonNullable<SegmentedStyleProps['variant']>
type Size = NonNullable<SegmentedStyleProps['size']>

const tracks = {
  raised: 'rounded-sm border border-border bg-border-soft p-1',
  accent: 'rounded-full border border-border bg-surface p-1',
} satisfies Record<Variant, string>

// A raised track matches an `sm` button at `sm`, and a text field (and an `md` button) at `md`, so it
// lines up with the controls beside it. The accent pill takes its height from its segments.
const raisedTrackHeights = {
  sm: 'h-8',
  md: 'h-10',
} satisfies Record<Size, string>

const thumbs = {
  // Inset by the track's padding, so its corners stay concentric with the track's.
  raised: 'rounded-xs bg-surface shadow-card',
  accent: 'rounded-full bg-accent',
} satisfies Record<Variant, string>

const itemBase =
  'relative text-center font-display cursor-pointer transition-colors'

const itemSizes = {
  sm: 'px-2 text-sm',
  md: 'px-4 text-base',
} satisfies Record<Size, string>

const items = {
  // Fills the track's height and centers its text, since the track sets the height.
  raised: {
    shape: 'flex h-full items-center justify-center rounded-xs',
    active: 'font-bold text-ink-strong',
    inactive: 'font-semibold text-muted hover:text-ink',
  },
  // Always bold, so a segment keeps its width (and the measured indicator its place) when it becomes active.
  accent: {
    shape: 'rounded-full font-bold',
    active: 'text-on-accent',
    inactive: 'text-muted hover:text-ink',
  },
} satisfies Record<Variant, Record<'shape' | 'active' | 'inactive', string>>

/** Class names for a segmented control's track, the row that holds its segments. */
export function segmentedTrackClassName(
  { variant = 'raised', size = 'sm' }: SegmentedStyleProps,
  className?: string,
) {
  return cx(
    tracks[variant],
    variant === 'raised' && raisedTrackHeights[size],
    className,
  )
}

/** Class names for the thumb that marks a segmented control's active segment; position it at the call site. */
export function segmentedThumbClassName(
  { variant = 'raised' }: Pick<SegmentedStyleProps, 'variant'>,
  className?: string,
) {
  return cx(thumbs[variant], className)
}

/** Class names for one segment of a segmented control (a radio's label, a link, a button). */
export function segmentedItemClassName(
  { variant = 'raised', active, size = 'sm' }: SegmentedItemStyleProps,
  className?: string,
) {
  const item = items[variant]
  return cx(
    itemBase,
    itemSizes[size],
    item.shape,
    active ? item.active : item.inactive,
    className,
  )
}
