import { useEffect, useMemo, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Button } from '../ui/Button'
import { cn } from '../../lib/cn'

const links = [
  { to: '/', vi: 'Trang chủ', en: 'Home' },
  { to: '/search', vi: 'Tìm phòng', en: 'Search' },
  { to: '/rooms', vi: 'Phòng', en: 'Rooms' },
  { to: '/bookings', vi: 'Lịch sử đặt', en: 'Bookings' },
] as const

type Locale = 'vi' | 'en'

export function GuestHeader() {
  const { pathname } = useLocation()
  const [locale, setLocale] = useState<Locale>('vi')
  const [isScrolled, setIsScrolled] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  const isHome = pathname === '/'

  useEffect(() => {
    if (!isHome) {
      setIsScrolled(true)
      setScrollY(120)
      return
    }

    const onScroll = () => {
      const y = window.scrollY
      setIsScrolled(y > 50)
      setScrollY(y)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  const isHomeTop = isHome && !isScrolled

  const isRoomsActive = pathname.startsWith('/rooms')
  const isLoginActive = pathname.startsWith('/login')
  const menuOpacity = isHome ? Math.max(0, Math.min(1, scrollY / 60)) : 1
  const canInteractWithMenu = !isHome || menuOpacity > 0.2
  const isTextLinkActive = (to: string) =>
    to === '/' ? pathname === '/' : pathname.startsWith(to)

  const text = useMemo(
    () => ({
      book: locale === 'vi' ? 'Đặt phòng' : 'Book now',
      login: locale === 'vi' ? 'Đăng nhập' : 'Login',
      switchLabel: locale === 'vi' ? 'Đổi sang English' : 'Switch to Vietnamese',
    }),
    [locale],
  )

  return (
    <header
      className={cn(
        'z-40 transition-all duration-300',
        isHome ? 'fixed inset-x-0 top-0' : 'sticky top-0',
        isHomeTop
          ? 'border-transparent bg-transparent shadow-none backdrop-blur-0'
          : 'border-b border-vio-navy/[0.06] bg-vio-white/95 shadow-soft-sm backdrop-blur-md',
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-3 md:px-6 md:py-4">
        <NavLink
          to="/"
          className={cn(
            'group z-20 shrink-0 text-center outline-none transition-all duration-300',
            isHomeTop ? 'absolute left-1/2 -translate-x-1/2' : 'relative',
          )}
        >
          <span
            className={cn(
              'font-heading font-medium tracking-wide transition-colors duration-300',
              isHomeTop
                ? 'bg-gradient-to-r from-vio-white via-[#F8EED4] to-vio-white bg-clip-text text-[34px] text-transparent drop-shadow-[0_3px_14px_rgba(0,0,0,0.55)]'
                : 'text-2xl text-vio-navy group-hover:text-vio-navy/80',
            )}
          >
            VIO
          </span>
          <span
            className={cn(
              'mt-1 block text-[10px] font-medium uppercase tracking-[0.32em] transition-opacity duration-300',
              isHomeTop
                ? 'text-vio-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] opacity-100'
                : 'text-vio-navy/38 opacity-100',
            )}
          >
            Hotel & Resort
          </span>
        </NavLink>

        <nav
          aria-label="Chính"
          className={cn(
            'hidden items-center gap-10 transition-all duration-300 md:flex',
            canInteractWithMenu ? 'pointer-events-auto' : 'pointer-events-none',
          )}
          style={{ opacity: isHome ? menuOpacity : 1 }}
        >
          {links.map(({ to, vi, en }) => (
            <NavLink
              key={to}
              to={to}
              className={() =>
                cn(
                  'text-sm font-medium tracking-wide transition-colors duration-300 ease-[var(--ease-vio)]',
                  isTextLinkActive(to)
                    ? isHomeTop
                      ? 'text-vio-white'
                      : 'text-vio-navy'
                    : isHomeTop
                      ? 'text-vio-white/70 hover:text-vio-white'
                      : 'text-vio-navy/45 hover:text-vio-navy/75',
                )
              }
            >
              {locale === 'vi' ? vi : en}
            </NavLink>
          ))}
        </nav>

        <div
          className={cn(
            'flex shrink-0 items-center gap-4 transition-all duration-300',
            canInteractWithMenu ? 'pointer-events-auto' : 'pointer-events-none',
          )}
          style={{ opacity: isHome ? menuOpacity : 1 }}
        >
          <NavLink to="/rooms" className="outline-none">
            <Button
              type="button"
              variant="primary"
              className={cn(
                'px-3.5 py-1.5 text-xs md:px-4 md:py-2 md:text-sm',
                isRoomsActive
                  ? 'ring-2 ring-vio-gold/60 ring-offset-2 ring-offset-vio-cream'
                  : 'opacity-95 hover:opacity-100',
              )}
            >
              {text.book}
            </Button>
          </NavLink>

          <NavLink to="/login" className="outline-none">
            <Button
              type="button"
              variant="secondary"
              className={cn(
                'px-3.5 py-1.5 text-xs md:px-4 md:py-2 md:text-sm',
                isLoginActive
                  ? 'bg-vio-navy text-vio-white ring-vio-navy/80 shadow-soft-sm'
                  : '',
              )}
            >
              {text.login}
            </Button>
          </NavLink>

          <div className="hidden items-center sm:flex">
            <button
              type="button"
              role="switch"
              title={text.switchLabel}
              aria-label={text.switchLabel}
              aria-checked={locale === 'en'}
              onClick={() => setLocale((prev) => (prev === 'vi' ? 'en' : 'vi'))}
              className={cn(
                'relative h-8 w-16 rounded-full border border-vio-navy/25 bg-vio-white/95 p-1 shadow-soft-sm transition-all duration-300 ease-[var(--ease-vio)]',
                locale === 'en' ? 'bg-vio-navy/95' : 'bg-vio-white',
              )}
            >
              <span
                className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[11px]"
                aria-hidden
              >
                🇻🇳
              </span>
              <span
                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[11px]"
                aria-hidden
              >
                🇺🇸
              </span>

              <span
                className={cn(
                  'absolute top-1 inline-flex h-6 w-6 items-center justify-center rounded-lg text-sm leading-none shadow-[0_2px_8px_rgba(0,0,0,0.2)] transition-all duration-300 ease-[var(--ease-vio)]',
                  locale === 'en'
                    ? 'left-9 bg-vio-cream'
                    : 'left-1 bg-vio-white ring-1 ring-vio-navy/15',
                )}
                aria-hidden
              >
                {locale === 'vi' ? '🇻🇳' : '🇺🇸'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
