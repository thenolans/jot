import type { CSSProperties } from 'react'

import ChevronRightIcon from '@/components/icons/ChevronRightIcon'
import RowLabel from '@/components/ui/RowLabel'

import type { OtherApp } from '../apps'

type AppLinkProps = {
  app: OtherApp
}

/** A row linking to another of our apps, in that app's colors. */
export default function AppLink({
  app: { name, description, href, Icon, brand },
}: AppLinkProps) {
  // The brand colors are scoped to this row as custom properties, so they can't leak into the app.
  const brandStyle = {
    '--app-color': brand.color,
    '--app-soft': brand.soft,
    '--app-mid': brand.mid,
  } as CSSProperties

  return (
    <a
      href={href}
      style={brandStyle}
      className="flex items-center gap-4 p-4 hover:bg-(--app-color)/10 focus-visible:bg-(--app-color)/10"
    >
      <div className="grid size-8 flex-none place-items-center rounded-sm bg-(--app-soft) text-(--app-color)">
        <Icon detailClassName="text-(--app-mid)" />
      </div>
      <RowLabel
        title={
          <>
            {name}
            <span className="text-(--app-mid)">.</span>
          </>
        }
        description={description}
        // The name is set as the app's wordmark.
        titleClassName="font-extrabold tracking-tight text-(--app-color)"
      />
      <ChevronRightIcon className="flex-none text-faint" />
    </a>
  )
}
