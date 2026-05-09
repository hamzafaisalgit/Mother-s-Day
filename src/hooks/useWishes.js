import { useState, useCallback } from 'react';

const STORAGE_KEY = 'mothers-day-wishes';
const MIN_DIST = 13; // minimum distance between stars (percent units)

// Stars are placed in three zones that avoid the centred text column:
//   Left strip  (x  3-17%,  y 10-75%) — beside the heading on all devices
//   Right strip (x 83-97%,  y 10-75%) — mirror of left strip
//   Bottom area (x  6-94%,  y 65-90%) — below the shooting-star button
export function findStarPosition(existing) {
  for (let i = 0; i < 60; i++) {
    let x, y;
    const zone = Math.random();
    if (zone < 0.25) {
      x = 3  + Math.random() * 14;  // left strip
      y = 10 + Math.random() * 65;
    } else if (zone < 0.5) {
      x = 83 + Math.random() * 14;  // right strip
      y = 10 + Math.random() * 65;
    } else {
      x = 6  + Math.random() * 88;  // bottom area
      y = 65 + Math.random() * 25;
    }

    const clear = existing.every(w => {
      const dx = w.x - x;
      const dy = w.y - y;
      return Math.sqrt(dx * dx + dy * dy) >= MIN_DIST;
    });
    if (clear) return { x, y };
  }
  // Fallback: bottom strip
  return { x: 6 + Math.random() * 88, y: 65 + Math.random() * 25 };
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
