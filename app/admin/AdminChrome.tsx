"use client"

import { useMemo, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clearAuthSession, getStoredUser } from '../../hooks/useAuth'
import { adminNavItems, isAdminNavActive } from '../../legacy/components/admin/adminNavItems'
import { cn } from '../../legacy/lib/cn'

const pathMeta: Record<string, { title: string; kicker?: string }> = {
  '/admin': { title: 'Tổng quan vận hành', kicker: 'Dashboard' },
  '/admin/dashboard': { title: 'Tổng quan vận hành', kicker: 'Dashboard' },
  '/admin/matrix': { title: 'Sơ đồ phòng', kicker: 'Buồng phòng' },
  '/admin/calendar': { title: 'Lịch đặt phòng', kicker: 'Đặt phòng' },
  '/admin/rooms': { title: 'Quản lý phòng', kicker: 'Inventory' },
  '/admin/bookings': { title: 'Tất cả đặt phòng', kicker: 'Admin' },
  '/admin/pricing': { title: 'Giá & ưu đãi', kicker: 'Revenue' },
  '/admin/customers': { title: 'Khách hàng', kicker: 'CRM' },
  '/admin/staff': { title: 'Nhân sự & phân quyền', kicker: 'Bảo mật' },
}

type Props = {
  children: ReactNode
}

export function AdminChrome({ children }: Props) {
  const pathname = usePathname() || '/admin'
  const user = getStoredUser()

  const meta = useMemo(
    () => pathMeta[pathname] ?? pathMeta['/admin/dashboard']!,
    [pathname],
  )

  const handleLogout = () => {
    clearAuthSession()
    window.location.href = '/login'
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-vio-dashboard-bg text-vio-text-primary">
      <aside className="sticky top-0 relative flex h-dvh w-[72px] shrink-0 flex-col overflow-hidden bg-vio-navy md:w-[280px]">
        <Link
          href="/admin/dashboard"
          className="px-4 py-8 text-center md:px-6 md:text-left"
          title="VIO — Trang chủ quản trị"
        >
          <span className="font-heading text-2xl font-normal tracking-wide text-vio-cream">VIO</span>
          <span className="mt-1 hidden text-[11px] font-medium uppercase tracking-[0.25em] text-vio-gold/80 md:block">
            Hotel OS
          </span>
        </Link>

        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 pb-24 md:px-0" aria-label="Điều hướng quản trị">
          {adminNavItems.map((item) => {
            const active = isAdminNavActive(pathname, item)
            return (
              <Link
                key={item.to}
                href={item.to}
                className={cn(
                  'mx-2 flex items-center justify-center gap-3 rounded-lg px-0 py-2.5 text-sm font-medium text-[#E8E2D9] transition-all duration-200 md:mx-0 md:justify-start md:px-6',
                  'hover:bg-vio-gold/10',
                  active
                    ? 'border-l-[3px] border-vio-gold bg-vio-gold/[0.08] text-vio-white'
                    : 'border-l-[3px] border-transparent',
                )}
              >
                <span className={cn('shrink-0 text-vio-gold/60', active && 'text-vio-gold')}>{item.icon}</span>
                <span className="hidden text-[14px] md:inline">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="absolute bottom-6 left-3 right-3 rounded-lg border border-vio-gold bg-transparent px-3 py-2 text-xs font-medium text-vio-gold transition-colors duration-200 hover:bg-vio-gold/10 md:left-6 md:right-6 md:text-sm"
        >
          <span className="hidden md:inline">Đăng xuất</span>
          <span className="md:hidden">Thoát</span>
        </button>
      </aside>

      <div className="flex h-dvh min-w-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-20 border-b border-vio-linen bg-vio-dashboard-bg/95 px-4 py-4 backdrop-blur-sm md:px-8 md:py-5">
          <div className="mx-auto flex w-full max-w-dashboard flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-vio-text-secondary">
                VIO · Bảng điều khiển khách sạn
              </p>
              {meta.kicker ? <p className="mt-1 text-xs text-vio-gold">{meta.kicker}</p> : null}
              <h1 className="mt-1 font-heading text-2xl font-normal text-vio-navy md:text-3xl">{meta.title}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              {user ? (
                <span className="rounded-full border border-vio-linen bg-vio-white px-4 py-2 text-vio-text-primary shadow-soft">
                  Xin chào, <span className="font-medium">{user.name}</span>
                </span>
              ) : null}
              <Link
                href="/"
                className="rounded-full border border-vio-navy/15 bg-vio-white px-4 py-2 font-medium text-vio-navy shadow-soft transition-colors hover:border-vio-gold/50 hover:text-vio-gold"
              >
                Về trang khách
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-dashboard">{children}</div>
        </main>
      </div>
    </div>
  )
}
