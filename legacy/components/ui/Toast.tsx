import { useCallback, useId, useMemo, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../lib/cn'
import { ToastContext, type ToastItem } from './toastContext'

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    (t: Omit<ToastItem, 'id'> & { id?: string }) => {
      const id =
        t.id ??
        (typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`)
      setToasts((prev) => [...prev, { ...t, id }])
      window.setTimeout(() => dismiss(id), 4800)
      return id
    },
    [dismiss],
  )

  const value = useMemo(
    () => ({ toasts, push, dismiss }),
    [toasts, push, dismiss],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
}) {
  const regionId = useId()
  if (toasts.length === 0) return null

  return createPortal(
    <div
      id={regionId}
      aria-live="polite"
      aria-relevant="additions text"
      className="pointer-events-none fixed inset-x-0 top-0 z-[110] flex flex-col items-end gap-3 p-6 sm:p-8"
    >
      {toasts.map((t) => (
        <ToastCard key={t.id} toast={t} onDismiss={() => onDismiss(t.id)} />
      ))}
    </div>,
    document.body,
  )
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem
  onDismiss: () => void
}) {
  const accent =
    toast.variant === 'success'
      ? 'border-l-vio-gold'
      : toast.variant === 'error'
        ? 'border-l-vio-navy/35'
        : 'border-l-transparent'

  return (
    <div
      className={cn(
        'pointer-events-auto w-full max-w-sm rounded-2xl bg-vio-white p-5 shadow-soft-lg ring-1 ring-vio-navy/[0.06] transition-all duration-500 ease-[var(--ease-vio)]',
        'border-l-[3px]',
        accent,
      )}
    >
      <div className="flex gap-4">
        <div className="min-w-0 flex-1">
          <p className="font-heading text-lg font-medium text-vio-navy">
            {toast.title}
          </p>
          {toast.description ? (
            <p className="mt-1 text-sm leading-relaxed text-vio-navy/55">
              {toast.description}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded-lg p-1.5 text-vio-navy/40 transition-colors duration-300 hover:bg-vio-cream/80 hover:text-vio-navy"
          aria-label="Dismiss notification"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            aria-hidden
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
