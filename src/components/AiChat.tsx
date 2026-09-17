import { useEffect, useRef, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { sendChatMessage, GeminiError, type ChatMessage } from '../utils/gemini'

interface AiChatProps {
  apiKey: string
}

export function AiChat({ apiKey }: AiChatProps) {
  const [history, setHistory] = useLocalStorage<ChatMessage[]>('eng-app:aiChatHistory', [])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [history, loading])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading) return
    const nextHistory = [...history, { role: 'user', text } as ChatMessage]
    setHistory(nextHistory)
    setInput('')
    setLoading(true)
    setError(null)
    try {
      const reply = await sendChatMessage(apiKey, nextHistory)
      setHistory([...nextHistory, { role: 'model', text: reply }])
    } catch (e) {
      setError(e instanceof GeminiError ? e.message : '알 수 없는 오류가 발생했어요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ai-panel">
      <div className="chat-header">
        <span>영어로 자유롭게 대화해보세요</span>
        <button className="link-button" onClick={() => setHistory([])} disabled={history.length === 0}>
          대화 초기화
        </button>
      </div>

      <div className="chat-messages" ref={listRef}>
        {history.length === 0 && <p className="empty-message">영어로 인사를 건네보세요! 👋 (예: Hi, how are you?)</p>}
        {history.map((m, i) => (
          <div key={i} className={`chat-bubble chat-bubble-${m.role}`}>
            {m.text}
          </div>
        ))}
        {loading && <div className="chat-bubble chat-bubble-model chat-bubble-loading">...</div>}
      </div>

      {error && <p className="ai-error">{error}</p>}

      <div className="api-key-input-row">
        <input
          className="search-input"
          type="text"
          placeholder="영어로 메시지를 입력하세요"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={loading}
        />
        <button className="btn btn-primary" onClick={handleSend} disabled={loading || !input.trim()}>
          전송
        </button>
      </div>
    </div>
  )
}
