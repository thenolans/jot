import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { RouterProvider } from 'react-router'

import { queryClient } from '@/app/queryClient'
import { persistOptions, syncRestoredCache } from '@/app/queryPersister'
import { router } from '@/app/router'

function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={persistOptions}
      onSuccess={syncRestoredCache}
    >
      <RouterProvider router={router} />
    </PersistQueryClientProvider>
  )
}

export default App
