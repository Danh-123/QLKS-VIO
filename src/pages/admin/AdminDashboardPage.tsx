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
  recentBookingsAdmin,
  revenueChartData,
} from '../../admin/mockData'
import { statusLabels } from '../../booking/bookingStorage'
import { StatCard } from '../../components/admin/StatCard'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '../../components/ui/Table'
import { formatVnd } from '../../data/roomDetails'

export function AdminDashboardPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="font-heading text-3xl font-medium tracking-tight text-vio-navy md:text-4xl">
          Tổng quan
        </h1>
        <p className="mt-2 text-sm text-vio-navy/50">
          Dữ liệu minh họa — giao diện tối giản, tập trung số liệu chính.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
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

      <div className="rounded-2xl bg-vio-white p-6 shadow-soft-lg ring-1 ring-vio-navy/[0.06] md:p-8">
        <h2 className="font-heading text-xl text-vio-navy md:text-2xl">
          Doanh thu theo ngày (tuần)
        </h2>
        <p className="mt-1 text-xs text-vio-navy/45">Đơn vị: VNĐ · demo</p>
        <div className="mt-6 h-[280px] w-full">
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
        </div>
      </div>

      <div>
        <h2 className="mb-6 font-heading text-xl text-vio-navy md:text-2xl">
          Đặt phòng gần đây
        </h2>
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
            {recentBookingsAdmin.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-mono text-xs">{b.id}</TableCell>
                <TableCell>{b.guest}</TableCell>
                <TableCell>{b.room}</TableCell>
                <TableCell>
                  <span className="rounded-full bg-vio-cream px-2 py-1 text-xs text-vio-navy/70">
                    {statusLabels[b.status]}
                  </span>
                </TableCell>
                <TableCell>{b.checkIn}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatVnd(b.totalVnd)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
