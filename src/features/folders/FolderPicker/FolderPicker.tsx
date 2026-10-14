import { useMemo } from 'react'

import CheckIcon from '@/components/icons/CheckIcon'
import FolderIcon from '@/components/icons/FolderIcon'
import Eyebrow from '@/components/ui/Eyebrow'
import { cx } from '@/lib/cx'

import { buildFolderTree, type FolderNode } from '../folderTree'
import type { Folder } from '../types'

type FolderPickerProps = {
  /** Names the choice, read from the form as a folder's id, or `''` for none. */
  name: string
  /** Labels the group for screen readers. */
  label: string
  folders: Folder[]
  /** Where the thing being moved is now (`null` for none), picked to start with. */
  current: number | null
  /** What picking no folder means, e.g. "Top level" or "No folder". */
  noneLabel: string
  /** Folders that can't be picked, left out with the folders inside them. */
  exclude?: Set<number>
  className?: string
}

type Option = { id: number | null; name: string; depth: number }

/** Folders as a tree, in order and indented, below the choice of none. */
function toOptions(nodes: FolderNode[], exclude: Set<number>, depth = 0) {
  return nodes
    .filter((node) => !exclude.has(node.id))
    .flatMap((node): Option[] => [
      { id: node.id, name: node.name, depth },
      ...toOptions(node.children, exclude, depth + 1),
    ])
}

/**
 * A choice of folder, as radio buttons in a scrolling list: none first, then the user's folders as a tree.
 * Where the thing being moved is now is marked, and picked to start with.
 */
export default function FolderPicker({
  name,
  label,
  folders,
  current,
  noneLabel,
  exclude,
  className,
}: FolderPickerProps) {
  const options = useMemo(
    () => [
      { id: null, name: noneLabel, depth: 0 },
      ...toOptions(buildFolderTree(folders), exclude ?? new Set()),
    ],
    [folders, exclude, noneLabel],
  )

  return (
    <fieldset
      className={cx(
        '-mx-2 flex max-h-80 flex-col overflow-y-auto p-1',
        className,
      )}
    >
      <legend className="sr-only">{label}</legend>
      {options.map((option) => (
        <label
          key={option.id ?? 'none'}
          className="flex h-10 flex-none cursor-pointer items-center gap-2 rounded-sm px-2 text-base text-ink hover:bg-border-soft has-checked:bg-accent-soft has-checked:text-accent has-focus-visible:shadow-focus"
          // The rows inside line up under their folder's name.
          style={{ paddingLeft: 8 + option.depth * 24 }}
        >
          <input
            type="radio"
            name={name}
            value={option.id ?? ''}
            defaultChecked={option.id === current}
            className="peer sr-only"
          />
          {option.id === null ? (
            <span className="size-4 flex-none" />
          ) : (
            <FolderIcon
              className={cx(
                'flex-none',
                option.depth === 0 ? 'text-accent' : 'text-faint',
              )}
            />
          )}
          <span className="min-w-0 flex-1 truncate peer-checked:font-semibold">
            {option.name}
          </span>
          {option.id === current && <Eyebrow>Current</Eyebrow>}
          <CheckIcon
            size={16}
            className="invisible flex-none peer-checked:visible"
          />
        </label>
      ))}
    </fieldset>
  )
}
