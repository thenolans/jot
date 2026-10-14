import CloseIcon from '@/components/icons/CloseIcon'
import Alert from '@/components/ui/Alert'
import IconButton from '@/components/ui/IconButton'
import RowLabel from '@/components/ui/RowLabel'
import SegmentedControl from '@/components/ui/SegmentedControl'
import { displayDetails } from '@/features/auth/displayName'
import UserAvatar from '@/features/auth/UserAvatar'
import { errorMessage } from '@/lib/api'
import { cx } from '@/lib/cx'

import type { Share, SharePermission } from '../../types'
import { useDeleteShare } from '../../useDeleteShare'
import { useUpdateShare } from '../../useUpdateShare'

const permissionOptions = [
  { value: 'view', label: 'View' },
  { value: 'edit', label: 'Edit' },
] satisfies { value: SharePermission; label: string }[]

type SharePersonRowProps = {
  share: Share
  className?: string
}

/**
 * Someone a note is shared with: who they are, what they can do, and a button to stop sharing, which
 * removes them straight away (they can be invited again).
 */
export default function SharePersonRow({
  share,
  className,
}: SharePersonRowProps) {
  const update = useUpdateShare(share)
  const remove = useDeleteShare(share)
  const { title, subtitle } = displayDetails(share)
  // Shows the new choice straight away while it saves; it goes back if saving fails.
  const permission = update.isPending ? update.variables : share.permission
  const error = update.error ?? remove.error

  return (
    <li className={cx('py-2', className)}>
      <div className="flex items-center gap-4">
        <UserAvatar user={share} />
        <RowLabel title={title} description={subtitle} />
        <div className="flex flex-none items-center gap-2">
          <SegmentedControl
            label={`What ${title} can do`}
            options={permissionOptions}
            value={permission}
            onChange={(value) => update.mutate(value)}
          />
          <IconButton
            variant="danger"
            aria-label={`Stop sharing with ${title}`}
            disabled={remove.isPending}
            onClick={() => remove.mutate()}
          >
            <CloseIcon />
          </IconButton>
        </div>
      </div>
      {error && (
        <Alert size="sm" className="mt-1">
          {errorMessage(error)}
        </Alert>
      )}
    </li>
  )
}
