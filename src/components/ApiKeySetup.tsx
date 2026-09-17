import { useState } from 'react'

interface ApiKeySetupProps {
  apiKey: string
  onSave: (key: string) => void
}

function maskKey(key: string) {
  if (key.length <= 8) return '••••••••'
  return `${key.slice(0, 4)}••••${key.slice(-4)}`
}

export function ApiKeySetup({ apiKey, onSave }: ApiKeySetupProps) {
  const [editing, setEditing] = useState(!apiKey)
  const [input, setInput] = useState(apiKey)
  const [show, setShow] = useState(false)

  if (!editing && apiKey) {
    return (
      <div className="api-key-card">
        <span className="api-key-status">🔑 API 키 등록됨 ({maskKey(apiKey)})</span>
        <button
          className="link-button"
          onClick={() => {
            setInput(apiKey)
            setEditing(true)
          }}
        >
          변경
        </button>
      </div>
    )
  }

  return (
    <div className="api-key-card">
      <p className="api-key-title">Gemini API 키 입력</p>
      <p className="api-key-desc">
        입력한 키는 이 브라우저에만 저장되고, Google Gemini API로만 직접 전송돼요. 다른 서버로는
        전송되지 않아요.{' '}
        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer">
          API 키 발급받기 →
        </a>
      </p>
      <div className="api-key-input-row">
        <input
          type={show ? 'text' : 'password'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="AIza..."
          className="search-input"
          autoComplete="off"
        />
        <button type="button" className="chip" onClick={() => setShow((s) => !s)}>
          {show ? '숨기기' : '보기'}
        </button>
      </div>
      <div className="answer-buttons">
        <button
          className="btn btn-primary"
          disabled={!input.trim()}
          onClick={() => {
            onSave(input.trim())
            setEditing(false)
          }}
        >
          저장
        </button>
        {apiKey && (
          <button
            className="btn btn-wrong"
            onClick={() => {
              onSave('')
              setInput('')
              setEditing(true)
            }}
          >
            삭제
          </button>
        )}
      </div>
    </div>
  )
}
