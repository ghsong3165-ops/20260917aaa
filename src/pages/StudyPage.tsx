import { useMemo, useState } from 'react'
import { Flashcard } from '../components/Flashcard'
import { useStudyData } from '../context/StudyDataContext'
import type { WordEntry, WordLevel } from '../types'
import { shuffle } from '../utils/shuffle'

type LevelFilter = WordLevel | 'all'

const LEVEL_OPTIONS: { value: LevelFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'beginner', label: '초급' },
  { value: 'intermediate', label: '중급' },
  { value: 'advanced', label: '고급' },
]

interface StudyPageProps {
  onExplain?: (word: string) => void
}

export function StudyPage({ onExplain }: StudyPageProps) {
  const { dueWords, recordReview } = useStudyData()
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all')
  const [session, setSession] = useState<WordEntry[] | null>(null)
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [sessionResult, setSessionResult] = useState({ correct: 0, wrong: 0 })

  const filteredDue = useMemo(
    () => (levelFilter === 'all' ? dueWords : dueWords.filter((w) => w.level === levelFilter)),
    [dueWords, levelFilter],
  )

  const startSession = () => {
    setSession(shuffle(filteredDue))
    setIndex(0)
    setFlipped(false)
    setSessionResult({ correct: 0, wrong: 0 })
  }

  const handleAnswer = (wasCorrect: boolean) => {
    if (!session) return
    recordReview(session[index].id, wasCorrect)
    setSessionResult((prev) => ({
      correct: prev.correct + (wasCorrect ? 1 : 0),
      wrong: prev.wrong + (wasCorrect ? 0 : 1),
    }))
    setFlipped(false)
    setIndex((prev) => prev + 1)
  }

  if (session && index < session.length) {
    const current = session[index]
    return (
      <div className="page study-page">
        <div className="session-progress">
          <div className="session-progress-bar">
            <div
              className="session-progress-fill"
              style={{ width: `${(index / session.length) * 100}%` }}
            />
          </div>
          <span>
            {index + 1} / {session.length}
          </span>
        </div>

        <Flashcard
          word={current}
          flipped={flipped}
          onFlip={() => setFlipped((f) => !f)}
          onExplain={onExplain}
        />

        {flipped ? (
          <div className="answer-buttons">
            <button className="btn btn-wrong" onClick={() => handleAnswer(false)}>
              몰라요 😅
            </button>
            <button className="btn btn-correct" onClick={() => handleAnswer(true)}>
              알아요 🎉
            </button>
          </div>
        ) : (
          <p className="study-tip">카드를 탭해서 뜻과 예문을 확인하세요</p>
        )}
      </div>
    )
  }

  if (session && index >= session.length) {
    const total = sessionResult.correct + sessionResult.wrong
    const accuracy = total === 0 ? 0 : Math.round((sessionResult.correct / total) * 100)
    return (
      <div className="page study-page">
        <div className="session-summary">
          <h2>학습 완료! 🎉</h2>
          <p className="summary-stat">
            이번 세션: <strong>{total}</strong>개 학습 · 정답률 <strong>{accuracy}%</strong>
          </p>
          <p className="summary-detail">
            알아요 {sessionResult.correct}개 · 몰라요 {sessionResult.wrong}개
          </p>
          <button className="btn btn-primary" onClick={() => setSession(null)}>
            확인
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page study-page">
      <h2 className="page-title">단어 암기 학습</h2>
      <p className="page-subtitle">오늘 복습할 단어를 확인하고 학습을 시작하세요.</p>

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

      <div className="due-summary-card">
        <p className="due-count">{filteredDue.length}</p>
        <p className="due-label">개의 단어가 복습 대기 중이에요</p>
      </div>

      <button className="btn btn-primary btn-large" onClick={startSession} disabled={filteredDue.length === 0}>
        {filteredDue.length === 0 ? '오늘 복습할 단어가 없어요' : '학습 시작하기'}
      </button>
    </div>
  )
}
