import { useEffect, useMemo, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { AdminSidebar } from './AdminSidebar'
import { AUTH_USER_KEY } from '../../hooks/useAuth'

const pathMeta: Record<string, { title: string; kicker?: string }> = {
  '/admin': { title: 'Tổng quan vận hành', kicker: 'Dashboard' },
  '/admin/matrix': { title: 'Sơ đồ phòng', kicker: 'Buồng phòng' },
  '/admin/calendar': { title: 'Lịch đặt phòng', kicker: 'Đặt phòng' },
  '/admin/rooms': { title: 'Quản lý phòng', kicker: 'Inventory' },
  '/admin/pricing': { title: 'Giá & ưu đãi', kicker: 'Revenue' },
  '/admin/customers': { title: 'Khách hàng', kicker: 'CRM' },
  '/admin/staff': { title: 'Nhân sự & phân quyền', kicker: 'Bảo mật' },
}

export function AdminLayout() {
  const { pathname } = useLocation()
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_USER_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as { name?: string }
      setUserName(typeof parsed.name === 'string' ? parsed.name : null)
    } catch {
      setUserName(null)
    }
  }, [])

  const meta = useMemo(() => pathMeta[pathname] ?? pathMeta['/admin']!, [pathname])

  return (
    <div className="flex h-dvh overflow-hidden bg-vio-dashboard-bg text-vio-text-primary">
      <AdminSidebar />
      <div className="flex h-dvh min-w-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-20 border-b border-vio-linen bg-vio-dashboard-bg/95 px-4 py-4 backdrop-blur-sm md:px-8 md:py-5">
          <div className="mx-auto flex w-full max-w-dashboard flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-vio-text-secondary">
                VIO · Bảng điều khiển khách sạn
              </p>
              {meta.kicker ? (
                <p className="mt-1 text-xs text-vio-gold">{meta.kicker}</p>
              ) : null}
              <h1 className="mt-1 font-heading text-2xl font-normal text-vio-navy md:text-3xl">{meta.title}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              {userName ? (
                <span className="rounded-full border border-vio-linen bg-vio-white px-4 py-2 text-vio-text-primary shadow-soft">
                  Xin chào, <span className="font-medium">{userName}</span>
                </span>
              ) : null}
              <Link
                to="/"
                className="rounded-full border border-vio-navy/15 bg-vio-white px-4 py-2 font-medium text-vio-navy shadow-soft transition-colors hover:border-vio-gold/50 hover:text-vio-gold"
              >
                Về trang khách
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-dashboard">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
