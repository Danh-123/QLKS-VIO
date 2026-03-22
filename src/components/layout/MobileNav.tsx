import type { ReactElement } from 'react'
import { cn } from '../../lib/cn'
import { defaultMobileNav, type MobileNavItem } from './navDefaults'

export type { MobileNavItem } from './navDefaults'

const icons: Record<MobileNavItem['icon'], ReactElement> = {
  home: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
  calendar: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
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
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="8" cy="15" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 11l8-8M18 5l2 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  more: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="6" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="18" cy="12" r="1.5" fill="currentColor" />
    </svg>
  ),
}

export type MobileNavProps = {
  items?: MobileNavItem[]
  activeHref?: string
  className?: string
}

export function MobileNav({
  items = defaultMobileNav,
  activeHref,
  className,
}: MobileNavProps) {
  return (
    <nav
      aria-label="Mobile"
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 md:hidden',
        'border-t border-vio-navy/[0.06] bg-vio-white/95 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_32px_-16px_rgba(30,58,95,0.12)] backdrop-blur-md',
        className,
      )}
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around gap-1 px-2">
        {items.map((item) => {
          const active = activeHref === item.href
          return (
            <li key={item.label} className="flex min-w-0 flex-1">
              <a
                href={item.href}
                className={cn(
                  'flex w-full flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-[11px] font-medium tracking-wide transition-all duration-300 ease-[var(--ease-vio)]',
                  active
                    ? 'text-vio-navy'
                    : 'text-vio-navy/45 hover:text-vio-navy/75',
                )}
              >
                <span
                  className={cn(
                    'transition-colors duration-300',
                    active ? 'text-vio-gold' : 'text-vio-navy/35',
                  )}
                >
                  {icons[item.icon]}
                </span>
                <span className="truncate">{item.label}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
