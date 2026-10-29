import React from 'react';
import { motion } from 'framer-motion';

export const MarqueeStrip: React.FC = () => {
  const marqueeItems = [
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
    '4.7★ GOOGLE VERIFIED ATELIER',
    '•',
  ];

  return (
    <div className="py-3.5 bg-ngen-lime text-ngen-charcoal overflow-hidden select-none border-y border-ngen-charcoal/20 font-display font-black text-xs sm:text-sm tracking-wider uppercase">
      <div className="flex w-max">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, ease: 'linear', duration: 25 }}
          className="flex items-center gap-8 whitespace-nowrap pr-8"
        >
          {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, idx) => (
            <span
              key={idx}
              className={item === '•' ? 'text-ngen-charcoal/40' : 'text-ngen-charcoal'}
            >
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
