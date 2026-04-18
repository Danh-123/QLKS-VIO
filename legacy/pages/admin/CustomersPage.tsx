import { useMemo, useState } from 'react'
import { AdminPageHero } from '../../components/admin/AdminPageHero'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { LuxuryPagination, LuxuryTable, type LuxuryColumn } from '../../components/ui/LuxuryTable'
import { Modal } from '../../components/ui/Modal'
import { useFakeApiData } from '../../lib/useFakeApiData'
import { useAppData } from '../../state/AppDataContext'

type CustomerRow = {
  id: string
  name: string
  email: string
  tier: string
  stays: number
}

const PAGE_SIZE = 6

export function CustomersPage() {
  const { customers, addCustomer } = useAppData()
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [form, setForm] = useState({
    name: '',
    email: '',
    tier: 'Silver',
  })

  const { loading, data: rows } = useFakeApiData<CustomerRow[]>(customers, 700)

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageStart = (safePage - 1) * PAGE_SIZE
  const pageRows = rows.slice(pageStart, pageStart + PAGE_SIZE)

  const columns: LuxuryColumn<CustomerRow>[] = useMemo(
    () => [
      { header: 'Name', accessorKey: 'name', className: 'font-medium' },
      { header: 'Email', accessorKey: 'email' },
      {
        header: 'Tier',
        accessorKey: 'tier',
        render: (row) => (
          <span className="font-accent text-sm tracking-[0.04em] text-vio-gold">
            {row.tier}
          </span>
        ),
      },
      { header: 'Stays', accessorKey: 'stays', align: 'right' },
    ],
    [],
  )

  const add = () => {
    if (!form.name.trim() || !form.email.trim()) return

    addCustomer({
      name: form.name,
      email: form.email,
      tier: form.tier,
    })

    setForm({ name: '', email: '', tier: 'Silver' })
    setOpen(false)
  }

  return (
    <div className="space-y-8">
      <AdminPageHero
        eyebrow="Guest Experience"
        title="Customers"
        description="Monitor guest profiles, loyalty tiers, and repeat stays in a unified luxury console."
        imageUrl="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1800&q=80"
      />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div />
        <Button type="button" onClick={() => setOpen(true)}>
          Add Customer
        </Button>
      </div>

      <LuxuryTable
        columns={columns}
        data={pageRows}
        loading={loading}
        rowKey={(row) => row.id}
        emptyMessage="No customers available."
      />
      <LuxuryPagination page={safePage} totalPages={totalPages} onPageChange={setPage} />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="New customer"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={add}>Save</Button>
          </>
        }
      >
        <div className="flex flex-col gap-6">
          <Input
            id="cu-name"
            label="Full name"
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
          />
          <Input
            id="cu-email"
            label="Email"
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
          />
          <div>
            <label
              htmlFor="cu-tier"
              className="mb-2 block text-xs uppercase tracking-[0.2em] text-vio-text-secondary"
            >
              Tier
            </label>
            <select
              id="cu-tier"
              value={form.tier}
              onChange={(event) =>
                setForm((current) => ({ ...current, tier: event.target.value }))
              }
              className="w-full rounded-xl border border-vio-linen bg-vio-white px-4 py-3 text-base text-vio-text-primary"
            >
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="Platinum">Platinum</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  )
}
