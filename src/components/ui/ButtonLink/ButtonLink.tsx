import { Link, type LinkProps } from 'react-router'

import { buttonClassName, type ButtonStyleProps } from '@/components/ui/Button'

type ButtonLinkProps = ButtonStyleProps & LinkProps

/** A router link styled as a button, for navigation that looks like an action. */
export default function ButtonLink({
  variant,
  size,
  block,
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={buttonClassName({ variant, size, block }, className)}
      {...props}
    />
  )
}
