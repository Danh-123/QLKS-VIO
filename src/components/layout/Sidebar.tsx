import type { ReactElement } from 'react'
import { cn } from '../../lib/cn'
import {
  defaultSidebarNav,
  type SidebarNavItem,
} from './navDefaults'

export type { SidebarNavItem } from './navDefaults'

const icons: Record<SidebarNavItem['icon'], ReactElement> = {
  home: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
  calendar: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="4"
        y="5"
        width="16"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M8 3v4M16 3v4M4 11h16" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  key: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="8" cy="15" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 11l8-8M18 5l2 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  sparkle: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
}

export type SidebarProps = {
  nav?: SidebarNavItem[]
  activeHref?: string
  className?: string
}

export function Sidebar({
  nav = defaultSidebarNav,
  activeHref,
  className,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        'hidden h-dvh w-[272px] shrink-0 flex-col border-r border-vio-navy/[0.06] bg-vio-white/90 px-8 py-10 shadow-soft-sm backdrop-blur-sm md:flex',
        className,
      )}
    >
      <a href="#" className="group mb-16 block outline-none">
        <span className="font-heading text-3xl font-medium tracking-wide text-vio-navy transition-colors duration-300 group-hover:text-vio-navy/80">
          VIO
        </span>
        <span className="mt-2 block text-xs font-medium uppercase tracking-[0.28em] text-vio-navy/40">
          Private Collection
        </span>
      </a>

      <nav aria-label="Main" className="flex flex-1 flex-col gap-2">
        {nav.map((item) => {
          const active = activeHref === item.href
          return (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                'flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-300 ease-[var(--ease-vio)]',
                active
                  ? 'bg-vio-cream/90 text-vio-navy shadow-soft-sm'
                  : 'text-vio-navy/55 hover:bg-vio-cream/50 hover:text-vio-navy',
              )}
            >
              <span
                className={cn(
                  'text-vio-navy/35 transition-colors duration-300',
                  active && 'text-vio-gold',
                )}
              >
                {icons[item.icon]}
              </span>
              {item.label}
            </a>
          )
        })}
      </nav>

      <div className="mt-auto border-t border-vio-navy/[0.06] pt-10">
        <p className="text-xs leading-relaxed text-vio-navy/40">
          VIO · Modern luxury hospitality. Crafted with quiet precision.
        </p>
      </div>
    </aside>
  )
}
