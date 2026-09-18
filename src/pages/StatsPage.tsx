import { useMemo } from 'react'
import { WORDS } from '../data/words'
import { useStudyData } from '../context/StudyDataContext'
import type { WordLevel } from '../types'
import { isMastered } from '../utils/srs'

const LEVELS: { value: WordLevel; label: string }[] = [
  { value: 'beginner', label: '초급' },
  { value: 'intermediate', label: '중급' },
  { value: 'advanced', label: '고급' },
]

function lastNDatesISO(n: number): string[] {
  const dates: string[] = []
  const cursor = new Date()
  for (let i = 0; i < n; i += 1) {
    dates.unshift(cursor.toISOString().slice(0, 10))
    cursor.setDate(cursor.getDate() - 1)
  }
  return dates
}

export function StatsPage() {
  const { progress, studyLog, masteredCount, totalWords, streak } = useStudyData()

  const overallAccuracy = useMemo(() => {
    const entries = Object.values(studyLog)
    const reviewed = entries.reduce((sum, e) => sum + e.reviewed, 0)
    const correct = entries.reduce((sum, e) => sum + e.correct, 0)
    return reviewed === 0 ? null : Math.round((correct / reviewed) * 100)
  }, [studyLog])

  const last7Days = useMemo(() => {
    const dates = lastNDatesISO(7)
    const counts = dates.map((d) => studyLog[d]?.reviewed ?? 0)
    const max = Math.max(1, ...counts)
    return dates.map((date, i) => ({
      date,
      count: counts[i],
      heightPct: Math.round((counts[i] / max) * 100),
    }))
  }, [studyLog])

  const levelBreakdown = useMemo(
    () =>
      LEVELS.map((lv) => {
        const wordsInLevel = WORDS.filter((w) => w.level === lv.value)
        const mastered = wordsInLevel.filter((w) => isMastered(progress[w.id])).length
        return { ...lv, total: wordsInLevel.length, mastered }
      }),
    [progress],
  )

  return (
    <div className="page stats-page">
      <h2 className="page-title">학습 통계</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-value">
            {masteredCount}/{totalWords}
          </p>
          <p className="stat-label">암기 완료 단어</p>
        </div>
        <div className="stat-card">
          <p className="stat-value">{streak}일</p>
          <p className="stat-label">연속 학습</p>
        </div>
        <div className="stat-card">
          <p className="stat-value">{overallAccuracy === null ? '-' : `${overallAccuracy}%`}</p>
          <p className="stat-label">전체 정답률</p>
        </div>
      </div>

      <section className="stats-section">
        <h3>최근 7일 학습량</h3>
        <div className="bar-chart">
          {last7Days.map((d) => (
            <div key={d.date} className="bar-chart-col">
              <div className="bar-chart-bar-track">
                <div className="bar-chart-bar" style={{ height: `${d.heightPct}%` }} />
              </div>
              <span className="bar-chart-value">{d.count}</span>
              <span className="bar-chart-label">{d.date.slice(5)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="stats-section">
        <h3>레벨별 암기 현황</h3>
        {levelBreakdown.map((lv) => {
          const pct = lv.total === 0 ? 0 : Math.round((lv.mastered / lv.total) * 100)
          return (
            <div key={lv.value} className="level-progress-row">
              <div className="level-progress-header">
                <span>{lv.label}</span>
                <span>
                  {lv.mastered}/{lv.total}
                </span>
              </div>
              <div className="level-progress-track">
                <div className={`level-progress-fill level-progress-${lv.value}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </section>
    </div>
  )
}
