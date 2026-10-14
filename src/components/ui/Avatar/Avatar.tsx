import { cx } from '@/lib/cx'

import AvatarImage from './AvatarImage'

type AvatarProps = {
  /** Shown until `src` loads, and instead of it when it can't. */
  initial: string
  src?: string | null
  className?: string
}

/** A round picture of a person, falling back to their initial. Decorative: label whatever contains it. */
export default function Avatar({ initial, src, className }: AvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        'relative grid size-8 flex-none place-items-center overflow-hidden rounded-full border border-accent-soft-border bg-accent-soft font-display text-sm font-bold text-accent',
        className,
      )}
    >
      {initial}
      {/* Keyed so a new picture starts out hidden instead of inheriting the last one's state. */}
      {src && <AvatarImage key={src} src={src} />}
    </span>
  )
}
