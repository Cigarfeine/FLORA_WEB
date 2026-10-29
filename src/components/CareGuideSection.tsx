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
      icon: <Droplets className="w-5 h-5 text-sky-700" />,
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
      icon: <Sun className="w-5 h-5 text-amber-600" />,
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
      icon: <Wind className="w-5 h-5 text-terracotta-600" />,
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
      icon: <Sprout className="w-5 h-5 text-emerald-700" />,
      answer: 'Dust accumulation blocks stomata and impairs photosynthesis. Keeping broad leaves clean ensures vibrant green shine and pest prevention.',
      bulletPoints: [
        'Wipe leaves monthly using a soft microfiber cloth dampened with plain lukewarm water.',
        'Add 2 drops of organic cold-pressed neem oil to water for natural insect and fungal repellent.',
        'Never use synthetic wax gloss sprays as they clog the plant respiratory pores.',
      ],
    },
  ];

  return (
    <section id="care" className="py-24 bg-sand-100/60 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-botanical-900/10 text-botanical-900 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-terracotta-600" />
            <span>Flora Botanical Almanac</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-botanical-950 mb-3">
            Plant Care & Planter Wisdom
          </h2>
          <p className="text-sand-700 text-sm sm:text-base max-w-lg mx-auto">
            Practical, field-tested guidance to keep your houseplants and designer pots pristine in Kerala homes.
          </p>
        </div>

        {/* Accordion Deck */}
        <div className="space-y-4">
          {guideItems.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-sand-200/90 overflow-hidden shadow-sm transition-all duration-200 hover:border-sand-300"
              >
                <button
                  onClick={() => setOpenId(isOpen ? '' : item.id)}
                  aria-expanded={isOpen}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-sand-100/80 border border-sand-200 flex-shrink-0">
                      {item.icon}
                    </div>
                    <span className="font-serif text-base sm:text-lg font-bold text-botanical-950">
                      {item.question}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-1 text-sand-500"
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
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-5 pb-6 sm:px-6 pt-0 border-t border-sand-100 text-sm text-sand-800 leading-relaxed">
                        <p className="mt-4 mb-4 text-sand-800 font-medium">{item.answer}</p>
                        <ul className="space-y-2.5 pl-2">
                          {item.bulletPoints.map((bp, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-sand-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-terracotta-500 mt-2 flex-shrink-0" />
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
