import type { ComponentType } from 'react'
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  ScrollRestoration,
} from 'react-router'

import { paths } from '@/app/paths'
import RedirectIfSignedIn from '@/features/auth/RedirectIfSignedIn'
import RequireAuth from '@/features/auth/RequireAuth'
import SharedSession from '@/features/auth/SharedSession'

// A route's lazy-loaded component: the default export of the module `load` imports.
function page(load: () => Promise<{ default: ComponentType }>) {
  return { Component: async () => (await load()).default }
}

// Pages and layouts load lazily, so each route downloads only its own code
// (the landing and sign-in pages don't pull in the note editor). Until the first page's code
// arrives the screen stays blank, as it does while the guards load the user.
export const router = createBrowserRouter([
  {
    // A new page opens at the top; going back returns to where that page was scrolled. The session
    // follows signing in and out in our other apps.
    element: (
      <>
        <ScrollRestoration />
        <SharedSession />
        <Outlet />
      </>
    ),
    children: [
      {
        element: <RedirectIfSignedIn to={paths.notes} />,
        HydrateFallback: () => null,
        children: [
          {
            path: paths.landing,
            lazy: page(() => import('@/pages/LandingPage')),
          },
          {
            lazy: page(() => import('@/pages/AuthLayout')),
            children: [
              {
                path: paths.login,
                lazy: page(() => import('@/pages/LoginPage')),
              },
              {
                path: paths.register,
                lazy: page(() => import('@/pages/RegisterPage')),
              },
            ],
          },
        ],
      },
      {
        element: (
          <RequireAuth redirectTo={paths.login} afterSignOut={paths.landing} />
        ),
        HydrateFallback: () => null,
        children: [
          {
            lazy: page(() => import('@/pages/AppLayout')),
            children: [
              {
                path: paths.notes,
                lazy: page(() => import('@/pages/NotesPage')),
                children: [
                  {
                    path: paths.note,
                    lazy: page(() => import('@/pages/NotePage')),
                  },
                ],
              },
            ],
          },
          {
            path: paths.settings,
            lazy: page(() => import('@/pages/SettingsPage')),
          },
        ],
      },
      { path: '*', element: <Navigate to={paths.landing} replace /> },
    ],
  },
])
