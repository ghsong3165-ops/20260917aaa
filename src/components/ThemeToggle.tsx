import type { ThemeMode } from '../hooks/useTheme'

const OPTIONS: { value: ThemeMode; icon: string; label: string }[] = [
  { value: 'system', icon: '🖥️', label: '시스템' },
  { value: 'light', icon: '☀️', label: '라이트' },
  { value: 'dark', icon: '🌙', label: '다크' },
]

interface ThemeToggleProps {
  theme: ThemeMode
  onChange: (theme: ThemeMode) => void
}

export function ThemeToggle({ theme, onChange }: ThemeToggleProps) {
  return (
    <div className="theme-toggle" role="group" aria-label="테마 선택">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          className={`theme-toggle-btn ${theme === opt.value ? 'theme-toggle-btn-active' : ''}`}
          onClick={() => onChange(opt.value)}
          aria-pressed={theme === opt.value}
          title={opt.label}
        >
          <span aria-hidden="true">{opt.icon}</span>
        </button>
      ))}
    </div>
  )
}
