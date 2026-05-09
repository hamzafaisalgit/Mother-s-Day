import { useState, useRef, useEffect } from 'react';
import Intro from './components/Intro';
import FallingPetals from './components/FallingPetals';
import Envelope from './components/Envelope';
import Letter from './components/Letter';
import StarSky from './components/StarSky';
import MemoryGarden from './components/MemoryGarden';
import Closing from './components/Closing';
import MusicToggle from './components/MusicToggle';

export default function App() {
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [letterDone,     setLetterDone]     = useState(false);
  const letterRef = useRef(null);

  // Always start at the top — prevents browser scroll-position restore on refresh
  useEffect(() => {
    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    return () => { history.scrollRestoration = 'auto'; };
  }, []);

  // Scroll is locked in two phases:
  //   1. Until envelope is opened (intro + envelope sections)
  //   2. While letter is still typing (until onDone fires)
  const scrollLocked = !envelopeOpened || !letterDone;

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const preventTouch = (e) => e.preventDefault();

    if (scrollLocked) {
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
      document.addEventListener('touchmove', preventTouch, { passive: false });
    }

    return () => {
      html.style.overflow = '';
      body.style.overflow = '';
      document.removeEventListener('touchmove', preventTouch);
    };
  }, [scrollLocked]);

  const handleEnvelopeOpen = () => {
    setEnvelopeOpened(true);
    setTimeout(() => {
      letterRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <>
      {/* Intro is a fixed overlay — main content renders beneath it immediately */}
      <Intro />

      <div className="animated-bg relative">
        <FallingPetals count={24} />
        <Envelope onOpen={handleEnvelopeOpen} />
        <div ref={letterRef}>
          <Letter visible={envelopeOpened} onDone={() => setLetterDone(true)} />
        </div>
        <StarSky />
        <MemoryGarden />
        <Closing />
      </div>

      {/* Music toggle persists across all sections — fixed position */}
      <MusicToggle />
    </>
  );
}
