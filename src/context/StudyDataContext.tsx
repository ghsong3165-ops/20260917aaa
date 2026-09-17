import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { WORDS } from '../data/words'
import type { ProgressMap, StudyLog, WordEntry } from '../types'
import { isDue, isMastered, reviewWord, todayISO } from '../utils/srs'

interface StudyDataContextValue {
  progress: ProgressMap
  studyLog: StudyLog
  dueWords: WordEntry[]
  masteredCount: number
  totalWords: number
  streak: number
  recordReview: (wordId: string, wasCorrect: boolean) => void
  resetAllProgress: () => void
}

const StudyDataContext = createContext<StudyDataContextValue | null>(null)

export function StudyDataProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useLocalStorage<ProgressMap>('eng-app:progress', {})
  const [studyLog, setStudyLog] = useLocalStorage<StudyLog>('eng-app:studyLog', {})

  const dueWords = useMemo(
    () => WORDS.filter((w) => isDue(progress[w.id])),
    [progress],
  )

  const masteredCount = useMemo(
    () => WORDS.filter((w) => isMastered(progress[w.id])).length,
    [progress],
  )

  const streak = useMemo(() => {
    const dates = Object.keys(studyLog).sort().reverse()
    if (dates.length === 0) return 0
    let count = 0
    const cursor = new Date()
    for (;;) {
      const iso = cursor.toISOString().slice(0, 10)
      if (studyLog[iso] && studyLog[iso].reviewed > 0) {
        count += 1
        cursor.setDate(cursor.getDate() - 1)
      } else if (iso === todayISO()) {
        // 오늘은 아직 학습 안 했어도 스트릭이 끊긴 건 아님
        cursor.setDate(cursor.getDate() - 1)
      } else {
        break
      }
    }
    return count
  }, [studyLog])

  const recordReview = (wordId: string, wasCorrect: boolean) => {
    setProgress((prev) => ({
      ...prev,
      [wordId]: reviewWord(prev[wordId], wasCorrect),
    }))
    setStudyLog((prev) => {
      const today = todayISO()
      const entry = prev[today] ?? { date: today, reviewed: 0, correct: 0 }
      return {
        ...prev,
        [today]: {
          date: today,
          reviewed: entry.reviewed + 1,
          correct: entry.correct + (wasCorrect ? 1 : 0),
        },
      }
    })
  }

  const resetAllProgress = () => {
    setProgress({})
    setStudyLog({})
  }

  const value: StudyDataContextValue = {
    progress,
    studyLog,
    dueWords,
    masteredCount,
    totalWords: WORDS.length,
    streak,
    recordReview,
    resetAllProgress,
  }

  return <StudyDataContext.Provider value={value}>{children}</StudyDataContext.Provider>
}

export function useStudyData() {
  const ctx = useContext(StudyDataContext)
  if (!ctx) throw new Error('useStudyData must be used within StudyDataProvider')
  return ctx
}
