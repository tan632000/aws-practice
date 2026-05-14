import { useState } from 'react';

interface FeedbackPanelProps {
  explanation: string;
  trick?: string;
}

export function FeedbackPanel({ explanation, trick }: FeedbackPanelProps) {
  const [showTrick, setShowTrick] = useState(false);

  return (
    <div className="mt-8 animate-slide-down">
      <div className="relative p-6 bg-slate-50 border border-slate-200 rounded-2xl shadow-inner">
        {/* Decorative badge */}
        <div className="absolute -top-4 left-6 bg-slate-800 text-white text-xs font-bold px-3 py-1 rounded-full tracking-wider uppercase shadow-md">
          Explanation
        </div>
        
        <div className="text-slate-700 leading-relaxed text-lg pt-2 whitespace-pre-wrap">
          {explanation}
        </div>
      </div>
      
      {trick && (
        <div className="mt-6">
          <button 
            onClick={() => setShowTrick(!showTrick)}
            className="flex items-center space-x-2 text-sm font-bold text-amber-700 bg-amber-100/50 hover:bg-amber-100 px-4 py-2 rounded-xl transition-colors border border-amber-200/50"
          >
            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            <span>{showTrick ? 'Hide Pro Tip' : 'Show Pro Tip'}</span>
          </button>
          
          {showTrick && (
            <div className="mt-3 p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 rounded-r-xl text-amber-900 shadow-sm animate-slide-down">
              <span className="font-bold text-amber-600 block mb-1">💡 AWS Exam Trick</span>
              <div className="text-lg leading-relaxed">{trick}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
