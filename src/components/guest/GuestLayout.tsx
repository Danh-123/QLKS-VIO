import { Outlet, useNavigate } from 'react-router-dom'
import { GuestFooter } from './GuestFooter'
import { GuestHeader } from './GuestHeader'
import { GuestMobileNav } from './GuestMobileNav'

export function GuestLayout() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-dvh flex-col bg-vio-cream">
      <GuestHeader onBook={() => navigate('/search')} />

      <main className="flex-1 pb-28 md:pb-6">
        <Outlet />
      </main>

      <GuestFooter />
      <GuestMobileNav />
    </div>
  )
}
