import { useStudyData } from '../context/StudyDataContext'
import type { AppTab } from '../App'

interface HomePageProps {
  onNavigate: (tab: AppTab) => void
}

export function HomePage({ onNavigate }: HomePageProps) {
  const { dueWords, masteredCount, totalWords, streak, resetAllProgress } = useStudyData()

  const handleReset = () => {
    if (window.confirm('모든 학습 기록을 초기화할까요? 이 작업은 되돌릴 수 없어요.')) {
      resetAllProgress()
    }
  }

  return (
    <div className="page home-page">
      <div className="home-hero">
        <h1>나만의 영어 공부</h1>
        <p>매일 조금씩, 꾸준히 단어를 암기해요.</p>
      </div>

      <div className="home-summary-row">
        <div className="home-summary-item">
          <p className="home-summary-value">{dueWords.length}</p>
          <p className="home-summary-label">오늘 복습할 단어</p>
        </div>
        <div className="home-summary-item">
          <p className="home-summary-value">{streak}일</p>
          <p className="home-summary-label">연속 학습</p>
        </div>
        <div className="home-summary-item">
          <p className="home-summary-value">
            {masteredCount}/{totalWords}
          </p>
          <p className="home-summary-label">암기 완료</p>
        </div>
      </div>

      <button className="btn btn-primary btn-large" onClick={() => onNavigate('study')}>
        오늘의 학습 시작하기
      </button>

      <div className="home-links">
        <button className="link-button" onClick={() => onNavigate('stats')}>
          학습 통계 보기 →
        </button>
        <button className="link-button" onClick={() => onNavigate('words')}>
          전체 단어장 보기 →
        </button>
      </div>

      <button className="reset-link" onClick={handleReset}>
        학습 기록 초기화
      </button>
    </div>
  )
}
