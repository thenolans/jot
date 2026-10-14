import { Link } from 'react-router'

import { paths } from '@/app/paths'
import Logo from '@/components/ui/Logo'

/** The accent-colored, topo-textured side of the card: a header band on small screens, a column on wide ones. */
export default function BrandPanel() {
  return (
    <div className="flex flex-none justify-center bg-accent bg-topo-brand p-6 scheme-light sm:w-56 sm:flex-col sm:justify-start sm:py-8">
      <Link to={paths.landing} aria-label="Jot home">
        <Logo tone="inverse" />
      </Link>
      <p className="mt-2 hidden text-sm text-accent-soft sm:block">
        Markdown notes, organized into folders and shareable.
      </p>
    </div>
  )
}
