import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export function StatCard({
  label,
  value,
  hint,
  className,
}: {
  label: string
  value: ReactNode
  hint?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-vio-white p-8 shadow-soft-lg ring-1 ring-vio-navy/[0.06] transition-shadow duration-500 hover:shadow-soft-2xl',
        className,
      )}
    >
      <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-vio-navy/40">
        {label}
      </p>
      <p className="mt-3 font-heading text-3xl font-medium leading-[1.1] tracking-wide text-vio-navy md:text-4xl">
        {value}
      </p>
      {hint ? (
        <p className="mt-2 text-xs text-vio-navy/45">{hint}</p>
      ) : null}
    </div>
  )
}
