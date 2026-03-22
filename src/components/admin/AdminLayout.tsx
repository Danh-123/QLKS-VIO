import { Outlet } from 'react-router-dom'
import { AdminSidebar } from './AdminSidebar'

export function AdminLayout() {
  return (
    <div className="flex min-h-dvh bg-vio-cream text-vio-navy">
      <AdminSidebar />
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-vio-navy/[0.06] bg-vio-cream/90 px-6 py-5 backdrop-blur-md md:px-10">
          <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-vio-navy/40">
            VIO · Operations
          </p>
        </header>
        <main className="flex-1 overflow-auto px-6 py-10 md:px-10 md:py-12">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
