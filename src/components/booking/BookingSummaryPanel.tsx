import { formatVnd } from '../../data/roomDetails'
import { cn } from '../../lib/cn'

export function BookingSummaryPanel({
  roomName,
  checkIn,
  checkOut,
  nights,
  adults,
  children,
  subtotal,
  tax,
  total,
  className,
}: {
  roomName: string
  checkIn: string
  checkOut: string
  nights: number
  adults: number
  children: number
  subtotal: number
  tax: number
  total: number
  className?: string
}) {
  const fmt = (s: string) =>
    s
      ? new Date(s + 'T12:00:00').toLocaleDateString('vi-VN', {
          day: 'numeric',
          month: 'short',
        })
      : '—'

  return (
    <div
      className={cn(
        'rounded-2xl bg-vio-white p-6 shadow-soft-lg ring-1 ring-vio-navy/[0.06] md:p-8',
        className,
      )}
    >
      <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.28em] text-vio-navy/45">
        Đặt chỗ của bạn
      </p>
      <div className="space-y-5 text-sm">
        <div className="flex justify-between gap-4 border-b border-vio-navy/[0.06] pb-4">
          <span className="text-vio-navy/50">Phòng</span>
          <span className="max-w-[60%] text-right font-medium text-vio-navy">
            {roomName || '—'}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-vio-navy/50">Nhận — trả</span>
          <span className="text-right text-vio-navy/80">
            {fmt(checkIn)} → {fmt(checkOut)}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-vio-navy/50">Đêm</span>
          <span className="font-medium text-vio-navy">{nights}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-vio-navy/50">Khách</span>
          <span className="text-vio-navy/80">
            {adults} người lớn
            {children > 0 ? ` · ${children} trẻ em` : ''}
          </span>
        </div>
        <div className="border-t border-vio-navy/[0.06] pt-4">
          <div className="flex justify-between text-vio-navy/60">
            <span>Tạm tính</span>
            <span className="tabular-nums">{formatVnd(subtotal)}</span>
          </div>
          <div className="mt-2 flex justify-between text-vio-navy/50">
            <span>Phí & dịch vụ</span>
            <span className="tabular-nums">{formatVnd(tax)}</span>
          </div>
          <div className="mt-4 flex justify-between border-t border-vio-navy/[0.06] pt-4 font-heading text-lg text-vio-navy">
            <span>Tổng</span>
            <span className="tabular-nums">{formatVnd(total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
