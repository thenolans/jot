import type { ComponentType } from 'react'
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  ScrollRestoration,
} from 'react-router'

import { paths } from '@/app/paths'

// A route's lazy-loaded component: the default export of the module `load` imports.
function page(load: () => Promise<{ default: ComponentType }>) {
  return { Component: async () => (await load()).default }
}

// Pages and layouts load lazily, so each route downloads only its own code. Until the first page's
// code arrives the screen stays blank.
export const router = createBrowserRouter([
  {
    // A new page opens at the top; going back returns to where that page was scrolled.
    element: (
      <>
        <ScrollRestoration />
        <Outlet />
      </>
    ),
    HydrateFallback: () => null,
    children: [
      {
        path: paths.landing,
        lazy: page(() => import('@/pages/LandingPage')),
      },
      { path: '*', element: <Navigate to={paths.landing} replace /> },
    ],
  },
])
