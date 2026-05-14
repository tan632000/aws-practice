import { Routes, Route, useNavigate } from 'react-router-dom';
import { Dashboard } from './features/dashboard/Dashboard';
import { ExamView } from './features/exam/components/ExamView';
import { useEffect, useState } from 'react';
import { loadQuestionsToDB, startExam, getActiveSession } from './features/exam/ExamEngine';

function ExamWrapper() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function init() {
      await loadQuestionsToDB();
      const active = await getActiveSession();
      if (!active) {
        try {
          await startExam();
        } catch (e: any) {
          alert(e.message);
          navigate('/');
        }
      }
      setLoading(false);
    }
    init();
  }, [navigate]);

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
