import { useState } from 'react'
import {
  initialPricingRules,
  type PricingRule,
} from '../../admin/mockData'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '../../components/ui/Table'

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
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-medium tracking-tight text-vio-navy md:text-4xl">
            Giá & ưu đãi
          </h1>
          <p className="mt-2 text-sm text-vio-navy/50">
            Quy tắc điều chỉnh giá — bật / tắt nhanh.
          </p>
        </div>
        <Button type="button" onClick={() => setOpen(true)}>
          Thêm quy tắc
        </Button>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Tên</TableHeaderCell>
            <TableHeaderCell>Loại</TableHeaderCell>
            <TableHeaderCell>Điều chỉnh</TableHeaderCell>
            <TableHeaderCell>Trạng thái</TableHeaderCell>
            <TableHeaderCell className="text-right">Bật/tắt</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rules.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-medium">{r.name}</TableCell>
              <TableCell>{r.type}</TableCell>
              <TableCell>{r.adjustment}</TableCell>
              <TableCell>{r.active ? 'Đang áp dụng' : 'Tắt'}</TableCell>
              <TableCell className="text-right">
                <Button
                  type="button"
                  variant="secondary"
                  className="px-4 py-2 text-xs"
                  onClick={() => toggle(r.id)}
                >
                  {r.active ? 'Tắt' : 'Bật'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Quy tắc mới"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Đóng
            </Button>
            <Button onClick={add}>Thêm</Button>
          </>
        }
      >
        <div className="flex flex-col gap-6">
          <Input
            id="pr-name"
            label="Tên quy tắc"
            value={form.name}
            onChange={(e) =>
              setForm((f) => ({ ...f, name: e.target.value }))
            }
          />
          <Input
            id="pr-type"
            label="Loại (nhãn)"
            value={form.type}
            onChange={(e) =>
              setForm((f) => ({ ...f, type: e.target.value }))
            }
          />
          <Input
            id="pr-adj"
            label="Điều chỉnh (vd +15%)"
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
