'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '../../../../lib/utils'
import type { PricingRule } from '../../../../types/pricing' // Add type later

// Stub data from mockData
const initialPricingRules: PricingRule[] = [
  { id: 'p1', name: 'Cuối tuần +15%', type: 'Thời điểm', adjustment: '+15%', active: true },
  { id: 'p2', name: 'Suite dài ngày -8%', type: 'Hạng phòng', adjustment: '-8%', active: true },
  { id: 'p3', name: 'Tết Nguyên Đán', type: 'Mùa', adjustment: '+35%', active: false },
]

type PricingRule = {
  id: string
  name: string
  type: string
  adjustment: string
  active: boolean
}

export default function PricingRulesPage() {
  const [rules, setRules] = useState<PricingRule[]>(initialPricingRules)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', type: 'Thời điểm', adjustment: '' })

  const toggleActive = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, active: !r.active } : r))
  }

  const addRule = () => {
    if (!form.name.trim() || !form.adjustment.trim()) return
    const newRule: PricingRule = {
      id: `p-${Date.now()}`,
      ...form,
      active: true,
    }
    setRules([...rules, newRule])
    setForm({ name: '', type: 'Thời điểm', adjustment: '' })
    setOpen(false)
  }

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative h-[260px] rounded-3xl overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1468824357306-a439d58ccb1c"
          alt="Pricing"
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30" />
        <div className="absolute bottom-6 left-6">
          <p className="text-xs uppercase tracking-wider text-orange-400">Revenue Control</p>
          <h1 className="text-3xl font-cormorant font-normal text-white mt-2">Pricing Plans</h1>
        </div>
      </section>

      {/* Controls */}
      <div className="flex items-center justify-end">
        <button
          onClick={() => setOpen(true)}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-200"
        >
          + Add Rule
        </button>
      </div>

      {/* Rules Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rules.map((rule) => (
          <div key={rule.id} className="group h-full rounded-3xl border border-orange-100/50 bg-white/80 backdrop-blur p-8 shadow-xl hover:shadow-2xl hover:shadow-orange-100/50 transition-all duration-500 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs uppercase tracking-[0.15em] text-gray-500">{rule.type}</p>
              <button
                onClick={() => toggleActive(rule.id)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ring-1 ring-inset",
                  rule.active 
                    ? "bg-green-100 text-green-800 ring-green-200 hover:bg-green-200" 
                    : "bg-gray-100 text-gray-600 ring-gray-200 hover:bg-gray-200"
                )}
              >
                {rule.active ? 'Active' : 'Inactive'}
              </button>
            </div>
            <h2 className="text-2xl font-cormorant font-normal text-gray-900 mb-4 leading-tight">{rule.name}</h2>
            <p className="text-4xl font-bold text-orange-600 mb-6">{rule.adjustment}</p>
            <ul className="space-y-2 text-sm text-gray-600 mb-8">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                Flexible cancellation
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                Dedicated concierge
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                Breakfast & lounge
              </li>
            </ul>
            <div className="flex items-center justify-between pt-6 border-t border-orange-100">
              <span className="text-sm text-gray-500">Applied to {rule.type}</span>
              <button className="px-4 py-1.5 rounded-xl bg-orange-100 text-orange-700 text-xs font-medium hover:bg-orange-200 transition-colors">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-cormorant font-normal text-gray-900 mb-6">New Pricing Rule</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rule name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  placeholder="e.g. Weekend Special"
                  className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({...form, type: e.target.value})}
                  className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-transparent outline-none transition-all"
                >
                  <option>Thời điểm</option>
                  <option>Hạng phòng</option>
                  <option>Mùa</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adjustment</label>
                <input
                  type="text"
                  value={form.adjustment}
                  onChange={(e) => setForm({...form, adjustment: e.target.value})}
                  placeholder="e.g. +15% or $50"
                  className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-8 pt-6 border-t border-orange-100">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={addRule}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-orange-700 transition-all"
              >
                Add Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
