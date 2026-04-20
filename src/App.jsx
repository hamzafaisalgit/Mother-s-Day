import { useState, useRef } from 'react';
import Intro from './components/Intro';
import FallingPetals from './components/FallingPetals';
import Envelope from './components/Envelope';
import Letter from './components/Letter';
import HeartButton from './components/HeartButton';
import MemoryGarden from './components/MemoryGarden';
import Closing from './components/Closing';

export default function App() {
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const letterRef = useRef(null);

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
          <Letter visible={envelopeOpened} />
        </div>
        <HeartButton />
        <MemoryGarden />
        <Closing />
      </div>
    </>
  );
}
