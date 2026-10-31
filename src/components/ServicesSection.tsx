import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle2, ArrowUpRight } from 'lucide-react';
import { DualTextButton } from './ui/DualTextButton';
import { FLORA_INFO } from '../data/catalog';

gsap.registerPlugin(ScrollTrigger);

interface ServiceItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  badge: string;
  imageUrl: string;
}

export const ServicesSection: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  const services: ServiceItem[] = [
    {
      id: 'curation',
      title: 'Indoor Greenery Curation',
      tagline: 'Architectural Houseplants Acclimatized for Tropical Living',
      description:
        'Hand-selected mature foliage specimens—Monstera Deliciosa, Ficus Lyrata, and Sansevieria—individually conditioned for Kerala’s indoor light and ambient humidity. Every plant undergoes root-rot inspection and is potted in nutrient-rich bio-compost.',
      tags: ['Living Exotics', 'Air Purification', 'Low-Light Tolerant', 'Root-Health Tested'],
      badge: '100% Root Health Verified',
      imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'planters',
      title: 'Bespoke Planter Fabrication',
      tagline: 'Marble, Sculpted Ceramic & UV-Stabilized Polymer Vessels',
      description:
        'Handcrafted vessels designed to complement contemporary minimalist spaces and traditional Kerala architecture. Engineered with precision drainage channels, optional moisture catchers, and textured matte finishes that resist tropical water stains.',
      tags: ['Hand-Thrown Ceramic', 'Porous Terracotta', 'Matte Polymer', 'Integrated Saucers'],
      badge: '500+ Vessels in Stock',
      imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'staging',
      title: 'Balcony & Commercial Staging',
      tagline: 'Turnkey Green Sanctuary Transformations for Homes & Cafés',
      description:
        'Transforming bare verandas, executive suites, and boutique hospitality lounges into lush botanical retreats. We provide on-site light audits, aesthetic vessel pairing, and complete layout installations across Ernakulam district.',
      tags: ['Villa Balconies', 'Boutique Cafés', 'Executive Lounges', 'On-Site Staging'],
      badge: '48h Turnaround',
      imageUrl: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'silk-botanicals',
      title: 'Zero-Maintenance Silk Botanicals',
      tagline: 'Botanically Accurate Faux Flora for High-AC & Low-Light Spaces',
      description:
        'For sun-deprived corridors, air-conditioned corporate boardrooms, or second residences where regular watering is impractical. Crafted with realistic leaf venation, natural bark texture, and UV-resistant foliage that stays perpetually verdant.',
      tags: ['Zero Watering', 'Hypoallergenic', 'UV Stabilized', 'Perpetually Verdant'],
      badge: '0 Liters Water / Year',
      imageUrl: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'clinic',
      title: 'White-Glove Repotting & Care Clinic',
      tagline: 'Continuous Horticultural Health & Soil Diagnostics',
      description:
        'Plants outgrow their vessels or require seasonal rejuvenation. Bring your plants to our Nellikuzhi showroom or connect via WhatsApp for soil nutrition rebalancing, root pruning, and organic neem pest treatments.',
      tags: ['Soil Balancing', 'Root Pruning', 'Organic Pest Shield', 'WhatsApp Clinic'],
      badge: 'Complimentary with Purchase',
      imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  // GSAP ScrollTrigger Pinned Accordion Scrub (Authentic New Engen .acc-services pattern)
  useEffect(() => {
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    if (!isDesktop || !trackRef.current || !stickyRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: trackRef.current,
        pin: stickyRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = self.progress;
          const total = services.length;
          const nextIndex = Math.min(Math.floor(progress * total), total - 1);
          setActiveIdx(nextIndex);
        },
      });
    }, trackRef);

    return () => ctx.revert();
  }, [services.length]);

  return (
    <section
      id="services"
      ref={containerRef}
      className="acc-services bg-ngen-green text-ngen-cream relative selection:bg-ngen-peach selection:text-ngen-charcoal border-b border-black/10"
      style={{ '--count': services.length } as React.CSSProperties}
    >
      {/* Section Header (Outside the sticky track, exactly matching New Engen layout) */}
      <div className="site-max pt-20 sm:pt-28 pb-10 sm:pb-14 flex flex-col gap-4">
        <span className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-widest text-ngen-lime">
          02 / Services &amp; Horticultural Craft
        </span>
        <h2 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-white tracking-[-0.03em] leading-[1.08] max-w-4xl">
          Driving botanical impact across living architecture.
        </h2>
      </div>

      {/* GSAP Scroll Scrub Track (Desktop sticky sequence / Mobile fluid vertical flow) */}
      <div ref={trackRef} className="relative h-auto lg:h-[260vh] w-full">
        {/* Sticky Pinned 100vh Viewport on Desktop */}
        <div
          ref={stickyRef}
          className="lg:sticky lg:top-0 lg:left-0 w-full lg:h-screen lg:overflow-hidden bg-ngen-green flex flex-col justify-start py-6 lg:py-10"
        >
          <div className="site-max w-full flex flex-col justify-start">
            
            {/* New Engen .acc-services Accordion List */}
            <div className="acc-services flex flex-col w-full divide-y divide-white/15 border-b border-white/15">
              {services.map((service, index) => {
                const isOpen = activeIdx === index;
                return (
                  <div
                    key={service.id}
                    className="acc-services-item relative w-full origin-top transition-colors duration-300"
                  >
                    {/* Clean Title Row (Title Case, Hairline Separation, Subtle Arrow) */}
                    <button
                      onClick={() => setActiveIdx(index)}
                      aria-expanded={isOpen}
                      className="w-full py-5 sm:py-6 lg:h-20 text-left flex items-center justify-between cursor-pointer select-none group"
                    >
                      <span
                        className={`font-display font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight transition-colors duration-300 ${
                          isOpen
                            ? 'text-white'
                            : 'text-ngen-cream/65 group-hover:text-ngen-lime'
                        }`}
                      >
                        {service.title}
                      </span>

                      {/* Subtle Right Arrow on Hover / Active */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isOpen
                            ? 'text-ngen-lime rotate-45'
                            : 'text-ngen-cream/30 group-hover:text-ngen-lime group-hover:translate-x-1'
                        }`}
                      >
                        <ArrowUpRight className="w-5 h-5" />
                      </div>
                    </button>

                    {/* Expanded Content Drawer (.acc-services-item__content) */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.45, ease: [0.19, 1, 0.22, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="pt-2 pb-8 sm:pb-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
                            
                            {/* Left Column: Description, Tag Pills & CTA */}
                            <div className="lg:col-span-7 flex flex-col justify-between">
                              <p className="text-base sm:text-lg text-ngen-cream/85 leading-relaxed font-sans mb-6 max-w-2xl">
                                {service.description}
                              </p>

                              {/* Capsule Tag Pills (Authentic New Engen Style) */}
                              <div className="flex flex-wrap gap-2 sm:gap-2.5 mb-8">
                                {service.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="rounded-full inline-flex h-8 sm:h-9 items-center whitespace-nowrap px-4 text-xs font-mono font-medium border border-ngen-cream/30 text-ngen-cream transition-colors duration-300 hover:border-ngen-lime hover:text-ngen-lime"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>

                              {/* CTA Action Button & Verification Badge */}
                              <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                                <DualTextButton
                                  href={`https://wa.me/${FLORA_INFO.whatsappRaw}?text=${encodeURIComponent(
                                    `Hello Flora! I would like to consult about your ${service.title} service.`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  variant="peach"
                                  size="md"
                                  showArrow
                                >
                                  Inquire about service
                                </DualTextButton>

                                <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-ngen-lime uppercase tracking-wider">
                                  <CheckCircle2 className="w-4 h-4 text-ngen-lime" />
                                  {service.badge}
                                </span>
                              </div>
                            </div>

                            {/* Right Column: Architectural Media Card (.acc-services-item__media) */}
                            <div className="lg:col-span-5 hidden sm:block">
                              <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 bg-black/40 shadow-2xl group/media max-h-[240px] lg:max-h-[280px]">
                                <img
                                  src={service.imageUrl}
                                  alt={service.title}
                                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/media:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                                
                                {/* Bottom Studio Tag */}
                                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-white">
                                  <span className="text-[11px] font-mono text-ngen-cream/80 uppercase tracking-wider">
                                    {service.tagline}
                                  </span>
                                  <span className="p-1 rounded-full bg-white/10 border border-white/15 text-ngen-lime">
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                  </span>
                                </div>
                              </div>
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
