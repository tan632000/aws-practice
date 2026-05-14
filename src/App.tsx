import { Routes, Route, useNavigate, useSearchParams } from 'react-router-dom';
import { Dashboard } from './features/dashboard/Dashboard';
import { ExamView } from './features/exam/components/ExamView';
import { useEffect, useState } from 'react';
import { loadQuestionsToDB, startMockExam, startRandomPractice, getActiveSession } from './features/exam/ExamEngine';

function ExamWrapper() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function init() {
      await loadQuestionsToDB();
      const active = await getActiveSession();
      if (!active) {
        try {
          const mockIdParam = searchParams.get('mockId');
          if (mockIdParam && !isNaN(Number(mockIdParam))) {
            await startMockExam(Number(mockIdParam));
          } else {
            await startRandomPractice();
          }
        } catch (e: any) {
          alert(e.message);
          navigate('/');
        }
      }
      setLoading(false);
    }
    init();
  }, [navigate, searchParams]);

  if (loading) return <div className="p-8 text-center">Initializing Exam...</div>;

  return <ExamView />;
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/exam" element={<ExamWrapper />} />
      </Routes>
    </div>
  );
}
