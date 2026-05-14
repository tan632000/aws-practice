/**
 * @vitest-environment happy-dom
 */
import 'fake-indexeddb/auto';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { calculateScore, EXAM_DURATION_SECONDS, getRandomQuestions } from './ExamEngine';
import { db } from '../../lib/db';
import type { ExamSession, QuestionSchema } from '../../lib/types';

describe('ExamEngine Scoring & Random Logic', () => {
  beforeAll(async () => {
    await db.open();
    // Insert mock questions
    const mockQs: QuestionSchema[] = Array.from({ length: 70 }).map((_, i) => ({
      id: `q${i}`,
      text: `Question ${i}?`,
      options: [
        { id: `q${i}-opt1`, text: 'Option 1 (Correct)', isCorrect: true },
        { id: `q${i}-opt2`, text: 'Option 2', isCorrect: false }
      ],
      explanation: 'Test'
    }));
    await db.questions.bulkAdd(mockQs);
  });

  afterAll(async () => {
    await db.questions.clear();
  });

  it('should get correct amount of random questions', async () => {
    const qList = await getRandomQuestions(65);
    expect(qList.length).toBe(65);
    const ids = new Set(qList.map(q => q.id));
    expect(ids.size).toBe(65); // verify all unique
  });

  it('should calculate score correctly', () => {
    const session: ExamSession = {
      sessionId: 'test-session',
      startTime: Date.now(),
      remainingSeconds: EXAM_DURATION_SECONDS,
      markedForReview: [],
      isCompleted: false,
      questions: [
        {
          id: 'q1',
          text: 'Q1',
          options: [
            { id: 'opt1', text: '1', isCorrect: true },
            { id: 'opt2', text: '2', isCorrect: false }
          ],
          explanation: 'E1'
        },
        {
          id: 'q2',
          text: 'Q2',
          options: [
            { id: 'opt3', text: '3', isCorrect: true },
            { id: 'opt4', text: '4', isCorrect: true }
          ],
          explanation: 'E2'
        }
      ],
      answers: {
        'q1': ['opt1'], // correct
        'q2': ['opt3']  // partial correct -> incorrect
      }
    };

    const result = calculateScore(session);
    expect(result.totalQuestions).toBe(2);
    expect(result.totalCorrect).toBe(1);
    expect(result.score).toBe(50);
    expect(result.passed).toBe(false);
  });
});
