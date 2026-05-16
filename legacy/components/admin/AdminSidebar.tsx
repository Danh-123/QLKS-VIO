import { NavLink } from 'react-router-dom'
import { adminNavItems } from './adminNavItems'
import { cn } from '../../lib/cn'
import { useAuth } from '../../../hooks/useAuth'

export function AdminSidebar() {
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <aside className="sticky top-0 relative flex h-dvh w-[72px] shrink-0 flex-col overflow-hidden bg-vio-navy md:w-[280px]">
    <NavLink
      to="/admin/dashboard"
        className="px-4 py-8 text-center md:px-6 md:text-left"
        title="VIO — Trang chủ quản trị"
      >
        <span className="font-heading text-2xl font-normal tracking-wide text-vio-cream">VIO</span>
        <span className="mt-1 hidden text-[11px] font-medium uppercase tracking-[0.25em] text-vio-gold/80 md:block">
          Hotel OS
        </span>
      </NavLink>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 pb-24 md:px-0" aria-label="Điều hướng quản trị">
        {adminNavItems.map((item) =>
          item.to === '/admin/bookings' || item.to === '/admin/rooms' ? (
            <a
              key={item.to}
              href={item.to}
              className={cn(
                'mx-2 flex items-center justify-center gap-3 rounded-lg border-l-[3px] border-transparent px-0 py-2.5 text-sm font-medium text-[#E8E2D9] transition-all duration-200 hover:bg-vio-gold/10 md:mx-0 md:justify-start md:px-6',
              )}
            >
              <span className="shrink-0 text-vio-gold/60">{item.icon}</span>
              <span className="hidden text-[14px] md:inline">{item.label}</span>
            </a>
          ) : (
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
          ),
        )}
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
