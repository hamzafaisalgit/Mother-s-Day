import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

// 5-pointed star in 32×32 viewBox — rendered at 50×50 for bigger visual
const STAR_PATH = 'M16,4 L18.5,11.8 L26.5,11.8 L20.2,16.6 L22.7,24.4 L16,19.6 L9.3,24.4 L11.8,16.6 L5.5,11.8 L13.5,11.8 Z';

export default function ShootingStar({ visible, launchKey, onClick }) {
  const reduced = useReducedMotion();

  return (
    /* Fixed-height slot keeps layout stable during entry/exit */
    <div style={{ position: 'relative', height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <AnimatePresence>
        {visible && (
          <motion.div
            key={launchKey}
            /* Entry: soft spring up from below */
            initial={{ opacity: 0, scale: 0.35, y: 32 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            /* Exit = launch: shoots diagonally upper-right like a real comet */
            exit={reduced ? { opacity: 0, transition: { duration: 0.4 } } : {
              x: 240, y: -580,
              scale: [1, 1.4, 1.0, 0.55, 0.12],
              opacity: [1, 1, 1, 0.75, 0],
              transition: {
                duration: 1.55,
                ease: [0.12, 0, 0.65, 1],
                scale:   { times: [0, 0.05, 0.22, 0.65, 1] },
                opacity: { times: [0, 0.06, 0.60, 0.85, 1] },
              },
            }}
            transition={{ duration: 0.65, ease: 'backOut' }}
            onClick={onClick}
            role="button"
            aria-label="Tap to make a wish"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onClick?.()}
            style={{
              position: 'absolute',
              cursor: 'pointer',
              userSelect: 'none',
              WebkitTapHighlightColor: 'transparent',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              /* 90px padding = generous touch target on mobile */
              padding: '20px',
              outline: 'none',
            }}
            whileHover={reduced ? {} : { scale: 1.14 }}
            whileTap={{ scale: 0.88 }}
          >
            {/* Pulsing glow halo — larger to match bigger star */}
            <motion.div
              style={{
                position: 'absolute',
                inset: '-12px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,215,0,0.45) 0%, rgba(255,215,0,0.12) 55%, transparent 75%)',
                pointerEvents: 'none',
              }}
              animate={reduced ? {} : { scale: [1, 1.42, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Idle float wrapper — gentle drift while waiting */}
            <motion.div
              animate={reduced ? {} : { x: [0, 12, -7, 0], y: [0, -10, 6, 0] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
            >
              {/* Comet tail — trails to the left of the star */}
              <svg
                width={120} height={40}
                viewBox="0 0 120 40"
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  right: '100%', top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                }}
              >
                <defs>
                  <linearGradient id="tailA" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%"   stopColor="#FFD700" stopOpacity="0"    />
                    <stop offset="65%"  stopColor="#FFD700" stopOpacity="0.62" />
                    <stop offset="100%" stopColor="#FFF4B0" stopOpacity="0.88" />
                  </linearGradient>
                  <linearGradient id="tailB" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%"   stopColor="#FFD700" stopOpacity="0"   />
                    <stop offset="100%" stopColor="#FFD700" stopOpacity="0.28" />
                  </linearGradient>
                </defs>
                {/* Core bright streak */}
                <path d="M0,20 Q60,15 120,20" stroke="url(#tailA)" strokeWidth="2.5"  fill="none" strokeLinecap="round" />
                {/* Soft wide glow */}
                <path d="M15,20 Q68,16 120,20" stroke="url(#tailB)" strokeWidth="8"   fill="none" opacity="0.55" />
                {/* Fine upper wisp */}
                <path d="M35,20 Q78,18 120,19" stroke="url(#tailA)" strokeWidth="1"   fill="none" opacity="0.38" />
              </svg>

              {/* Star shape — 50×50 for clear visibility */}
              <svg width={50} height={50} viewBox="0 0 32 32" aria-hidden="true">
                <defs>
                  <radialGradient id="ssGrad" cx="50%" cy="30%" r="60%">
                    <stop offset="0%"   stopColor="white"   />
                    <stop offset="30%"  stopColor="#FFFBE0" />
                    <stop offset="70%"  stopColor="#FFD700" />
                    <stop offset="100%" stopColor="#FFAA22" />
                  </radialGradient>
                </defs>
                <path
                  d={STAR_PATH}
                  fill="url(#ssGrad)"
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(255,215,0,1)) drop-shadow(0 0 18px rgba(255,200,0,0.7)) drop-shadow(0 0 32px rgba(255,180,0,0.35))',
                  }}
                />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
