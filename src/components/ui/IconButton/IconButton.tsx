import type { ComponentProps } from 'react'

import {
  iconButtonClassName,
  type IconButtonStyleProps,
} from './iconButtonClassName'

type IconButtonProps = IconButtonStyleProps &
  ComponentProps<'button'> & {
    /** Names the button, since it has no visible text. */
    'aria-label': string
  }

/** A button showing only an icon, passed as its child. */
export default function IconButton({
  variant,
  size,
  className,
  type = 'button',
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      className={iconButtonClassName({ variant, size }, className)}
      {...props}
    />
  )
}
