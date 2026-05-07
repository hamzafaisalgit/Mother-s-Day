import { useState, useCallback } from 'react';

const STORAGE_KEY = 'mothers-day-wishes';
const MIN_DIST = 11; // minimum distance between stars (percent units)

// Called from event handlers — Math.random is fine outside render
export function findStarPosition(existing) {
  for (let i = 0; i < 35; i++) {
    const x = 5  + Math.random() * 88; // 5-93%
    const y = 22 + Math.random() * 48; // 22-70%  (below header, above button area)
    const clear = existing.every(w => {
      const dx = w.x - x;
      const dy = w.y - y;
      return Math.sqrt(dx * dx + dy * dy) >= MIN_DIST;
    });
    if (clear) return { x, y };
  }
  // Fallback: place anywhere if all attempts overlapped
  return { x: 5 + Math.random() * 88, y: 22 + Math.random() * 48 };
}

export function useWishes() {
  const [wishes, setWishes] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const addWish = useCallback((text, x, y) => {
    const wish = {
      id: `w-${Date.now()}`,
      text: String(text).slice(0, 100),
      x,
      y,
    };
    setWishes(prev => {
      const next = [...prev, wish];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* storage unavailable */ }
      return next;
    });
    return wish;
  }, []);

  const clearWishes = useCallback(() => {
    setWishes([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* storage unavailable */ }
  }, []);

  return { wishes, addWish, clearWishes };
}
