import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import FallingPetals from './FallingPetals';

const GoldLine = () => (
  <motion.div
    className="flex items-center gap-4 w-full max-w-sm"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5, delay: 2.8 }}
  >
    <motion.div
      className="flex-1 h-px"
      style={{ background: 'linear-gradient(to right, transparent, #D4AF37)' }}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.8, delay: 2.9, ease: 'easeOut' }}
    />
    <motion.div
      initial={{ scale: 0, rotate: -90 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', delay: 3.4, stiffness: 200 }}
    >
      <svg width="18" height="18" viewBox="0 0 16 16">
        <path d="M8 1 L9.5 6 L15 6 L10.5 9.5 L12 14.5 L8 11 L4 14.5 L5.5 9.5 L1 6 L6.5 6 Z" fill="#D4AF37" />
      </svg>
    </motion.div>
    <motion.div
      className="flex-1 h-px"
      style={{ background: 'linear-gradient(to left, transparent, #D4AF37)' }}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.8, delay: 2.9, ease: 'easeOut' }}
    />
  </motion.div>
);

export default function Intro() {
  const [visible, setVisible] = useState(true);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowButton(true), 5800);
    return () => clearTimeout(t);
  }, []);

  const handleEnter = () => setVisible(false);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center px-6 text-center"
          style={{
            zIndex: 100,
            background: 'linear-gradient(-45deg, #FFF8F3, #FFE4E6, #FBCFE8, #FDE8E8)',
            backgroundSize: '400% 400%',
          }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        >
          <FallingPetals count={20} />

          {/* Soft radial glow behind text */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255,255,255,0.5) 0%, transparent 100%)',
            }}
          />

          <div className="relative flex flex-col items-center gap-5">

            {/* "Happy" — slides up first */}
            <motion.p
              className="font-dancing"
              style={{ color: '#E8998D', fontSize: 'clamp(2rem, 6vw, 3.5rem)', letterSpacing: '0.05em' }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
            >
              Happy
            </motion.p>

            {/* "Mother's Day" — big centrepiece */}
            <motion.h1
              className="font-playfair leading-none"
              style={{
                color: '#881337',
                fontSize: 'clamp(3.2rem, 12vw, 8rem)',
                textShadow: '0 2px 30px rgba(136,19,55,0.15)',
                lineHeight: 1.05,
              }}
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
            >
              Mother's Day
            </motion.h1>

            {/* Gold divider */}
            <GoldLine />

            {/* Heart trio */}
            <motion.div
              className="flex items-center gap-3 mt-1"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', delay: 3.7, stiffness: 180, damping: 18 }}
            >
              <Heart size={18} fill="#FBCFE8" color="#FBCFE8" />
              <motion.div
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
              >
                <Heart size={26} fill="#E8998D" color="#E8998D" />
              </motion.div>
              <Heart size={18} fill="#FBCFE8" color="#FBCFE8" />
            </motion.div>

            {/* Tagline */}
            <motion.p
              className="font-dancing max-w-sm"
              style={{ color: '#5C2E2E', fontSize: 'clamp(1.3rem, 4vw, 2rem)', lineHeight: 1.5 }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 4.3, ease: 'easeOut' }}
            >
              Something made with love is waiting for you...
            </motion.p>

            {/* Anticipation hint */}
            <motion.p
              className="font-lato tracking-widest uppercase"
              style={{ color: '#E8998D', fontSize: '0.72rem', letterSpacing: '0.18em' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.7, 0.4, 0.7] }}
              transition={{ duration: 2.5, delay: 5.0, repeat: Infinity, ease: 'easeInOut' }}
            >
              a letter · reasons · memories · and more
            </motion.p>

            {/* Enter button */}
            <AnimatePresence>
              {showButton && (
                <motion.button
                  className="mt-4 px-10 py-4 rounded-full font-dancing outline-none focus:outline-none relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #881337, #9F1239)',
                    color: 'white',
                    fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
                    boxShadow: '0 4px 24px rgba(136,19,55,0.35), 0 0 40px rgba(136,19,55,0.15)',
                    border: '1px solid rgba(212,175,55,0.4)',
                  }}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                  whileHover={{ scale: 1.05, boxShadow: '0 6px 32px rgba(136,19,55,0.5), 0 0 50px rgba(136,19,55,0.2)' }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleEnter}
                >
                  {/* Shimmer sweep */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%)' }}
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
                  />
                  Open your gift 💌
                </motion.button>
              )}
            </AnimatePresence>

          </div>

          {/* Corner decorations */}
          {[
            { top: '12px', left: '16px', r: 0 },
            { top: '12px', right: '16px', r: 90 },
            { bottom: '12px', left: '16px', r: 270 },
            { bottom: '12px', right: '16px', r: 180 },
          ].map((pos, i) => (
            <motion.div
              key={i}
              className="absolute opacity-30"
              style={pos}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.3, scale: 1 }}
              transition={{ delay: 1.2 + i * 0.15 }}
            >
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none"
                style={{ transform: `rotate(${pos.r}deg)` }}>
                <path d="M4 4 Q4 28 28 28" stroke="#D4AF37" strokeWidth="1" fill="none" />
                <path d="M4 4 Q28 4 28 28" stroke="#D4AF37" strokeWidth="1" fill="none" />
                <circle cx="4" cy="4" r="3" fill="#D4AF37" />
                <circle cx="28" cy="28" r="2" fill="#E8998D" />
              </svg>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
