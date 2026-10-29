import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

interface WordProps {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}

const ScrubWord: React.FC<WordProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0.15, 1.0]);
  const y = useTransform(progress, range, [4, 0]);

  return (
    <span className="relative inline-block mr-[0.3em] my-[0.08em]">
      <motion.span style={{ opacity, y }} className="inline-block transition-colors">
        {children}
      </motion.span>
    </span>
  );
};

export const EditorialManifesto: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.3'],
  });

  const manifestoParagraph =
    "At Flora, we treat living horticulture as sculptural architecture. We believe every Kerala home, modern balcony, and boutique workspace deserves vessels crafted with timeless integrity, paired with healthy tropical foliage that purifies the air and calms the soul.";

  const words = manifestoParagraph.split(' ');

  return (
    <section
      ref={containerRef}
      className="py-28 sm:py-36 bg-ngen-cream text-ngen-charcoal border-b border-black/10 relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Eyebrow Label */}
        <div className="flex items-center justify-between pb-8 mb-10 border-b border-black/10">
          <span className="text-xs uppercase font-mono font-bold tracking-widest text-ngen-green">
            01 / PHILOSOPHY & BOTANICAL MANIFESTO
          </span>
          <span className="text-xs font-mono text-ngen-charcoal/60 uppercase">
            Nellikuzhi • Kerala
          </span>
        </div>

        {/* Large Scrubbing Text Reveal (New Engen style) */}
        <div className="max-w-5xl">
          <p className="font-display font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-[-0.03em] leading-[1.08] text-ngen-charcoal">
            {words.map((word, i) => {
              const start = i / words.length;
              const end = start + 1 / words.length;
              return (
                <ScrubWord key={i} progress={scrollYProgress} range={[start, end]}>
                  {word}
                </ScrubWord>
              );
            })}
          </p>
        </div>

        {/* Supporting Meta Metrics & Quote Attribution */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-16 pt-8 border-t border-black/10 items-end">
          <div className="md:col-span-7">
            <p className="text-sm sm:text-base text-ngen-charcoal/70 font-sans max-w-xl leading-relaxed">
              From hand-carved marble basins to acclimatized indoor Ficus and zero-maintenance silk botanicals, each piece is individually inspected for Kerala’s unique monsoon-to-summer climate.
            </p>
          </div>
          <div className="md:col-span-5 flex md:justify-end items-center gap-6 font-mono text-xs text-ngen-charcoal/70 uppercase">
            <div>
              <span className="block font-black text-lg text-ngen-charcoal">1,200+</span>
              <span>Living Vessels Placed</span>
            </div>
            <div className="w-[1px] h-8 bg-black/15" />
            <div>
              <span className="block font-black text-lg text-ngen-charcoal">100%</span>
              <span>Organic Potting Soil</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
