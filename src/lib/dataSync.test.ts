/**
 * @vitest-environment happy-dom
 */
import 'fake-indexeddb/auto';
import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { calculateAverageScore, importData } from './dataSync';
import { db } from './db';
import type { ExamHistory } from './types';

describe('Data Sync', () => {
  beforeAll(async () => {
    await db.open();
  });
  
  afterEach(async () => {
    await db.history.clear();
    await db.activeSession.clear();
  });

  it('calculates average score correctly', () => {
    const history: ExamHistory[] = [
      { id: '1', date: 1, score: 80, totalQuestions: 65, timeSpentSeconds: 100 },
      { id: '2', date: 2, score: 90, totalQuestions: 65, timeSpentSeconds: 100 }
    ];
    expect(calculateAverageScore(history)).toBe(85);
    expect(calculateAverageScore([])).toBe(0);
  });

  it('throws an error for invalid import JSON format', async () => {
    await expect(importData('not json')).rejects.toThrow('Invalid backup file');
    await expect(importData('{"foo": "bar"}')).rejects.toThrow('Invalid backup file');
  });

  it('imports valid data successfully', async () => {
    const validJson = JSON.stringify({
      history: [{ id: '1', date: 1, score: 80, totalQuestions: 65, timeSpentSeconds: 100 }]
    });
    const result = await importData(validJson);
    expect(result).toBe(true);
    const history = await db.history.toArray();
    expect(history.length).toBe(1);
    expect(history[0].score).toBe(80);
  });
});
