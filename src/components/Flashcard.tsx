import { SpeakButton } from './SpeakButton'
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
  onExplain?: (word: string) => void
}

export function Flashcard({ word, flipped, onFlip, onExplain }: FlashcardProps) {
  return (
    <div className={`flashcard ${flipped ? 'is-flipped' : ''}`} onClick={onFlip}>
      <div className="flashcard-inner">
        <div className="flashcard-face flashcard-front">
          <span className={`badge badge-${word.level}`}>{LEVEL_LABEL[word.level]}</span>
          <div className="flashcard-word-row">
            <p className="flashcard-word">{word.word}</p>
            <SpeakButton text={word.word} label={`${word.word} 발음 듣기`} />
          </div>
          <span className="flashcard-hint">탭해서 뜻 보기</span>
        </div>
        <div className="flashcard-face flashcard-back">
          <p className="flashcard-meaning">{word.meaning}</p>
          <div className="flashcard-example">
            <div className="example-en-row">
              <p className="example-en">{word.example}</p>
              <SpeakButton text={word.example} label="예문 발음 듣기" />
            </div>
            <p className="example-ko">{word.exampleMeaning}</p>
          </div>
          {onExplain && (
            <button
              type="button"
              className="link-button ai-explain-link"
              onClick={(e) => {
                e.stopPropagation()
                onExplain(word.word)
              }}
            >
              🤖 AI로 더 자세히 알아보기
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
