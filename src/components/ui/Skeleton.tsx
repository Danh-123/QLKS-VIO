import { cn } from '../../lib/cn'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-vio-navy/[0.08]',
        className,
      )}
      aria-hidden
    />
  )
}
