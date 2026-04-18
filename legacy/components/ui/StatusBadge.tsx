import { cn } from '../../lib/cn'

type StatusBadgeType =
  | 'confirmed'
  | 'pending'
  | 'cancelled'
  | 'active'
  | 'inactive'
  | 'on-leave'

const statusStyles: Record<StatusBadgeType, string> = {
  confirmed: 'bg-vio-success/10 text-vio-success',
  pending: 'bg-vio-gold/10 text-vio-gold',
  cancelled: 'bg-vio-error/10 text-vio-error',
  active: 'bg-vio-success/10 text-vio-success',
  inactive: 'bg-vio-text-secondary/10 text-vio-text-secondary',
  'on-leave': 'bg-vio-gold/10 text-vio-gold',
}

const statusLabels: Record<StatusBadgeType, string> = {
  confirmed: 'Confirmed',
  pending: 'Pending',
  cancelled: 'Cancelled',
  active: 'Active',
  inactive: 'Inactive',
  'on-leave': 'On Leave',
}

type StatusBadgeProps = {
  status: StatusBadgeType
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-3 py-1 text-xs font-medium leading-none',
        statusStyles[status],
        className,
      )}
    >
      {statusLabels[status]}
    </span>
  )
}
