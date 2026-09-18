import { WORDS } from '../data/words'
import type { WordEntry } from '../types'

const INDEX = new Map<string, WordEntry>(WORDS.map((w) => [w.word.toLowerCase(), w]))

export function lookupWord(raw: string): WordEntry | undefined {
  const normalized = raw.toLowerCase().replace(/[^a-z']/g, '')
  if (!normalized) return undefined
  return INDEX.get(normalized)
}
