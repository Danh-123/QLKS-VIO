import { Outlet } from 'react-router-dom'
import { GuestFooter } from './GuestFooter'
import { NavbarClient } from '../../../components/NavbarClient'

export function GuestLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-vio-cream">
      <NavbarClient />
      <main className="flex-1">
        <Outlet />
      </main>

      <GuestFooter />
    </div>
  )
}
