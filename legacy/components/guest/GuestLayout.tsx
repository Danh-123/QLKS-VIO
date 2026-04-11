import { Outlet } from 'react-router-dom'
import { GuestFooter } from './GuestFooter'
import { GuestHeader } from './GuestHeader'
import { GuestMobileNav } from './GuestMobileNav'

export function GuestLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-vio-cream">
      <GuestHeader />

      <main className="flex-1 pb-28 md:pb-0">
        <Outlet />
      </main>

      <GuestFooter />
      <GuestMobileNav />
    </div>
  )
}
