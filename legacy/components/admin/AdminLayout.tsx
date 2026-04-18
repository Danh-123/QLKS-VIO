import { Outlet } from 'react-router-dom'
import { AdminSidebar } from './AdminSidebar'

export function AdminLayout() {
  return (
    <div className="flex h-dvh overflow-hidden bg-vio-dashboard-bg text-vio-text-primary">
      <AdminSidebar />
      <div className="flex h-dvh min-w-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-20 border-b border-vio-linen bg-vio-dashboard-bg/95 px-4 py-5 backdrop-blur-sm md:px-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-vio-text-secondary">
            Grand Aurelia · Admin
          </p>
        </header>
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-8 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-dashboard">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
