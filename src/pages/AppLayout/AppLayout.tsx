import { Outlet } from 'react-router'

import AppBar from './AppBar'

/** Frame for the signed-in app: the app bar on top and the page below it. */
export default function AppLayout() {
  return (
    <div className="min-h-screen">
      <AppBar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
