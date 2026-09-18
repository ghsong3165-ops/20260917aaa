import { useMemo, useState } from 'react'
import { WORDS, WORD_SOURCES } from '../data/words'
import { useStudyData } from '../context/StudyDataContext'
import { SpeakButton } from '../components/SpeakButton'
import type { WordLevel, WordProgress } from '../types'
import { isDue, isMastered } from '../utils/srs'

type LevelFilter = WordLevel | 'all'
type SourceFilter = 'all' | 'core' | string

const LEVEL_OPTIONS: { value: LevelFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'beginner', label: '초급' },
  { value: 'intermediate', label: '중급' },
  { value: 'advanced', label: '고급' },
]

const SOURCE_OPTIONS: { value: SourceFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'core', label: '기본 단어장' },
  ...WORD_SOURCES.map((s) => ({ value: s, label: s })),
]

export function statusOf(progress: WordProgress | undefined): { label: string; className: string } {
  if (!progress) return { label: '새 단어', className: 'status-new' }
  if (isMastered(progress)) return { label: '암기 완료', className: 'status-mastered' }
  if (isDue(progress)) return { label: '복습 필요', className: 'status-due' }
  return { label: '학습중', className: 'status-learning' }
}

export function WordListPage() {
  const { progress } = useStudyData()
  const [query, setQuery] = useState('')
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all')
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return WORDS.filter((w) => {
      const matchesLevel = levelFilter === 'all' || w.level === levelFilter
      const matchesSource =
        sourceFilter === 'all' ||
        (sourceFilter === 'core' ? !w.source : w.source === sourceFilter)
      const matchesQuery =
        q === '' || w.word.toLowerCase().includes(q) || w.meaning.includes(q)
      return matchesLevel && matchesSource && matchesQuery
    })
  }, [query, levelFilter, sourceFilter])

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

      {WORD_SOURCES.length > 0 && (
        <div className="level-filter">
          {SOURCE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`chip ${sourceFilter === opt.value ? 'chip-active' : ''}`}
              onClick={() => setSourceFilter(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      <ul className="word-list">
        {filtered.map((w) => {
          const status = statusOf(progress[w.id])
          return (
            <li key={w.id} className="word-list-item">
              <div className="word-list-main">
                <div className="word-list-word-row">
                  <span className="word-list-word">{w.word}</span>
                  <SpeakButton text={w.word} label={`${w.word} 발음 듣기`} />
                  {w.source && <span className="word-source-tag">{w.source}</span>}
                </div>
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
