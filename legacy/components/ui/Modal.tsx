import { AnimatePresence, motion } from 'framer-motion'
import { type ReactNode, useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../lib/cn'
import { Button } from './Button'

const easeModal = [0.25, 0.1, 0.25, 1] as const

export type ModalProps = {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  className?: string
  panelClassName?: string
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
  panelClassName,
}: ModalProps) {
  const titleId = useId()
  const descId = useId()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    panelRef.current?.focus()
  }, [open])

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div
          role="presentation"
          className={cn(
            'fixed inset-0 z-[100] flex items-center justify-center p-6',
            className,
          )}
        >
          <motion.button
            type="button"
            aria-label="Close dialog"
            className="absolute inset-0 bg-vio-navy/25 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: easeModal }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-describedby={description ? descId : undefined}
            tabIndex={-1}
            className={cn(
              'relative z-10 flex max-h-[min(90dvh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-vio-white shadow-soft-2xl ring-1 ring-vio-navy/[0.08]',
              panelClassName,
            )}
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.45, ease: easeModal }}
          >
            {(title ?? description) ? (
              <div className="border-b border-vio-navy/[0.06] px-8 py-8">
                {title ? (
                  <h2
                    id={titleId}
                    className="font-heading text-2xl font-medium leading-[1.2] tracking-wide text-vio-navy"
                  >
                    {title}
                  </h2>
                ) : null}
                {description ? (
                  <p id={descId} className="mt-2 text-sm leading-relaxed text-vio-navy/55">
                    {description}
                  </p>
                ) : null}
              </div>
            ) : null}
            <div className="min-h-0 flex-1 overflow-y-auto px-8 py-8">{children}</div>
            {footer ? (
              <div className="flex flex-wrap items-center justify-end gap-3 border-t border-vio-navy/[0.06] px-8 py-6">
                {footer}
              </div>
            ) : (
              <div className="flex justify-end border-t border-vio-navy/[0.06] px-8 py-6">
                <Button type="button" variant="ghost" onClick={onClose}>
                  Close
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}
