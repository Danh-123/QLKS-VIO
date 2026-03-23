import { NavLink } from 'react-router-dom'
import { Button } from '../ui/Button'
import { cn } from '../../lib/cn'

const links = [
  { to: '/', label: 'Trang chủ' },
  { to: '/search', label: 'Tìm phòng' },
  { to: '/rooms', label: 'Phòng' },
  { to: '/bookings', label: 'Lịch sử đặt' },
] as const

export function GuestHeader({ onBook }: { onBook: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-vio-navy/[0.06] bg-vio-cream/90 shadow-soft-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-6 py-7 md:px-10">
        <NavLink to="/" className="group shrink-0 outline-none">
          <span className="font-heading text-2xl font-medium tracking-wide text-vio-navy transition-colors duration-300 group-hover:text-vio-navy/80 md:text-3xl">
            VIO
          </span>
          <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.32em] text-vio-navy/38">
            Hotel & Resort
          </span>
        </NavLink>

        <nav
          aria-label="Chính"
          className="hidden items-center gap-10 md:flex"
        >
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'text-sm font-medium tracking-wide transition-colors duration-300 ease-[var(--ease-vio)]',
                  isActive
                    ? 'text-vio-navy'
                    : 'text-vio-navy/45 hover:text-vio-navy/75',
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            className="hidden sm:inline-flex"
            onClick={onBook}
          >
            Đặt phòng ngay
          </Button>
        </div>
      </div>
    </header>
  )
}
