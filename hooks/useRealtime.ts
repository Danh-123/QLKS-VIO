'use client'

import { useEffect, useRef } from 'react'

export function useRealtime(callback: () => void, delayMs: number, enabled = true) {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    if (!enabled) return
    const id = window.setInterval(() => {
      callbackRef.current()
    }, delayMs)

    return () => {
      window.clearInterval(id)
    }
  }, [delayMs, enabled])
}
