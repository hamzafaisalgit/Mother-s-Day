import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const WaxSeal = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
    <circle cx="32" cy="32" r="28" fill="#881337" />
    <circle cx="32" cy="32" r="24" fill="#9F1239" />
    <path
      d="M32 18 L35 27 L44 27 L37 33 L40 42 L32 36 L24 42 L27 33 L20 27 L29 27 Z"
      fill="#FFE4E6"
      opacity="0.9"
    />
    <circle cx="32" cy="32" r="28" stroke="#D4AF37" strokeWidth="2" fill="none" />
    <circle cx="32" cy="32" r="22" stroke="#D4AF37" strokeWidth="0.5" fill="none" strokeDasharray="3 3" />
  </svg>
);

const EnvelopeSVG = ({ isOpen }) => (
  <svg width="340" height="240" viewBox="0 0 340 240" fill="none">
    {/* Envelope body */}
    <rect x="10" y="60" width="320" height="170" rx="6" fill="#FFF8F3" stroke="#E8998D" strokeWidth="1.5" />

    {/* Bottom triangle flap */}
    <path d="M10 230 L170 140 L330 230" fill="#FFE4E6" stroke="#E8998D" strokeWidth="1" />

    {/* Side triangles */}
    <path d="M10 60 L170 150 L10 230" fill="#FBCFE8" opacity="0.6" />
    <path d="M330 60 L170 150 L330 230" fill="#FBCFE8" opacity="0.6" />

    {/* Top flap */}
    <motion.path
      d="M10 60 L170 155 L330 60"
      fill="#FFE4E6"
      stroke="#E8998D"
      strokeWidth="1.5"
      animate={isOpen ? { d: "M10 60 L170 -10 L330 60", fill: "#FBCFE8" } : {}}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    />

    {/* Decorative lines on envelope */}
    <line x1="80" y1="145" x2="260" y2="145" stroke="#E8998D" strokeWidth="0.5" opacity="0.4" strokeDasharray="4 4" />
    <line x1="80" y1="165" x2="260" y2="165" stroke="#E8998D" strokeWidth="0.5" opacity="0.4" strokeDasharray="4 4" />
  </svg>
);

export default function Envelope({ onOpen }) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    if (clicked) return;
    setClicked(true);
    setTimeout(() => onOpen(), 1200);
  };

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-4" style={{ zIndex: 1 }}>
      {/* Heading */}
      <motion.p
        className="font-dancing text-3xl md:text-4xl mb-10 text-center"
        style={{ color: '#881337' }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
      >
        A letter for you, Mom
      </motion.p>

      {/* Envelope container */}
      <motion.div
        className="relative cursor-pointer select-none"
        animate={clicked ? {} : { y: [0, -12, 0] }}
        transition={clicked ? {} : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.04 }}
        onClick={handleClick}
        style={{ filter: 'drop-shadow(0 12px 32px rgba(232,153,141,0.4))' }}
      >
        {/* Glow ring */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: 'radial-gradient(ellipse, rgba(232,153,141,0.3) 0%, transparent 70%)', transform: 'scale(1.15)' }}
        />

        <motion.div
          animate={clicked ? { rotateY: [0, 15, 0], scale: [1, 1.1, 0.8], opacity: [1, 1, 0] } : {}}
          transition={{ duration: 1.1, ease: 'easeInOut' }}
        >
          <EnvelopeSVG isOpen={clicked} />
        </motion.div>

        {/* Wax seal */}
        <AnimatePresence>
          {!clicked && (
            <motion.div
              className="absolute"
              style={{ bottom: '54px', left: '50%', transform: 'translateX(-50%)' }}
              exit={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <WaxSeal />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Pulse text */}
      <AnimatePresence>
        {!clicked && (
          <motion.p
            className="font-dancing text-xl md:text-2xl mt-8 text-center"
            style={{ color: '#E8998D' }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            exit={{ opacity: 0 }}
          >
            Click to open 💌
          </motion.p>
        )}
      </AnimatePresence>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        animate={{ y: [0, 8, 0], opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="font-lato text-xs tracking-widest uppercase" style={{ color: '#E8998D' }}>Scroll</span>
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
          <path d="M8 0 L8 20 M2 14 L8 20 L14 14" stroke="#E8998D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </section>
  );
}
