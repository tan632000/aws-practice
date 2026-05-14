/**
 * @vitest-environment happy-dom
 */
import 'fake-indexeddb/auto';
import { describe, it, expect, beforeAll } from 'vitest';
import { db } from './db';

describe('Dexie Database Setup', () => {
  beforeAll(async () => {
    await db.open();
  });

  it('should initialize without errors', () => {
    expect(db.isOpen()).toBe(true);
  });

  it('should have correct tables defined', () => {
    expect(db.tables.map(t => t.name).sort()).toEqual(
      ['activeSession', 'history', 'questions'].sort()
    );
  });
});
