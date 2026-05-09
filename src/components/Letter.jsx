import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { TypeAnimation } from 'react-type-animation';

const FlowerCorner = ({ flip }) => (
  <svg
    width="70" height="70" viewBox="0 0 70 70" fill="none"
    style={{ transform: flip ? 'scaleX(-1)' : undefined }}
  >
    <circle cx="15" cy="15" r="6" fill="#FBCFE8" opacity="0.8" />
    <circle cx="28" cy="10" r="4.5" fill="#F9A8D4" opacity="0.7" />
    <circle cx="10" cy="28" r="4.5" fill="#F9A8D4" opacity="0.7" />
    <circle cx="15" cy="15" r="3" fill="#881337" opacity="0.5" />
    <path d="M22 22 Q35 28 45 20" stroke="#E8998D" strokeWidth="1" fill="none" opacity="0.5" />
    <path d="M22 22 Q28 35 20 45" stroke="#E8998D" strokeWidth="1" fill="none" opacity="0.5" />
    <circle cx="46" cy="19" r="3" fill="#FBCFE8" opacity="0.6" />
    <circle cx="19" cy="46" r="3" fill="#FBCFE8" opacity="0.6" />
  </svg>
);

const LETTER_SEQUENCE = [
  'Dear Mom,', 600,
  'Dear Mom,\n\nHappy Mother\'s Day.', 500,
  'Dear Mom,\n\nHappy Mother\'s Day.\n\nBefore you scroll any further, I want you\nto pause for just a moment, and feel how\ndeeply loved you are.', 400,
  `Dear Mom,\n\nHappy Mother's Day.\n\nBefore you scroll any further, I want you\nto pause for just a moment, and feel how\ndeeply loved you are.\n\nYou're the quiet strength behind everything\ngood in my life. The warmth in every memory.\nThe reason I know what love looks like.`, 400,
  `Dear Mom,\n\nHappy Mother's Day.\n\nBefore you scroll any further, I want you\nto pause for just a moment, and feel how\ndeeply loved you are.\n\nYou're the quiet strength behind everything\ngood in my life. The warmth in every memory.\nThe reason I know what love looks like.\n\nThis little page is my way of saying what\nwords alone never quite capture.\n\nWith all my heart,\nYour child 💕`, 1000,
];

export default function Letter({ visible, onDone }) {
  const ref        = useRef(null);
  const sentinelRef = useRef(null);
  const isInView   = useInView(ref, { once: true, margin: '-100px' });
  const [done, setDone] = useState(false);

  const shouldType = visible && isInView;

  // Auto-scroll during typing so new lines stay visible.
  // Uses window.scrollBy which works even while overflow:hidden is active.
  // Margin is 12% of viewport so it feels right on all screen sizes.
  useEffect(() => {
    if (!shouldType || done) return;
    const tick = () => {
      if (!sentinelRef.current) return;
      const margin = window.innerHeight * 0.12;
      const gap = sentinelRef.current.getBoundingClientRect().bottom - (window.innerHeight - margin);
      if (gap > 0) window.scrollBy({ top: gap, behavior: 'smooth' });
    };
    const id = setInterval(tick, 350);
    return () => clearInterval(id);
  }, [shouldType, done]);

  // When typing finishes:
  //   Step 1 — scroll signature fully into view
  //   Step 2 — teaser nudge (15% of vh) to show there's more below
  //   Step 3 — THEN unlock scroll so user can't scroll past us before the tease
  useEffect(() => {
    if (!done) return;

    const margin  = window.innerHeight * 0.1;
    const gap = sentinelRef.current
      ? sentinelRef.current.getBoundingClientRect().bottom - (window.innerHeight - margin)
      : 0;
    if (gap > 0) window.scrollBy({ top: gap, behavior: 'smooth' });

    // Teaser: nudge immediately after letter ends
    const tTeaser = setTimeout(() => {
      window.scrollBy({ top: Math.round(window.innerHeight * 0.20), behavior: 'smooth' });
    }, 20);

    // Unlock scroll just after the teaser nudge completes
    const tUnlock = setTimeout(() => {
      onDone?.();
    }, 100);

    return () => {
      clearTimeout(tTeaser);
      clearTimeout(tUnlock);
    };
  }, [done]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section
      id="letter"
      ref={ref}
      className="relative flex items-center justify-center min-h-screen py-20 px-4"
      style={{ zIndex: 1 }}
    >
      <motion.div
        className="relative w-full max-w-2xl"
        initial={{ opacity: 0, y: 60, rotateX: 8 }}
        animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Paper card */}
        <div
          className="paper-texture relative rounded-2xl px-10 py-12 md:px-16 md:py-16"
          style={{
            boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 10px 30px rgba(232,153,141,0.15), 0 30px 60px rgba(232,153,141,0.08)',
            border: '1px solid rgba(232,153,141,0.2)',
          }}
        >
          {/* Corner flowers */}
          <div className="absolute top-4 left-4 opacity-60"><FlowerCorner /></div>
          <div className="absolute top-4 right-4 opacity-60"><FlowerCorner flip /></div>
          <div className="absolute bottom-4 left-4 opacity-60" style={{ transform: 'scaleY(-1)' }}><FlowerCorner /></div>
          <div className="absolute bottom-4 right-4 opacity-60" style={{ transform: 'scale(-1,-1)' }}><FlowerCorner /></div>

          {/* Decorative top line */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #E8998D, transparent)' }} />
            <svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 1 L9.5 6 L15 6 L10.5 9.5 L12 14.5 L8 11 L4 14.5 L5.5 9.5 L1 6 L6.5 6 Z" fill="#D4AF37" /></svg>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #E8998D, transparent)' }} />
          </div>

          {/* Letter text */}
          <div className="font-dancing text-[1.45rem] md:text-[1.75rem] leading-loose" style={{ color: '#5C2E2E', minHeight: '300px' }}>
            {shouldType ? (
              <TypeAnimation
                sequence={[
                  ...LETTER_SEQUENCE,
                  () => setDone(true),
                ]}
                speed={65}
                style={{ whiteSpace: 'pre-line', display: 'block' }}
                cursor={!done}
              />
            ) : null}
            {/* Scroll target — tracks the bottom of typed text */}
            <div ref={sentinelRef} />
          </div>

          {/* Divider */}
          <div className="mt-8 flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #E8998D, transparent)' }} />
            <svg width="14" height="14" viewBox="0 0 16 16"><path d="M8 1 L9.5 6 L15 6 L10.5 9.5 L12 14.5 L8 11 L4 14.5 L5.5 9.5 L1 6 L6.5 6 Z" fill="#D4AF37" /></svg>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #E8998D, transparent)' }} />
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0, y: 8 }}
          animate={done ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.p
            className="font-dancing text-center"
            style={{
              color: '#C8546A',
              fontSize: 'clamp(1.4rem, 4vw, 1.8rem)',
              letterSpacing: '0.02em',
            }}
            animate={done ? { y: [0, 7, 0] } : {}}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          >
            scroll for more ↓
          </motion.p>
        </motion.div>
      </motion.div>
    </section>
  );
}
