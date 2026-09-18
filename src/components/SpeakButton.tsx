import { isSpeechSupported, speak } from '../utils/tts'

interface SpeakButtonProps {
  text: string
  className?: string
  label?: string
}

export function SpeakButton({ text, className, label }: SpeakButtonProps) {
  if (!isSpeechSupported()) return null

  return (
    <button
      type="button"
      className={`speak-button ${className ?? ''}`}
      onClick={(e) => {
        e.stopPropagation()
        speak(text)
      }}
      aria-label={label ?? `${text} 발음 듣기`}
    >
      🔊
    </button>
  )
}
