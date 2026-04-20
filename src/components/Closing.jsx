import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function Closing() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen py-24 px-4 text-center" style={{ zIndex: 1 }}>
      {/* Decorative line */}
      <motion.div
        className="w-48 h-px mb-16"
        style={{ background: 'linear-gradient(to right, transparent, #D4AF37, transparent)' }}
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      />

      <motion.h2
        className="font-playfair text-5xl md:text-7xl mb-6"
        style={{ color: '#881337' }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      >
        Happy Mother's Day
      </motion.h2>

      <motion.p
        className="font-dancing text-3xl md:text-4xl mb-16 max-w-xl leading-relaxed"
        style={{ color: '#5C2E2E' }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.3 }}
      >
        I love you more than these words could ever say.
      </motion.p>

      {/* Glowing heart */}
      <motion.div
        className="mb-10"
        animate={{
          scale: [1, 1.15, 1],
          filter: [
            'drop-shadow(0 0 12px rgba(232,153,141,0.4))',
            'drop-shadow(0 0 28px rgba(232,153,141,0.8))',
            'drop-shadow(0 0 12px rgba(232,153,141,0.4))',
          ],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <Heart size={72} fill="#E8998D" color="#E8998D" />
      </motion.div>

      <motion.p
        className="font-dancing text-2xl md:text-3xl"
        style={{ color: '#E8998D' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        — Your child, always 💕
      </motion.p>

      {/* Bottom gold line */}
      <motion.div
        className="w-32 h-px mt-16"
        style={{ background: 'linear-gradient(to right, transparent, #D4AF37, transparent)' }}
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.4 }}
      />
    </section>
  );
}
