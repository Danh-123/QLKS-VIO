import { cn } from '../../lib/cn'

export function LoadingSpinner({
  label = 'Loading',
  className,
}: {
  label?: string
  className?: string
}) {
  return (
    <div className={cn('inline-flex items-center gap-2', className)} role="status" aria-live="polite">
      <span
        className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-vio-navy/20 border-t-vio-navy"
        aria-hidden
      />
      <span className="text-sm text-vio-navy/55">{label}</span>
    </div>
  )
}
