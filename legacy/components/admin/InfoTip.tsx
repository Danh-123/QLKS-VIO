import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export function InfoTip({
  children,
  content,
  className,
}: {
  children: ReactNode
  content: string
  className?: string
}) {
  return (
    <div className={cn('group relative inline-flex max-w-full', className)}>
      {children}
      <span
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-vio-navy px-3 py-2 text-[11px] text-vio-white opacity-0 shadow-soft transition-opacity duration-300 group-hover:opacity-100"
        role="tooltip"
      >
        {content}
      </span>
    </div>
  )
}
