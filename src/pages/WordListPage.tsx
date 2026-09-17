import { useMemo, useState } from 'react'
import { WORDS } from '../data/words'
import { useStudyData } from '../context/StudyDataContext'
import type { WordLevel, WordProgress } from '../types'
import { isDue, isMastered } from '../utils/srs'

type LevelFilter = WordLevel | 'all'

const LEVEL_OPTIONS: { value: LevelFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'beginner', label: '초급' },
  { value: 'intermediate', label: '중급' },
  { value: 'advanced', label: '고급' },
]

function statusOf(progress: WordProgress | undefined): { label: string; className: string } {
  if (!progress) return { label: '새 단어', className: 'status-new' }
  if (isMastered(progress)) return { label: '암기 완료', className: 'status-mastered' }
  if (isDue(progress)) return { label: '복습 필요', className: 'status-due' }
  return { label: '학습중', className: 'status-learning' }
}

export function WordListPage() {
  const { progress } = useStudyData()
  const [query, setQuery] = useState('')
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return WORDS.filter((w) => {
      const matchesLevel = levelFilter === 'all' || w.level === levelFilter
      const matchesQuery =
        q === '' || w.word.toLowerCase().includes(q) || w.meaning.includes(q)
      return matchesLevel && matchesQuery
    })
  }, [query, levelFilter])

  return (
    <div className="page wordlist-page">
      <h2 className="page-title">전체 단어장</h2>
      <p className="page-subtitle">{WORDS.length}개의 단어가 있어요.</p>

      <input
        className="search-input"
        type="text"
        placeholder="단어 또는 뜻으로 검색"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="level-filter">
        {LEVEL_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className={`chip ${levelFilter === opt.value ? 'chip-active' : ''}`}
            onClick={() => setLevelFilter(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <ul className="word-list">
        {filtered.map((w) => {
          const status = statusOf(progress[w.id])
          return (
            <li key={w.id} className="word-list-item">
              <div className="word-list-main">
                <span className="word-list-word">{w.word}</span>
                <span className="word-list-meaning">{w.meaning}</span>
              </div>
              <span className={`status-badge ${status.className}`}>{status.label}</span>
            </li>
          )
        })}
        {filtered.length === 0 && <p className="empty-message">검색 결과가 없어요.</p>}
      </ul>
    </div>
  )
}
