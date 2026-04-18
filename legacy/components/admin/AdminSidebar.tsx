import { NavLink, useNavigate } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { clearAuthSession } from '../../hooks/useAuth'

const navItems = [
  {
    to: '/admin',
    label: 'Overview',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
        <path d="M3 12L12 4L21 12V20H3V12Z" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
    end: true,
  },
  {
    to: '/admin/rooms',
    label: 'Rooms',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
        <path d="M3 9H21V19H3V9Z" stroke="currentColor" strokeWidth="1.6" />
        <path d="M7 9V5H17V9" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    to: '/admin/calendar',
    label: 'Bookings',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
        <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 3V7M16 3V7M4 10H20" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    to: '/admin/customers',
    label: 'Customers',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
        <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3 19C3 15.7 5.7 13 9 13C12.3 13 15 15.7 15 19" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="17" cy="10" r="2" stroke="currentColor" strokeWidth="1.6" />
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
        className="px-6 py-8 text-center font-heading text-2xl font-normal text-vio-cream md:text-left"
      >
        Grand Aurelia
      </NavLink>

      <nav className="flex flex-1 flex-col gap-1 px-2 md:px-0" aria-label="Admin navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'mx-2 flex items-center justify-center gap-3 px-0 py-3 text-sm font-medium text-[#E8E2D9] transition-all duration-200 md:mx-0 md:justify-start md:px-6',
                'hover:bg-vio-gold/10',
                isActive
                  ? 'border-l-[3px] border-vio-gold bg-vio-gold/[0.08] text-vio-white'
                  : 'border-l-[3px] border-transparent',
              )
            }
          >
            {({ isActive }) => (
              <>
                <span className={cn('text-vio-gold/60', isActive && 'text-vio-gold')}>
                  {item.icon}
                </span>
                <span className="hidden text-[14px] md:inline">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <NavLink
        to="/admin/staff"
        className={({ isActive }) =>
          cn(
            'mx-2 mb-3 flex items-center justify-center gap-3 border-l-[3px] border-transparent px-0 py-3 text-[#E8E2D9] transition-all duration-200 hover:bg-vio-gold/10 md:mx-0 md:justify-start md:px-6',
            isActive && 'border-vio-gold bg-vio-gold/[0.08] text-vio-white',
          )
        }
      >
        {({ isActive }) => (
          <>
            <span className={cn('text-vio-gold/60', isActive && 'text-vio-gold')}>
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
                <path d="M12 8.5A2.5 2.5 0 1 0 12 3.5A2.5 2.5 0 0 0 12 8.5Z" stroke="currentColor" strokeWidth="1.6" />
                <path d="M20 13A2 2 0 1 0 20 9A2 2 0 0 0 20 13Z" stroke="currentColor" strokeWidth="1.6" />
                <path d="M4 13A2 2 0 1 0 4 9A2 2 0 0 0 4 13Z" stroke="currentColor" strokeWidth="1.6" />
                <path d="M12 20C15.3 20 18 18.2 18 16C18 13.8 15.3 12 12 12C8.7 12 6 13.8 6 16C6 18.2 8.7 20 12 20Z" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </span>
            <span className="hidden text-[14px] md:inline">Settings</span>
          </>
        )}
      </NavLink>

      <button
        type="button"
        onClick={handleLogout}
        className="absolute bottom-8 left-3 right-3 rounded-lg border border-vio-gold bg-transparent px-4 py-2 text-sm font-medium text-vio-gold transition-colors duration-200 hover:bg-vio-gold/10 md:left-6 md:right-6"
      >
        <span className="hidden md:inline">Log out</span>
        <span className="md:hidden">Exit</span>
      </button>
    </aside>
  )
}
