import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useState, useRef } from 'react';

const STAR = 'M0,-10 L2.4,-3.4 L9.5,-3.1 L4.3,1.3 L5.9,8.5 L0,4.9 L-5.9,8.5 L-4.3,1.3 L-9.5,-3.1 L-2.4,-3.4 Z';
const STAR_INNER = 'M0,-7 L1.7,-2.4 L6.7,-2.2 L3,0.9 L4.1,5.9 L0,3.4 L-4.1,5.9 L-3,0.9 L-6.7,-2.2 L-1.7,-2.4 Z';

export default function WishStar({ wish, seed = 0 }) {
  const [hovered, setHovered]   = useState(false);
  const reduced                 = useReducedMotion();
  const dismissRef              = useRef(null);

  const duration = 2.8 + (seed * 0.41) % 1.4;
  const delay    = (seed * 0.33) % 2.2;

  // ── Tooltip vertical direction ──
  const tooltipAbove = wish.y >= 42;

  // ── Tooltip horizontal anchor — keeps it inside the section on edge stars ──
  // Left strip stars (x < 25) → anchor tooltip to the left of the star
  // Right strip stars (x > 75) → anchor tooltip to the right of the star
  // Centre stars → centred as normal
  const anchor = wish.x < 25 ? 'left' : wish.x > 75 ? 'right' : 'center';

  const tooltipHoriz =
    anchor === 'left'  ? { left: '-6px',             transform: 'none' } :
    anchor === 'right' ? { right: '-6px', left: 'auto', transform: 'none' } :
                         { left: '50%',  transform: 'translateX(-50%)' };

  const arrowHoriz =
    anchor === 'left'  ? { left: '14px',              transform: 'none' } :
    anchor === 'right' ? { right: '14px', left: 'auto', transform: 'none' } :
                         { left: '50%',  transform: 'translateX(-50%)' };

  // ── Touch: tap to show, auto-dismiss after 3 s ──
  const handleTouchStart = (e) => {
    e.preventDefault(); // stops ghost-click delay on mobile
    clearTimeout(dismissRef.current);
    setHovered(h => {
      if (h) return false; // second tap hides
      dismissRef.current = setTimeout(() => setHovered(false), 3000);
      return true;
    });
  };

  const showTooltip = () => {
    clearTimeout(dismissRef.current);
    setHovered(true);
  };
  const hideTooltip = () => {
    clearTimeout(dismissRef.current);
    setHovered(false);
  };

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      onTouchStart={handleTouchStart}
      tabIndex={0}
      aria-label={`Wish: ${wish.text}`}
      role="button"
    >
      {/* 48 × 48 touch target */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '48px', height: '48px',
      }} />

      {/* Pulsing glow halo */}
      <motion.div
        style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '44px', height: '44px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,215,0,0.42) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
        animate={reduced ? {} : { scale: [1, 1.45, 1], opacity: [0.45, 0.9, 0.45] }}
        transition={{ duration, repeat: Infinity, delay, ease: 'easeInOut' }}
      />

      {/* Star shape */}
      <motion.svg
        width={22} height={22}
        viewBox="-13 -13 26 26"
        style={{ display: 'block', filter: 'drop-shadow(0 0 6px rgba(255,215,0,0.85))' }}
        animate={reduced ? {} : { scale: [1, 1.13, 1] }}
        transition={{ duration, repeat: Infinity, delay, ease: 'easeInOut' }}
        whileHover={{ scale: 1.3 }}
        whileTap={{ scale: 1.2 }}
      >
        <path d={STAR}       fill="#FFD700" />
        <path d={STAR_INNER} fill="#FFF4B0" opacity={0.65} />
      </motion.svg>

      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: tooltipAbove ? 6 : -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{   opacity: 0, y: tooltipAbove ? 6 : -6 }}
            transition={{ duration: 0.18 }}
            style={{
              position: 'absolute',
              ...(tooltipAbove
                ? { bottom: 'calc(100% + 12px)' }
                : { top:    'calc(100% + 12px)' }),
              ...tooltipHoriz,
              background: '#FFF8F3',
              border: '1px solid rgba(212,175,55,0.65)',
              borderRadius: '10px',
              padding: '8px 14px',
              width: 'max-content',
              maxWidth: '185px',
              whiteSpace: 'normal',
              textAlign: 'center',
              pointerEvents: 'none',
              zIndex: 50,
              boxShadow: '0 4px 20px rgba(0,0,0,0.45)',
            }}
          >
            <p style={{
              margin: 0,
              fontFamily: "'Dancing Script', cursive",
              fontSize: '0.92rem',
              color: '#881337',
              lineHeight: 1.45,
            }}>
              {wish.text}
            </p>
            {/* Arrow */}
            <div style={{
              position: 'absolute',
              ...(tooltipAbove
                ? { bottom: '-6px', borderTop: '6px solid rgba(212,175,55,0.65)', borderBottom: 'none' }
                : { top:    '-6px', borderBottom: '6px solid rgba(212,175,55,0.65)', borderTop: 'none' }),
              ...arrowHoriz,
              width: 0, height: 0,
              borderLeft:  '5px solid transparent',
              borderRight: '5px solid transparent',
            }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
