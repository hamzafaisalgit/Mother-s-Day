import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const Rose = ({ color = '#F9A8D4', center = '#881337' }) => (
  <svg width="80" height="90" viewBox="0 0 80 90" fill="none">
    {/* Stem */}
    <path d="M40 90 Q38 70 40 55" stroke="#6B8F4E" strokeWidth="3" strokeLinecap="round" />
    <path d="M40 75 Q30 68 25 60" stroke="#6B8F4E" strokeWidth="2" strokeLinecap="round" />
    {/* Petals */}
    <ellipse cx="40" cy="30" rx="12" ry="18" fill={color} transform="rotate(-20 40 30)" opacity="0.9" />
    <ellipse cx="40" cy="30" rx="12" ry="18" fill={color} transform="rotate(20 40 30)" opacity="0.9" />
    <ellipse cx="40" cy="30" rx="12" ry="18" fill={color} transform="rotate(65 40 30)" opacity="0.8" />
    <ellipse cx="40" cy="30" rx="12" ry="18" fill={color} transform="rotate(-65 40 30)" opacity="0.8" />
    <ellipse cx="40" cy="30" rx="10" ry="16" fill={color} transform="rotate(0 40 30)" />
    <circle cx="40" cy="28" r="9" fill={center} opacity="0.85" />
    <circle cx="40" cy="28" r="5" fill={color} opacity="0.7" />
  </svg>
);

const Daisy = ({ color = '#ffffff', center = '#D4AF37' }) => (
  <svg width="80" height="90" viewBox="0 0 80 90" fill="none">
    <path d="M40 90 Q39 70 40 52" stroke="#6B8F4E" strokeWidth="3" strokeLinecap="round" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <ellipse key={i} cx="40" cy="28" rx="6" ry="16" fill={color} stroke="#e5e7eb" strokeWidth="0.5"
        transform={`rotate(${angle} 40 28)`} opacity="0.95" />
    ))}
    <circle cx="40" cy="28" r="10" fill={center} />
    <circle cx="40" cy="28" r="6" fill="#FBBF24" opacity="0.7" />
  </svg>
);

const Tulip = ({ color = '#C084FC', center = '#7E22CE' }) => (
  <svg width="80" height="90" viewBox="0 0 80 90" fill="none">
    <path d="M40 90 Q38 72 40 52" stroke="#6B8F4E" strokeWidth="3" strokeLinecap="round" />
    <path d="M40 65 Q32 58 28 48" stroke="#6B8F4E" strokeWidth="2" strokeLinecap="round" />
    <path d="M28 22 Q40 12 52 22 Q56 42 40 52 Q24 42 28 22Z" fill={color} />
    <path d="M28 22 Q34 18 40 32 Q46 18 52 22" fill={center} opacity="0.4" />
    <ellipse cx="40" cy="36" rx="6" ry="14" fill={color} opacity="0.5" />
  </svg>
);

const Sunflower = () => (
  <svg width="80" height="90" viewBox="0 0 80 90" fill="none">
    <path d="M40 90 Q39 70 40 52" stroke="#6B8F4E" strokeWidth="3.5" strokeLinecap="round" />
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
      <ellipse key={i} cx="40" cy="26" rx="5" ry="14" fill="#FCD34D"
        transform={`rotate(${angle} 40 26)`} opacity="0.9" />
    ))}
    <circle cx="40" cy="26" r="13" fill="#92400E" />
    <circle cx="40" cy="26" r="9" fill="#78350F" />
    {[0, 45, 90, 135].map((a, i) => (
      <circle key={i} cx={40 + Math.cos(a * Math.PI / 180) * 4} cy={26 + Math.sin(a * Math.PI / 180) * 4}
        r="2" fill="#D97706" opacity="0.6" />
    ))}
  </svg>
);

const Cosmos = ({ color = '#F472B6' }) => (
  <svg width="80" height="90" viewBox="0 0 80 90" fill="none">
    <path d="M40 90 Q37 72 40 52" stroke="#6B8F4E" strokeWidth="2.5" strokeLinecap="round" />
    {[0, 51, 102, 153, 204, 255, 306].map((angle, i) => (
      <ellipse key={i} cx="40" cy="26" rx="7" ry="16" fill={color}
        transform={`rotate(${angle} 40 26)`} opacity="0.85" />
    ))}
    <circle cx="40" cy="26" r="8" fill="#FEF08A" />
    <circle cx="40" cy="26" r="4" fill="#D4AF37" opacity="0.8" />
  </svg>
);

const FLOWER_COMPONENTS = [
  { Component: Rose, props: { color: '#FBCFE8', center: '#9F1239' } },
  { Component: Daisy, props: { color: '#ffffff', center: '#D4AF37' } },
  { Component: Tulip, props: { color: '#C4B5FD', center: '#7C3AED' } },
  { Component: Sunflower, props: {} },
  { Component: Rose, props: { color: '#FCA5A5', center: '#DC2626' } },
  { Component: Cosmos, props: { color: '#F472B6' } },
  { Component: Daisy, props: { color: '#BAE6FD', center: '#0EA5E9' } },
  { Component: Tulip, props: { color: '#6EE7B7', center: '#059669' } },
];

export default function Flower({ index, memory }) {
  const [hovered, setHovered] = useState(false);
  const { Component, props } = FLOWER_COMPONENTS[index % FLOWER_COMPONENTS.length];

  // Random sway timing so flowers feel independent
  const swayDuration = 2.5 + (index * 0.4) % 2;
  const swayDelay = (index * 0.3) % 2;

  // Tooltip position — alternate left/right to avoid clipping
  const tooltipLeft = index % 2 === 0;

  return (
    <div
      className="relative flex flex-col items-center cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      role="button"
      aria-label={`Memory ${index + 1}`}
    >
      <motion.div
        animate={hovered
          ? { scale: 1.2, filter: 'drop-shadow(0 0 12px rgba(232,153,141,0.6))' }
          : { rotate: ['-4deg', '4deg', '-4deg'] }
        }
        transition={hovered
          ? { duration: 0.3, ease: 'easeOut' }
          : { duration: swayDuration, delay: swayDelay, repeat: Infinity, ease: 'easeInOut' }
        }
        style={{ transformOrigin: 'bottom center' }}
      >
        <Component {...props} />
      </motion.div>

      {/* Memory tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute z-20 w-56 rounded-xl px-5 py-4 pointer-events-none"
            style={{
              bottom: '95%',
              [tooltipLeft ? 'left' : 'right']: '-20px',
              background: 'linear-gradient(135deg, #FFFDF8, #FFF5EC)',
              boxShadow: '0 8px 30px rgba(232,153,141,0.3), 0 2px 8px rgba(0,0,0,0.06)',
              border: '1px solid rgba(232,153,141,0.25)',
            }}
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          >
            <p className="font-dancing text-base leading-snug text-center" style={{ color: '#5C2E2E' }}>
              {memory}
            </p>
            {/* Small arrow */}
            <div
              className="absolute w-3 h-3 rotate-45"
              style={{
                bottom: '-7px',
                [tooltipLeft ? 'left' : 'right']: '28px',
                background: '#FFF5EC',
                border: '1px solid rgba(232,153,141,0.25)',
                borderTop: 'none',
                borderLeft: 'none',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
