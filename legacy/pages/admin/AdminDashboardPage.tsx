import { useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { BookingStatus } from '../../../types/booking'
import { AdminPageHero } from '../../components/admin/AdminPageHero'
import { LuxuryPagination, LuxuryTable, type LuxuryColumn } from '../../components/ui/LuxuryTable'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { Card } from '../../components/ui/Card'
import { useAdminDashboard } from '../../hooks/useAdminDashboard'
import { cn } from '../../lib/cn'

const PAGE_SIZE = 7

const statusLabels: Record<BookingStatus, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  'checked-in': 'Đã nhận phòng',
  'checked-out': 'Đã trả phòng',
  cancelled: 'Đã hủy',
  'no-show': 'Không đến',
}

const roomStatusLabels: Record<string, string> = {
  available: 'Trống sạch',
  occupied: 'Có khách',
  dirty: 'Chờ dọn',
  maintenance: 'Bảo trì',
  reserved: 'Giữ phòng',
  unknown: 'Khác',
}

type BookingRow = {
  id: string
  guest: string
  room: string
  checkIn: string
  checkOut: string
  total: string
  status: BookingStatus
}

function toBadgeStatus(status: BookingStatus): 'confirmed' | 'pending' | 'cancelled' {
  if (status === 'confirmed' || status === 'checked-in' || status === 'checked-out') {
    return 'confirmed'
  }

  if (status === 'cancelled' || status === 'no-show') {
    return 'cancelled'
  }

  return 'pending'
}

function formatVnd(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value)
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function bookingMonthKey(checkIn: string): string | null {
  if (checkIn.length >= 7 && /^\d{4}-\d{2}/.test(checkIn)) {
    return checkIn.slice(0, 7)
  }
  const t = Date.parse(checkIn)
  if (Number.isNaN(t)) return null
  const d = new Date(t)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function lastSixMonthKeys(): string[] {
  const out: string[] = []
  const now = new Date()
  for (let i = 5; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    out.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }
  return out
}

function monthLabelVi(ym: string) {
  const [y, m] = ym.split('-').map(Number)
  if (!y || !m) return ym
  return new Date(y, m - 1, 1).toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' })
}

function StatTile({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint: string
}) {
  return (
    <Card goldBorder className="p-5 md:p-6">
      <p className="text-xs uppercase tracking-[0.1em] text-vio-text-secondary">{label}</p>
      <p className="mt-3 font-heading text-3xl font-normal leading-none text-vio-navy md:text-4xl">{value}</p>
      <p className="mt-3 text-xs text-vio-text-secondary">{hint}</p>
    </Card>
  )
}

function QuickLink({
  to,
  title,
  description,
}: {
  to: string
  title: string
  description: string
}) {
  return (
    <Link
      to={to}
      className="group flex flex-col rounded-xl border border-vio-linen bg-vio-white p-4 shadow-soft transition-all hover:border-vio-gold/60 hover:shadow-soft-lg md:p-5"
    >
      <span className="font-heading text-lg text-vio-navy transition-colors group-hover:text-vio-gold md:text-xl">
        {title}
      </span>
      <span className="mt-2 text-xs leading-relaxed text-vio-text-secondary md:text-sm">{description}</span>
      <span className="mt-4 text-xs font-medium uppercase tracking-wider text-vio-gold">Mở →</span>
    </Link>
  )
}

function FlowList({
  title,
  count,
  children,
}: {
  title: string
  count: number
  children: ReactNode
}) {
  return (
    <Card className="flex h-full flex-col p-0">
      <div className="flex items-center justify-between gap-3 border-b border-vio-linen px-5 py-4">
        <h3 className="font-heading text-xl text-vio-navy">{title}</h3>
        <span className="shrink-0 rounded-full bg-vio-navy/8 px-3 py-1 text-xs font-medium text-vio-navy">
          {count}
        </span>
      </div>
      <ul className="max-h-[220px] flex-1 divide-y divide-vio-linen overflow-y-auto px-0 text-sm">{children}</ul>
    </Card>
  )
}

export function AdminDashboardPage() {
  const [page, setPage] = useState(1)
  const { bookings, metrics, rooms, roomStatusCounts, loading, error, reload, updateBookingStatus } =
    useAdminDashboard()

  const today = todayISO()

  const arrivals = useMemo(
    () =>
      bookings.filter(
        (b) =>
          b.checkIn === today &&
          b.status !== 'cancelled' &&
          b.status !== 'no-show' &&
          b.status !== 'checked-out',
      ),
    [bookings, today],
  )

  const departures = useMemo(
    () =>
      bookings.filter(
        (b) =>
          b.checkOut === today &&
          (b.status === 'checked-in' || b.status === 'confirmed' || b.status === 'pending'),
      ),
    [bookings, today],
  )

  const attentionRooms = useMemo(
    () => rooms.filter((r) => r.status === 'dirty' || r.status === 'maintenance'),
    [rooms],
  )

  const chartData = useMemo(() => {
    const keys = lastSixMonthKeys()
    const totals = new Map<string, number>()
    for (const k of keys) totals.set(k, 0)

    for (const b of bookings) {
      const mk = bookingMonthKey(b.checkIn)
      if (!mk || !totals.has(mk)) continue
      if (b.status === 'cancelled' || b.status === 'no-show') continue
      totals.set(mk, (totals.get(mk) ?? 0) + b.totalVnd)
    }

    return keys.map((ym) => ({
      ym,
      label: monthLabelVi(ym),
      revenue: totals.get(ym) ?? 0,
    }))
  }, [bookings])

  const rows = useMemo<BookingRow[]>(
    () =>
      bookings.map((booking) => ({
        id: booking.id,
        guest: booking.guest,
        room: booking.room,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut || '—',
        total: formatVnd(booking.totalVnd),
        status: booking.status,
      })),
    [bookings],
  )

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageStart = (safePage - 1) * PAGE_SIZE
  const pageRows = rows.slice(pageStart, pageStart + PAGE_SIZE)

  const columns: LuxuryColumn<BookingRow>[] = [
    { header: 'Mã đặt', accessorKey: 'id', className: 'font-medium' },
    { header: 'Khách', accessorKey: 'guest' },
    { header: 'Phòng', accessorKey: 'room' },
    {
      header: 'Trạng thái',
      accessorKey: 'status',
      render: (row) => <StatusBadge status={toBadgeStatus(row.status)} />,
    },
    {
      header: 'Cập nhật',
      accessorKey: 'update',
      render: (row) => (
        <select
          value={row.status}
          onChange={(event) => updateBookingStatus(row.id, event.target.value as BookingStatus)}
          className="max-w-[140px] rounded-full border border-vio-linen bg-vio-white px-2 py-1.5 text-xs text-vio-text-primary"
        >
          {Object.keys(statusLabels).map((status) => (
            <option key={status} value={status}>
              {statusLabels[status as BookingStatus]}
            </option>
          ))}
        </select>
      ),
    },
    { header: 'Nhận phòng', accessorKey: 'checkIn' },
    { header: 'Trả phòng', accessorKey: 'checkOut' },
    { header: 'Tổng tiền', accessorKey: 'total', align: 'right' },
  ]

  return (
    <div className="space-y-8 md:space-y-10">
      <AdminPageHero
        eyebrow="VIO · Hotel Operations"
        title="Điều hành khách sạn"
        description="Một trung tâm cho đặt phòng, công suất buồng, giá và trải nghiệm khách — đồng bộ dữ liệu qua API nội bộ."
        imageUrl="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=80"
      />

      {error ? (
        <div
          className={cn(
            'flex items-center justify-between gap-4 rounded-lg border border-vio-error/30 bg-vio-error/5 px-4 py-3 text-sm text-vio-error',
          )}
          role="alert"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={reload}
            className="rounded-md border border-vio-error/40 px-3 py-1.5 text-xs transition-colors hover:bg-vio-error/10"
          >
            Thử lại
          </button>
        </div>
      ) : null}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Doanh thu (tổng hợp)"
          value={formatVnd(metrics.totalRevenueVnd)}
          hint="Từ tất cả booking trong hệ thống"
        />
        <StatTile
          label="Công suất phòng"
          value={`${metrics.occupancyRate}%`}
          hint="Phòng đang ở / tổng số phòng"
        />
        <StatTile
          label="Booking đang hoạt động"
          value={String(metrics.activeBookings)}
          hint="Chờ xác nhận, đã xác nhận, đã nhận phòng"
        />
        <StatTile
          label="ADR ước tính"
          value={formatVnd(metrics.averageDailyRateVnd)}
          hint="Doanh thu / số booking hoạt động"
        />
      </section>

      <section>
        <h2 className="font-heading text-2xl text-vio-navy md:text-3xl">Trung tâm điều hành</h2>
        <p className="mt-2 max-w-3xl text-sm text-vio-text-secondary">
          Các module chính của hệ thống quản lý khách sạn VIO — mở nhanh để xử lý vận hành hằng ngày.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <QuickLink
            to="/admin/calendar"
            title="Lịch đặt phòng"
            description="Xem khoảng trống, chồng lịch và trạng thái từng booking."
          />
          <QuickLink
            to="/admin/matrix"
            title="Sơ đồ phòng"
            description="Bản đồ tầng, trạng thái buồng và phân bổ theo thời gian thực."
          />
          <QuickLink
            to="/admin/rooms"
            title="Quản lý phòng"
            description="Danh mục phòng, trạng thái dọn dẹp và bảo trì."
          />
          <QuickLink
            to="/admin/pricing"
            title="Giá & ưu đãi"
            description="Quy tắc giá theo mùa, gói và chính sách giảm giá."
          />
          <QuickLink
            to="/admin/customers"
            title="Khách hàng"
            description="Hồ sơ khách, lịch sử lưu trú và ghi chú dịch vụ."
          />
          <QuickLink
            to="/admin/staff"
            title="Nhân sự & quyền"
            description="Vai trò nhân viên, phân quyền và an toàn vận hành."
          />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FlowList title={`Nhận phòng · ${today}`} count={arrivals.length}>
          {arrivals.length === 0 ? (
            <li className="px-5 py-8 text-center text-sm text-vio-text-secondary">Danh sách trống.</li>
          ) : (
            arrivals.map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-vio-navy">{b.guest}</p>
                  <p className="truncate text-xs text-vio-text-secondary">
                    {b.room} · {b.guests} khách
                  </p>
                </div>
                <StatusBadge status={toBadgeStatus(b.status)} />
              </li>
            ))
          )}
        </FlowList>

        <FlowList title={`Trả phòng · ${today}`} count={departures.length}>
          {departures.length === 0 ? (
            <li className="px-5 py-8 text-center text-sm text-vio-text-secondary">Danh sách trống.</li>
          ) : (
            departures.map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-vio-navy">{b.guest}</p>
                  <p className="truncate text-xs text-vio-text-secondary">{b.room}</p>
                </div>
                <StatusBadge status={toBadgeStatus(b.status)} />
              </li>
            ))
          )}
        </FlowList>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="p-5 md:p-6 xl:col-span-2">
          <h3 className="font-heading text-xl text-vio-navy md:text-2xl">Doanh thu theo tháng (6 tháng gần nhất)</h3>
          <p className="mt-2 text-sm text-vio-text-secondary">
            Gán doanh thu theo tháng nhận phòng (bỏ qua hủy / không đến).
          </p>
          <div className="mt-6 h-[260px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="vioRevFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C6A43F" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#C6A43F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E2D9" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: '#5A6B7A', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis
                  tickFormatter={(v) => `${Math.round(v / 1_000_000)}tr`}
                  tick={{ fill: '#5A6B7A', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={44}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #E8E2D9',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  }}
                  formatter={(value) => [formatVnd(Number(value ?? 0)), 'Doanh thu']}
                  labelFormatter={(_, payload) => (payload?.[0]?.payload as { label?: string })?.label ?? ''}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#C6A43F"
                  strokeWidth={2}
                  fill="url(#vioRevFill)"
                  name="Doanh thu"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 md:p-6">
          <h3 className="font-heading text-xl text-vio-navy">Buồng phòng</h3>
          <p className="mt-2 text-sm text-vio-text-secondary">Tổng hợp trạng thái từ API phòng.</p>
          <ul className="mt-5 space-y-2">
            {Object.entries(roomStatusCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([key, count]) => (
                <li
                  key={key}
                  className="flex items-center justify-between rounded-lg border border-vio-linen bg-vio-cream/40 px-3 py-2 text-sm"
                >
                  <span>{roomStatusLabels[key] ?? key}</span>
                  <span className="font-medium text-vio-navy">{count}</span>
                </li>
              ))}
          </ul>
          {attentionRooms.length > 0 ? (
            <div className="mt-6 border-t border-vio-linen pt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-vio-error">Cần xử lý</p>
              <ul className="mt-2 space-y-1 text-sm text-vio-text-primary">
                {attentionRooms.map((r) => (
                  <li key={r.id}>
                    {r.name}{' '}
                    <span className="text-vio-text-secondary">
                      ({r.status === 'maintenance' ? 'Bảo trì' : 'Chờ dọn'})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Card>
      </section>

      <Card className="p-0">
        <div className="border-b border-vio-linen p-6">
          <h2 className="font-heading text-2xl text-vio-navy md:text-3xl">Booking gần đây</h2>
          <p className="mt-2 text-sm text-vio-text-secondary">
            Đồng bộ từ API đặt phòng — có thể chuyển sang backend thật mà không đổi giao diện.
          </p>
        </div>

        <div className="p-6 pt-2">
          <LuxuryTable
            columns={columns}
            data={pageRows}
            loading={loading}
            rowKey={(row) => row.id}
            emptyMessage="Chưa có booking."
          />
          <LuxuryPagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </Card>
    </div>
  )
}
