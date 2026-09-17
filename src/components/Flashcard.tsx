import type { WordEntry } from '../types'

const LEVEL_LABEL: Record<WordEntry['level'], string> = {
  beginner: '초급',
  intermediate: '중급',
  advanced: '고급',
}

interface FlashcardProps {
  word: WordEntry
  flipped: boolean
  onFlip: () => void
}

export function Flashcard({ word, flipped, onFlip }: FlashcardProps) {
  return (
    <div className={`flashcard ${flipped ? 'is-flipped' : ''}`} onClick={onFlip}>
      <div className="flashcard-inner">
        <div className="flashcard-face flashcard-front">
          <span className={`badge badge-${word.level}`}>{LEVEL_LABEL[word.level]}</span>
          <p className="flashcard-word">{word.word}</p>
          <span className="flashcard-hint">탭해서 뜻 보기</span>
        </div>
        <div className="flashcard-face flashcard-back">
          <p className="flashcard-meaning">{word.meaning}</p>
          <div className="flashcard-example">
            <p className="example-en">{word.example}</p>
            <p className="example-ko">{word.exampleMeaning}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
