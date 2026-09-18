import { useMemo, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useStudyData } from '../context/StudyDataContext'
import { lookupWord } from '../utils/wordLookup'
import { statusOf } from './WordListPage'
import { SpeakButton } from '../components/SpeakButton'
import { explainWord, GeminiError } from '../utils/gemini'

const PAGE_WORD_LIMIT = 350
const WORD_TOKEN = /([A-Za-z']+)/

function paginate(text: string): string[][] {
  const paragraphs = text.split(/\n+/).filter((p) => p.trim() !== '')
  const pages: string[][] = []
  let current: string[] = []
  let currentCount = 0

  for (const p of paragraphs) {
    const count = p.split(/\s+/).filter(Boolean).length
    if (currentCount > 0 && currentCount + count > PAGE_WORD_LIMIT) {
      pages.push(current)
      current = []
      currentCount = 0
    }
    current.push(p)
    currentCount += count
  }
  if (current.length > 0) pages.push(current)
  return pages
}

function ReaderWord({ token, onSelect }: { token: string; onSelect: (t: string) => void }) {
  const entry = lookupWord(token)
  const { progress } = useStudyData()
  if (!entry) {
    return (
      <button type="button" className="reader-word reader-word-unknown" onClick={() => onSelect(token)}>
        {token}
      </button>
    )
  }
  const status = statusOf(progress[entry.id])
  return (
    <button
      type="button"
      className={`reader-word reader-word-known ${status.className}`}
      onClick={() => onSelect(token)}
    >
      {token}
    </button>
  )
}

function WordPanel({ word }: { word: string }) {
  const entry = lookupWord(word)
  const [apiKey] = useLocalStorage('eng-app:geminiApiKey', '')
  const [aiResult, setAiResult] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)

  if (entry) {
    return (
      <div className="reader-panel">
        <div className="reader-panel-header">
          <span className="reader-panel-word">{entry.word}</span>
          <SpeakButton text={entry.word} label={`${entry.word} 발음 듣기`} />
        </div>
        <p className="reader-panel-meaning">{entry.meaning}</p>
        <p className="reader-panel-example">
          {entry.example}
          <br />
          <span className="example-ko">{entry.exampleMeaning}</span>
        </p>
      </div>
    )
  }

  const handleAiExplain = async () => {
    if (!apiKey || aiLoading) return
    setAiLoading(true)
    setAiError(null)
    try {
      const text = await explainWord(apiKey, word)
      setAiResult(text)
    } catch (e) {
      setAiError(e instanceof GeminiError ? e.message : '알 수 없는 오류가 발생했어요.')
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div className="reader-panel">
      <div className="reader-panel-header">
        <span className="reader-panel-word">{word}</span>
        <SpeakButton text={word} label={`${word} 발음 듣기`} />
      </div>
      <p className="reader-panel-meaning reader-panel-muted">사전에 없는 단어예요.</p>
      {apiKey ? (
        <>
          <button className="btn btn-primary" onClick={handleAiExplain} disabled={aiLoading}>
            {aiLoading ? '생성 중...' : 'AI로 뜻 보기'}
          </button>
          {aiError && <p className="ai-error">{aiError}</p>}
          {aiResult && <div className="ai-result">{aiResult}</div>}
        </>
      ) : (
        <p className="reader-panel-muted">AI 탭에서 Gemini API 키를 등록하면 뜻을 바로 물어볼 수 있어요.</p>
      )}
    </div>
  )
}

export function ReaderPage() {
  const [text, setText] = useLocalStorage('eng-app:readerText', '')
  const [draft, setDraft] = useState(text)
  const [editing, setEditing] = useState(!text)
  const [pageIndex, setPageIndex] = useState(0)
  const [selectedWord, setSelectedWord] = useState<string | null>(null)

  const pages = useMemo(() => paginate(text), [text])

  const stats = useMemo(() => {
    const tokens = text.match(/[A-Za-z']+/g) ?? []
    const unique = new Set(tokens.map((t) => t.toLowerCase()))
    let known = 0
    unique.forEach((w) => {
      if (lookupWord(w)) known += 1
    })
    return { total: unique.size, known }
  }, [text])

  const applyText = () => {
    setText(draft)
    setPageIndex(0)
    setSelectedWord(null)
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="page reader-page">
        <h2 className="page-title">내 텍스트로 읽기 연습</h2>
        <p className="page-subtitle">
          가지고 있는 영어 대본이나 글을 붙여넣으면, 단어를 탭해서 뜻을 확인하며 읽을 수 있어요.
          붙여넣은 글은 이 브라우저에만 저장되고 서버로 전송되지 않아요.
        </p>
        <textarea
          className="reader-textarea"
          placeholder="여기에 영어 텍스트를 붙여넣으세요..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button className="btn btn-primary btn-large" onClick={applyText} disabled={!draft.trim()}>
          적용하기
        </button>
      </div>
    )
  }

  const currentPage = pages[pageIndex] ?? []

  return (
    <div className="page reader-page">
      <div className="reader-toolbar">
        <p className="page-subtitle">
          고유 단어 {stats.total}개 중 {stats.known}개가 단어장에 있어요.
        </p>
        <button className="link-button" onClick={() => setEditing(true)}>
          텍스트 변경
        </button>
      </div>

      {selectedWord ? (
        <WordPanel word={selectedWord} />
      ) : (
        <p className="reader-hint">아무 단어나 탭해서 뜻을 확인해보세요.</p>
      )}

      <div className="reader-text">
        {currentPage.map((paragraph, pIdx) => (
          <p key={pIdx} className="reader-paragraph">
            {paragraph.split(WORD_TOKEN).map((chunk, cIdx) =>
              WORD_TOKEN.test(chunk) ? (
                <ReaderWord key={cIdx} token={chunk} onSelect={setSelectedWord} />
              ) : (
                <span key={cIdx}>{chunk}</span>
              ),
            )}
          </p>
        ))}
      </div>

      {pages.length > 1 && (
        <div className="reader-pagination">
          <button
            className="chip"
            onClick={() => setPageIndex((i) => Math.max(0, i - 1))}
            disabled={pageIndex === 0}
          >
            이전
          </button>
          <span>
            {pageIndex + 1} / {pages.length}
          </span>
          <button
            className="chip"
            onClick={() => setPageIndex((i) => Math.min(pages.length - 1, i + 1))}
            disabled={pageIndex === pages.length - 1}
          >
            다음
          </button>
        </div>
      )}
    </div>
  )
}
