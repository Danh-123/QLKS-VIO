import Link from 'next/link'
import { adminNavItems } from '../../../legacy/admin/adminNav'
import { cn } from '../../lib/utils'

export default function AdminSidebar() {
  return (
    <div className="w-64 flex-shrink-0 border-r border-vio-border-cream/50 bg-vio-ivory/50 backdrop-blur-sm max-md:w-16 md:w-72">
      {/* Logo */}
      <div className="border-b border-vio-border-cream/30 p-6 md:p-8">
        <span className="text-lg font-bold uppercase tracking-tight text-vio-near-black hidden md:inline">
          VIO Admin
        </span>
        <span className="p-2 md:hidden">☰</span>
      </div>
      
      {/* Nav Links */}
      <nav className="p-2 md:p-4 space-y-1" role="navigation" aria-label="Admin navigation">
        {adminNavItems.map((item) => (
          <Link
            key={item.to}
            href={item.to}
            className={cn(
              'group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-vio-stone-gray transition-all duration-200 hover:bg-vio-parchment/50 hover:text-vio-near-black focus:outline-none focus-visible:ring-2 focus-visible:ring-vio-terracotta focus-visible:ring-offset-2',
              'md:px-4 md:py-2.5',
              item.to === '/admin' && 'bg-vio-terracotta/10 text-vio-terracotta border-r-2 border-vio-terracotta'
            )}
          >
            <span className="w-5 h-5 opacity-75 group-hover:opacity-100 md:inline hidden">
              {/* Icon placeholders per DESIGN.md motion */}
              {item.to.includes('matrix') && '📊'}
              {item.to.includes('calendar') && '📅'}
              {item.to.includes('rooms') && '🛏️'}
              {item.to.includes('pricing') && '💰'}
              {item.to.includes('customers') && '👥'}
              {item.to.includes('staff') && '👨‍💼'}
            </span>
            <span className="md:block hidden">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
