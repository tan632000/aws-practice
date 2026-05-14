import { useEffect, useState } from 'react';
import { useTimer, formatTime } from '../hooks/useTimer';
import { getActiveSession, updateSessionAnswer, updateSessionReviewMark, submitExam, saveRemainingTime, EXAM_DURATION_SECONDS } from '../ExamEngine';
import type { ExamSession, ExamResult } from '../../../lib/types';
import { QuestionCard } from './QuestionCard';

export function ExamView() {
  const [session, setSession] = useState<ExamSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [isPracticeMode, setIsPracticeMode] = useState(true);

  const handleExpire = async () => {
    if (session) {
      const res = await submitExam(session.sessionId);
      setResult(res);
    }
  };

  const { remainingSeconds, pauseTimer } = useTimer(
    session?.remainingSeconds ?? EXAM_DURATION_SECONDS,
    handleExpire
  );

  useEffect(() => {
    async function loadSession() {
      const active = await getActiveSession();
      if (active) {
        setSession(active);
      }
    }
    loadSession();
  }, []);

  // Auto save timer periodically
  useEffect(() => {
    if (session && remainingSeconds % 10 === 0) {
      saveRemainingTime(session.sessionId, remainingSeconds);
    }
  }, [remainingSeconds, session]);

  if (result) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Exam Results</h1>
        <p className="mt-4 text-xl">Score: {result.score.toFixed(2)}%</p>
        <p>Correct: {result.totalCorrect} / {result.totalQuestions}</p>
        <p className="mt-2 font-semibold">{result.passed ? 'PASSED 🎉' : 'FAILED 😢'}</p>
      </div>
    );
  }

  if (!session || session.questions.length === 0) {
    return <div>Loading Exam...</div>;
  }

  const currentQuestion = session.questions[currentIndex];
  const currentAnswers = session.answers[currentQuestion.id] || [];
  const isMarked = session.markedForReview.includes(currentQuestion.id);

  const handleOptionChange = async (optionId: string) => {
    // Assuming single choice for now to keep UI simple
    const newAnswers = [optionId];
    
    // Update local state
    setSession(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        answers: { ...prev.answers, [currentQuestion.id]: newAnswers }
      };
    });

    // Auto-save to DB
    await updateSessionAnswer(session.sessionId, currentQuestion.id, newAnswers);
  };

  const handleMarkReview = async () => {
    const newValue = !isMarked;
    setSession(prev => {
      if (!prev) return prev;
      const marks = new Set(prev.markedForReview);
      if (newValue) marks.add(currentQuestion.id);
      else marks.delete(currentQuestion.id);
      return { ...prev, markedForReview: Array.from(marks) };
    });
    
    await updateSessionReviewMark(session.sessionId, currentQuestion.id, newValue);
  };

  const handleSubmit = async () => {
    if (window.confirm("Are you sure you want to submit the exam?")) {
      pauseTimer();
      const res = await submitExam(session.sessionId);
      setResult(res);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center bg-gray-100 p-4 rounded mb-6">
        <div>
          <h2 className="text-xl font-semibold">Question {currentIndex + 1} of {session.questions.length}</h2>
          <label className="flex items-center space-x-2 mt-2 text-sm text-gray-600">
            <input 
              type="checkbox" 
              checked={isPracticeMode} 
              onChange={e => setIsPracticeMode(e.target.checked)} 
            />
            <span>Practice Mode (Immediate Feedback)</span>
          </label>
        </div>
        <div className="text-2xl font-mono text-red-600">{formatTime(remainingSeconds)}</div>
      </div>

      <QuestionCard 
        question={currentQuestion}
        selectedOptionIds={currentAnswers}
        onOptionChange={handleOptionChange}
        isPracticeMode={isPracticeMode}
      />

      <div className="mt-6 flex justify-between">
        <button 
          onClick={handleMarkReview}
          className={`px-4 py-2 rounded font-medium ${isMarked ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-200 text-gray-800'}`}
        >
          {isMarked ? 'Unmark Review' : 'Mark for Review'}
        </button>

        <div className="space-x-4">
          <button 
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
            className="px-4 py-2 bg-blue-100 text-blue-800 rounded disabled:opacity-50"
          >
            Previous
          </button>
          
          {currentIndex < session.questions.length - 1 ? (
            <button 
              onClick={() => setCurrentIndex(i => Math.min(session.questions.length - 1, i + 1))}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Next
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 text-white rounded font-bold"
            >
              Submit Exam
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
