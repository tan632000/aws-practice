import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../lib/db';
import { exportData, importData, calculateAverageScore } from '../../lib/dataSync';
import { formatTime } from '../exam/hooks/useTimer';
import type { ExamHistory } from '../../lib/types';

export function Dashboard() {
  const [history, setHistory] = useState<ExamHistory[]>([]);
  const [hasActiveSession, setHasActiveSession] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const h = await db.history.orderBy('date').reverse().toArray();
    setHistory(h);
    const active = await db.activeSession.count();
    setHasActiveSession(active > 0);
  }

  const handleExport = () => {
    exportData();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (window.confirm("Hành động này sẽ ghi đè lịch sử hiện tại, bạn có chắc chắn?")) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const content = event.target?.result as string;
          await importData(content);
          alert('Import successful!');
          loadData();
        } catch (error: any) {
          alert(error.message);
        }
      };
      reader.readAsText(file);
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const avgScore = calculateAverageScore(history);
  const totalQuestions = history.reduce((sum, h) => sum + h.totalQuestions, 0);

  return (
    <div className="max-w-4xl mx-auto p-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">AWS SAA-C03 Prep</h1>
        <div className="space-x-3">
          <button onClick={handleExport} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Export</button>
          <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Import</button>
          <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleImport} />
          <Link to="/exam" className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700">
            {hasActiveSession ? 'Resume Exam' : 'Start Exam'}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 border rounded shadow-sm text-center">
          <div className="text-gray-500 text-sm uppercase tracking-wide">Exams Taken</div>
          <div className="text-3xl font-bold mt-2">{history.length}</div>
        </div>
        <div className="bg-white p-6 border rounded shadow-sm text-center">
          <div className="text-gray-500 text-sm uppercase tracking-wide">Average Score</div>
          <div className="text-3xl font-bold mt-2 text-blue-600">{avgScore.toFixed(1)}%</div>
        </div>
        <div className="bg-white p-6 border rounded shadow-sm text-center">
          <div className="text-gray-500 text-sm uppercase tracking-wide">Questions Practiced</div>
          <div className="text-3xl font-bold mt-2">{totalQuestions}</div>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4 text-gray-800">Exam History</h2>
      {history.length === 0 ? (
        <p className="text-gray-500 bg-white p-6 border rounded text-center">No exams taken yet.</p>
      ) : (
        <div className="bg-white border rounded shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Date</th>
                <th className="p-4 font-semibold text-gray-600">Score</th>
                <th className="p-4 font-semibold text-gray-600">Result</th>
                <th className="p-4 font-semibold text-gray-600">Time Spent</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-4 text-gray-800">{new Date(h.date).toLocaleString()}</td>
                  <td className="p-4 font-bold text-gray-900">{h.score.toFixed(1)}%</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${h.score >= 72 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {h.score >= 72 ? 'Pass' : 'Fail'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{formatTime(h.timeSpentSeconds)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
