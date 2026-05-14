import { useState } from 'react';

interface FeedbackPanelProps {
  explanation: string;
  trick?: string;
}

export function FeedbackPanel({ explanation, trick }: FeedbackPanelProps) {
  const [showTrick, setShowTrick] = useState(false);

  return (
    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded text-blue-900">
      <h3 className="font-bold mb-2">Explanation</h3>
      <div className="text-sm mb-4 whitespace-pre-wrap">{explanation}</div>
      
      {trick && (
        <div>
          <button 
            onClick={() => setShowTrick(!showTrick)}
            className="text-sm font-semibold bg-blue-200 px-3 py-1 rounded hover:bg-blue-300 transition-colors"
          >
            {showTrick ? 'Hide Trick' : 'Show Trick 💡'}
          </button>
          
          {showTrick && (
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 text-yellow-900 rounded text-sm">
              <span className="font-bold">Trick: </span>{trick}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
