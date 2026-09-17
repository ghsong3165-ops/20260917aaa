export type WordLevel = 'beginner' | 'intermediate' | 'advanced'

export interface WordEntry {
  id: string
  word: string
  meaning: string
  example: string
  exampleMeaning: string
  level: WordLevel
  category: string
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
