import { useState, useEffect, useRef, useCallback } from 'react';

export function useTimer(initialRemainingSeconds: number, onExpire: () => void) {
  const [remainingSeconds, setRemainingSeconds] = useState(initialRemainingSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const targetTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning && targetTimeRef.current === null) {
      targetTimeRef.current = Date.now() + remainingSeconds * 1000;
    }

    if (!isRunning) return;

    const intervalId = setInterval(() => {
      if (targetTimeRef.current === null) return;
      
      const now = Date.now();
      const differenceSeconds = Math.max(0, Math.floor((targetTimeRef.current - now) / 1000));
      
      setRemainingSeconds(differenceSeconds);

      if (differenceSeconds <= 0) {
        clearInterval(intervalId);
        setIsRunning(false);
        onExpire();
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning, onExpire, remainingSeconds]);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
    targetTimeRef.current = null;
  }, []);

  const resumeTimer = useCallback(() => {
    targetTimeRef.current = Date.now() + remainingSeconds * 1000;
    setIsRunning(true);
  }, [remainingSeconds]);

  return { remainingSeconds, isRunning, pauseTimer, resumeTimer };
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
