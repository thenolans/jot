import { type ComponentProps, useRef, useState } from 'react'

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

type FolderSheetProps = Pick<
  ComponentProps<typeof FolderNav>,
  | 'activeFolderId'
  | 'folderTo'
  | 'noteCount'
  | 'isUnfiledActive'
  | 'unfiledTo'
  | 'unfiledCount'
  | 'isSharedActive'
  | 'sharedTo'
  | 'sharedCount'
> & {
  onClose: () => void
}

/**
 * The folders on phones, in a sheet from the tab bar; picking one closes it. A folder's actions (naming,
 * moving, deleting) open in the sheet in place of the folders, rather than in a sheet on top of it.
 * Render it to open it.
 */
export default function FolderSheet({
  onClose,
  ...navProps
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
      sheet
      panelClassName="flex flex-col md:max-w-sm md:pt-4"
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
          {...navProps}
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
