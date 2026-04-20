import { motion } from 'framer-motion';
import Flower from './Flower';
import { memories } from '../data/content';

export default function MemoryGarden() {
  return (
    <section className="relative py-24 px-4 min-h-screen flex flex-col items-center justify-center" style={{ zIndex: 1 }}>
      <motion.h2
        className="font-playfair text-3xl md:text-4xl text-center mb-4"
        style={{ color: '#881337' }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        A garden of little moments
      </motion.h2>

      <motion.p
        className="font-dancing text-xl md:text-2xl text-center mb-16"
        style={{ color: '#E8998D' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        Hover over each flower to remember...
      </motion.p>

      {/* Garden bed background */}
      <div
        className="relative w-full max-w-3xl rounded-3xl px-8 py-12"
        style={{
          background: 'linear-gradient(180deg, rgba(255,248,243,0.4) 0%, rgba(187,247,208,0.15) 100%)',
          border: '1px solid rgba(232,153,141,0.15)',
          boxShadow: 'inset 0 -4px 20px rgba(107,143,78,0.08)',
        }}
      >
        {/* Grass line at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-10 rounded-b-3xl"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(107,143,78,0.12))' }}
        />

        {/* Flowers grid — organic layout */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-8 justify-items-center">
          {memories.map((memory, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              style={{
                marginTop: [0, 20, -10, 15, 5, 25, -5, 10][i] || 0,
              }}
            >
              <Flower index={i} memory={memory} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
