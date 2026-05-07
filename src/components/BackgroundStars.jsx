// Deterministic star field — golden-ratio + sqrt(2) distribution.
// Uses CSS @keyframes (defined in index.css) instead of Framer Motion
// so all 90 stars animate with zero JS overhead on mobile.
const STARS = Array.from({ length: 90 }, (_, i) => {
  const sizeRaw = (i * 37) % 10;
  const size = sizeRaw < 6 ? 1 + sizeRaw * 0.17
             : sizeRaw < 9 ? 3 + (sizeRaw - 6) * 0.33
             :               5 + (sizeRaw - 9) * 0.5;

  return {
    id: i,
    x:        (i * 61.8034) % 100,
    y:        (i * 41.4214) % 100,
    size:     Math.max(0.8, size),
    duration: 2 + (i * 0.301) % 3,
    delay:    (i * 0.473) % 5,
    base:     0.25 + (i * 0.083) % 0.55,
  };
});

export default function BackgroundStars() {
  return (
    <>
      {STARS.map(s => (
        <div
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
              ? `0 0 ${s.size * 2}px rgba(255,248,243,0.5)`
              : 'none',
            pointerEvents: 'none',
            willChange: 'opacity',
            '--star-base': s.base,
            animation: `twinkle ${s.duration}s ${s.delay}s ease-in-out infinite`,
          }}
        />
      ))}
    </>
  );
}
