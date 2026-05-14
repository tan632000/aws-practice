import { useState, useEffect } from 'react';
import type { QuestionSchema } from '../../../lib/types';
import { FeedbackPanel } from './FeedbackPanel';

interface QuestionCardProps {
  question: QuestionSchema;
  selectedOptionIds: string[];
  onOptionChange: (optionId: string) => void;
  isPracticeMode?: boolean;
}

export function QuestionCard({ question, selectedOptionIds, onOptionChange, isPracticeMode = false }: QuestionCardProps) {
  const [isEvaluated, setIsEvaluated] = useState(false);

  // Reset evaluation state when question changes
  useEffect(() => {
    setIsEvaluated(false);
  }, [question.id]);

  const handleEvaluate = () => {
    setIsEvaluated(true);
  };

  return (
    <div className="glass-card p-8 rounded-3xl relative">
      <div className="flex items-start gap-4 mb-8">
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
          Q
        </div>
        <h3 className="text-xl md:text-2xl font-semibold text-slate-800 leading-relaxed pt-1">
          {question.text}
        </h3>
      </div>
      
      <div className="space-y-4">
        {question.options.map(opt => {
          const isSelected = selectedOptionIds.includes(opt.id);
          
          let bgColor = 'bg-white hover:bg-slate-50';
          let borderColor = 'border-slate-200';
          let textColor = 'text-slate-700';
          let radioClass = 'custom-radio';

          if (isEvaluated) {
             if (opt.isCorrect) {
               bgColor = 'bg-emerald-50';
               borderColor = 'border-emerald-400 border-2';
               textColor = 'text-emerald-900 font-medium';
               radioClass = 'custom-radio border-emerald-500 text-emerald-500';
             } else if (isSelected && !opt.isCorrect) {
               bgColor = 'bg-rose-50';
               borderColor = 'border-rose-400 border-2';
               textColor = 'text-rose-900 font-medium';
               radioClass = 'custom-radio border-rose-500 text-rose-500';
             }
          } else if (isSelected) {
            bgColor = 'bg-orange-50';
            borderColor = 'border-orange-400 border-2';
            textColor = 'text-orange-900 font-medium';
          }

          return (
            <label 
              key={opt.id} 
              data-testid={`option-${opt.id}`}
              className={`flex items-start space-x-4 p-5 rounded-2xl cursor-pointer transition-all duration-200 shadow-sm border ${bgColor} ${borderColor} ${textColor}`}
            >
              <div className="pt-0.5">
                <input 
                  type="radio" 
                  name={`question-${question.id}`}
                  checked={isSelected}
                  onChange={() => onOptionChange(opt.id)}
                  disabled={isEvaluated}
                  className={radioClass}
                />
              </div>
              <span className="text-lg leading-relaxed flex-1">{opt.text}</span>
              
              {/* Icons for evaluated state */}
              {isEvaluated && opt.isCorrect && (
                <svg className="w-6 h-6 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              )}
              {isEvaluated && isSelected && !opt.isCorrect && (
                <svg className="w-6 h-6 text-rose-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
              )}
            </label>
          );
        })}
      </div>

      {isPracticeMode && !isEvaluated && (
        <div className="mt-8 flex justify-end border-t border-slate-200/60 pt-6">
          <button 
            onClick={handleEvaluate}
            disabled={selectedOptionIds.length === 0}
            className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none disabled:shadow-none"
          >
            Check Answer
          </button>
        </div>
      )}

      {isEvaluated && (
        <FeedbackPanel explanation={question.explanation} trick={question.trick} />
      )}
    </div>
  );
}
