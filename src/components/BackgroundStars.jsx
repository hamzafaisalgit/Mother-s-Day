import { motion, useReducedMotion } from 'framer-motion';

// Deterministic star field using golden-ratio + sqrt(2) distribution.
// Computed once at module load — never during render, so no purity concerns.
const STARS = Array.from({ length: 92 }, (_, i) => {
  const sizeRaw = (i * 37) % 10;
  const size = sizeRaw < 6 ? 1   + sizeRaw * 0.17   // 1-2 px  (60 % of stars)
             : sizeRaw < 9 ? 3   + (sizeRaw - 6) * 0.33 // 3-4 px  (30 %)
             :               5   + (sizeRaw - 9) * 0.5;  // 5-6 px  (10 %)

  return {
    id: i,
    x: (i * 61.8034) % 100,       // x: 0–100%  (golden ratio)
    y: (i * 41.4214) % 100,       // y: 0–100%  (sqrt2 fraction)
    size: Math.max(0.8, size),
    duration: 2 + (i * 0.301) % 3,   // twinkle period: 2–5 s
    delay:    (i * 0.473) % 5,        // stagger: 0–5 s
    base:     0.25 + (i * 0.083) % 0.55, // base opacity
  };
});

export default function BackgroundStars() {
  const reduced = useReducedMotion();

  return (
    <>
      {STARS.map(s => (
        <motion.div
          key={s.id}
          style={{
            position: 'absolute',
            left: `${s.x}%`,
            top:  `${s.y}%`,
            width:  `${s.size}px`,
            height: `${s.size}px`,
            borderRadius: '50%',
            background: '#FFF8F3',
            boxShadow: s.size > 3.5
              ? `0 0 ${s.size * 2}px rgba(255,248,243,0.55)`
              : 'none',
            pointerEvents: 'none',
          }}
          initial={{ opacity: s.base }}
          animate={reduced ? {} : { opacity: [0.22, 1, 0.22] }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            delay: s.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </>
  );
}
