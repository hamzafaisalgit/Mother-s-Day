import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Music, Volume2 } from 'lucide-react';

const STORAGE_KEY = 'mothers-day-music';
const TARGET_VOL  = 0.75;

export default function MusicToggle() {
  const reduced = useReducedMotion();

  const [isPlaying,       setIsPlaying]       = useState(false);
  const [showPrompt,      setShowPrompt]       = useState(false);
  const [promptGone,      setPromptGone]       = useState(false);
  const [isDesktop,       setIsDesktop]        = useState(() => window.innerWidth >= 1024);

  const audioRef   = useRef(null);
  const fadeRef    = useRef(null); // current setInterval id

  // Track desktop breakpoint for button sizing
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const btnSize  = isDesktop ? 70 : 56;
  const iconSize = isDesktop ? 26 : 22;

  // ── Fade helpers (all access via refs — stable across renders) ──

  const stopFade = () => {
    if (fadeRef.current) { clearInterval(fadeRef.current); fadeRef.current = null; }
  };

  const fadeIn = (duration = 1500) => {
    stopFade();
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0;
    const steps    = 30;
    const stepTime = duration / steps;
    const step     = TARGET_VOL / steps;
    fadeRef.current = setInterval(() => {
      if (!audioRef.current) { stopFade(); return; }
      const next = Math.min(audioRef.current.volume + step, TARGET_VOL);
      audioRef.current.volume = next;
      if (next >= TARGET_VOL) stopFade();
    }, stepTime);
  };

  const fadeOut = (duration = 1000) => {
    stopFade();
    const audio = audioRef.current;
    if (!audio) return;
    const startVol = Math.max(audio.volume, TARGET_VOL);
    const steps    = 20;
    const stepTime = duration / steps;
    const step     = startVol / steps;
    fadeRef.current = setInterval(() => {
      if (!audioRef.current) { stopFade(); return; }
      const next = Math.max(audioRef.current.volume - step, 0);
      audioRef.current.volume = next;
      if (next <= 0) {
        stopFade();
        audioRef.current.pause();
      }
    }, stepTime);
  };

  // ── On mount: restore preference + show prompt ──
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'on') {
      const audio = audioRef.current;
      if (audio) {
        audio.volume = 0;
        audio.play()
          .then(() => { fadeIn(); setIsPlaying(true); })
          .catch(() => { /* browser blocked autoplay — wait for user click */ });
      }
    }

    // Prompt: appears after 3 s, auto-dismisses after 6 more seconds
    const showTimer    = setTimeout(() => setShowPrompt(true),  3000);
    const dismissTimer = setTimeout(() => { setShowPrompt(false); setPromptGone(true); }, 9000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(dismissTimer);
      stopFade();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Tab visibility: pause / resume ──
  useEffect(() => {
    const handleVisibility = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (document.hidden) {
        if (!audio.paused) audio.pause();
      } else {
        if (localStorage.getItem(STORAGE_KEY) === 'on' && isPlaying) {
          audio.volume = 0;
          audio.play()
            .then(() => fadeIn(800))
            .catch(err => console.error('Audio play failed:', err));
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  // ── Toggle ──
  const handleToggle = () => {
    // Dismiss prompt immediately
    if (!promptGone) { setShowPrompt(false); setPromptGone(true); }

    if (!isPlaying) {
      localStorage.setItem(STORAGE_KEY, 'on');
      const audio = audioRef.current;
      if (audio) {
        audio.volume = 0;
        audio.play()
          .then(() => { fadeIn(1500); setIsPlaying(true); })
          .catch(err => console.error('Audio play failed:', err));
      }
    } else {
      localStorage.setItem(STORAGE_KEY, 'off');
      setIsPlaying(false);
      fadeOut(1000);
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/Song.mp3" loop preload="auto" />

      {/* ── Tooltip prompt — sits to the LEFT of the button, vertically centred ── */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            style={{
              position: 'fixed',
              /* Align vertical centre with button centre */
              bottom: `${24 + Math.round(btnSize / 2)}px`,
              transform: 'translateY(50%)',
              /* Gap of 12px from the button's left edge */
              right: `${24 + btnSize + 12}px`,
              zIndex: 999,
              background: '#FFF8F3',
              border: '1px solid rgba(212,175,55,0.45)',
              borderRadius: '14px',
              padding: '12px 18px',
              boxShadow: '0 6px 28px rgba(0,0,0,0.13)',
              pointerEvents: 'none',
              maxWidth: 'min(240px, calc(100vw - 120px))',
              whiteSpace: 'nowrap',
            }}
          >
            <p style={{
              margin: 0,
              fontFamily: "'Dancing Script', cursive",
              fontSize: 'clamp(1.05rem, 4vw, 1.2rem)',
              color: '#E8998D',
              lineHeight: 1.4,
            }}>
              Tap for a softer experience
            </p>
            {/* Arrow pointing RIGHT toward the button */}
            <div style={{
              position: 'absolute', right: '-8px', top: '50%',
              transform: 'translateY(-50%)',
              width: 0, height: 0,
              borderTop: '7px solid transparent',
              borderBottom: '7px solid transparent',
              borderLeft: '8px solid rgba(212,175,55,0.45)',
            }} />
            <div style={{
              position: 'absolute', right: '-6px', top: '50%',
              transform: 'translateY(-50%)',
              width: 0, height: 0,
              borderTop: '6px solid transparent',
              borderBottom: '6px solid transparent',
              borderLeft: '7px solid #FFF8F3',
            }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating button ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5, ease: 'backOut' }}
        style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000 }}
      >
        {/* Pulsing glow when playing */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              key="glow"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={reduced ? { opacity: 0.5 } : {
                opacity: [0.4, 0.8, 0.4],
                scale:   [1,   1.18, 1],
              }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute', inset: '-12px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(212,175,55,0.38) 0%, rgba(212,175,55,0.1) 55%, transparent 75%)',
                pointerEvents: 'none',
              }}
            />
          )}
        </AnimatePresence>

        <motion.button
          onClick={handleToggle}
          aria-label="Toggle background music"
          aria-pressed={isPlaying}
          whileHover={reduced ? {} : { scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{
            position: 'relative',
            width: `${btnSize}px`, height: `${btnSize}px`,
            borderRadius: '50%',
            background: '#FFF8F3',
            border: `1.5px solid ${isPlaying ? '#D4AF37' : 'rgba(212,175,55,0.55)'}`,
            boxShadow: isPlaying
              ? '0 4px 24px rgba(212,175,55,0.28), 0 1px 4px rgba(0,0,0,0.08)'
              : '0 4px 20px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.07)',
            backdropFilter: 'blur(8px)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            outline: 'none',
            WebkitTapHighlightColor: 'transparent',
            transition: 'border-color 0.3s, box-shadow 0.3s',
          }}
        >
          {isPlaying ? (
            <>
              <Volume2 size={isDesktop ? 22 : 18} color="#881337" strokeWidth={1.8} />
              {/* Equalizer bars */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: isDesktop ? '15px' : '12px' }}>
                {[0, 0.18, 0.36].map((delay, i) => (
                  <motion.div
                    key={i}
                    style={{
                      width: isDesktop ? '4px' : '3px', borderRadius: '2px',
                      background: '#D4AF37',
                      transformOrigin: 'bottom',
                    }}
                    initial={{ scaleY: 0.3, height: isDesktop ? '15px' : '12px' }}
                    animate={reduced ? { scaleY: 1 } : { scaleY: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 0.8, repeat: Infinity,
                      repeatType: 'reverse', ease: 'easeInOut', delay,
                    }}
                  />
                ))}
              </div>
            </>
          ) : (
            <Music size={iconSize} color="#E8998D" strokeWidth={1.8} />
          )}
        </motion.button>
      </motion.div>
    </>
  );
}
