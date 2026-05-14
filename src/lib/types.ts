export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuestionSchema {
  id: string; // Unique identifier/hash
  text: string;
  options: QuestionOption[];
  explanation: string;
  trick?: string;
  domain?: string; // SAA-C03 domain
}

export interface ExamSession {
  sessionId: string;
  mockId?: number | 'random';
  startTime: number;
  remainingSeconds: number;
  questions: QuestionSchema[];
  answers: Record<string, string[]>; // questionId -> selected optionIds
  markedForReview: string[];
  isCompleted: boolean;
  score?: number;
}

export interface ExamResult {
  score: number;
  totalCorrect: number;
  totalQuestions: number;
  passed: boolean; // >= 72% for SAA-C03
}

export interface ExamHistory {
  id: string; // PK
  date: number; // timestamp
  mockId?: number | 'random';
  score: number;
  totalQuestions: number;
  timeSpentSeconds: number;
}
