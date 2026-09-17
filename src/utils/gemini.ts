export const GEMINI_MODEL = 'gemini-3.5-flash-lite'

export class GeminiError extends Error {}

export interface ChatMessage {
  role: 'user' | 'model'
  text: string
}

interface GeminiContent {
  role: 'user' | 'model'
  parts: { text: string }[]
}

async function callGemini(
  apiKey: string,
  contents: GeminiContent[],
  systemInstruction?: string,
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`
  const body: Record<string, unknown> = { contents }
  if (systemInstruction) {
    body.systemInstruction = { parts: [{ text: systemInstruction }] }
  }

  let res: Response
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new GeminiError('네트워크 오류로 Gemini API에 연결하지 못했어요.')
  }

  if (!res.ok) {
    if (res.status === 400 || res.status === 401 || res.status === 403) {
      throw new GeminiError('API 키가 올바르지 않거나 권한이 없어요. 키를 다시 확인해 주세요.')
    }
    if (res.status === 429) {
      throw new GeminiError('요청이 너무 많아요. 잠시 후 다시 시도해 주세요.')
    }
    throw new GeminiError(`Gemini API 오류가 발생했어요. (${res.status})`)
  }

  const data = await res.json()
  const parts = data?.candidates?.[0]?.content?.parts as { text?: string }[] | undefined
  const text = parts?.map((p) => p.text ?? '').join('') ?? ''
  if (!text) {
    throw new GeminiError('Gemini로부터 응답을 받지 못했어요.')
  }
  return text
}

export function explainWord(apiKey: string, word: string): Promise<string> {
  const prompt = `당신은 한국인을 위한 친절한 영어 학습 도우미입니다. 영어 단어 "${word}"에 대해 다음 항목을 한국어로 간결하게 설명해 주세요:
1. 핵심 의미와 뉘앙스
2. 유의어 2~3개
3. 실생활에서 쓸 수 있는 새로운 예문 2개 (영어 문장 + 한글 해석)
마크다운 기호(#, *, -) 없이 자연스러운 문단과 줄바꿈으로만 답해주세요.`

  return callGemini(apiKey, [{ role: 'user', parts: [{ text: prompt }] }])
}

export function sendChatMessage(apiKey: string, history: ChatMessage[]): Promise<string> {
  const systemInstruction =
    '당신은 한국인 영어 학습자의 영어 회화 연습 상대입니다. 항상 영어로 대화하되, 문법이나 표현에 어색한 부분이 있으면 답변 끝에 "[Tip] ..." 형식으로 한국어로 짧게 고쳐주세요. 답변은 3문장 이내로 짧게 유지하세요.'
  const contents: GeminiContent[] = history.map((m) => ({ role: m.role, parts: [{ text: m.text }] }))
  return callGemini(apiKey, contents, systemInstruction)
}
