import { NavLink } from 'react-router-dom'
import { adminNavItems } from '../../admin/adminNav'
import { cn } from '../../lib/cn'

export function AdminSidebar() {
  return (
    <>
      <aside className="hidden w-60 shrink-0 flex-col border-r border-vio-navy/[0.06] bg-vio-white/95 py-10 pl-8 pr-6 md:flex">
        <NavLink
          to="/admin"
          className="mb-12 block font-heading text-2xl text-vio-navy"
        >
          VIO
          <span className="mt-1 block text-[10px] font-normal uppercase tracking-[0.28em] text-vio-navy/38">
            Admin
          </span>
        </NavLink>
        <nav className="flex flex-col gap-1" aria-label="Admin">
          {adminNavItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin'}
              className={({ isActive }) =>
                cn(
                  'rounded-xl px-4 py-2.5 text-sm font-medium tracking-wide transition-colors duration-300',
                  isActive
                    ? 'bg-vio-cream text-vio-navy'
                    : 'text-vio-navy/50 hover:bg-vio-cream/60 hover:text-vio-navy',
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto pt-10">
          <NavLink
            to="/"
            className="text-xs tracking-wide text-vio-navy/40 transition-colors hover:text-vio-navy/70"
          >
            ← Về site khách
          </NavLink>
        </div>
      </aside>

      <div className="border-b border-vio-navy/[0.06] bg-vio-white/90 px-4 py-3 md:hidden">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {adminNavItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin'}
              className={({ isActive }) =>
                cn(
                  'shrink-0 rounded-full px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors',
                  isActive
                    ? 'bg-vio-navy text-vio-white'
                    : 'bg-vio-cream/80 text-vio-navy/60',
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  )
}
