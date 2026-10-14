/** Where a `FolderNav` is: down the side of wide screens, or in the folder sheet on phones. */
export type FolderNavVariant = 'sidebar' | 'sheet'

/** How a `FolderNav`'s rows look in each place: tighter in the sidebar, taller to tap in the sheet. */
export const folderNavVariants = {
  sidebar: {
    row: 'h-8 gap-1 rounded-r-sm pr-1',
    /** Padding before the row's content, in px. */
    inset: 0,
    label: 'gap-2 text-sm',
    count: 'min-w-6 text-xs',
    activeCount: 'text-accent',
    inactiveCount: 'text-faint',
    /** Indent per level, in px. */
    indent: 16,
    iconSize: 16,
  },
  sheet: {
    // Full width, reaching past the sheet's 24px padding so the highlight runs edge to edge, with that
    // padding inside it instead (`inset` on the left).
    row: '-mx-6 h-12 gap-2 border-b border-border-soft pr-6',
    inset: 24,
    label: 'gap-2 text-base',
    count: 'h-6 min-w-6 rounded-xs px-1 text-xs',
    activeCount: 'bg-surface text-accent',
    inactiveCount: 'bg-accent-soft text-accent',
    indent: 24,
    iconSize: 20,
  },
} satisfies Record<FolderNavVariant, Record<string, string | number>>
