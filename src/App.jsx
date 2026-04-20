import { useState, useRef } from 'react';
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
    <div className="animated-bg relative">
      {/* Always-present falling petals */}
      <FallingPetals count={24} />

      {/* Section 1 — Envelope hero */}
      <Envelope onOpen={handleEnvelopeOpen} />

      {/* Section 2 — Letter */}
      <div ref={letterRef}>
        <Letter visible={envelopeOpened} />
      </div>

      {/* Section 3 — Heart button reasons */}
      <HeartButton />

      {/* Section 4 — Memory garden */}
      <MemoryGarden />

      {/* Section 5 — Closing */}
      <Closing />
    </div>
  );
}
