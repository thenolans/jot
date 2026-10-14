import type { ReactNode } from 'react'
import {
  Button,
  Menu as AriaMenu,
  MenuTrigger,
  Popover,
  type PopoverProps,
} from 'react-aria-components'

import MoreVerticalIcon from '@/components/icons/MoreVerticalIcon'
import {
  iconButtonClassName,
  type IconButtonStyleProps,
} from '@/components/ui/IconButton'

type MenuProps = {
  /** Names the button that opens it, e.g. "Note actions". */
  label: string
  /** Its actions, as `MenuItem`s. */
  children: ReactNode
  /** Where it opens against the button, e.g. `top start` for a button at the foot of a panel. */
  placement?: PopoverProps['placement']
  /** The button's size, from `IconButton`'s; `lg` by default. */
  size?: IconButtonStyleProps['size']
  /** Classes for the button. */
  className?: string
}

const iconSizes = { sm: 16, md: 16, lg: 20 }

/**
 * A button showing three dots, stacked, that opens a list of actions (`MenuItem`s) beside it. The arrow keys move
 * through the actions and Enter picks one; it closes once one is picked, on Esc or on a click outside.
 */
export default function Menu({
  label,
  children,
  placement = 'bottom start',
  size = 'lg',
  className,
}: MenuProps) {
  return (
    <MenuTrigger>
      <Button
        aria-label={label}
        className={iconButtonClassName({ size }, className)}
      >
        <MoreVerticalIcon size={iconSizes[size]} />
      </Button>
      <Popover
        placement={placement}
        offset={4}
        className="min-w-48 rounded-sm border border-border bg-surface p-1 shadow-raised outline-none data-entering:animate-fade-in"
      >
        <AriaMenu className="outline-none focus-visible:shadow-none">
          {children}
        </AriaMenu>
      </Popover>
    </MenuTrigger>
  )
}
