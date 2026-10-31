import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface PreloaderProps {
  onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Quick, elegant 380ms intro mask reveal matching New Engen .js-t-mask
    const timer = setTimeout(() => {
      setIsDone(true);
      if (onComplete) onComplete();
    }, 400);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="preloader-curtain"
          initial={{ y: '0%' }}
          exit={{
            y: '-100%',
            transition: {
              duration: 0.6,
              ease: [0.19, 1, 0.22, 1],
            },
          }}
          className="fixed inset-0 z-[99999] bg-ngen-green text-ngen-cream flex flex-col justify-between p-8 sm:p-12 md:p-16 select-none pointer-events-none"
        >
          {/* Top Bar: Brand Coordinates */}
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-ngen-cream/60">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-ngen-lime" />
              FLORA BOTANICAL ATELIER
            </span>
            <span>NELLIKUZHI, KERALA</span>
          </div>

          {/* Center Stage: Monogram & Kinetic Wordmark */}
          <div className="flex flex-col items-center justify-center my-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center mb-5 bg-white/5">
                <svg
                  className="w-7 h-7 text-ngen-lime"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                </svg>
              </div>

              <div className="font-display font-black text-4xl sm:text-6xl md:text-7xl tracking-[-0.04em] text-white uppercase leading-none mb-3">
                FLORA
              </div>

              <p className="font-mono text-xs uppercase tracking-widest text-ngen-peach">
                POTS • PLANTS • LIVING ARCHITECTURE
              </p>
            </motion.div>
          </div>

          {/* Bottom Bar: Loading Status */}
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-ngen-cream/60 border-t border-white/10 pt-4">
            <span>ENTRANCE CHOREOGRAPHY</span>
            <span className="text-ngen-lime font-bold">READY</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
