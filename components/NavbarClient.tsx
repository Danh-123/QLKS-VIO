"use client"

import { Link, useLocation } from 'react-router-dom'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AUTH_USER_KEY, clearAuthSession, hasAuthToken } from '../legacy/hooks/useAuth'

type Language = 'VN' | 'EN'

type AuthUser = {
  id: string
  name: string
  email: string
  role: string
}

type BottomTabItem = {
  href: string
  label: string
  icon: React.ReactNode
}

const NAV_LINKS = [
  { href: '/', label: 'Trang chủ' },
  { href: '/search', label: 'Tìm phòng' },
  { href: '/rooms', label: 'Phòng' },
  { href: '/bookings', label: 'Lịch sử đặt' },
  { href: '/contact', label: 'Liên hệ' },
] as const

const BOTTOM_TABS: BottomTabItem[] = [
  {
    href: '/',
    label: 'Trang chủ',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-5 w-5">
        <path
          d="M4 11.5 12 4l8 7.5M6.5 9.5V20h11V9.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: '/search',
    label: 'Tìm phòng',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-5 w-5">
        <circle cx="11" cy="11" r="5.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="m15.2 15.2 3.3 3.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/rooms',
    label: 'Phòng',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-5 w-5">
        <path
          d="M5 18V8.5A2.5 2.5 0 0 1 7.5 6h9A2.5 2.5 0 0 1 19 8.5V18M5 18h14M7 12h10"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: '/contact',
    label: 'Liên hệ',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-5 w-5">
        <path
          d="M6 8.5A2.5 2.5 0 0 1 8.5 6h7A2.5 2.5 0 0 1 18 8.5v7A2.5 2.5 0 0 1 15.5 18h-7A2.5 2.5 0 0 1 6 15.5v-7Z"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path d="m8 9 4 3 4-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

function isActivePath(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

function getInitials(name?: string) {
  if (!name) return 'V'

  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

function UserGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-4.5 w-4.5">
      <path
        d="M12 12.3a3.8 3.8 0 1 0 0-7.6 3.8 3.8 0 0 0 0 7.6ZM5.8 19.2a6.2 6.2 0 0 1 12.4 0"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function NavbarClient() {
  const location = useLocation()
  const pathname = location.pathname
  const [language, setLanguage] = useState<Language>('VN')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [authMenuOpen, setAuthMenuOpen] = useState(false)
  const mobileAuthMenuRef = useRef<HTMLDivElement | null>(null)
  const tabletAuthMenuRef = useRef<HTMLDivElement | null>(null)
  const desktopAuthMenuRef = useRef<HTMLDivElement | null>(null)

  const syncAuth = useCallback(() => {
    const tokenPresent = hasAuthToken()
    setIsLoggedIn(tokenPresent)

    if (!tokenPresent) {
      setUser(null)
      setAuthMenuOpen(false)
      return
    }

    try {
      const rawUser = window.localStorage.getItem(AUTH_USER_KEY)
      setUser(rawUser ? (JSON.parse(rawUser) as AuthUser) : null)
    } catch {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const saved = window.localStorage.getItem('vio-language')
    if (saved === 'VN' || saved === 'EN') {
      setLanguage(saved)
      document.documentElement.lang = saved === 'VN' ? 'vi' : 'en'
    }

    syncAuth()

    const handleAuthChanged = () => syncAuth()
    const handleStorage = (event: StorageEvent) => {
      if (event.key === AUTH_USER_KEY || event.key === null) {
        syncAuth()
      }
    }

    const authMenuRefs = [mobileAuthMenuRef, tabletAuthMenuRef, desktopAuthMenuRef]

    const handleOutsideClick = (event: MouseEvent) => {
      // Cheap early-return: most of the time menu is closed.
      if (!authMenuOpen) return

      if (authMenuRefs.some((ref) => ref.current?.contains(event.target as Node))) {
        return
      }

      setAuthMenuOpen(false)
    }

    window.addEventListener('vio-auth-changed', handleAuthChanged)
    window.addEventListener('storage', handleStorage)
    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      window.removeEventListener('vio-auth-changed', handleAuthChanged)
      window.removeEventListener('storage', handleStorage)
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [authMenuOpen, syncAuth])

  const setLang = (next: Language) => {
    setLanguage(next)

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('vio-language', next)
      document.documentElement.lang = next === 'VN' ? 'vi' : 'en'
    }
  }

  const navItems = useMemo(
    () =>
      NAV_LINKS.map((item) => {
        const active = isActivePath(pathname, item.href)

        return (
          <Link
            key={item.href}
            to={item.href}
            className={`relative inline-flex items-center justify-center rounded-full px-2 py-1 text-[15px] font-light tracking-[0.04em] transition-all duration-200 ${
              active ? 'text-black' : 'text-gray-700 hover:text-black'
            } after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:bg-black after:transition-transform after:duration-200 ${
              active ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-60'
            }`}
          >
            {item.label}
          </Link>
        )
      }),
    [pathname],
  )

  const mobileTabItems = useMemo(
    () =>
      BOTTOM_TABS.map((item) => {
        const active = isActivePath(pathname, item.href)

        return (
          <Link
            key={item.href}
            to={item.href}
            className={`flex h-full min-h-14 flex-1 flex-col items-center justify-center gap-1 rounded-full px-2 py-2 text-[10px] font-medium tracking-[0.12em] transition-all duration-200 ${
              active
                ? 'bg-slate-900/5 text-slate-950'
                : 'text-gray-500 hover:bg-slate-900/[0.03] hover:text-slate-900'
            }`}
          >
            <span className={active ? 'text-slate-950' : 'text-gray-500'}>{item.icon}</span>
            <span className="whitespace-nowrap leading-none">{item.label}</span>
          </Link>
        )
      }),
    [pathname],
  )

  const langButtonClass = (item: Language) =>
    `inline-flex items-center justify-center rounded-full px-3 py-1 text-sm tracking-[0.08em] transition-all duration-200 ${
      language === item
        ? 'bg-[#0f172a] font-semibold text-white shadow-sm'
        : 'bg-transparent font-light text-gray-700 hover:text-black'
    }`

  const primaryButtonClass =
    'inline-flex h-11 min-h-11 items-center justify-center rounded-full px-6 py-2.5 text-[15px] font-light tracking-[0.04em] transition-transform duration-300 ease-in-out bg-[#0f172a] text-white hover:bg-[#1a2740] hover:-translate-y-0.5 md:h-12 md:min-h-12 md:w-auto'

  const secondaryButtonClass =
    'inline-flex h-11 min-h-11 w-full items-center justify-center rounded-full border border-gray-300 bg-white px-6 text-sm font-light tracking-[0.06em] transition-all duration-200 text-gray-700 hover:border-gray-400 hover:text-black md:h-12 md:min-h-12 md:w-auto'

  return (
      <header className="sticky top-5 z-50 pointer-events-none ">
        <div className="pointer-events-auto mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative mx-auto w-full rounded-3xl bg-white/72 backdrop-blur-xl border border-white/40 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between py-3 px-4 md:hidden">
            <Link to="/" className="flex shrink-0 flex-col leading-none text-black">
              <span className="text-[1.35rem] font-light tracking-[0.26em]">VIO</span>
              <span className="mt-1 text-[10px] uppercase tracking-[0.34em] text-gray-500">
                Hotel & Resort
              </span>
            </Link>

            <div className="relative" ref={mobileAuthMenuRef}>
              <button
                type="button"
                onClick={() => setAuthMenuOpen((current) => !current)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition-all duration-200 hover:border-gray-400 hover:text-black"
                aria-expanded={authMenuOpen}
                aria-label="Mở menu tài khoản"
              >
                {isLoggedIn ? <span className="text-[11px] font-medium">{getInitials(user?.name)}</span> : <UserGlyph />}
              </button>

              <div
                className={`absolute right-0 top-full mt-3 w-[calc(100vw-2rem)] max-w-[20rem] rounded-2xl border border-gray-200/80 bg-white/90 px-4 py-4 text-left shadow-lg backdrop-blur-xl transition-all duration-200 ${
                  authMenuOpen
                    ? 'translate-y-0 opacity-100 visible'
                    : '-translate-y-2 opacity-0 pointer-events-none invisible'
                }`}
              >
                {!isLoggedIn ? (
                  <Link
                    to="/login"
                    className="block rounded-xl px-3 py-3 text-sm text-gray-700 transition-colors duration-200 hover:bg-slate-900/5 hover:text-black"
                    onClick={() => setAuthMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                ) : (
                  <div className="rounded-xl bg-slate-900/[0.03] px-3 py-3">
                    <div className="text-sm font-light text-black">{user?.name || 'User'}</div>
                    <div className="mt-1 text-xs text-gray-500">{user?.email || ''}</div>
                  </div>
                )}

                <div className="my-3 h-px bg-gray-100/80" />

                <div className="flex flex-col gap-2">
                  <Link
                    to="/profile"
                    className="rounded-xl px-3 py-3 text-sm text-gray-700 transition-colors duration-200 hover:bg-slate-900/5 hover:text-black"
                    onClick={() => setAuthMenuOpen(false)}
                  >
                    Hồ sơ
                  </Link>
                  <Link
                    to="/bookings"
                    className="rounded-xl px-3 py-3 text-sm text-gray-700 transition-colors duration-200 hover:bg-slate-900/5 hover:text-black"
                    onClick={() => setAuthMenuOpen(false)}
                  >
                    Lịch sử đặt
                  </Link>
                  <button
                    type="button"
                    onClick={() => setLang(language === 'VN' ? 'EN' : 'VN')}
                    className="rounded-xl px-3 py-3 text-left text-sm text-gray-700 transition-colors duration-200 hover:bg-slate-900/5 hover:text-black"
                  >
                    Đổi ngôn ngữ · {language}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      clearAuthSession()
                      setIsLoggedIn(false)
                      setUser(null)
                      setAuthMenuOpen(false)
                    }}
                    className="rounded-xl px-3 py-3 text-left text-sm text-gray-700 transition-colors duration-200 hover:bg-slate-900/5 hover:text-black"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden ">
            <div className="flex items-center justify-center">
              <Link to="/" className="flex shrink-0 flex-col items-center leading-none text-black">
                <span className="text-[1.35rem] font-light tracking-[0.26em]">VIO</span>
                <span className="mt-1 text-[10px] uppercase tracking-[0.34em] text-gray-500">
                  Hotel & Resort
                </span>
              </Link>
            </div>

            <nav aria-label="Chính" className="flex flex-nowrap items-center justify-center gap-x-8 gap-y-0 whitespace-nowrap overflow-hidden">
              {navItems}
            </nav>

            <div className="flex items-center justify-center gap-3">
              <Link to="/search" className={primaryButtonClass}>
                Đặt phòng
              </Link>

              {!isLoggedIn ? (
                <Link to="/login" className={secondaryButtonClass}>
                  Đăng nhập
                </Link>
              ) : (
                <div className="relative" ref={tabletAuthMenuRef}>
                  <button
                    type="button"
                    onClick={() => setAuthMenuOpen((current) => !current)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition-all duration-200 hover:border-gray-400 hover:text-black"
                    aria-expanded={authMenuOpen}
                    aria-label="Mở menu tài khoản"
                  >
                    <span className="text-[11px] font-medium">{getInitials(user?.name)}</span>
                  </button>
                </div>
              )}

              <div className="grid min-w-[120px] grid-cols-2 overflow-hidden rounded-full border border-gray-300/80 bg-white">
                <button type="button" onClick={() => setLang('VN')} className={langButtonClass('VN')}>
                  VN
                </button>
                <button
                  type="button"
                  onClick={() => setLang('EN')}
                  className={`border-l border-gray-200 px-3.5 py-1.5 text-sm tracking-[0.08em] transition-all duration-200 ${
                    language === 'EN'
                      ? 'bg-[#0f172a] font-semibold text-white'
                      : 'bg-transparent font-light text-gray-700 hover:text-black'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>
          </div>

          <div className="hidden lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-8 lg:py-4 px-6">
            <Link to="/" className="flex shrink-0 flex-col leading-none text-black">
              <span className="text-[1.35rem] font-light tracking-[0.26em] md:text-[1.5rem]">VIO</span>
              <span className="mt-1 text-[10px] uppercase tracking-[0.34em] text-gray-500">
                Hotel & Resort
              </span>
            </Link>

            <nav aria-label="Chính" className="flex items-center justify-center gap-x-8">
              {navItems}
            </nav>

            <div className="flex items-center justify-end gap-4">
              <Link to="/search" className={primaryButtonClass}>
                Đặt phòng
              </Link>

              {!isLoggedIn ? (
                <Link to="/login" className={secondaryButtonClass}>
                  Đăng nhập
                </Link>
              ) : (
                <div className="relative" ref={desktopAuthMenuRef}>
                  <button
                    type="button"
                    onClick={() => setAuthMenuOpen((current) => !current)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition-all duration-200 hover:border-gray-400 hover:text-black"
                    aria-expanded={authMenuOpen}
                    aria-label="Mở menu tài khoản"
                  >
                    <span className="text-[11px] font-medium">{getInitials(user?.name)}</span>
                  </button>

                  <div
                    className={`absolute right-0 top-full mt-3 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-gray-200/80 bg-white/90 px-4 py-4 text-left shadow-lg backdrop-blur-xl transition-all duration-200 ${
                      authMenuOpen
                        ? 'translate-y-0 opacity-100 visible'
                        : '-translate-y-2 opacity-0 pointer-events-none invisible'
                    }`}
                  >
                    <div className="text-sm font-light text-black">{user?.name || 'User'}</div>
                    <div className="mt-1 text-xs text-gray-500">{user?.email || ''}</div>

                    <div className="my-3 h-px bg-gray-100/80" />

                    <div className="flex flex-col gap-2">
                      <Link
                        to="/profile"
                        className="rounded-xl px-3 py-3 text-sm text-gray-700 transition-colors duration-200 hover:bg-slate-900/5 hover:text-black"
                        onClick={() => setAuthMenuOpen(false)}
                      >
                        Hồ sơ
                      </Link>
                      <Link
                        to="/bookings"
                        className="rounded-xl px-3 py-3 text-sm text-gray-700 transition-colors duration-200 hover:bg-slate-900/5 hover:text-black"
                        onClick={() => setAuthMenuOpen(false)}
                      >
                        Lịch sử đặt
                      </Link>
                      <button
                        type="button"
                        onClick={() => setLang(language === 'VN' ? 'EN' : 'VN')}
                        className="rounded-xl px-3 py-3 text-left text-sm text-gray-700 transition-colors duration-200 hover:bg-slate-900/5 hover:text-black"
                      >
                        Đổi ngôn ngữ · {language}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          clearAuthSession()
                          setIsLoggedIn(false)
                          setUser(null)
                          setAuthMenuOpen(false)
                        }}
                        className="rounded-xl px-3 py-3 text-left text-sm text-gray-700 transition-colors duration-200 hover:bg-slate-900/5 hover:text-black"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="inline-flex items-center gap-1 rounded-full bg-white/90 p-1 shadow-sm">
                <button type="button" onClick={() => setLang('VN')} className={langButtonClass('VN')}>
                  VN
                </button>
                <button
                  type="button"
                  onClick={() => setLang('EN')}
                  className={`rounded-full px-3 py-1 text-sm tracking-[0.08em] transition-all duration-200 ${
                    language === 'EN' ? 'bg-[#0f172a] font-semibold text-white' : 'bg-transparent font-light text-gray-700 hover:text-black'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>
          </div>
        </div>
          <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 md:hidden">
            <div className="mx-auto flex w-[min(100%-1rem,22rem)] items-center justify-center">
              <nav
                aria-label="Điều hướng nhanh"
                className="pointer-events-auto grid w-full grid-cols-4 gap-1 rounded-full border border-gray-200/60 bg-white/85 p-1.5 shadow-lg backdrop-blur-xl"
              >
                {mobileTabItems}
              </nav>
            </div>
          </div>
        </div>
      </header>
    )
}