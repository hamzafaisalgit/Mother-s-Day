import { motion } from 'framer-motion';
import { useMemo } from 'react';

const petalColors = ['#FBCFE8', '#FFE4E6', '#F9A8D4', '#FDE8E8', '#ffffff', '#FCE7F3'];

const PetalShape = ({ color, size }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <ellipse cx="20" cy="20" rx="8" ry="14" fill={color} opacity="0.75" transform="rotate(-20 20 20)" />
    <ellipse cx="20" cy="20" rx="8" ry="14" fill={color} opacity="0.5" transform="rotate(30 20 20)" />
  </svg>
);

export default function FallingPetals({ count = 22 }) {
  const petals = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 18 + Math.random() * 22,
      color: petalColors[Math.floor(Math.random() * petalColors.length)],
      duration: 10 + Math.random() * 16,
      delay: Math.random() * -25,
      rotationEnd: (Math.random() - 0.5) * 720,
      drift: (Math.random() - 0.5) * 220,
    })), []
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{ left: `${p.x}%`, top: -50, willChange: 'transform' }}
          animate={{
            y: typeof window !== 'undefined' ? window.innerHeight + 80 : 900,
            x: p.drift,
            rotate: p.rotationEnd,
            opacity: [0, 0.7, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <PetalShape color={p.color} size={p.size} />
        </motion.div>
      ))}
    </div>
  );
}
