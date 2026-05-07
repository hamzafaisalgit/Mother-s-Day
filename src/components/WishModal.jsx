import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { suggestedWishes } from '../data/content';

export default function WishModal({ isOpen, onClose, onSubmit }) {
  const [selected, setSelected]     = useState(null);  // index into suggestedWishes
  const [customText, setCustomText] = useState('');

  const handleSelectSuggestion = idx => {
    setSelected(idx);
    setCustomText('');
  };

  const handleCustomChange = e => {
    setCustomText(e.target.value);
    setSelected(null);
  };

  const handleSubmit = () => {
    const text = selected !== null ? suggestedWishes[selected] : customText.trim();
    if (!text) return;
    onSubmit(text);
    setSelected(null);
    setCustomText('');
  };

  const canSubmit = selected !== null || customText.trim().length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            background: 'rgba(8, 6, 28, 0.78)',
            backdropFilter: 'blur(8px)',
          }}
          onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ scale: 0.82, opacity: 0, y: 24 }}
            animate={{ scale: 1,    opacity: 1, y: 0  }}
            exit={{   scale: 0.9,   opacity: 0, y: 12 }}
            transition={{ type: 'spring', stiffness: 310, damping: 28 }}
            style={{
              background: '#FFF8F3',
              border: '2px solid #D4AF37',
              borderRadius: '22px',
              padding: '34px 28px 28px',
              width: '100%',
              maxWidth: '440px',
              position: 'relative',
              boxShadow: '0 24px 70px rgba(0,0,0,0.55)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            {/* Corner stars */}
            <span style={{ position: 'absolute', top: '16px', left: '18px', fontSize: '0.85rem', opacity: 0.4, pointerEvents: 'none' }}>✦</span>
            <span style={{ position: 'absolute', bottom: '16px', right: '48px', fontSize: '0.75rem', opacity: 0.35, pointerEvents: 'none' }}>✦</span>

            {/* Close */}
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                position: 'absolute', top: '14px', right: '16px',
                background: 'none', border: 'none',
                fontSize: '1.15rem', color: '#9D4B6A',
                cursor: 'pointer', padding: '4px 6px', lineHeight: 1,
              }}
            >✕</button>

            {/* Heading */}
            <h3 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '1.5rem',
              color: '#1a1a3e',
              margin: '0 0 8px 0',
              textAlign: 'center',
            }}>
              What do you wish for?
            </h3>

            <p style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: '1.05rem',
              color: '#9D4B6A',
              textAlign: 'center',
              margin: '0 0 22px 0',
            }}>
              Anything at all — big, small, silly, sacred
            </p>

            {/* Suggested wish pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '18px' }}>
              {suggestedWishes.map((wish, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectSuggestion(i)}
                  style={{
                    background: selected === i ? '#E8998D' : 'rgba(232,153,141,0.15)',
                    border: `1.5px solid ${selected === i ? '#E8998D' : 'rgba(232,153,141,0.45)'}`,
                    borderRadius: '24px',
                    padding: '7px 14px',
                    color: selected === i ? '#fff' : '#881337',
                    fontFamily: 'Lato, sans-serif',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    transition: 'all 0.18s',
                  }}
                >
                  {wish}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', color: '#B07080', fontSize: '0.78rem' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(176,112,128,0.28)' }} />
              <span>or write your own</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(176,112,128,0.28)' }} />
            </div>

            {/* Custom textarea */}
            <textarea
              value={customText}
              onChange={handleCustomChange}
              placeholder="Or type your own wish here..."
              maxLength={100}
              rows={3}
              inputMode="text"
              autoComplete="off"
              autoCorrect="on"
              style={{
                width: '100%',
                background: 'rgba(255,248,243,0.8)',
                border: `1.5px solid ${customText ? '#D4AF37' : 'rgba(212,175,55,0.35)'}`,
                borderRadius: '10px',
                padding: '10px 14px',
                fontFamily: "'Dancing Script', cursive",
                fontSize: '1rem',
                color: '#1a1a3e',
                resize: 'none',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
            />
            <div style={{ textAlign: 'right', fontSize: '0.73rem', color: '#B07080', marginTop: '4px' }}>
              {customText.length} / 100
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              style={{
                display: 'block',
                width: '100%',
                marginTop: '18px',
                background: canSubmit
                  ? 'linear-gradient(135deg, #C9A227 0%, #FFD700 50%, #D4AF37 100%)'
                  : '#ddd0b0',
                border: 'none',
                borderRadius: '12px',
                padding: '13px',
                color: canSubmit ? '#1a1a3e' : '#9a8860',
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '1rem',
                fontStyle: 'italic',
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                boxShadow: canSubmit ? '0 4px 20px rgba(212,175,55,0.5)' : 'none',
                transition: 'all 0.2s',
                letterSpacing: '0.02em',
              }}
            >
              Send to the sky ✨
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
