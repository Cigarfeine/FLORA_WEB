import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShieldCheck, MapPin, ArrowLeft, ArrowRight, Quote, Clock, CloudSun } from 'lucide-react';
import { InstagramIcon } from './icons/InstagramIcon';
import { FLORA_INFO } from '../data/catalog';
import { DualTextButton } from './ui/DualTextButton';
import { AnimatedCounter } from './ui/AnimatedCounter';

interface PatronStory {
  id: string;
  category: string;
  quote: string;
  author: string;
  role: string;
  location: string;
  rating: number;
  date: string;
  projectType: string;
}

export const SocialProofSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState<number>(0);

  const categories = [
    { id: 'all', label: 'All Spaces' },
    { id: 'balconies', label: 'Balcony Sanctuaries' },
    { id: 'cafes', label: 'Boutique Cafés' },
    { id: 'villas', label: 'Modern Villas' },
    { id: 'apartments', label: 'Minimalist Interiors' },
  ];

  const patronStories: PatronStory[] = [
    {
      id: 'story-1',
      category: 'balconies',
      quote:
        'The grey marble Jaguar pot with matching tray completely changed our open veranda. Water drainage is clean, zero floor stains, and the Fiddle Leaf Fig is shooting new leaves every two weeks. Truly an atelier of fine taste.',
      author: 'Anjali Menon',
      role: 'Interior Enthusiast',
      location: 'Kakkanad, Kochi',
      rating: 5,
      date: 'Google Verified • 2 Weeks Ago',
      projectType: 'East-Facing Veranda Staging',
    },
    {
      id: 'story-2',
      category: 'cafes',
      quote:
        'We ordered 12 custom textured ceramic urns and tropical palms for our outdoor café deck in Kothamangalam. Even during torrential monsoons, the pots have maintained their pristine finish without any algae accumulation.',
      author: 'Rohit Varghese',
      role: 'Café Founder',
      location: 'Kothamangalam, Kerala',
      rating: 5,
      date: 'Google Verified • 1 Month Ago',
      projectType: 'Commercial Hospitality Staging',
    },
    {
      id: 'story-3',
      category: 'villas',
      quote:
        'The silk architectural ficus looks astonishingly real in our double-height living room. Air conditioning used to dry out our living plants, but Flora solved this with zero-maintenance lifelike botanicals that visitors constantly admire.',
      author: 'Dr. Mohammed Shafi',
      role: 'Homeowner',
      location: 'Aluva, Ernakulam',
      rating: 5,
      date: 'Google Verified • 3 Weeks Ago',
      projectType: 'Double-Height Living Gallery',
    },
    {
      id: 'story-4',
      category: 'apartments',
      quote:
        'Ordered via WhatsApp and delivered directly to our high-rise apartment. Packed with heavy shock-proof padding. The Monstera arrived vigorous and acclimatized, not a single damaged leaf. Outstanding service.',
      author: 'Kavitha Pillai',
      role: 'Architectural Designer',
      location: 'Marine Drive, Kochi',
      rating: 5,
      date: 'Google Verified • 2 Months Ago',
      projectType: 'High-Rise Apartment Foliage',
    },
  ];

  const filteredStories = activeCategory === 'all'
    ? patronStories
    : patronStories.filter((s) => s.category === activeCategory);

  const activeStory = filteredStories[currentQuoteIndex % filteredStories.length] || patronStories[0];

  const handlePrev = () => {
    setCurrentQuoteIndex((prev) => (prev - 1 + filteredStories.length) % filteredStories.length);
  };

  const handleNext = () => {
    setCurrentQuoteIndex((prev) => (prev + 1) % filteredStories.length);
  };

  return (
    <section className="py-24 sm:py-32 bg-ngen-cream text-ngen-charcoal relative border-b border-ngen-charcoal/10 overflow-hidden">
      <div className="site-max">
        
        {/* Section Header (New Engen Section 4 Architecture) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-widest text-ngen-green block mb-3">
              Patron Stories &amp; Living Sanctuaries
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl tracking-[-0.03em] text-ngen-charcoal leading-[1.05]">
              Our Kerala Living Spaces Shine
            </h2>
          </div>

          {/* Interactive Navigation Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              aria-label="Previous Story"
              className="w-12 h-12 rounded-full border border-ngen-charcoal/20 flex items-center justify-center text-ngen-charcoal hover:bg-ngen-green hover:text-white hover:border-ngen-green transition-all cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next Story"
              className="w-12 h-12 rounded-full border border-ngen-charcoal/20 flex items-center justify-center text-ngen-charcoal hover:bg-ngen-green hover:text-white hover:border-ngen-green transition-all cursor-pointer active:scale-95"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Pill Filters (New Engen Style) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-12 scrollbar-none border-b border-ngen-charcoal/10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setCurrentQuoteIndex(0);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors duration-200 border cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-ngen-green text-ngen-cream border-ngen-green'
                  : 'bg-transparent text-ngen-charcoal/70 border-ngen-charcoal/15 hover:border-ngen-charcoal/40 hover:text-ngen-charcoal'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Hero Interactive Testimonial Card */}
        <div className="mb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStory.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
              className="bg-white rounded-3xl p-8 sm:p-12 border border-ngen-charcoal/15 relative group"
            >
              <Quote className="w-12 h-12 text-ngen-peach/40 absolute top-8 right-8 pointer-events-none" />

              <div className="max-w-4xl">
                {/* Rating & Project Badge */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex text-amber-500">
                    {[...Array(activeStory.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500" />
                    ))}
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-ngen-cream border border-ngen-charcoal/10 text-ngen-charcoal">
                    {activeStory.projectType}
                  </span>
                </div>

                {/* Main Quote Statement */}
                <p className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-ngen-charcoal leading-snug sm:leading-relaxed mb-8">
                  "{activeStory.quote}"
                </p>

                {/* Author Credentials & Coordinates */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-ngen-charcoal/10">
                  <div>
                    <p className="font-display font-black text-base uppercase text-ngen-charcoal">
                      {activeStory.author}
                    </p>
                    <span className="text-xs font-mono text-ngen-charcoal/80 font-medium uppercase block">
                      {activeStory.role}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 font-mono text-xs text-ngen-charcoal/60">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-ngen-peach" />
                      {activeStory.location}
                    </span>
                    <span>•</span>
                    <span>{activeStory.date}</span>
                  </div>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Live Studio Ambient Status & Climate Ticker (New Engen Weather Paradigm) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          <div className="p-5 rounded-2xl bg-white border border-ngen-charcoal/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <CloudSun className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-mono font-bold text-xs uppercase tracking-wider text-ngen-charcoal">
                  Nellikuzhi Showroom
                </span>
                <span className="text-[11px] font-mono text-ngen-charcoal/60">
                  29°C • Tropical Humidity
                </span>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>

          <div className="p-5 rounded-2xl bg-white border border-ngen-charcoal/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-mono font-bold text-xs uppercase tracking-wider text-ngen-charcoal">
                  Atelier Hours Today
                </span>
                <span className="text-[11px] font-mono text-ngen-charcoal/60">
                  Open 9:00 AM – 8:00 PM
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 uppercase">
              Open Now
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-ngen-charcoal/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-mono font-bold text-xs uppercase tracking-wider text-ngen-charcoal">
                  Kerala Transit Protection
                </span>
                <span className="text-[11px] font-mono text-ngen-charcoal/60">
                  100% Safe Root Transit
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-sky-700 uppercase">
              Guaranteed
            </span>
          </div>
        </div>

        {/* Metric Badges Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 p-6 sm:p-8 rounded-3xl bg-white border border-ngen-charcoal/10">
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
              <Star className="w-6 h-6 fill-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-2xl text-ngen-charcoal">
                  <AnimatedCounter to={FLORA_INFO.googleRating} decimals={1} />
                </span>
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                  ))}
                </div>
              </div>
              <span className="text-xs text-ngen-charcoal/60 font-mono uppercase tracking-wider block mt-0.5">
                Google Verified • 140+ Ratings
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-ngen-charcoal/10 pt-4 md:pt-0 md:pl-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="font-display font-black text-2xl text-ngen-charcoal block">
                <AnimatedCounter to={100} suffix="%" /> Safe
              </span>
              <span className="text-xs text-ngen-charcoal/60 font-mono uppercase tracking-wider block mt-0.5">
                Reinforced Shock-Proof Packing
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-ngen-charcoal/10 pt-4 md:pt-0 md:pl-6">
            <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-600 shrink-0">
              <InstagramIcon className="w-6 h-6" />
            </div>
            <div>
              <span className="font-display font-black text-2xl text-ngen-charcoal block">
                @flora__pots
              </span>
              <span className="text-xs text-ngen-charcoal/60 font-mono uppercase tracking-wider block mt-0.5">
                Active Kerala Plant Community
              </span>
            </div>
          </div>

        </div>

        {/* Read All Reviews Action */}
        <div className="text-center">
          <DualTextButton
            href="https://share.google/tXA9Ppu1DJDbtgEzE"
            target="_blank"
            rel="noopener noreferrer"
            variant="outline-dark"
            size="md"
            showArrow
          >
            Read All 140+ Reviews on Google
          </DualTextButton>
        </div>

      </div>
    </section>
  );
};
