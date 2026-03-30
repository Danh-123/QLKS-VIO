import type { HTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export function Table({
  className,
  ...props
}: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl bg-vio-white shadow-soft-lg ring-1 ring-vio-navy/[0.06]">
      <table
        className={cn(
          'w-full min-w-[520px] border-collapse text-left text-sm text-vio-navy/85',
          className,
        )}
        {...props}
      />
    </div>
  )
}

export function TableHead({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn(
        'border-b border-vio-navy/[0.06] bg-vio-cream/40 text-xs font-medium uppercase tracking-[0.12em] text-vio-navy/45',
        className,
      )}
      {...props}
    />
  )
}

export function TableBody({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={cn('divide-y divide-vio-navy/[0.06]', className)}
      {...props}
    />
  )
}

export function TableRow({
  className,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        'transition-colors duration-300 hover:bg-vio-cream/35',
        className,
      )}
      {...props}
    />
  )
}

export function TableHeaderCell({
  className,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn('px-6 py-4 font-medium first:pl-8 last:pr-8', className)}
      {...props}
    />
  )
}

export function TableCell({
  className,
  children,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement> & { children?: ReactNode }) {
  return (
    <td
      className={cn('px-6 py-5 align-middle first:pl-8 last:pr-8', className)}
      {...props}
    >
      {children}
    </td>
  )
}
