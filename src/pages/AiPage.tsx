import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { ApiKeySetup } from '../components/ApiKeySetup'
import { WordExplainer } from '../components/WordExplainer'
import { AiChat } from '../components/AiChat'
import { GEMINI_MODEL } from '../utils/gemini'

type AiSubTab = 'explain' | 'chat'

interface AiPageProps {
  initialWord?: string
}

export function AiPage({ initialWord }: AiPageProps) {
  const [apiKey, setApiKey] = useLocalStorage('eng-app:geminiApiKey', '')
  const [subTab, setSubTab] = useState<AiSubTab>('explain')

  return (
    <div className="page ai-page">
      <h2 className="page-title">AI 학습 도우미</h2>
      <p className="page-subtitle">{GEMINI_MODEL}로 단어를 더 깊이 이해하고 영어 회화를 연습해요.</p>

      <ApiKeySetup apiKey={apiKey} onSave={setApiKey} />

      {apiKey && (
        <>
          <div className="level-filter">
            <button
              className={`chip ${subTab === 'explain' ? 'chip-active' : ''}`}
              onClick={() => setSubTab('explain')}
            >
              단어 설명
            </button>
            <button
              className={`chip ${subTab === 'chat' ? 'chip-active' : ''}`}
              onClick={() => setSubTab('chat')}
            >
              회화 연습
            </button>
          </div>

          {subTab === 'explain' ? (
            <WordExplainer apiKey={apiKey} initialWord={initialWord} />
          ) : (
            <AiChat apiKey={apiKey} />
          )}
        </>
      )}
    </div>
  )
}
