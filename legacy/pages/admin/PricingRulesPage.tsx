import { useState } from 'react'
import {
  initialPricingRules,
  type PricingRule,
} from '../../admin/mockData'
import { AdminPageHero } from '../../components/admin/AdminPageHero'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'

const planFeatures = [
  'Flexible cancellation window',
  'Dedicated concierge support',
  'Breakfast and lounge access',
]

export function PricingRulesPage() {
  const [rules, setRules] = useState<PricingRule[]>(initialPricingRules)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    name: '',
    type: 'Thời điểm',
    adjustment: '',
  })

  const add = () => {
    if (!form.name.trim() || !form.adjustment.trim()) return
    setRules((r) => [
      ...r,
      {
        id: `p-${Date.now()}`,
        name: form.name,
        type: form.type,
        adjustment: form.adjustment,
        active: true,
      },
    ])
    setForm({ name: '', type: 'Thời điểm', adjustment: '' })
    setOpen(false)
  }

  const toggle = (id: string) => {
    setRules((list) =>
      list.map((x) => (x.id === id ? { ...x, active: !x.active } : x)),
    )
  }

  return (
    <div className="space-y-8">
      <AdminPageHero
        eyebrow="Revenue Control"
        title="Pricing Plans"
        description="Shape rate strategy with premium plans, dynamic adjustments, and seasonal offers."
        imageUrl="https://images.unsplash.com/photo-1468824357306-a439d58ccb1c?auto=format&fit=crop&w=1800&q=80"
      />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div />
        <Button type="button" onClick={() => setOpen(true)}>
          Add Rule
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {rules.map((rule) => (
          <Card key={rule.id} goldBorder className="flex h-full flex-col gap-6 p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.1em] text-vio-text-secondary">
                {rule.type}
              </p>
              <h2 className="mt-2 font-heading text-3xl font-normal text-vio-navy">
                {rule.name}
              </h2>
              <p className="mt-3 font-accent text-4xl font-normal text-vio-gold">
                {rule.adjustment}
              </p>
            </div>

            <ul className="space-y-2 text-sm text-vio-text-secondary">
              {planFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <span className="mt-0.5 text-vio-gold">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto flex items-center justify-between gap-3">
              <span
                className={rule.active ? 'text-sm text-vio-success' : 'text-sm text-vio-text-secondary'}
              >
                {rule.active ? 'Active' : 'Inactive'}
              </span>
              <Button
                type="button"
                className="px-4 py-2 text-xs transition-colors duration-200 hover:bg-vio-gold"
                onClick={() => toggle(rule.id)}
              >
                {rule.active ? 'Disable' : 'Enable'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="New pricing rule"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button onClick={add}>Add</Button>
          </>
        }
      >
        <div className="flex flex-col gap-6">
          <Input
            id="pr-name"
            label="Rule name"
            value={form.name}
            onChange={(e) =>
              setForm((f) => ({ ...f, name: e.target.value }))
            }
          />
          <Input
            id="pr-type"
            label="Plan type"
            value={form.type}
            onChange={(e) =>
              setForm((f) => ({ ...f, type: e.target.value }))
            }
          />
          <Input
            id="pr-adj"
            label="Price marker (ex: $320 or +15%)"
            value={form.adjustment}
            onChange={(e) =>
              setForm((f) => ({ ...f, adjustment: e.target.value }))
            }
          />
        </div>
      </Modal>
    </div>
  )
}
