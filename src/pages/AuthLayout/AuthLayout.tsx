import { Outlet } from 'react-router'

import Card from '@/components/ui/Card'

import AuthModeToggle from './AuthModeToggle'
import BrandPanel from './BrandPanel'

/**
 * Shared frame for the sign-in and registration pages. As a layout route it stays mounted while
 * switching between them, so the mode toggle animates instead of re-rendering.
 */
export default function AuthLayout() {
  return (
    <div className="grid min-h-screen place-items-center px-4 py-8 sm:p-8">
      <Card className="flex w-full max-w-sm flex-col overflow-hidden sm:max-w-2xl sm:flex-row">
        <BrandPanel />
        <main className="flex min-w-0 flex-1 flex-col gap-4 p-6 sm:p-8">
          <AuthModeToggle />
          <Outlet />
        </main>
      </Card>
    </div>
  )
}
