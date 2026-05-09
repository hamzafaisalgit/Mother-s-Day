import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

const STAR = 'M0,-10 L2.4,-3.4 L9.5,-3.1 L4.3,1.3 L5.9,8.5 L0,4.9 L-5.9,8.5 L-4.3,1.3 L-9.5,-3.1 L-2.4,-3.4 Z';
const STAR_INNER = 'M0,-7 L1.7,-2.4 L6.7,-2.2 L3,0.9 L4.1,5.9 L0,3.4 L-4.1,5.9 L-3,0.9 L-6.7,-2.2 L-1.7,-2.4 Z';

const TOOLTIP_W = 185;
const MARGIN    = 10;

export default function WishStar({ wish, seed = 0 }) {
  const [hovered,  setHovered]  = useState(false);
  const [tipStyle, setTipStyle] = useState({});
  const reduced      = useReducedMotion();
  const containerRef = useRef(null);
  const starRef      = useRef(null);
  const dismissRef   = useRef(null);
  const touchStart   = useRef(null);  // {x, y} of touchstart
  const touchMoved   = useRef(false); // true if finger scrolled

  // Dismiss on scroll or tap outside while tooltip is open
  useEffect(() => {
    if (!hovered) return;
    const dismiss = () => {
      clearTimeout(dismissRef.current);
      setHovered(false);
    };
    const onOutsideTouch = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) dismiss();
    };
    window.addEventListener('scroll', dismiss, { passive: true });
    document.addEventListener('mousedown', onOutsideTouch);
    document.addEventListener('touchstart', onOutsideTouch, { passive: true });
    return () => {
      window.removeEventListener('scroll', dismiss);
      document.removeEventListener('mousedown', onOutsideTouch);
      document.removeEventListener('touchstart', onOutsideTouch);
    };
  }, [hovered]);

  const duration = 2.8 + (seed * 0.41) % 1.4;
  const delay    = (seed * 0.33) % 2.2;

  // Compute fixed position so tooltip stays inside viewport regardless of star location
  const computeTip = () => {
    if (!starRef.current) return;
    const r  = starRef.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;

    // Horizontal: centre on star, then clamp to screen
    let left = cx - TOOLTIP_W / 2;
    left = Math.max(MARGIN, Math.min(left, window.innerWidth - TOOLTIP_W - MARGIN));

    // Arrow points back to where the star actually is
    const arrowLeft = Math.max(12, Math.min(cx - left, TOOLTIP_W - 12));

    // Vertical: show above star if it's in the lower half of the viewport
    const above = r.top > window.innerHeight * 0.5;

    setTipStyle({
      left,
      arrowLeft,
      above,
      ...(above ? { bottom: window.innerHeight - r.top + 12 } : { top: r.bottom + 12 }),
    });
  };

  const showTip = () => {
    computeTip();
    clearTimeout(dismissRef.current);
    setHovered(true);
  };
  const hideTip = () => {
    clearTimeout(dismissRef.current);
    setHovered(false);
  };

  // Touch: only open tooltip on a real tap, not while scrolling
  const handleTouchStart = (e) => {
    touchStart.current  = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    touchMoved.current  = false;
  };
  const handleTouchMove = (e) => {
    if (!touchStart.current) return;
    const dx = Math.abs(e.touches[0].clientX - touchStart.current.x);
    const dy = Math.abs(e.touches[0].clientY - touchStart.current.y);
    if (dx > 8 || dy > 8) touchMoved.current = true;
  };
  const handleTouchEnd = (e) => {
    if (touchMoved.current) return; // was a scroll — ignore
    e.preventDefault(); // block ghost-click only on real taps
    clearTimeout(dismissRef.current);
    if (hovered) {
      setHovered(false);
    } else {
      computeTip();
      setHovered(true);
      dismissRef.current = setTimeout(() => setHovered(false), 3000);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
      onFocus={showTip}
      onBlur={hideTip}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
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

      {/* Pulsing glow */}
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

      {/* Star SVG — ref used to measure position for fixed tooltip */}
      <motion.svg
        ref={starRef}
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

      {/* Tooltip — position:fixed so it's never clipped by overflow:hidden */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: tipStyle.above ? 6 : -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{   opacity: 0, y: tipStyle.above ? 6 : -6 }}
            transition={{ duration: 0.18 }}
            style={{
              position: 'fixed',
              left:   tipStyle.left,
              top:    tipStyle.top,
              bottom: tipStyle.bottom,
              width:  `${TOOLTIP_W}px`,
              background: '#FFF8F3',
              border: '1px solid rgba(212,175,55,0.65)',
              borderRadius: '10px',
              padding: '8px 14px',
              textAlign: 'center',
              pointerEvents: 'none',
              zIndex: 9999,
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

            {/* Arrow — points toward the star */}
            <div style={{
              position: 'absolute',
              left: `${tipStyle.arrowLeft}px`,
              transform: 'translateX(-50%)',
              width: 0, height: 0,
              borderLeft:  '5px solid transparent',
              borderRight: '5px solid transparent',
              ...(tipStyle.above
                ? { bottom: '-6px', borderTop:    '6px solid rgba(212,175,55,0.65)', borderBottom: 'none' }
                : { top:    '-6px', borderBottom: '6px solid rgba(212,175,55,0.65)', borderTop:    'none' }),
            }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
