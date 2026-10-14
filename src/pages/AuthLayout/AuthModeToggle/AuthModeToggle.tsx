import { matchPath, NavLink, useLocation } from 'react-router'

import { paths } from '@/app/paths'
import {
  segmentedItemClassName,
  SegmentedThumb,
  segmentedTrackClassName,
} from '@/components/ui/SegmentedControl'

const modes = [
  { to: paths.login, label: 'Sign in' },
  { to: paths.register, label: 'Create account' },
]

/** Switches between signing in and creating an account, with a thumb that slides to the active page. */
export default function AuthModeToggle() {
  const { pathname } = useLocation()
  const activeIndex = modes.findIndex((mode) => matchPath(mode.to, pathname))

  return (
    <nav
      aria-label="Account"
      className={segmentedTrackClassName({ size: 'md' }, 'flex')}
    >
      <div className="relative grid flex-1 auto-cols-fr grid-flow-col">
        {activeIndex !== -1 && (
          <SegmentedThumb index={activeIndex} count={modes.length} />
        )}
        {modes.map((mode) => (
          <NavLink
            key={mode.to}
            to={mode.to}
            className={({ isActive }) =>
              segmentedItemClassName({ active: isActive, size: 'md' })
            }
          >
            {mode.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
