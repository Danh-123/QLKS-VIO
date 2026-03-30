import type { ReactNode } from 'react'
import { Card } from './Card'

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string
  description: string
  action?: ReactNode
  className?: string
}) {
  return (
    <Card className={className ?? 'p-10 text-center'}>
      <p className="font-heading text-2xl text-vio-navy">{title}</p>
      <p className="mt-3 text-vio-navy/55">{description}</p>
      {action ? <div className="mt-8">{action}</div> : null}
    </Card>
  )
}
