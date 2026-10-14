import { type ReactNode, useId } from 'react'

import Card from '@/components/ui/Card'
import Eyebrow from '@/components/ui/Eyebrow'

type SettingsSectionProps = {
  /** Shown above the card; leave it out for the first, unlabelled section. */
  title?: string
  children: ReactNode
  className?: string
}

/** A card of settings rows, with an optional label above it. */
export default function SettingsSection({
  title,
  children,
  className,
}: SettingsSectionProps) {
  const titleId = useId()

  return (
    <section
      aria-labelledby={title ? titleId : undefined}
      className={className}
    >
      {title && (
        <Eyebrow as="h2" id={titleId} className="px-1 pb-2">
          {title}
        </Eyebrow>
      )}
      <Card
        variant="inset"
        className="divide-y divide-border-soft overflow-hidden"
      >
        {children}
      </Card>
    </section>
  )
}
