import type { ComponentType, ReactNode } from 'react'

import type { IconProps } from '@/components/icons/types'
import RowLabel from '@/components/ui/RowLabel'

type SettingsRowProps = {
  Icon: ComponentType<IconProps>
  title: string
  description?: string
  /** The row's control, shown at the end. */
  children?: ReactNode
}

export default function SettingsRow({
  Icon,
  title,
  description,
  children,
}: SettingsRowProps) {
  return (
    <div className="flex items-center gap-4 p-4">
      <div className="grid size-8 flex-none place-items-center rounded-sm bg-accent-soft text-accent">
        <Icon />
      </div>
      <RowLabel title={title} description={description} />
      {children}
    </div>
  )
}
