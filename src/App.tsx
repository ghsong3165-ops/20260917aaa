import { useState } from 'react'
import './App.css'
import { StudyDataProvider } from './context/StudyDataContext'
import { ThemeToggle } from './components/ThemeToggle'
import { useTheme } from './hooks/useTheme'
import { HomePage } from './pages/HomePage'
import { StudyPage } from './pages/StudyPage'
import { StatsPage } from './pages/StatsPage'
import { WordListPage } from './pages/WordListPage'
import { AiPage } from './pages/AiPage'
import { ReaderPage } from './pages/ReaderPage'

export type AppTab = 'home' | 'study' | 'stats' | 'words' | 'ai' | 'reader'

const NAV_ITEMS: { tab: AppTab; label: string; icon: string }[] = [
  { tab: 'home', label: '홈', icon: '🏠' },
  { tab: 'study', label: '학습', icon: '🃏' },
  { tab: 'ai', label: 'AI', icon: '🤖' },
  { tab: 'reader', label: '리더', icon: '📜' },
  { tab: 'stats', label: '통계', icon: '📊' },
  { tab: 'words', label: '단어장', icon: '📖' },
]

function App() {
  const [tab, setTab] = useState<AppTab>('home')
  const [theme, setTheme] = useTheme()
  const [aiPrefillWord, setAiPrefillWord] = useState<string | undefined>(undefined)

  const handleExplain = (word: string) => {
    setAiPrefillWord(word)
    setTab('ai')
  }

  return (
    <StudyDataProvider>
      <div className="app-shell">
        <header className="app-header">
          <ThemeToggle theme={theme} onChange={setTheme} />
        </header>

        <main className="app-content">
          {tab === 'home' && <HomePage onNavigate={setTab} />}
          {tab === 'study' && <StudyPage onExplain={handleExplain} />}
          {tab === 'ai' && <AiPage initialWord={aiPrefillWord} />}
          {tab === 'reader' && <ReaderPage />}
          {tab === 'stats' && <StatsPage />}
          {tab === 'words' && <WordListPage />}
        </main>

        <nav className="bottom-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.tab}
              className={`nav-item ${tab === item.tab ? 'nav-item-active' : ''}`}
              onClick={() => setTab(item.tab)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </StudyDataProvider>
  )
}

export default App
