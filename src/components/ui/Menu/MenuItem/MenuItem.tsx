import type { ReactNode } from 'react'
import {
  MenuItem as AriaMenuItem,
  type MenuItemProps as AriaMenuItemProps,
} from 'react-aria-components'

import { cx } from '@/lib/cx'

type MenuItemProps = Omit<AriaMenuItemProps, 'children' | 'className'> & {
  /** Shown before the label, at 16px. */
  icon?: ReactNode
  /** `danger` for destructive actions, like deleting. */
  variant?: 'default' | 'danger'
  children: string
  className?: string
}

/** An action in a `Menu`. `onAction` runs it, then the menu closes. */
export default function MenuItem({
  icon,
  variant = 'default',
  children,
  className,
  ...props
}: MenuItemProps) {
  // The highlight shows which action has focus, in place of the focus ring.
  return (
    <AriaMenuItem
      textValue={children}
      className={cx(
        'flex cursor-pointer items-center gap-2 rounded-xs p-2 text-base outline-none focus-visible:shadow-none',
        variant === 'danger'
          ? 'text-danger data-focused:bg-danger-soft'
          : 'text-ink data-focused:bg-accent-soft data-focused:text-accent',
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </AriaMenuItem>
  )
}
