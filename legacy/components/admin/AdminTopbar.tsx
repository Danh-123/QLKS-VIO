import { useState } from 'react'
import { Link } from 'react-router-dom'

export function AdminTopbar({ title }: { title?: string }) {
  const [query, setQuery] = useState('')

  return (
    <header className="flex items-center justify-between gap-4 bg-transparent px-4 py-4 md:px-6">
      <div>
        <h2 className="text-lg font-heading font-medium text-vio-navy">{title || 'Dashboard'}</h2>
        <p className="text-xs text-vio-text-secondary">Welcome back — overview of recent activity</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center rounded-full bg-white/90 px-3 py-1 border border-white/40">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search bookings, guests..."
            className="w-48 bg-transparent text-sm outline-none placeholder:text-vio-text-secondary"
          />
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/profile" className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-700">
            AD
          </Link>
        </div>
      </div>
    </header>
  )
}
