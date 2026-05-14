import { Link } from 'react-router-dom';
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
      <div className="max-w-2xl mx-auto p-12 mt-20 glass-panel rounded-3xl text-center relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-2 ${result.passed ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
        <h1 className="text-4xl font-extrabold mb-8 text-slate-800 tracking-tight">Exam Complete!</h1>
        
        <div className="flex justify-center items-center mb-8">
          <div className="relative">
            <svg className="w-48 h-48 transform -rotate-90">
              <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-200" />
              <circle 
                cx="96" cy="96" r="88" 
                stroke="currentColor" 
                strokeWidth="12" 
                fill="transparent" 
                strokeDasharray="552.92" 
                strokeDashoffset={552.92 - (552.92 * result.score) / 100}
                className={result.passed ? 'text-emerald-500 transition-all duration-1000 ease-out' : 'text-rose-500 transition-all duration-1000 ease-out'} 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-5xl font-black ${result.passed ? 'text-emerald-600' : 'text-rose-600'}`}>
                {result.score.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        <p className="text-xl text-slate-600 mb-2 font-medium">Correct Answers: <span className="text-slate-800 font-bold">{result.totalCorrect} / {result.totalQuestions}</span></p>
        <p className={`text-3xl font-black mb-10 tracking-widest ${result.passed ? 'text-emerald-600' : 'text-rose-600'}`}>
          {result.passed ? 'PASSED 🎉' : 'FAILED 😢'}
        </p>

        <Link to="/" className="inline-block px-10 py-4 bg-gradient-to-r from-[#232F3E] to-[#374151] text-white rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  if (!session || session.questions.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium">Preparing your exam...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = session.questions[currentIndex];
  const currentAnswers = session.answers[currentQuestion.id] || [];
  const isMarked = session.markedForReview.includes(currentQuestion.id);

  const handleOptionChange = async (optionId: string) => {
    const isMultipleChoice = currentQuestion.options.filter(o => o.isCorrect).length > 1;
    
    let newAnswers: string[];
    if (isMultipleChoice) {
      if (currentAnswers.includes(optionId)) {
        newAnswers = currentAnswers.filter(id => id !== optionId);
      } else {
        newAnswers = [...currentAnswers, optionId];
      }
    } else {
      newAnswers = [optionId];
    }
    
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
    <div className="max-w-4xl mx-auto p-4 py-8 relative">
      {/* Sticky Header */}
      <div className="sticky top-4 z-50 glass-panel px-6 py-4 rounded-2xl mb-8 flex justify-between items-center shadow-md">
        <div>
          <div className="flex items-center space-x-3">
            <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-lg text-sm font-bold">
              Q {currentIndex + 1} / {session.questions.length}
            </span>
            <label className="flex items-center space-x-2 text-sm text-slate-600 bg-white/60 px-3 py-1 rounded-lg border border-slate-200 cursor-pointer hover:bg-white transition-colors">
              <input 
                type="checkbox" 
                checked={isPracticeMode} 
                onChange={e => setIsPracticeMode(e.target.checked)} 
                className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 cursor-pointer"
              />
              <span className="font-medium">Practice Mode</span>
            </label>
          </div>
        </div>
        <div className={`text-3xl font-mono font-black ${remainingSeconds < 300 ? 'text-rose-600 animate-pulse' : 'text-slate-800'}`}>
          {formatTime(remainingSeconds)}
        </div>
      </div>

      <QuestionCard 
        question={currentQuestion}
        selectedOptionIds={currentAnswers}
        onOptionChange={handleOptionChange}
        isPracticeMode={isPracticeMode}
      />

      <div className="mt-8 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <button 
          onClick={handleMarkReview}
          className={`px-5 py-2.5 rounded-xl font-bold flex items-center space-x-2 transition-all ${isMarked ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
          </svg>
          <span>{isMarked ? 'Unmark Review' : 'Mark for Review'}</span>
        </button>

        <div className="flex space-x-3">
          <button 
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
            className="px-6 py-2.5 bg-white text-slate-700 border border-slate-300 rounded-xl font-bold disabled:opacity-40 hover:bg-slate-50 transition-colors"
          >
            Previous
          </button>
          
          {currentIndex < session.questions.length - 1 ? (
            <button 
              onClick={() => setCurrentIndex(i => Math.min(session.questions.length - 1, i + 1))}
              className="px-8 py-2.5 bg-[#232F3E] text-white rounded-xl font-bold hover:bg-[#131A22] transition-colors shadow-md"
            >
              Next
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              className="px-8 py-2.5 bg-emerald-600 text-white rounded-xl font-black hover:bg-emerald-700 transition-colors shadow-md animate-pulse"
            >
              Submit Exam
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
