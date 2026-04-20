import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useCallback } from 'react';
import { Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { reasons } from '../data/content';

const MILESTONES = { 10: '🌟 10 reasons already! Keep going...', 25: '✨ 25 reasons and counting...', 50: '💫 50 reasons! You mean the world.', 100: '🌸 100 reasons. Still not enough.' };

const FloatingHeart = ({ id, onDone }) => {
  const x = (Math.random() - 0.5) * 140;
  const size = 10 + Math.random() * 12;
  return (
    <motion.div
      key={id}
      className="absolute pointer-events-none"
      style={{ bottom: 0, left: '50%', x: -size / 2 }}
      initial={{ opacity: 1, y: 0, x }}
      animate={{ opacity: 0, y: -(80 + Math.random() * 100), x: x + (Math.random() - 0.5) * 60 }}
      transition={{ duration: 1.4 + Math.random() * 0.6, ease: 'easeOut' }}
      onAnimationComplete={onDone}
    >
      <Heart size={size} fill="#E8998D" color="#E8998D" />
    </motion.div>
  );
};

// Fisher-Yates shuffle
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function HeartButton() {
  const [count, setCount] = useState(0);
  const [currentReason, setCurrentReason] = useState(null);
  const [milestone, setMilestone] = useState(null);
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [heartAnim, setHeartAnim] = useState(false);
  const heartRef = useRef(null);
  const deckRef = useRef(shuffle(reasons));
  const indexRef = useRef(0);

  const fireConfetti = useCallback((big = false) => {
    if (!heartRef.current) return;
    const rect = heartRef.current.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    const burst = big ? 200 : 80;
    confetti({
      particleCount: burst,
      spread: big ? 90 : 60,
      origin: { x, y },
      colors: ['#FFE4E6', '#FBCFE8', '#F9A8D4', '#D4AF37', '#881337', '#ffffff'],
      scalar: big ? 1.2 : 0.9,
    });
  }, []);

  const handleClick = useCallback(() => {
    if (indexRef.current >= deckRef.current.length) {
      deckRef.current = shuffle(reasons);
      indexRef.current = 0;
    }
    const reason = deckRef.current[indexRef.current++];
    const newCount = count + 1;
    setCount(newCount);
    setCurrentReason(reason);

    // Squish animation
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 300);

    // Floating hearts
    const hearts = Array.from({ length: 5 + Math.floor(Math.random() * 4) }, (_, i) => Date.now() + i);
    setFloatingHearts(prev => [...prev, ...hearts]);

    // Confetti
    const isMilestone = MILESTONES[newCount];
    fireConfetti(!!isMilestone);

    // Milestone message
    if (isMilestone) {
      setMilestone(isMilestone);
      setTimeout(() => setMilestone(null), 3000);
    }
  }, [count, fireConfetti]);

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen py-24 px-4" style={{ zIndex: 1 }}>
      {/* Heading */}
      <motion.h2
        className="font-playfair text-3xl md:text-4xl text-center mb-4"
        style={{ color: '#881337' }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        One hundred reasons, and counting...
      </motion.h2>

      <motion.p
        className="font-dancing text-xl md:text-2xl mb-14 text-center"
        style={{ color: '#E8998D' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        Press for a reason I love you
      </motion.p>

      {/* Heart button */}
      <div className="relative flex flex-col items-center">
        <motion.button
          ref={heartRef}
          className="relative outline-none focus:outline-none rounded-full p-8 heart-cursor"
          style={{
            background: 'radial-gradient(circle at 40% 35%, #FBCFE8, #E8998D 60%, #C4756A)',
            boxShadow: '0 0 30px rgba(232,153,141,0.5), 0 0 60px rgba(232,153,141,0.25), 0 8px 32px rgba(0,0,0,0.1)',
          }}
          animate={heartAnim
            ? { scale: [0.88, 1.12, 1] }
            : { scale: [1, 1.08, 1] }
          }
          transition={heartAnim
            ? { duration: 0.3, ease: 'easeInOut' }
            : { duration: 2, repeat: Infinity, ease: 'easeInOut' }
          }
          onClick={handleClick}
          aria-label="Reveal a reason I love you"
          whileTap={{ scale: 0.88 }}
        >
          <Heart size={100} fill="white" color="white" strokeWidth={0} />
        </motion.button>

        {/* Floating hearts */}
        <div className="absolute inset-0 overflow-visible pointer-events-none">
          <AnimatePresence>
            {floatingHearts.map((id) => (
              <FloatingHeart
                key={id}
                id={id}
                onDone={() => setFloatingHearts(prev => prev.filter(h => h !== id))}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Counter */}
        <motion.p
          className="font-playfair text-lg mt-6"
          style={{ color: '#881337' }}
          key={count}
          initial={{ scale: 1.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {count === 0 ? 'Tap the heart...' : `${count} ${count === 1 ? 'reason' : 'reasons'} revealed`}
        </motion.p>
      </div>

      {/* Reason display */}
      <div className="relative mt-10 w-full max-w-lg min-h-28 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {currentReason && (
            <motion.div
              key={currentReason}
              className="w-full rounded-2xl px-8 py-6 text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(255,248,243,0.98), rgba(255,228,230,0.9))',
                boxShadow: '0 4px 20px rgba(232,153,141,0.2), 0 1px 4px rgba(0,0,0,0.05)',
                border: '1px solid rgba(232,153,141,0.25)',
              }}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <p className="font-dancing text-xl md:text-2xl leading-relaxed" style={{ color: '#5C2E2E' }}>
                "{currentReason}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Milestone toast */}
      <AnimatePresence>
        {milestone && (
          <motion.div
            className="fixed top-8 left-1/2 -translate-x-1/2 px-8 py-4 rounded-full font-dancing text-xl z-50 text-center"
            style={{
              background: 'linear-gradient(135deg, #881337, #9F1239)',
              color: 'white',
              boxShadow: '0 4px 20px rgba(136,19,55,0.4)',
            }}
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {milestone}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
