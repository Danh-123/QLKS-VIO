import { cn } from '../../lib/cn'

const labels = [
  'Ngày & khách',
  'Chọn phòng',
  'Sở thích',
  'Thông tin',
  'Hoàn tất',
] as const

export function StepIndicator({
  current,
  className,
}: {
  current: number
  className?: string
}) {
  return (
    <nav
      aria-label="Tiến trình đặt phòng"
      className={cn('w-full', className)}
    >
      <ol className="flex flex-wrap items-center justify-center gap-2 md:gap-0">
        {labels.map((label, i) => {
          const n = i + 1
          const done = n < current
          const active = n === current
          return (
            <li
              key={label}
              className="flex items-center text-[10px] uppercase tracking-[0.2em] md:text-[11px]"
            >
              {i > 0 ? (
                <span
                  className="mx-2 hidden h-px w-6 bg-vio-navy/15 md:inline-block lg:w-10"
                  aria-hidden
                />
              ) : null}
              <span
                className={cn(
                  'flex items-center gap-2 rounded-full px-3 py-2 md:px-4',
                  active && 'bg-vio-navy/8 text-vio-navy',
                  done && 'text-vio-navy/45',
                  !active && !done && 'text-vio-navy/30',
                )}
              >
                <span
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium tracking-normal',
                    active &&
                      'bg-vio-navy text-vio-white ring-1 ring-vio-navy/10',
                    done && 'bg-vio-gold/25 text-vio-navy',
                    !active && !done && 'bg-vio-white ring-1 ring-vio-navy/10',
                  )}
                >
                  {done ? '✓' : n}
                </span>
                <span className="hidden max-w-[7rem] leading-tight sm:inline">
                  {label}
                </span>
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
