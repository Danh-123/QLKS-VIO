export type SidebarNavItem = {
  label: string
  href: string
  icon: 'home' | 'calendar' | 'key' | 'sparkle'
}

export const defaultSidebarNav: SidebarNavItem[] = [
  { label: 'Overview', href: '#overview', icon: 'home' },
  { label: 'Reservations', href: '#reservations', icon: 'calendar' },
  { label: 'Rooms', href: '#rooms', icon: 'key' },
  { label: 'Experiences', href: '#experiences', icon: 'sparkle' },
]

export type MobileNavItem = {
  label: string
  href: string
  icon: 'home' | 'calendar' | 'key' | 'more'
}

export const defaultMobileNav: MobileNavItem[] = [
  { label: 'Home', href: '#home', icon: 'home' },
  { label: 'Stay', href: '#stay', icon: 'calendar' },
  { label: 'Rooms', href: '#rooms-mobile', icon: 'key' },
  { label: 'More', href: '#more', icon: 'more' },
]
