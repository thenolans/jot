import { useLocation, useNavigate } from 'react-router'

import ChevronLeftIcon from '@/components/icons/ChevronLeftIcon'
import Heading from '@/components/ui/Heading'
import IconButton from '@/components/ui/IconButton'
import TopBar from '@/components/ui/TopBar'

type SubpageTopBarProps = {
  /** The page's title, shown as its `h1`. */
  title: string
  /** Where the back button goes when the page was opened directly, with no history to go back to. */
  fallbackPath: string
  className?: string
}

/** The top bar of a page opened from another: a back button and the page's title. */
export default function SubpageTopBar({
  title,
  fallbackPath,
  className,
}: SubpageTopBarProps) {
  const navigate = useNavigate()
  const location = useLocation()

  // Go back to wherever the page was opened from, without adding that page to the history again.
  const goBack = () =>
    location.key === 'default' ? navigate(fallbackPath) : navigate(-1)

  return (
    <TopBar className={className}>
      <IconButton onClick={goBack} aria-label="Back" className="-ml-2">
        <ChevronLeftIcon />
      </IconButton>
      <Heading as="h1" variant="bar">
        {title}
      </Heading>
    </TopBar>
  )
}
