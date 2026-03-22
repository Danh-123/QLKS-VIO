import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'

const easeBar = [0.25, 0.1, 0.25, 1] as const

const labels = [
  'Ngày & khách',
  'Phòng',
  'Sở thích',
  'Thông tin',
  'Xác nhận',
] as const

export function WizardProgressBar({
  current,
  className,
}: {
  current: number
  className?: string
}) {
  const pct = ((current - 1) / (labels.length - 1)) * 100

  return (
    <div className={cn('w-full', className)}>
      <div className="mb-6 h-1 overflow-hidden rounded-full bg-vio-navy/[0.08]">
        <motion.div
          className="h-full rounded-full bg-vio-navy"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: easeBar }}
        />
      </div>
      <div className="flex justify-between gap-1 text-[9px] uppercase tracking-[0.18em] text-vio-navy/35 sm:text-[10px] sm:tracking-[0.2em]">
        {labels.map((label, i) => {
          const n = i + 1
          const active = n === current
          const done = n < current
          return (
            <span
              key={label}
              className={cn(
                'max-w-[4.5rem] text-center leading-tight sm:max-w-none',
                active && 'font-medium text-vio-navy',
                done && !active && 'text-vio-navy/50',
              )}
            >
              {label}
            </span>
          )
        })}
      </div>
    </div>
  )
}
