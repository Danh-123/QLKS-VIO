import { ReactNode } from 'react'
import AdminSidebar from './AdminSidebar'
import { cn } from '../../lib/utils' // Standard Tailwind cn util

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex h-dvh overflow-hidden bg-vio-parchment/95 text-vio-near-black antialiased">
      <AdminSidebar />
      <div className="flex h-dvh min-w-0 flex-1 flex-col overflow-hidden">
        {/* Sticky Header */}
        <header className="sticky top-0 z-20 border-b border-vio-border-cream/50 bg-vio-parchment/95 px-4 py-4 backdrop-blur-md md:px-8 md:py-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-vio-stone-gray hidden sm:block">
              VIO Private Collection
            </p>
            <span className="rounded-full border border-vio-border-cream bg-vio-ivory px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-vio-stone-gray md:inline-flex">
              Admin Console
            </span>
          </div>
        </header>
        {/* Main Content */}
        <main 
          className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-7 md:px-8 md:py-10 max-[390px]:p-6 scroll-smooth"
          style={{ scrollBehavior: 'smooth' }}
        >
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
