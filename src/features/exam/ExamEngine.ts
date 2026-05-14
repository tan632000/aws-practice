import { db } from '../../lib/db';
import type { QuestionSchema, ExamSession, ExamResult } from '../../lib/types';

export const EXAM_DURATION_SECONDS = 130 * 60; // 7800s
export const EXAM_QUESTION_COUNT = 65;

export async function loadQuestionsToDB(questionsJsonUrl = '/data/questions.json'): Promise<void> {
  const count = await db.questions.count();
  if (count === 0) {
    try {
      const response = await fetch(questionsJsonUrl);
      if (response.ok) {
        const questions: QuestionSchema[] = await response.json();
        await db.questions.bulkAdd(questions);
      }
    } catch (error) {
      console.error('Failed to load questions JSON:', error);
    }
  }
}

export async function getRandomQuestions(limit: number): Promise<QuestionSchema[]> {
  const allIds = await db.questions.toCollection().primaryKeys();
  // Shuffle allIds
  for (let i = allIds.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allIds[i], allIds[j]] = [allIds[j], allIds[i]];
  }
  const selectedIds = allIds.slice(0, limit);
  const questions = await db.questions.where('id').anyOf(selectedIds).toArray();
  return questions;
}

export async function startExam(): Promise<ExamSession> {
  const questions = await getRandomQuestions(EXAM_QUESTION_COUNT);
  
  if (questions.length === 0) {
     throw new Error("No questions available in the database.");
  }

  const session: ExamSession = {
    sessionId: crypto.randomUUID(),
    startTime: Date.now(),
    remainingSeconds: EXAM_DURATION_SECONDS,
    questions,
    answers: {},
    markedForReview: [],
    isCompleted: false
  };

  await db.activeSession.clear();
  await db.activeSession.add(session);
  return session;
}

export async function getActiveSession(): Promise<ExamSession | undefined> {
  return await db.activeSession.toCollection().first();
}

export async function updateSessionAnswer(sessionId: string, questionId: string, optionIds: string[]): Promise<void> {
  const session = await db.activeSession.get(sessionId);
  if (session) {
    session.answers[questionId] = optionIds;
    await db.activeSession.put(session);
  }
}

export async function updateSessionReviewMark(sessionId: string, questionId: string, isMarked: boolean): Promise<void> {
  const session = await db.activeSession.get(sessionId);
  if (session) {
    const currentMarks = new Set(session.markedForReview);
    if (isMarked) {
      currentMarks.add(questionId);
    } else {
      currentMarks.delete(questionId);
    }
    session.markedForReview = Array.from(currentMarks);
    await db.activeSession.put(session);
  }
}

export function calculateScore(session: ExamSession): ExamResult {
  let totalCorrect = 0;
  
  for (const question of session.questions) {
    const selectedOptions = session.answers[question.id] || [];
    const correctOptions = question.options.filter(o => o.isCorrect).map(o => o.id);
    
    // Exact match for arrays (ignoring order)
    if (selectedOptions.length === correctOptions.length &&
        selectedOptions.every(id => correctOptions.includes(id))) {
      totalCorrect++;
    }
  }

  const score = (totalCorrect / session.questions.length) * 100;
  
  return {
    score,
    totalCorrect,
    totalQuestions: session.questions.length,
    passed: score >= 72
  };
}

export async function submitExam(sessionId: string): Promise<ExamResult> {
  const session = await db.activeSession.get(sessionId);
  if (!session) {
    throw new Error('Session not found');
  }

  const result = calculateScore(session);
  session.isCompleted = true;
  session.score = result.score;
  await db.activeSession.put(session); 
  
  // Save to history
  await db.history.add({
    id: crypto.randomUUID(),
    date: Date.now(),
    score: result.score,
    totalQuestions: result.totalQuestions,
    timeSpentSeconds: EXAM_DURATION_SECONDS - session.remainingSeconds 
  });
  
  await db.activeSession.clear();

  return result;
}

export async function saveRemainingTime(sessionId: string, remainingSeconds: number): Promise<void> {
   const session = await db.activeSession.get(sessionId);
   if (session) {
     session.remainingSeconds = remainingSeconds;
     await db.activeSession.put(session);
   }
}
