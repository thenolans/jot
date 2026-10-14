import JotIcon from '@/components/icons/JotIcon'
import { cx } from '@/lib/cx'

type LogoProps = {
  /** `inverse` is for placing the logo on the accent color, under `scheme-light` so it stays the same in dark mode. */
  tone?: 'default' | 'inverse'
}

const tones = {
  default: {
    outline: 'text-accent',
    lines: 'stroke-accent-mid',
    wordmark: 'text-accent',
    dot: 'text-accent-mid',
  },
  inverse: {
    outline: 'text-surface',
    lines: 'stroke-accent-soft',
    wordmark: 'text-surface',
    dot: 'text-accent-soft',
  },
} satisfies Record<NonNullable<LogoProps['tone']>, Record<string, string>>

export default function Logo({ tone = 'default' }: LogoProps) {
  const colors = tones[tone]

  return (
    <span className="inline-flex items-center gap-2">
      <JotIcon
        className={cx('size-8 flex-none', colors.outline)}
        linesClassName={colors.lines}
      />
      <span
        className={cx(
          'font-display text-3xl font-extrabold tracking-tight',
          colors.wordmark,
        )}
      >
        jot<span className={colors.dot}>.</span>
      </span>
    </span>
  )
}
