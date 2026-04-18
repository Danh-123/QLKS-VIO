import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Card } from '../ui/Card'

export function StatCard({
  label,
  value,
  change,
  icon,
  trend = 'positive',
  className,
}: {
  label: string
  value: ReactNode
  change: string
  icon: ReactNode
  trend?: 'positive' | 'negative'
  className?: string
}) {
  return (
    <Card
      variant="gold"
      className={cn('relative overflow-hidden p-6', className)}
    >
      <span className="absolute right-6 top-6 text-vio-gold">{icon}</span>
      <p className="text-xs font-medium uppercase tracking-[0.1em] text-vio-text-secondary">
        {label}
      </p>
      <p className="mt-3 font-heading text-4xl font-normal leading-none text-vio-navy">
        {value}
      </p>
      <p
        className={cn(
          'mt-4 text-[13px] font-medium',
          trend === 'positive' ? 'text-vio-success' : 'text-vio-error',
        )}
      >
        {change}
      </p>
    </Card>
  )
}
