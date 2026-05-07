import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import confetti from 'canvas-confetti';
import BackgroundStars from './BackgroundStars';
import ShootingStar from './ShootingStar';
import WishStar from './WishStar';
import WishModal from './WishModal';
import { useWishes, findStarPosition } from '../hooks/useWishes';

// The exit vector in ShootingStar is x:240, y:-580.
// Comet trail rotation = atan2(580, 240) ≈ 67.5° from horizontal → rotate(-67.5deg)
const TRAIL_ANGLE = -67.5;

const MILESTONES = {
  3:  { msg: 'Your sky is starting to glow ✨',           bursts: [[65,  0.45]] },
  5:  { msg: 'Look at all this hope you carry 💫',         bursts: [[110, 0.4], [90, 0.55]] },
  10: {
    msg: 'Ten wishes, Mom. Each one is sacred to me. May the universe hear every single one.',
    bursts: [[150, 0.35], [130, 0.5], [110, 0.65]],
  },
};

const NEBULAE = [
  { left: '12%', top: '18%', w: '280px', h: '190px', color: 'rgba(170,95,215,0.06)'  },
  { left: '68%', top: '44%', w: '240px', h: '170px', color: 'rgba(210,95,155,0.05)'  },
  { left: '42%', top: '72%', w: '260px', h: '150px', color: 'rgba(95,75,210,0.05)'   },
];

export default function StarSky() {
  const { wishes, addWish, clearWishes } = useWishes();
  const reduced = useReducedMotion();

  const [modalOpen,        setModalOpen]        = useState(false);
  const [starVisible,      setStarVisible]      = useState(true);
  const [launchKey,        setLaunchKey]        = useState(0);
  const [isLaunching,      setIsLaunching]      = useState(false);
  const [landingPos,       setLandingPos]       = useState(null);
  const [milestoneMsg,     setMilestoneMsg]     = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Position of the shooting star button within the section (percent)
  const [starPos, setStarPos] = useState({ x: 50, y: 42 });

  const skyRef          = useRef(null);
  const starContainerRef = useRef(null);
  const milestoneTimer  = useRef(null);

  // Measure the shooting star's position relative to the sky section
  useEffect(() => {
    const measure = () => {
      if (!starContainerRef.current || !skyRef.current) return;
      const sR = skyRef.current.getBoundingClientRect();
      const bR = starContainerRef.current.getBoundingClientRect();
      if (!sR.width || !sR.height) return;
      setStarPos({
        x: ((bR.left + bR.width  / 2 - sR.left) / sR.width)  * 100,
        y: ((bR.top  + bR.height / 2 - sR.top)  / sR.height) * 100,
      });
    };
    const t = setTimeout(measure, 120); // wait for first paint
    window.addEventListener('resize', measure);
    return () => { clearTimeout(t); window.removeEventListener('resize', measure); };
  }, []);

  const fireConfetti = useCallback((count, fracY = 0.45) => {
    const rect = skyRef.current?.getBoundingClientRect();
    confetti({
      particleCount: count,
      spread: 72,
      origin: {
        x: rect ? (rect.left + rect.width  * 0.5)  / window.innerWidth  : 0.5,
        y: rect ? (rect.top  + rect.height * fracY) / window.innerHeight : 0.4,
      },
      colors: ['#FFD700', '#FFF4B0', '#ffffff', '#FFB347', '#D4AF37', '#FFF8F3'],
      scalar: 1.1, ticks: 220, gravity: 0.55,
    });
  }, []);

  const handleWishSubmit = useCallback((text) => {
    setModalOpen(false);

    const pos      = findStarPosition(wishes);  // Math.random OK in event handler
    const newCount = wishes.length + 1;

    // ── Launch sequence ──
    setStarVisible(false);
    setIsLaunching(true);

    // Star arrives at its destination after ~1.35 s of flight
    setTimeout(() => {
      addWish(text, pos.x, pos.y);   // wish star springs in
      setLandingPos({ x: pos.x, y: pos.y });
      fireConfetti(55, pos.y / 100 * 0.8); // sparkle at landing altitude
    }, 1350);

    // Clear landing flash after it's done
    setTimeout(() => setLandingPos(null), 2100);

    // Shooting star reappears
    setTimeout(() => {
      setIsLaunching(false);
      setStarVisible(true);
      setLaunchKey(k => k + 1);
    }, 2300);

    // ── Milestone ──
    if (MILESTONES[newCount]) {
      clearTimeout(milestoneTimer.current);
      setTimeout(() => {
        setMilestoneMsg(MILESTONES[newCount].msg);
        MILESTONES[newCount].bursts.forEach(([n, y], i) =>
          setTimeout(() => fireConfetti(n, y), i * 380)
        );
        milestoneTimer.current = setTimeout(() => setMilestoneMsg(null), 5500);
      }, 1600);
    }
  }, [wishes, addWish, fireConfetti]);

  const handleClearConfirmed = useCallback(() => {
    clearWishes();
    setShowClearConfirm(false);
  }, [clearWishes]);

  return (
    <section
      ref={skyRef}
      style={{
        position: 'relative',
        minHeight: '700px',
        overflow: 'hidden',
        background: 'linear-gradient(174deg, #1a1a3e 0%, #2d1b4e 52%, #4a2c5a 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0 20px 60px',
      }}
    >
      {/* ── Atmosphere ── */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:1,
        background:'radial-gradient(ellipse at 50% 50%, transparent 38%, rgba(8,6,22,0.6) 100%)' }} />
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:1,
        background:'linear-gradient(115deg, transparent 22%, rgba(155,115,200,0.07) 42%, rgba(245,175,215,0.05) 54%, transparent 72%)' }} />
      {NEBULAE.map((n, i) => (
        <div key={i} style={{
          position:'absolute', left:n.left, top:n.top,
          width:n.w, height:n.h,
          background:`radial-gradient(ellipse, ${n.color} 0%, transparent 70%)`,
          filter:'blur(14px)',
          transform:'translate(-50%,-50%)',
          pointerEvents:'none', zIndex:1,
          willChange: 'auto',
        }} />
      ))}

      {/* ── Background stars ── */}
      <div style={{ position:'absolute', inset:0, zIndex:2, pointerEvents:'none' }}>
        <BackgroundStars />
      </div>

      {/* ── Launch effects (comet trail + ring burst) ── */}
      <AnimatePresence>
        {isLaunching && !reduced && (
          <>
            {/* Expanding ring burst from star's starting position */}
            <motion.div
              key={`ring-${launchKey}`}
              initial={{ scale: 0.2, opacity: 1 }}
              animate={{ scale: 7,   opacity: 0 }}
              transition={{ duration: 0.75, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                left: `${starPos.x}%`, top: `${starPos.y}%`,
                width: '56px', height: '56px',
                marginLeft: '-28px', marginTop: '-28px',
                borderRadius: '50%',
                border: '2px solid rgba(255,215,0,0.9)',
                background: 'radial-gradient(circle, rgba(255,215,0,0.5) 0%, rgba(255,180,0,0.2) 50%, transparent 70%)',
                pointerEvents: 'none', zIndex: 15,
              }}
            />
            {/* Inner bright flash */}
            <motion.div
              key={`flash-${launchKey}`}
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: 3,   opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                left: `${starPos.x}%`, top: `${starPos.y}%`,
                width: '40px', height: '40px',
                marginLeft: '-20px', marginTop: '-20px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,250,210,0.95) 0%, rgba(255,215,0,0.6) 50%, transparent 75%)',
                pointerEvents: 'none', zIndex: 15,
              }}
            />
            {/* Comet streak — grows from star toward upper-right */}
            <motion.div
              key={`streak-${launchKey}`}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: [0, 1, 1, 0.7, 0] }}
              transition={{ duration: 1.65, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                left: `${starPos.x}%`, top: `${starPos.y}%`,
                width: '310px', height: '4px',
                background: 'linear-gradient(90deg, rgba(255,215,0,0.08) 0%, rgba(255,215,0,0.85) 38%, #FFF4B0 75%, rgba(255,255,255,0.7) 100%)',
                transformOrigin: 'left center',
                transform: `translateY(-50%) rotate(${TRAIL_ANGLE}deg)`,
                filter: 'blur(1.5px)',
                boxShadow: '0 0 12px rgba(255,215,0,0.65)',
                pointerEvents: 'none', zIndex: 14,
              }}
            />
            {/* Soft wide glow wake behind the trail */}
            <motion.div
              key={`wake-${launchKey}`}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: [0, 0.45, 0.4, 0] }}
              transition={{ duration: 1.65, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                left: `${starPos.x}%`, top: `${starPos.y}%`,
                width: '310px', height: '16px',
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,215,0,0.2) 40%, rgba(255,230,150,0.3) 100%)',
                transformOrigin: 'left center',
                transform: `translateY(-50%) rotate(${TRAIL_ANGLE}deg)`,
                filter: 'blur(6px)',
                pointerEvents: 'none', zIndex: 13,
              }}
            />
          </>
        )}
      </AnimatePresence>

      {/* ── Landing burst at wish star's destination ── */}
      <AnimatePresence>
        {landingPos && !reduced && (
          <>
            <motion.div
              key={`land-ring-${launchKey}`}
              initial={{ scale: 0.3, opacity: 1 }}
              animate={{ scale: 5.5, opacity: 0 }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                left: `${landingPos.x}%`, top: `${landingPos.y}%`,
                transform: 'translate(-50%, -50%)',
                width: '36px', height: '36px',
                borderRadius: '50%',
                border: '1.5px solid rgba(255,215,0,0.8)',
                background: 'radial-gradient(circle, rgba(255,248,200,0.9) 0%, rgba(255,215,0,0.4) 45%, transparent 70%)',
                pointerEvents: 'none', zIndex: 12,
              }}
            />
            <motion.div
              key={`land-glow-${launchKey}`}
              initial={{ scale: 0.5, opacity: 0.9 }}
              animate={{ scale: 4,   opacity: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.05 }}
              style={{
                position: 'absolute',
                left: `${landingPos.x}%`, top: `${landingPos.y}%`,
                transform: 'translate(-50%, -50%)',
                width: '50px', height: '50px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,215,0,0.55) 0%, transparent 65%)',
                filter: 'blur(4px)',
                pointerEvents: 'none', zIndex: 11,
              }}
            />
          </>
        )}
      </AnimatePresence>

      {/* ── Wish stars ── */}
      <AnimatePresence>
        {wishes.map((wish, i) => (
          <motion.div
            key={wish.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{   scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
              position: 'absolute',
              left: `${wish.x}%`, top: `${wish.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
            }}
          >
            <WishStar wish={wish} seed={i} />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* ── Main content ── */}
      <div style={{ position:'relative', zIndex:20, width:'100%', maxWidth:'560px', textAlign:'center' }}>
        <motion.h2
          initial={{ opacity:0, y:18 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }}
          transition={{ duration:0.8 }}
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(1.8rem, 5.5vw, 3rem)',
            color: '#FFF8F3',
            margin: '0 0 14px 0',
            paddingTop: 'clamp(48px, 8vw, 72px)',
            textShadow: '0 0 32px rgba(255,215,0,0.28)',
            letterSpacing: '0.01em',
          }}
        >
          Make a wish, Mom
        </motion.h2>

        <motion.p
          initial={{ opacity:0 }}
          whileInView={{ opacity:1 }}
          viewport={{ once:true }}
          transition={{ duration:0.8, delay:0.2 }}
          style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: 'clamp(1rem, 3.5vw, 1.38rem)',
            color: '#DDB8D8',
            margin: '0 0 8px 0',
          }}
        >
          This sky is yours — fill it with everything your heart hopes for
        </motion.p>

        <motion.p
          initial={{ opacity:0 }}
          whileInView={{ opacity:1 }}
          viewport={{ once:true }}
          transition={{ duration:0.8, delay:0.35 }}
          style={{
            fontStyle: 'italic',
            fontSize: 'clamp(0.78rem, 2.5vw, 0.85rem)',
            color: 'rgba(255,248,243,0.5)',
            margin: '0 0 28px 0',
          }}
        >
          Tap the shooting star to send a wish into the sky ✨
        </motion.p>

        {/* Shooting star button */}
        <div ref={starContainerRef}>
          <ShootingStar
            visible={starVisible}
            launchKey={launchKey}
            onClick={() => setModalOpen(true)}
          />
        </div>

        {/* Wish counter */}
        <AnimatePresence>
          {wishes.length > 0 && (
            <motion.p
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              style={{
                marginTop: '8px',
                fontSize: '0.78rem',
                color: 'rgba(255,248,243,0.38)',
                fontStyle: 'italic',
              }}
            >
              {wishes.length} {wishes.length === 1 ? 'wish' : 'wishes'} in your sky
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* ── Milestone message ── */}
      <AnimatePresence>
        {milestoneMsg && (
          <motion.div
            initial={{ opacity:0, y:22 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-14 }}
            transition={{ duration:0.55 }}
            style={{
              position:'relative', zIndex:20,
              marginTop: '28px',
              background: 'rgba(255,248,243,0.07)',
              border: '1px solid rgba(212,175,55,0.4)',
              borderRadius: '14px',
              padding: 'clamp(14px, 4vw, 20px) clamp(18px, 5vw, 28px)',
              maxWidth: '380px',
              width: '100%',
              textAlign: 'center',
              backdropFilter: 'blur(6px)',
            }}
          >
            <p style={{
              margin: 0,
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(0.86rem, 2.5vw, 1rem)',
              color: '#FFF8F3',
              fontStyle: 'italic',
              lineHeight: 1.65,
            }}>
              {milestoneMsg}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Clear sky ── */}
      <div style={{ position:'relative', zIndex:20, marginTop:'auto', paddingTop:'40px', textAlign:'center' }}>
        <AnimatePresence mode="wait">
          {showClearConfirm ? (
            <motion.div
              key="confirm"
              initial={{ opacity:0, y:10 }}
              animate={{ opacity:1, y:0 }}
              exit={{ opacity:0 }}
              style={{
                background: 'rgba(22,18,54,0.9)',
                border: '1px solid rgba(212,175,55,0.4)',
                borderRadius: '14px',
                padding: '18px 22px',
                textAlign: 'center',
                maxWidth: '300px',
                backdropFilter: 'blur(8px)',
              }}
            >
              <p style={{ color:'#FFF8F3', fontSize:'0.87rem', margin:'0 0 16px 0', lineHeight:1.55 }}>
                Are you sure? This will remove all your wishes.
              </p>
              <div style={{ display:'flex', gap:'10px', justifyContent:'center' }}>
                <button
                  onClick={handleClearConfirmed}
                  style={{ background:'rgba(232,153,141,0.28)', border:'1px solid #E8998D',
                    borderRadius:'8px', padding:'8px 18px', color:'#FFF8F3', fontSize:'0.82rem', cursor:'pointer' }}
                >Yes, clear it</button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  style={{ background:'rgba(212,175,55,0.18)', border:'1px solid rgba(212,175,55,0.5)',
                    borderRadius:'8px', padding:'8px 18px', color:'#FFF8F3', fontSize:'0.82rem', cursor:'pointer' }}
                >Keep them</button>
              </div>
            </motion.div>
          ) : wishes.length > 0 ? (
            <motion.button
              key="clear-btn"
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              onClick={() => setShowClearConfirm(true)}
              style={{
                background:'none', border:'none',
                color:'rgba(255,248,243,0.25)',
                fontSize:'0.72rem', cursor:'pointer',
                fontStyle:'italic', letterSpacing:'0.03em',
              }}
            >Clear my sky ↻</motion.button>
          ) : null}
        </AnimatePresence>
      </div>

      {/* ── Wish Modal ── */}
      <WishModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleWishSubmit}
      />
    </section>
  );
}
