import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { MobileNav, type MobileNavItem } from './MobileNav'
import { Sidebar, type SidebarNavItem } from './Sidebar'
import { Topbar, type TopbarProps } from './Topbar'

export type AppShellProps = {
  children: ReactNode
  topbar: TopbarProps
  sidebarNav?: SidebarNavItem[]
  sidebarActiveHref?: string
  mobileNavItems?: MobileNavItem[]
  mobileActiveHref?: string
  className?: string
  mainClassName?: string
}

export function AppShell({
  children,
  topbar,
  sidebarNav,
  sidebarActiveHref,
  mobileNavItems,
  mobileActiveHref,
  className,
  mainClassName,
}: AppShellProps) {
  return (
    <div
      className={cn(
        'flex min-h-dvh bg-vio-cream text-vio-navy',
        className,
      )}
    >
      <Sidebar nav={sidebarNav} activeHref={sidebarActiveHref} />

      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
        <Topbar {...topbar} />

        <main
          className={cn(
            'flex-1 px-6 py-10 pb-28 md:px-10 md:pb-12',
            mainClassName,
          )}
        >
          {children}
        </main>
      </div>

      <MobileNav items={mobileNavItems} activeHref={mobileActiveHref} />
    </div>
  )
}
