import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Skeleton } from './Skeleton'

export type LuxuryColumn<T> = {
  header: string
  accessorKey: keyof T | string
  render?: (row: T) => ReactNode
  align?: 'left' | 'right' | 'center'
  className?: string
}

type LuxuryTableProps<T> = {
  columns: LuxuryColumn<T>[]
  data: T[]
  loading?: boolean
  onRowClick?: (row: T) => void
  rowKey?: (row: T, index: number) => string
  emptyMessage?: string
  skeletonRows?: number
}

export function LuxuryTable<T>({
  columns,
  data,
  loading = false,
  onRowClick,
  rowKey,
  emptyMessage = 'No records found.',
  skeletonRows = 5,
}: LuxuryTableProps<T>) {
  const resolveCell = (column: LuxuryColumn<T>, row: T) => {
    if (column.render) return column.render(row)
    return (row as Record<string, ReactNode>)[String(column.accessorKey)]
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse bg-transparent text-left">
        <thead className="bg-transparent">
          <tr className="border-b border-vio-linen">
            {columns.map((column) => (
              <th
                key={String(column.accessorKey)}
                className={cn(
                  'px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.05em] text-vio-text-secondary',
                  column.align === 'right' && 'text-right',
                  column.align === 'center' && 'text-center',
                  column.className,
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: skeletonRows }).map((_, rowIndex) => (
                <tr key={`skeleton-${rowIndex}`} className="border-b border-vio-linen">
                  {columns.map((column, cellIndex) => (
                    <td
                      key={`${String(column.accessorKey)}-${cellIndex}`}
                      className={cn(
                        'px-5 py-4 text-sm text-vio-text-primary',
                        column.align === 'right' && 'text-right',
                        column.align === 'center' && 'text-center',
                      )}
                    >
                      <Skeleton className="h-4 w-full max-w-[160px] rounded-md" />
                    </td>
                  ))}
                </tr>
              ))
            : null}

          {!loading && data.length === 0 ? (
            <tr className="border-b border-vio-linen">
              <td
                colSpan={columns.length}
                className="px-5 py-10 text-center text-sm text-vio-text-secondary"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : null}

          {!loading
            ? data.map((row, index) => (
                <tr
                  key={rowKey ? rowKey(row, index) : String(index)}
                  className={cn(
                    'border-b border-vio-linen transition-colors duration-200',
                    onRowClick ? 'cursor-pointer hover:bg-vio-gold/[0.04]' : 'hover:bg-vio-gold/[0.04]',
                  )}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.accessorKey)}
                      className={cn(
                        'px-5 py-4 text-sm text-vio-text-primary',
                        column.align === 'right' && 'text-right',
                        column.align === 'center' && 'text-center',
                        column.className,
                      )}
                    >
                      {resolveCell(column, row)}
                    </td>
                  ))}
                </tr>
              ))
            : null}
        </tbody>
      </table>
    </div>
  )
}

type LuxuryPaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function LuxuryPagination({
  page,
  totalPages,
  onPageChange,
}: LuxuryPaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, idx) => idx + 1)

  return (
    <div className="mt-6 flex items-center justify-between gap-4">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="rounded-lg border border-vio-linen bg-transparent px-4 py-2 text-sm text-vio-text-primary transition-colors duration-200 hover:border-vio-gold hover:text-vio-gold disabled:opacity-40 disabled:hover:border-vio-linen disabled:hover:text-vio-text-primary"
      >
        Previous
      </button>

      <div className="flex items-center gap-2">
        {pages.map((pageNumber) => {
          const active = pageNumber === page
          return (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              className={cn(
                'rounded-lg border px-4 py-2 text-sm transition-colors duration-200',
                active
                  ? 'border-vio-gold bg-vio-gold text-vio-white'
                  : 'border-vio-linen bg-transparent text-vio-text-primary hover:border-vio-gold hover:text-vio-gold',
              )}
            >
              {pageNumber}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="rounded-lg border border-vio-linen bg-transparent px-4 py-2 text-sm text-vio-text-primary transition-colors duration-200 hover:border-vio-gold hover:text-vio-gold disabled:opacity-40 disabled:hover:border-vio-linen disabled:hover:text-vio-text-primary"
      >
        Next
      </button>
    </div>
  )
}
