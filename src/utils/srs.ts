import type { WordProgress } from '../types'

// Leitner 시스템: box 1~5, 박스별 다음 복습까지의 간격(일)
const BOX_INTERVALS_DAYS = [0, 1, 3, 7, 14]
export const MAX_BOX = BOX_INTERVALS_DAYS.length
export const MASTERED_BOX = 4

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

function addDaysISO(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export function createInitialProgress(): WordProgress {
  return {
    box: 1,
    correctCount: 0,
    wrongCount: 0,
    lastReviewed: null,
    nextReview: todayISO(),
  }
}

export function isDue(progress: WordProgress | undefined): boolean {
  if (!progress) return true
  return progress.nextReview <= todayISO()
}

export function reviewWord(progress: WordProgress | undefined, wasCorrect: boolean): WordProgress {
  const current = progress ?? createInitialProgress()
  const nextBox = wasCorrect ? Math.min(current.box + 1, MAX_BOX) : 1
  const interval = BOX_INTERVALS_DAYS[nextBox - 1]

  return {
    box: nextBox,
    correctCount: current.correctCount + (wasCorrect ? 1 : 0),
    wrongCount: current.wrongCount + (wasCorrect ? 0 : 1),
    lastReviewed: todayISO(),
    nextReview: addDaysISO(interval),
  }
}

export function isMastered(progress: WordProgress | undefined): boolean {
  return !!progress && progress.box >= MASTERED_BOX
}
