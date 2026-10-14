import type { ComponentProps } from 'react'

import { buttonClassName, type ButtonStyleProps } from './buttonClassName'

type ButtonProps = ButtonStyleProps & ComponentProps<'button'>

export default function Button({
  variant,
  size,
  block,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName({ variant, size, block }, className)}
      {...props}
    />
  )
}
