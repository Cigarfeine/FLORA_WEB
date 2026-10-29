import React from 'react';
import { motion } from 'framer-motion';

export const MarqueeStrip: React.FC = () => {
  const strip1 = [
    'SCULPTURAL CERAMIC & MARBLE POTS',
    '•',
    'ACCLIMATIZED KERALA TROPICAL FLORA',
    '•',
    'LIFELIKE SILK BOTANICALS',
    '•',
    'BESPOKE GREEN GIFT HAMPERS',
    '•',
    'DIRECT WHATSAPP INSTANT ORDERING',
    '•',
  ];

  const strip2 = [
    '4.7★ GOOGLE VERIFIED ATELIER',
    '—',
    'HAND-TURNED STONEWARE',
    '—',
    'ZERO WATERLOGGING DESIGNS',
    '—',
    'NELLIKUZHI SHOWROOM OPEN DAILY',
    '—',
    'WHITE-GLOVE KERALA DISPATCH',
    '—',
  ];

  return (
    <div className="select-none overflow-hidden border-y border-black/10">
      {/* Top Track (Lime Canvas, moves Left) */}
      <div className="py-3 bg-ngen-lime text-ngen-charcoal font-display font-black text-xs sm:text-sm tracking-widest uppercase flex w-max">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, ease: 'linear', duration: 28 }}
          className="flex items-center gap-8 whitespace-nowrap pr-8"
        >
          {[...strip1, ...strip1, ...strip1, ...strip1].map((item, idx) => (
            <span
              key={idx}
              className={item === '•' ? 'text-ngen-charcoal/40 font-mono' : 'text-ngen-charcoal'}
            >
              {item}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Bottom Track (Dark Green Canvas, moves Right) */}
      <div className="py-2.5 bg-ngen-green text-ngen-cream font-mono font-bold text-[11px] sm:text-xs tracking-widest uppercase flex w-max border-t border-white/10">
        <motion.div
          animate={{ x: ['-50%', '0%'] }}
          transition={{ repeat: Infinity, ease: 'linear', duration: 32 }}
          className="flex items-center gap-8 whitespace-nowrap pr-8"
        >
          {[...strip2, ...strip2, ...strip2, ...strip2].map((item, idx) => (
            <span
              key={idx}
              className={item === '—' ? 'text-ngen-lime font-bold' : 'text-ngen-cream/90'}
            >
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
