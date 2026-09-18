import { useState } from 'react'
import { explainWord, GeminiError } from '../utils/gemini'

interface WordExplainerProps {
  apiKey: string
  initialWord?: string
}

export function WordExplainer({ apiKey, initialWord }: WordExplainerProps) {
  const [word, setWord] = useState(initialWord ?? '')
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleExplain = async () => {
    const trimmed = word.trim()
    if (!trimmed || loading) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const text = await explainWord(apiKey, trimmed)
      setResult(text)
    } catch (e) {
      setError(e instanceof GeminiError ? e.message : '알 수 없는 오류가 발생했어요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ai-panel">
      <div className="api-key-input-row">
        <input
          className="search-input"
          type="text"
          placeholder="설명을 듣고 싶은 영어 단어"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleExplain()}
        />
        <button className="btn btn-primary" onClick={handleExplain} disabled={loading || !word.trim()}>
          {loading ? '생성 중...' : 'AI 설명'}
        </button>
      </div>
      {error && <p className="ai-error">{error}</p>}
      {result && <div className="ai-result">{result}</div>}
    </div>
  )
}
