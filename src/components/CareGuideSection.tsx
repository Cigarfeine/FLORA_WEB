import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Droplets, Sun, Wind, Sparkles, Sprout } from 'lucide-react';

interface GuideItem {
  id: string;
  question: string;
  icon: React.ReactNode;
  answer: string;
  bulletPoints: string[];
}

export const CareGuideSection: React.FC = () => {
  const [openId, setOpenId] = useState<string>('watering');

  const guideItems: GuideItem[] = [
    {
      id: 'watering',
      question: 'Watering Guidelines for Kerala Tropical Climates',
      icon: <Droplets className="w-4 h-4 text-sky-600" />,
      answer: 'Kerala experiences heavy monsoon humidity followed by intense sunny spells. Never water indoor plants on a rigid calendar schedule. Instead, test the soil with your index finger.',
      bulletPoints: [
        'Insert your finger 2 inches into the soil. If it feels cool and damp, delay watering.',
        'During June-September monsoon months, reduce watering frequency by 40% as ambient humidity is high.',
        'Always empty the catchment tray 15 minutes after watering so roots do not stand in stagnant water.',
      ],
    },
    {
      id: 'sunlight',
      question: 'Mastering Light: Direct Sun vs Filtered Bright Light',
      icon: <Sun className="w-4 h-4 text-amber-500" />,
      answer: 'Most indoor foliage plants (Monstera, Fiddle Leaf, Peace Lily) originate in tropical forest canopies and despise harsh direct midday sun which scorches leaves.',
      bulletPoints: [
        'Place plants 3 to 6 feet away from east-facing or south-facing windows with sheer curtains.',
        'Snake Plants and ZZ plants can tolerate low-light interior corridors, bathrooms, and air-conditioned bedrooms.',
        'Rotate your pot 90 degrees every fortnight so foliage grows uniformly without bending.',
      ],
    },
    {
      id: 'potting',
      question: 'Choosing the Right Planter: Ceramic, Fiber or Polymer?',
      icon: <Wind className="w-4 h-4 text-ngen-peach" />,
      answer: 'Every pot material in our store is selected for specific indoor lifestyle needs and aesthetic durability.',
      bulletPoints: [
        'Natural Terracotta: Porous walls allow maximum root breathing, ideal for succulents and overwaterers.',
        'Jaguar Marble & Polymer: Durable, lightweight, UV-resistant, and paired with matching saucers for spotless wooden and tile floors.',
        'Fiberglass Urns: Best for tall statement trees (Fiddle Leaf, Palms) as they offer grand architectural scale without backbreaking weight.',
      ],
    },
    {
      id: 'cleaning',
      question: 'Dust Prevention & Natural Leaf Polish Routine',
      icon: <Sprout className="w-4 h-4 text-emerald-600" />,
      answer: 'Dust accumulation blocks stomata and impairs photosynthesis. Keeping broad leaves clean ensures vibrant green shine and pest prevention.',
      bulletPoints: [
        'Wipe leaves monthly using a soft microfiber cloth dampened with plain lukewarm water.',
        'Add 2 drops of organic cold-pressed neem oil to water for natural insect and fungal repellent.',
        'Never use synthetic wax gloss sprays as they clog the plant respiratory pores.',
      ],
    },
  ];

  return (
    <section id="care" className="py-24 bg-ngen-cream text-ngen-charcoal relative border-b border-ngen-charcoal/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ngen-green text-ngen-cream font-mono text-[11px] font-bold uppercase tracking-wider mb-4 border border-ngen-green">
            <Sparkles className="w-3.5 h-3.5 text-ngen-lime" />
            <span>Flora Botanical Almanac</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-[-0.03em] text-ngen-charcoal leading-[0.95] mb-3">
            PLANT CARE &<br />PLANTER WISDOM
          </h2>
          <p className="text-ngen-charcoal/70 text-sm sm:text-base max-w-lg mx-auto font-sans">
            Practical, field-tested guidance to keep your houseplants and designer pots pristine in Kerala homes.
          </p>
        </div>

        {/* Accordion Deck - Flat Architectural Cards */}
        <div className="space-y-3">
          {guideItems.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-ngen-charcoal/10 overflow-hidden transition-colors hover:border-ngen-charcoal/30"
              >
                <button
                  onClick={() => setOpenId(isOpen ? '' : item.id)}
                  aria-expanded={isOpen}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-xl bg-ngen-cream border border-ngen-charcoal/10 flex-shrink-0">
                      {item.icon}
                    </div>
                    <span className="font-display font-black text-sm sm:text-base uppercase tracking-tight text-ngen-charcoal">
                      {item.question}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-1 text-ngen-charcoal/60"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
                    >
                      <div className="px-5 pb-6 sm:px-6 pt-0 border-t border-ngen-charcoal/10 text-sm text-ngen-charcoal/80 leading-relaxed font-sans">
                        <p className="mt-4 mb-4 text-ngen-charcoal font-medium">{item.answer}</p>
                        <ul className="space-y-2.5 pl-1">
                          {item.bulletPoints.map((bp, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-ngen-charcoal/70">
                              <span className="w-1.5 h-1.5 rounded-full bg-ngen-green mt-2 flex-shrink-0" />
                              <span>{bp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
