import { useEffect, useState } from 'react'

export function useFakeApiData<T>(source: T, delayMs = 700) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<T>(source)

  useEffect(() => {
    setLoading(true)
    const timer = window.setTimeout(() => {
      setData(source)
      setLoading(false)
    }, delayMs)

    return () => {
      window.clearTimeout(timer)
    }
  }, [source, delayMs])

  return { loading, data }
}
