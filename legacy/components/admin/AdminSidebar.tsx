import type { ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { clearAuthSession } from '../../hooks/useAuth'

type NavItem = {
  to: string
  label: string
  icon: ReactNode
  end?: boolean
}

const navItems: NavItem[] = [
  {
    to: '/admin',
    label: 'Tổng quan',
    end: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
        <path d="M3 12L12 4L21 12V20H3V12Z" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    to: '/admin/calendar',
    label: 'Lịch đặt phòng',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
        <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 3V7M16 3V7M4 10H20" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    to: '/admin/matrix',
    label: 'Sơ đồ phòng',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
        <path d="M4 4H10V10H4V4Z" stroke="currentColor" strokeWidth="1.6" />
        <path d="M14 4H20V10H14V4Z" stroke="currentColor" strokeWidth="1.6" />
        <path d="M4 14H10V20H4V14Z" stroke="currentColor" strokeWidth="1.6" />
        <path d="M14 14H20V20H14V14Z" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    to: '/admin/rooms',
    label: 'Quản lý phòng',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
        <path d="M3 9H21V19H3V9Z" stroke="currentColor" strokeWidth="1.6" />
        <path d="M7 9V5H17V9" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    to: '/admin/pricing',
    label: 'Giá & ưu đãi',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
        <path d="M4 7H20V17H4V7Z" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 11H16M8 14H13" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    to: '/admin/customers',
    label: 'Khách hàng',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
        <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3 19C3 15.7 5.7 13 9 13C12.3 13 15 15.7 15 19" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="17" cy="10" r="2" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    to: '/admin/staff',
    label: 'Nhân sự & quyền',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
        <path d="M12 8.5A2.5 2.5 0 1 0 12 3.5A2.5 2.5 0 0 0 12 8.5Z" stroke="currentColor" strokeWidth="1.6" />
        <path d="M20 13A2 2 0 1 0 20 9A2 2 0 0 0 20 13Z" stroke="currentColor" strokeWidth="1.6" />
        <path d="M4 13A2 2 0 1 0 4 9A2 2 0 0 0 4 13Z" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 20C15.3 20 18 18.2 18 16C18 13.8 15.3 12 12 12C8.7 12 6 13.8 6 16C6 18.2 8.7 20 12 20Z" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
]

export function AdminSidebar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    clearAuthSession()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="sticky top-0 relative flex h-dvh w-[72px] shrink-0 flex-col overflow-hidden bg-vio-navy md:w-[280px]">
      <NavLink
        to="/admin"
        className="px-4 py-8 text-center md:px-6 md:text-left"
        title="VIO — Trang chủ quản trị"
      >
        <span className="font-heading text-2xl font-normal tracking-wide text-vio-cream">VIO</span>
        <span className="mt-1 hidden text-[11px] font-medium uppercase tracking-[0.25em] text-vio-gold/80 md:block">
          Hotel OS
        </span>
      </NavLink>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 pb-24 md:px-0" aria-label="Điều hướng quản trị">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'mx-2 flex items-center justify-center gap-3 rounded-lg px-0 py-2.5 text-sm font-medium text-[#E8E2D9] transition-all duration-200 md:mx-0 md:justify-start md:px-6',
                'hover:bg-vio-gold/10',
                isActive
                  ? 'border-l-[3px] border-vio-gold bg-vio-gold/[0.08] text-vio-white'
                  : 'border-l-[3px] border-transparent',
              )
            }
          >
            {({ isActive }) => (
              <>
                <span className={cn('shrink-0 text-vio-gold/60', isActive && 'text-vio-gold')}>
                  {item.icon}
                </span>
                <span className="hidden text-[14px] md:inline">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
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
  )
}
