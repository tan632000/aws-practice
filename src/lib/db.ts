import Dexie, { type EntityTable } from 'dexie';
import type { QuestionSchema, ExamHistory, ExamSession } from './types';

export const db = new Dexie('aws-saa-c03-db') as Dexie & {
  questions: EntityTable<QuestionSchema, 'id'>;
  history: EntityTable<ExamHistory, 'id'>;
  activeSession: EntityTable<ExamSession, 'sessionId'>;
};

db.version(1).stores({
  questions: 'id, domain',
  history: 'id, date',
  activeSession: 'sessionId'
});
