import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Droplets, Sun, Wind, Sprout } from 'lucide-react';

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
    <section id="care" className="py-24 sm:py-32 bg-ngen-cream text-ngen-charcoal relative border-b border-black/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header (Clean New Engen Editorial Header) */}
        <div className="mb-14 sm:mb-16">
          <span className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-widest text-ngen-green block mb-3">
            Botanical Almanac &amp; Care Guidance
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-[-0.03em] text-ngen-charcoal leading-[1.05] mb-4">
            Plant Care &amp; Planter Wisdom
          </h2>
          <p className="text-ngen-charcoal/70 text-sm sm:text-base max-w-xl font-sans leading-relaxed">
            Practical, field-tested guidance to keep your houseplants and designer pots pristine in Kerala homes.
          </p>
        </div>

        {/* Divided List Accordion (Authentic New Engen Minimalist Architecture) */}
        <div className="divide-y divide-black/15 border-y border-black/15">
          {guideItems.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="transition-colors duration-200"
              >
                <button
                  onClick={() => setOpenId(isOpen ? '' : item.id)}
                  aria-expanded={isOpen}
                  className="w-full py-6 sm:py-7 text-left flex items-center justify-between gap-4 cursor-pointer select-none group"
                >
                  <span
                    className={`font-display font-bold text-xl sm:text-2xl tracking-tight transition-colors duration-300 ${
                      isOpen
                        ? 'text-ngen-green'
                        : 'text-ngen-charcoal group-hover:text-ngen-green'
                    }`}
                  >
                    {item.question}
                  </span>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
                      isOpen
                        ? 'text-ngen-green rotate-45'
                        : 'text-ngen-charcoal/40 group-hover:text-ngen-green group-hover:translate-x-1'
                    }`}
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-8 pt-2 text-sm text-ngen-charcoal/80 leading-relaxed font-sans max-w-3xl">
                        <p className="mb-4 text-base text-ngen-charcoal font-medium">{item.answer}</p>
                        <ul className="space-y-3 pl-2">
                          {item.bulletPoints.map((bp, i) => (
                            <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-ngen-charcoal/75">
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
