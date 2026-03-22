import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/cn'

const items = [
  {
    to: '/',
    label: 'Trang chủ',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9.5z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    to: '/search',
    label: 'Tìm phòng',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M20 20l-4-4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    to: '/rooms',
    label: 'Phòng',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect
          x="4"
          y="6"
          width="16"
          height="14"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M8 6V4M16 6V4" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    to: '/bookings',
    label: 'Lịch sử',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M8 7h12M8 12h12M8 17h8M4 7h.01M4 12h.01M4 17h.01"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
] as const

export function GuestMobileNav() {
  return (
    <nav
      aria-label="Điều hướng di động"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-vio-navy/[0.06] bg-vio-white/95 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_32px_-16px_rgba(30,58,95,0.12)] backdrop-blur-md md:hidden"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around gap-1 px-2">
        {items.map(({ to, label, icon }) => (
          <li key={to} className="flex min-w-0 flex-1">
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex w-full flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-[11px] font-medium tracking-wide transition-all duration-300 ease-[var(--ease-vio)]',
                  isActive
                    ? 'text-vio-navy'
                    : 'text-vio-navy/45 hover:text-vio-navy/75',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      'transition-colors duration-300',
                      isActive ? 'text-vio-gold' : 'text-vio-navy/35',
                    )}
                  >
                    {icon}
                  </span>
                  <span className="truncate">{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
