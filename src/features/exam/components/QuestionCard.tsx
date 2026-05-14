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
    <div className="bg-white p-6 border rounded shadow-sm">
      <p className="text-lg mb-6">{question.text}</p>
      
      <div className="space-y-3">
        {question.options.map(opt => {
          const isSelected = selectedOptionIds.includes(opt.id);
          
          let bgColor = 'bg-white hover:bg-gray-50';
          let borderColor = 'border-gray-200';
          let textColor = 'text-gray-900';

          if (isEvaluated) {
             if (opt.isCorrect) {
               bgColor = 'bg-green-100';
               borderColor = 'border-green-500';
               textColor = 'text-green-900';
             } else if (isSelected && !opt.isCorrect) {
               bgColor = 'bg-red-100';
               borderColor = 'border-red-500';
               textColor = 'text-red-900';
             }
          }

          return (
            <label 
              key={opt.id} 
              data-testid={`option-${opt.id}`}
              className={`flex items-center space-x-3 p-3 border rounded cursor-pointer transition-colors ${bgColor} ${borderColor} ${textColor}`}
            >
              <input 
                type="radio" 
                name={`question-${question.id}`}
                checked={isSelected}
                onChange={() => onOptionChange(opt.id)}
                disabled={isEvaluated}
                className="w-5 h-5 text-blue-600"
              />
              <span>{opt.text}</span>
            </label>
          );
        })}
      </div>

      {isPracticeMode && !isEvaluated && (
        <button 
          onClick={handleEvaluate}
          disabled={selectedOptionIds.length === 0}
          className="mt-6 px-4 py-2 bg-purple-600 text-white rounded font-medium disabled:opacity-50"
        >
          Check Answer
        </button>
      )}

      {isEvaluated && (
        <FeedbackPanel explanation={question.explanation} trick={question.trick} />
      )}
    </div>
  );
}
