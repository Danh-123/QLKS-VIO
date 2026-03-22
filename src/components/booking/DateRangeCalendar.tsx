import { useMemo, useState } from 'react'
import { cn } from '../../lib/cn'

function pad(n: number) {
  return n.toString().padStart(2, '0')
}

function toISO(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function parseISO(s: string): Date | null {
  if (!s) return null
  const d = new Date(s + 'T12:00:00')
  return Number.isNaN(d.getTime()) ? null : d
}

type DateRangeCalendarProps = {
  checkIn: string
  checkOut: string
  onChange: (checkIn: string, checkOut: string) => void
  className?: string
}

export function DateRangeCalendar({
  checkIn,
  checkOut,
  onChange,
  className,
}: DateRangeCalendarProps) {
  const ci = parseISO(checkIn)
  const co = parseISO(checkOut)
  const anchor = ci ?? new Date()
  const [view, setView] = useState(() => ({
    y: anchor.getFullYear(),
    m: anchor.getMonth(),
  }))

  const { grid, monthLabel } = useMemo(() => {
    const y = view.y
    const m = view.m
    const first = new Date(y, m, 1)
    const last = new Date(y, m + 1, 0)
    const startPad = (first.getDay() + 6) % 7
    const daysInMonth = last.getDate()
    const cells: { d: Date; inMonth: boolean }[] = []
    for (let i = startPad; i > 0; i--) {
      const d = new Date(y, m, 1 - i)
      cells.push({ d, inMonth: false })
    }
    for (let i = 1; i <= daysInMonth; i++) {
      cells.push({ d: new Date(y, m, i), inMonth: true })
    }
    while (cells.length < 42) {
      const lastD = cells[cells.length - 1].d
      const n = new Date(lastD)
      n.setDate(n.getDate() + 1)
      cells.push({ d: n, inMonth: false })
    }
    const label = first.toLocaleDateString('vi-VN', {
      month: 'long',
      year: 'numeric',
    })
    return { grid: cells, monthLabel: label }
  }, [view])

  const inRange = (d: Date) => {
    if (!ci || !co) return false
    const t = d.getTime()
    return t >= ci.getTime() && t <= co.getTime()
  }

  const isStart = (d: Date) => Boolean(ci && toISO(d) === checkIn)
  const isEnd = (d: Date) => Boolean(co && toISO(d) === checkOut)
  const onlyStart = Boolean(ci && !co)
  const sameDay = Boolean(ci && co && checkIn === checkOut)

  const onDayClick = (d: Date, inMonth: boolean) => {
    if (!inMonth) return
    const iso = toISO(d)
    const t = d.getTime()
    if (!ci || (ci && co)) {
      onChange(iso, '')
      return
    }
    if (t < ci.getTime()) {
      onChange(iso, '')
      return
    }
    if (t === ci.getTime()) return
    onChange(checkIn, iso)
  }

  const shiftMonth = (delta: number) => {
    setView((v) => {
      const d = new Date(v.y, v.m + delta, 1)
      return { y: d.getFullYear(), m: d.getMonth() }
    })
  }

  return (
    <div
      className={cn(
        'rounded-2xl bg-vio-white p-6 shadow-soft-lg ring-1 ring-vio-navy/[0.06] md:p-8',
        className,
      )}
    >
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          aria-label="Tháng trước"
          className="rounded-lg p-2 text-vio-navy/50 transition-colors hover:bg-vio-cream/80 hover:text-vio-navy"
          onClick={() => shiftMonth(-1)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 6l-6 6 6 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <p className="font-heading text-lg capitalize text-vio-navy md:text-xl">
          {monthLabel}
        </p>
        <button
          type="button"
          aria-label="Tháng sau"
          className="rounded-lg p-2 text-vio-navy/50 transition-colors hover:bg-vio-cream/80 hover:text-vio-navy"
          onClick={() => shiftMonth(1)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px] font-medium uppercase tracking-[0.15em] text-vio-navy/40">
        {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d) => (
          <div key={d} className="py-2">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {grid.map(({ d, inMonth }, i) => {
          const iso = toISO(d)
          const range = inRange(d)
          const start = isStart(d)
          const end = isEnd(d)
          return (
            <button
              key={`${iso}-${i}`}
              type="button"
              onClick={() => onDayClick(d, inMonth)}
              className={cn(
                'relative min-h-[40px] rounded-lg text-sm transition-all duration-300 md:min-h-[44px]',
                !inMonth && 'pointer-events-none text-vio-navy/25',
                inMonth && 'text-vio-navy/85 hover:bg-vio-cream/60',
                onlyStart && start && 'bg-vio-navy text-vio-white hover:bg-vio-navy',
                range && !start && !end && 'bg-vio-navy/[0.07]',
                !sameDay &&
                  start &&
                  !end &&
                  co &&
                  'rounded-r-none bg-vio-navy text-vio-white hover:bg-vio-navy',
                !sameDay &&
                  end &&
                  !start &&
                  'rounded-l-none bg-vio-navy text-vio-white hover:bg-vio-navy',
                sameDay && start && 'bg-vio-navy text-vio-white hover:bg-vio-navy',
              )}
            >
              {d.getDate()}
            </button>
          )
        })}
      </div>
      <p className="mt-6 text-center text-xs text-vio-navy/45">
        Chọn ngày đến, sau đó chọn ngày đi
      </p>
    </div>
  )
}
