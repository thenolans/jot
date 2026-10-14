import { useState } from 'react'

import { cx } from '@/lib/cx'

/** Covers the initial once it has loaded; removes itself if it can't, leaving the initial. */
export default function AvatarImage({ src }: { src: string }) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'failed'>(
    'loading',
  )

  if (status === 'failed') return null

  return (
    <img
      src={src}
      alt=""
      onLoad={() => setStatus('loaded')}
      onError={() => setStatus('failed')}
      className={cx(
        'absolute inset-0 size-full object-cover transition-opacity',
        status === 'loaded' ? 'opacity-100' : 'opacity-0',
      )}
    />
  )
}
