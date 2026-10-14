import { type ReactNode, useId } from 'react'

import { cx } from '@/lib/cx'

import {
  segmentedItemClassName,
  segmentedTrackClassName,
} from './segmentedClassNames'
import SegmentedThumb from './SegmentedThumb'

type Option<T extends string | number> = {
  value: T
  label: string
  /** Shown before the label. */
  icon?: ReactNode
}

type SegmentedControlProps<T extends string | number> = {
  /** Accessible name for the group. */
  label: string
  options: ReadonlyArray<Option<T>>
  value: T
  onChange: (value: T) => void
  /** Below `md`, show only the options' icons, keeping their labels for screen readers. */
  iconsOnlyOnPhones?: boolean
  className?: string
}

/** A single-choice control rendered as a row of segments, backed by radio inputs, with a thumb that slides to the checked one. */
export default function SegmentedControl<T extends string | number>({
  label,
  options,
  value,
  onChange,
  iconsOnlyOnPhones,
  className,
}: SegmentedControlProps<T>) {
  const name = useId()
  const checkedIndex = options.findIndex((option) => option.value === value)

  return (
    <fieldset
      className={segmentedTrackClassName({}, cx('inline-flex', className))}
    >
      <legend className="sr-only">{label}</legend>
      <div className="relative grid flex-1 auto-cols-fr grid-flow-col">
        {checkedIndex !== -1 && (
          <SegmentedThumb index={checkedIndex} count={options.length} />
        )}
        {options.map((option) => {
          const id = `${name}-${option.value}`
          const checked = option.value === value
          return (
            <div key={option.value} className="relative">
              <input
                id={id}
                type="radio"
                name={name}
                className="peer sr-only"
                checked={checked}
                onChange={() => onChange(option.value)}
              />
              <label
                htmlFor={id}
                className={segmentedItemClassName(
                  { active: checked },
                  'gap-1 peer-focus-visible:shadow-focus',
                )}
              >
                {option.icon}
                <span className={cx(iconsOnlyOnPhones && 'max-md:sr-only')}>
                  {option.label}
                </span>
              </label>
            </div>
          )
        })}
      </div>
    </fieldset>
  )
}
