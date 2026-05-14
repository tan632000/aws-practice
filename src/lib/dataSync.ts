import { db } from './db';
import type { ExamHistory, ExamSession } from './types';

export interface BackupData {
  history: ExamHistory[];
  activeSession?: ExamSession;
}

export async function exportData(): Promise<void> {
  const history = await db.history.toArray();
  const activeSession = await db.activeSession.toCollection().first();
  
  const data: BackupData = { history, activeSession };
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'aws_prep_backup.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function importData(jsonStr: string): Promise<boolean> {
  try {
    const data = JSON.parse(jsonStr) as BackupData;
    
    // Minimal validation
    if (!data || typeof data !== 'object') throw new Error('Invalid JSON format');
    if (!Array.isArray(data.history)) throw new Error('Missing history array');
    
    // Clear and insert
    await db.transaction('rw', db.history, db.activeSession, async () => {
      await db.history.clear();
      await db.history.bulkAdd(data.history);
      
      await db.activeSession.clear();
      if (data.activeSession) {
        await db.activeSession.add(data.activeSession);
      }
    });
    
    return true;
  } catch (error) {
    console.error('Import failed:', error);
    throw new Error('Invalid backup file');
  }
}

export function calculateAverageScore(history: ExamHistory[]): number {
  if (history.length === 0) return 0;
  const total = history.reduce((sum, entry) => sum + entry.score, 0);
  return total / history.length;
}
