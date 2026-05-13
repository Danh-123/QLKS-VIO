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
    <aside className="sticky top-0 relative flex h-dvh w-16 shrink-0 flex-col overflow-hidden bg-vio-navy text-vio-cream md:w-64">
      <div className="flex h-16 items-center justify-center md:justify-start md:px-6">
        <NavLink to="/admin" className="text-lg font-heading tracking-wide">
          <span className="hidden md:inline">Grand Aurelia</span>
          <span className="md:hidden">GA</span>
        </NavLink>
      </div>

      <nav className="flex flex-1 flex-col gap-2 px-2 md:px-0 mt-4" aria-label="Admin navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'mx-2 flex items-center gap-3 rounded-xl px-2 py-2 text-sm font-medium transition-all duration-200 md:mx-0 md:justify-start md:px-6',
                isActive
                  ? 'bg-vio-gold/5 ring-1 ring-vio-gold/15 text-vio-white before:block before:w-1 before:rounded-full before:bg-vio-gold before:mr-3'
                  : 'text-vio-cream hover:bg-vio-navy/60 hover:text-white',
              )
            }
          >
            {({ isActive }) => (
              <>
                <span className={cn('text-vio-gold/60', isActive && 'text-vio-gold')}>{item.icon}</span>
                <span className="hidden text-[14px] md:inline">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto p-4 md:px-6">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-xl border border-vio-gold/30 bg-transparent px-3 py-2 text-sm font-medium text-vio-gold transition-all hover:bg-vio-gold/6"
        >
          <span className="hidden md:inline">Log out</span>
          <span className="md:hidden">Exit</span>
        </button>
      </div>
    </aside>
  )
}
