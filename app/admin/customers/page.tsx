'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { fetchUsers } from '../../../../lib/api'
import { cn } from '../../../../lib/utils'
import type { User } from '../../../../types/user'

const PAGE_SIZE = 6

export default function CustomersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useMemo(async () => {
    setLoading(true)
    try {
      const data = await fetchUsers()
      setUsers(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  const totalPages = Math.ceil(users.length / PAGE_SIZE)
  const paginatedUsers = users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="space-y-8">
      <section className="relative h-[260px] rounded-3xl overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa" alt="Customers" fill sizes="100vw" priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60" />
        <div className="absolute bottom-6 left-6">
          <p className="text-xs uppercase tracking-wider text-orange-400">Guest Experience</p>
          <h1 className="text-3xl font-cormorant font-normal text-white mt-2">Customers</h1>
        </div>
      </section>

      <section className="rounded-3xl border border-orange-100/50 bg-white/80 backdrop-blur shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-orange-100">
          <h2 className="text-3xl font-cormorant font-normal text-gray-900">Customer Directory</h2>
          <p className="text-sm text-gray-600 mt-1">Profiles, loyalty tiers, stay history.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-orange-100">
                <th className="px-8 py-5 text-left text-xs uppercase tracking-wider font-semibold text-gray-500">Name</th>
                <th className="px-6 py-5 text-left text-xs uppercase tracking-wider font-semibold text-gray-500">Email</th>
                <th className="px-6 py-5 text-left text-xs uppercase tracking-wider font-semibold text-gray-500">Tier</th>
                <th className="px-8 py-5 text-right text-xs uppercase tracking-wider font-semibold text-gray-500">Stays</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-50">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-orange-50">
                  <td className="px-8 py-5 font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-5 text-gray-600">{user.email}</td>
                  <td className="px-6 py-5">
                    <span className={cn('px-3 py-1 rounded-full text-xs font-semibold',
                      user.tier === 'Platinum' ? 'bg-indigo-100 text-indigo-800' :
                      user.tier === 'Gold' ? 'bg-amber-100 text-amber-800' :
                      'bg-gray-100 text-gray-700'
                    )}>
                      {user.tier}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right font-semibold text-gray-900">12</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="px-8 py-6 border-t border-orange-100 flex items-center justify-center gap-2">
            <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-4 py-2 rounded-xl border font-medium disabled:opacity-50">
              Previous
            </button>
            <span>{page} / {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-4 py-2 rounded-xl border font-medium disabled:opacity-50">
              Next
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
