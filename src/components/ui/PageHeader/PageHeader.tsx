import Heading from '@/components/ui/Heading'
import { cx } from '@/lib/cx'

const descriptionSizeClassNames = {
  /** A full page. */
  md: 'text-lg',
  /** A page inside a smaller frame, such as the sign-in card. */
  sm: 'text-base',
}

type PageHeaderProps = {
  title: string
  /** A line under the title on what the page is for. */
  description?: string
  /** Sets the description's size; `md` by default. */
  size?: keyof typeof descriptionSizeClassNames
  className?: string
}

/** A page's title, with a line on what it's for. */
export default function PageHeader({
  title,
  description,
  size = 'md',
  className,
}: PageHeaderProps) {
  return (
    <header className={className}>
      <Heading as="h1" variant="title">
        {title}
      </Heading>
      {description && (
        <p className={cx('mt-1 text-muted', descriptionSizeClassNames[size])}>
          {description}
        </p>
      )}
    </header>
  )
}
