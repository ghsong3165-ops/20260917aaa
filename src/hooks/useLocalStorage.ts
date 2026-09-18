import { useCallback, useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored ? (JSON.parse(stored) as T) : initialValue
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // localStorage 접근 불가(프라이빗 모드 등) 시 조용히 무시
    }
  }, [key, value])

  const update = useCallback((updater: T | ((prev: T) => T)) => {
    setValue((prev) => (updater instanceof Function ? updater(prev) : updater))
  }, [])

  return [value, update] as const
}
