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
    <div className="max-w-5xl mx-auto p-4 py-12">
      <div className="glass-panel p-8 rounded-3xl mb-10 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight">AWS SAA-C03 Prep</h1>
          <p className="mt-2 text-slate-500 font-medium text-lg">Master your architecture skills.</p>
        </div>
        
        <div className="space-x-3 relative z-10 flex items-center">
          <button onClick={handleExport} className="px-5 py-2.5 bg-white/80 backdrop-blur-sm text-slate-700 font-medium rounded-xl hover:bg-white shadow-sm transition-all border border-slate-200">Export</button>
          <button onClick={() => fileInputRef.current?.click()} className="px-5 py-2.5 bg-white/80 backdrop-blur-sm text-slate-700 font-medium rounded-xl hover:bg-white shadow-sm transition-all border border-slate-200">Import</button>
          <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleImport} />
          <Link to="/exam" className="px-6 py-2.5 bg-gradient-to-r from-[#232F3E] to-[#374151] text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all">
            {hasActiveSession ? 'Resume Exam' : 'Start Exam'}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="glass-card p-6 rounded-2xl text-center">
          <div className="text-slate-500 text-sm uppercase tracking-wider font-semibold mb-2">Exams Taken</div>
          <div className="text-5xl font-black text-slate-800">{history.length}</div>
        </div>
        <div className="glass-card p-6 rounded-2xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-amber-500"></div>
          <div className="text-slate-500 text-sm uppercase tracking-wider font-semibold mb-2">Average Score</div>
          <div className="text-5xl font-black text-[#FF9900]">{avgScore.toFixed(1)}<span className="text-2xl text-orange-400">%</span></div>
        </div>
        <div className="glass-card p-6 rounded-2xl text-center">
          <div className="text-slate-500 text-sm uppercase tracking-wider font-semibold mb-2">Questions Practiced</div>
          <div className="text-5xl font-black text-slate-800">{totalQuestions}</div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-slate-800 px-2">Exam History</h2>
      {history.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center">
          <p className="text-slate-500 text-lg font-medium">No exams taken yet. Start your first practice session!</p>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-200/60">
              <tr>
                <th className="p-5 font-semibold text-slate-600">Date</th>
                <th className="p-5 font-semibold text-slate-600">Score</th>
                <th className="p-5 font-semibold text-slate-600">Result</th>
                <th className="p-5 font-semibold text-slate-600 text-right">Time Spent</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={i} className="border-b border-slate-200/50 last:border-0 hover:bg-white/50 transition-colors">
                  <td className="p-5 text-slate-800 font-medium">{new Date(h.date).toLocaleString()}</td>
                  <td className="p-5 font-bold text-slate-900">{h.score.toFixed(1)}%</td>
                  <td className="p-5">
                    <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${h.score >= 72 ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-rose-100 text-rose-700 border border-rose-200'}`}>
                      {h.score >= 72 ? 'PASS' : 'FAIL'}
                    </span>
                  </td>
                  <td className="p-5 text-slate-600 font-mono text-right">{formatTime(h.timeSpentSeconds)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
