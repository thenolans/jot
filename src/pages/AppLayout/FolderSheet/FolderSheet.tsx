import { useRef, useState } from 'react'
import type { To } from 'react-router'

import CloseIcon from '@/components/icons/CloseIcon'
import Heading from '@/components/ui/Heading'
import IconButton from '@/components/ui/IconButton'
import ModalShell, {
  closeModal,
  useModalView,
} from '@/components/ui/ModalShell'
import ModalSubview from '@/components/ui/ModalSubview'
import SheetHandle from '@/components/ui/SheetHandle'
import FolderActionForm from '@/features/folders/FolderActionForm'
import {
  type FolderAction as Action,
  folderActionTitle,
} from '@/features/folders/folderActions'
import FolderNav from '@/features/folders/FolderNav'
import { useFolders } from '@/features/folders/useFolders'
import { cx } from '@/lib/cx'

type FolderSheetProps = {
  activeFolderId: number | null
  folderTo: (id: number | null) => To
  noteCount?: number
  onClose: () => void
}

/**
 * The folders on phones, in a sheet from the tab bar; picking one closes it. A folder's actions (naming,
 * moving, deleting) open in the sheet in place of the folders, rather than in a sheet on top of it.
 * Render it to open it.
 */
export default function FolderSheet({
  activeFolderId,
  folderTo,
  noteCount,
  onClose,
}: FolderSheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const { folders } = useFolders()
  const [action, setAction] = useState<Action | null>(null)
  const { isMainView, show, back, viewClassName } = useModalView<
    'folders' | 'action'
  >(dialogRef, 'folders')

  const close = () => closeModal(dialogRef.current)
  const startAction = (next: Action) => {
    setAction(next)
    show('action')
  }

  return (
    <ModalShell
      dialogRef={dialogRef}
      aria-label={!isMainView && action ? folderActionTitle(action) : 'Folders'}
      onClose={onClose}
      onEscape={isMainView ? undefined : back}
      // As `Dialog`'s sheet: a gap above it leaves the page in view, and the sheet clips as it slides.
      className="flex items-end justify-center overflow-clip pt-12 md:items-center md:p-4"
      panelClassName="flex max-h-full w-full flex-col max-md:rounded-b-none max-md:pb-safe-area max-md:motion-safe:animate-sheet-in max-md:motion-safe:in-data-closing:animate-sheet-out md:max-w-sm md:pt-4"
    >
      <SheetHandle onClick={close} className="flex-none" />

      {/* Hidden rather than removed while an action shows, so it keeps where it's scrolled. */}
      <div
        className={cx(
          'min-h-0 overflow-y-auto px-6 pb-6',
          viewClassName,
          !isMainView && 'hidden',
        )}
      >
        <div className="mb-4 flex items-center justify-between gap-2">
          <Heading as="h2" variant="subsection">
            Folders
          </Heading>
          <IconButton
            size="lg"
            onClick={close}
            aria-label="Close"
            className="-mr-2"
          >
            <CloseIcon size={20} />
          </IconButton>
        </div>
        <FolderNav
          variant="sheet"
          activeFolderId={activeFolderId}
          folderTo={folderTo}
          noteCount={noteCount}
          onNavigate={close}
          onAction={startAction}
        />
      </div>

      {!isMainView && action && folders && (
        <ModalSubview
          title={folderActionTitle(action)}
          onBack={back}
          className={cx('min-h-0 overflow-y-auto', viewClassName)}
        >
          <FolderActionForm action={action} folders={folders} onDone={back} />
        </ModalSubview>
      )}
    </ModalShell>
  )
}
