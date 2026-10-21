import type { UniqueIdentifier } from '@dnd-kit/abstract'
import { Accessibility } from '@dnd-kit/dom'
import type { DragDropProvider } from '@dnd-kit/react'
import { isSortable } from '@dnd-kit/react/sortable'
import type { ComponentProps } from 'react'

type Plugins = Extract<
  NonNullable<ComponentProps<typeof DragDropProvider>['plugins']>,
  unknown[]
>
type AccessibilityOptions = NonNullable<
  ConstructorParameters<typeof Accessibility>[1]
>

/** Says where a row is, e.g. "position 2 of 4", given its list (when lists are grouped) and index. */
type DescribePosition = (
  group: UniqueIdentifier | undefined,
  index: number,
) => string

/**
 * The provider's plugins, with screen reader instructions and announcements that name rows by their
 * place, in place of the default ones. Made once: the provider takes its plugins when it's created.
 */
export function rowPlugins(itemName: string, position: DescribePosition) {
  return (defaults: Plugins) =>
    defaults.map((plugin) =>
      plugin === Accessibility ? accessibility(itemName, position) : plugin,
    )
}

function accessibility(itemName: string, position: DescribePosition) {
  const capitalized = itemName[0].toUpperCase() + itemName.slice(1)
  // Where the row was last announced, so each move is announced once.
  let announced: string | null = null

  const options: AccessibilityOptions = {
    screenReaderInstructions: {
      draggable: `To move this ${itemName}, press Space, use the up and down arrow keys to choose its place, then press Space again to drop it or Escape to cancel.`,
    },
    announcements: {
      dragstart: ({ operation: { source } }) => {
        if (!isSortable(source)) return undefined
        announced = position(source.initialGroup, source.initialIndex)
        return `Picked up ${itemName} ${source.initialIndex + 1}.`
      },
      dragover: ({ operation: { source } }) => {
        if (!isSortable(source)) return undefined
        const place = position(source.group, source.index)
        if (place === announced) return undefined
        announced = place
        return `${capitalized} moved to ${place}.`
      },
      dragend: ({ operation: { source }, canceled }) => {
        if (!isSortable(source)) return undefined
        return canceled
          ? `Move cancelled. ${capitalized} returned to ${position(source.initialGroup, source.initialIndex)}.`
          : `${capitalized} dropped at ${position(source.group, source.index)}.`
      },
    },
  }
  return Accessibility.configure(options)
}
