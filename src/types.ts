export type WordLevel = 'beginner' | 'intermediate' | 'advanced'

export interface WordEntry {
  id: string
  word: string
  meaning: string
  example: string
  exampleMeaning: string
  level: WordLevel
  category: string
  /** 이 단어가 특정 소스(영화 등)에서 유래했다면 표시 (예: 'Before Sunrise (1995)') */
  source?: string
}

export interface WordProgress {
  box: number
  correctCount: number
  wrongCount: number
  lastReviewed: string | null
  nextReview: string
}

export type ProgressMap = Record<string, WordProgress>

export interface StudyLogEntry {
  date: string
  reviewed: number
  correct: number
}

export type StudyLog = Record<string, StudyLogEntry>
