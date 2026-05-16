import { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'
import { cn } from '../../lib/cn'
import { clearAuthSession, getStoredUser } from '../../../hooks/useAuth'

const links = [
  { to: '/', vi: 'Trang chủ', en: 'Home' },
  { to: '/search', vi: 'Tìm phòng', en: 'Search' },
  { to: '/rooms', vi: 'Phòng', en: 'Rooms' },
  { to: '/bookings/history', vi: 'Lịch sử đặt', en: 'Bookings' },
] as const

type Locale = 'vi' | 'en'

type HeaderUser = {
  id: string
  name: string
  role: 'admin' | 'user'
  avatar?: string
}

function userAvatarInitials(name?: string) {
  const words = (name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (!words.length) return 'U'

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase()
  }

  return `${words[0][0] || ''}${words[words.length - 1][0] || ''}`.toUpperCase()
}

export function GuestHeader() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [locale, setLocale] = useState<Locale>('vi')
  const [scrollY, setScrollY] = useState(0)
  const [currentUser, setCurrentUser] = useState<HeaderUser | null>(null)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement | null>(null)

  const isHome = pathname === '/'

  useEffect(() => {
    if (!isHome) {
      return
    }

    const onScroll = () => {
      setScrollY(window.scrollY)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  const isScrolled = !isHome || scrollY > 50
  const isHomeTop = isHome && !isScrolled

  const isRoomsActive = pathname.startsWith('/rooms')
  const isLoginActive = pathname.startsWith('/login') || pathname.startsWith('/admin/login')
  const menuOpacity = isHome ? Math.max(0, Math.min(1, scrollY / 60)) : 1
  const canInteractWithMenu = !isHome || menuOpacity > 0.2
  const isTextLinkActive = (to: string) =>
    to === '/' ? pathname === '/' : pathname.startsWith(to)

  const text = useMemo(
    () => ({
      book: locale === 'vi' ? 'Đặt phòng' : 'Book now',
      login: locale === 'vi' ? 'Đăng nhập' : 'Login',
      switchLabel: locale === 'vi' ? 'Đổi sang English' : 'Switch to Vietnamese',
      myAccount: locale === 'vi' ? 'Tài khoản của tôi' : 'My account',
      bookingHistory: locale === 'vi' ? 'Lịch sử đặt phòng' : 'Booking history',
      logout: locale === 'vi' ? 'Đăng xuất' : 'Logout',
      adminDashboard: locale === 'vi' ? 'Bảng quản trị' : 'Admin dashboard',
    }),
    [locale],
  )

  useEffect(() => {
    const applyUser = () => {
      const user = getStoredUser()
      if (!user) {
        setCurrentUser(null)
        return
      }

      setCurrentUser({
        id: user.id,
        name: user.name,
        role: user.role,
        avatar: typeof user.avatar === 'string' && user.avatar.trim() ? user.avatar : undefined,
      })
    }

    applyUser()

    const onStorage = (event: StorageEvent) => {
      if (event.key === 'user' || event.key === null) {
        applyUser()
      }
    }

    window.addEventListener('storage', onStorage)

    return () => {
      window.removeEventListener('storage', onStorage)
    }
  }, [pathname])

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!userMenuRef.current) return
      if (event.target instanceof Node && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
    }

    const onEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onEsc)

    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onEsc)
    }
  }, [])

  const handleLogout = () => {
    clearAuthSession()
    setCurrentUser(null)
    setIsUserMenuOpen(false)
    navigate('/login', { replace: true })
  }

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
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:gap-8 md:px-6 md:py-4">
        <NavLink
          to="/"
          className={cn(
            'group z-20 shrink-0 text-center outline-none transition-all duration-300 md:relative',
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
          {currentUser?.role === 'admin' ? (
            <NavLink
              to="/admin/dashboard"
              className={() =>
                cn(
                  'rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-300 ease-[var(--ease-vio)]',
                  pathname.startsWith('/admin')
                    ? isHomeTop
                      ? 'border-vio-white bg-white/15 text-vio-white'
                      : 'border-vio-gold/50 bg-vio-gold/10 text-vio-navy'
                    : isHomeTop
                      ? 'border-vio-white/35 text-vio-white/90 hover:border-vio-white hover:bg-white/10'
                      : 'border-vio-navy/15 text-vio-navy hover:border-vio-gold/45 hover:text-vio-gold',
                )
              }
            >
              {text.adminDashboard}
            </NavLink>
          ) : null}
        </nav>

        <div
          className={cn(
            'hidden shrink-0 items-center gap-4 transition-all duration-300 md:flex',
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

          {!currentUser ? (
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
          ) : (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                aria-expanded={isUserMenuOpen}
                aria-haspopup="menu"
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full border border-vio-navy/12 bg-white/95 px-2 py-1.5 shadow-soft-sm transition-colors hover:border-vio-gold/40"
              >
                <span className="relative inline-flex h-8 w-8 overflow-hidden rounded-full bg-vio-navy text-xs font-semibold tracking-wide text-white">
                  {currentUser.avatar ? (
                    <span
                      className="h-full w-full bg-cover bg-center"
                      role="img"
                      aria-label={currentUser.name}
                      style={{ backgroundImage: `url(${currentUser.avatar})` }}
                    />
                  ) : (
                    <span className="m-auto">{userAvatarInitials(currentUser.name)}</span>
                  )}
                </span>
                <span className="max-w-[96px] truncate text-xs font-medium text-vio-navy">{currentUser.name}</span>
              </button>

              {isUserMenuOpen ? (
                <div
                  role="menu"
                  className="absolute right-0 top-[calc(100%+0.5rem)] z-50 min-w-[220px] overflow-hidden rounded-2xl border border-vio-navy/12 bg-white shadow-soft"
                >
                  <div className="border-b border-vio-navy/8 px-4 py-3">
                    <p className="text-sm font-semibold text-vio-navy">{currentUser.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-vio-navy/45">{currentUser.role}</p>
                  </div>
                  <div className="p-2">
                    {currentUser.role === 'admin' ? (
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false)
                          navigate('/admin/dashboard')
                        }}
                        className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm font-medium text-vio-navy transition-colors hover:bg-vio-gold/15"
                        role="menuitem"
                      >
                        {text.adminDashboard}
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false)
                        navigate('/rooms')
                      }}
                      className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm text-vio-navy transition-colors hover:bg-vio-sand/30"
                      role="menuitem"
                    >
                      {text.myAccount}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false)
                        navigate('/bookings/history')
                      }}
                      className="mt-1 flex w-full items-center rounded-xl px-3 py-2 text-left text-sm text-vio-navy transition-colors hover:bg-vio-sand/30"
                      role="menuitem"
                    >
                      {text.bookingHistory}
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="mt-1 flex w-full items-center rounded-xl px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                      role="menuitem"
                    >
                      {text.logout}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )}

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
