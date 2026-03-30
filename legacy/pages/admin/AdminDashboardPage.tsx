import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  dashboardStats,
  revenueChartData,
} from '../../admin/mockData'
import type { BookingStatus } from '../../booking/types'
import { statusLabels } from '../../booking/bookingStorage'
import { StatCard } from '../../components/admin/StatCard'
import { EmptyState } from '../../components/ui/EmptyState'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { Skeleton } from '../../components/ui/Skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '../../components/ui/Table'
import { formatVnd } from '../../data/roomDetails'
import { useFakeApiData } from '../../lib/useFakeApiData'
import { useAppData } from '../../state/AppDataContext'

const statusOptions: BookingStatus[] = [
  'pending',
  'confirmed',
  'checked-in',
  'checked-out',
  'cancelled',
  'no-show',
]

export function AdminDashboardPage() {
  const { bookings, updateBookingStatus } = useAppData()
  const sortedBookings = [...bookings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
  const { loading, data: displayedBookings } = useFakeApiData(sortedBookings, 950)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-medium tracking-wide text-vio-navy md:text-4xl">
          Tổng quan
        </h1>
        <p className="mt-2 text-sm text-vio-navy/50">
          Dữ liệu minh họa — giao diện tối giản, tập trung số liệu chính.
        </p>
      </div>

      <div className="mt-10 flex items-center justify-center">
        {loading ? <LoadingSpinner label="Đang đồng bộ dữ liệu vận hành..." /> : null}
      </div>

      <div className="mt-24 transition-opacity duration-300" style={{ opacity: loading ? 0.9 : 1 }}>
        {loading ? (
          <div className="grid gap-8 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="rounded-2xl bg-vio-white p-8 ring-1 ring-vio-navy/[0.06]">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-5 h-10 w-32" />
                <Skeleton className="mt-4 h-4 w-40" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            <StatCard
              label="Phòng"
              value={dashboardStats.roomCount}
              hint="Tổng hạng phòng khai thác"
            />
            <StatCard
              label="Công suất"
              value={`${dashboardStats.occupancyPct}%`}
              hint="Ước tính tháng hiện tại"
            />
            <StatCard
              label="Doanh thu (tháng)"
              value={formatVnd(dashboardStats.revenueMonthVnd)}
              hint="Trước thuế, mock"
            />
          </div>
        )}
      </div>

      <div className="mt-24 rounded-2xl bg-vio-white p-6 shadow-soft-lg ring-1 ring-vio-navy/[0.06] md:p-8">
        <h2 className="font-heading text-xl text-vio-navy md:text-2xl">
          Doanh thu theo ngày (tuần)
        </h2>
        <p className="mt-1 text-xs text-vio-navy/45">Đơn vị: VNĐ · demo</p>
        <div className="mt-6 h-[280px] w-full">
          {loading ? (
            <div className="h-full space-y-4">
              {Array.from({ length: 6 }).map((_, idx) => (
                <Skeleton key={idx} className="h-9 w-full" />
              ))}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="vioRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1e3a5f" stopOpacity={0.12} />
                    <stop offset="100%" stopColor="#1e3a5f" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 6" stroke="#1e3a5f12" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#1e3a5f88' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#1e3a5f66' }}
                  tickFormatter={(v) => `${Math.round(v / 1e6)}M`}
                  axisLine={false}
                  tickLine={false}
                />
                <RTooltip
                  formatter={(v) => [
                    typeof v === 'number' ? formatVnd(v) : '',
                    '',
                  ]}
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid rgba(30,58,95,0.08)',
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="vnd"
                  stroke="#1e3a5f"
                  strokeWidth={1.5}
                  fill="url(#vioRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="mt-24">
        <h2 className="font-heading text-xl text-vio-navy md:text-2xl">
          Quản lý đặt phòng
        </h2>
        <div className="mt-6">
          {loading ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Mã</TableHeaderCell>
                  <TableHeaderCell>Khách</TableHeaderCell>
                  <TableHeaderCell>Phòng</TableHeaderCell>
                  <TableHeaderCell>Trạng thái</TableHeaderCell>
                  <TableHeaderCell>Nhận phòng</TableHeaderCell>
                  <TableHeaderCell className="text-right">Tổng</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="ml-auto h-4 w-20" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : displayedBookings.length === 0 ? (
            <EmptyState
              title="Chưa có booking nào"
              description="Dữ liệu đặt phòng sẽ xuất hiện tại đây khi có giao dịch mới."
            />
          ) : (
          <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Mã</TableHeaderCell>
              <TableHeaderCell>Khách</TableHeaderCell>
              <TableHeaderCell>Phòng</TableHeaderCell>
              <TableHeaderCell>Trạng thái</TableHeaderCell>
              <TableHeaderCell>Nhận phòng</TableHeaderCell>
              <TableHeaderCell className="text-right">Tổng</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedBookings.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-mono text-xs">{b.id}</TableCell>
                <TableCell>{b.customerName || 'Khách lẻ'}</TableCell>
                <TableCell>{b.roomName}</TableCell>
                <TableCell>
                  <select
                    value={b.status}
                    onChange={(e) =>
                      updateBookingStatus(b.id, e.target.value as BookingStatus)
                    }
                    className="rounded-lg border-0 bg-vio-cream px-2 py-1 text-xs text-vio-navy/75 ring-1 ring-vio-navy/10"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {statusLabels[status]}
                      </option>
                    ))}
                  </select>
                </TableCell>
                <TableCell>{b.checkIn}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatVnd(b.totalVnd)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          </Table>
          )}
        </div>
      </div>
    </div>
  )
}
