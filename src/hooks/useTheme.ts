import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

export type ThemeMode = 'system' | 'light' | 'dark'

const STORAGE_KEY = 'eng-app:theme'

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<ThemeMode>(STORAGE_KEY, 'system')

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'system') {
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', theme)
    }
  }, [theme])

  return [theme, setTheme] as const
}
