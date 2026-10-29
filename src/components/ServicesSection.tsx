import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Plus, Minus, CheckCircle2 } from 'lucide-react';
import { DualTextButton } from './ui/DualTextButton';
import { FLORA_INFO } from '../data/catalog';

interface ServiceItem {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  metric: { value: string; label: string };
  imageUrl: string;
}

export const ServicesSection: React.FC = () => {
  const [activeId, setActiveId] = useState<string>('curation');

  const services: ServiceItem[] = [
    {
      id: 'curation',
      number: '01',
      title: 'Indoor Greenery Curation',
      tagline: 'Architectural Houseplants Acclimatized for Tropical Living',
      description:
        'We hand-select robust, air-purifying foliage specimens including mature Monstera Deliciosa, Fiddle Leaf Figs, and Sansevieria. Every plant undergoes root-rot inspection and is potted in nutrient-rich bio-compost optimized for Kerala’s ambient humidity.',
      tags: ['Tropical Exotics', 'Air Purification', 'Low-Light Foliage', 'Root-Health Guarantee'],
      metric: { value: '100%', label: 'Root Inspection Pass Rate' },
      imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'planters',
      number: '02',
      title: 'Bespoke Planter Fabrication',
      tagline: 'Marble, Sculpted Ceramic & UV-Stabilized Polymer Vessels',
      description:
        'Designed to complement modern minimalist and traditional Kerala architecture. Our pots feature precision drainage holes, optional moisture catchers, and textured matte finishes that resist water stains and tropical algae.',
      tags: ['Handcrafted Ceramic', 'White & Grey Marble', 'Matte Polymer', 'Catchment Saucers'],
      metric: { value: '500+', label: 'Pots & Urns in Stock' },
      imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'landscaping',
      number: '03',
      title: 'Balcony & Commercial Staging',
      tagline: 'Turnkey Green Sanctuary Transformations for Homes & Cafés',
      description:
        'Transform bare verandas, executive boardrooms, and boutique hospitality lounges into lush botanical retreats. We provide on-site light audits, aesthetic vessel pairing, and complete layout installations across Ernakulam district.',
      tags: ['Villa Balconies', 'Boutique Cafés', 'Corporate Lounges', 'On-Site Layout'],
      metric: { value: '48h', label: 'Staging Turnaround' },
      imageUrl: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'silk-botanicals',
      number: '04',
      title: 'Zero-Maintenance Silk Botanicals',
      tagline: 'Botanically Accurate Faux Flora for High-AC & Low-Light Spaces',
      description:
        'For dark hallways, air-conditioned executive suites, or second homes where natural watering is impossible. Crafted with realistic leaf veining, lifelike bark texture, and UV-resistant foliage that stays perpetually vibrant.',
      tags: ['Zero Watering', 'Hypoallergenic', 'UV Resistant', 'Architectural Trees'],
      metric: { value: '0 Liters', label: 'Water Required / Year' },
      imageUrl: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'maintenance',
      number: '05',
      title: 'White-Glove Repotting & Care Clinic',
      tagline: 'Continuous Horticultural Health & Soil Diagnostics',
      description:
        'Plants outgrow their pots or face seasonal pests. Bring your plants to our Nellikuzhi showroom or connect via WhatsApp for soil nutrition rebalancing, root pruning, and organic neem pest treatments.',
      tags: ['Soil Refresh', 'Root Pruning', 'Organic Pest Shield', 'WhatsApp Clinic'],
      metric: { value: 'Free', label: 'Consultation with Purchase' },
      imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <section id="services" className="py-28 sm:py-36 bg-ngen-green text-ngen-cream relative border-b border-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section (New Engen Style) */}
        <div className="mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-ngen-lime font-mono text-[11px] font-bold uppercase tracking-wider mb-6 border border-white/15">
            <span>02 / SERVICES & HORTICULTURAL CRAFT</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl uppercase tracking-[-0.03em] leading-[0.95] text-white max-w-4xl">
            CURATING BOTANICAL IMPACT ACROSS EVERY LIVING SPACE.
          </h2>
        </div>

        {/* Accordion List (Matching New Engen Pinned Services layout) */}
        <div className="border-t border-white/15 divide-y divide-white/15">
          {services.map((service) => {
            const isOpen = activeId === service.id;
            return (
              <div
                key={service.id}
                className="group transition-colors duration-300"
              >
                {/* Header Row */}
                <button
                  onClick={() => setActiveId(isOpen ? '' : service.id)}
                  aria-expanded={isOpen}
                  className="w-full py-8 sm:py-10 text-left flex items-start sm:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-start sm:items-center gap-6 sm:gap-12 flex-grow">
                    <span className="font-mono text-sm sm:text-base font-bold text-ngen-lime shrink-0 mt-1 sm:mt-0">
                      {service.number}
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 flex-grow">
                      <h3 className="font-display font-black text-xl sm:text-3xl lg:text-4xl uppercase tracking-tight text-white group-hover:text-ngen-lime transition-colors">
                        {service.title}
                      </h3>
                      <span className="text-xs sm:text-sm font-mono text-ngen-cream/60 uppercase hidden md:inline-block">
                        — {service.tagline}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-full border border-white/20 text-ngen-cream group-hover:border-ngen-lime group-hover:text-ngen-lime transition-colors shrink-0">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {/* Expanded Details Panel */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-12 pt-2 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-t border-white/10">
                        
                        {/* Text Details (7 Cols) */}
                        <div className="lg:col-span-7 flex flex-col justify-between">
                          <p className="text-base sm:text-lg text-ngen-cream/80 leading-relaxed font-sans mb-8">
                            {service.description}
                          </p>

                          {/* Tags Array */}
                          <div className="flex flex-wrap gap-2 mb-8">
                            {service.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-3 py-1 rounded-full text-xs font-mono font-medium uppercase tracking-wider bg-white/5 border border-white/15 text-ngen-cream/90"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Metric & Action CTA */}
                          <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/10">
                            <div>
                              <span className="block font-display font-black text-2xl sm:text-3xl text-white">
                                {service.metric.value}
                              </span>
                              <span className="text-[11px] font-mono uppercase text-ngen-cream/60 tracking-wider">
                                {service.metric.label}
                              </span>
                            </div>

                            <DualTextButton
                              href={`https://wa.me/${FLORA_INFO.whatsappRaw}?text=${encodeURIComponent(`Hello Flora! I would like to inquire about your ${service.title} service.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              variant="peach"
                              size="md"
                              showArrow
                            >
                              Inquire About {service.title}
                            </DualTextButton>
                          </div>
                        </div>

                        {/* Image Showcase (5 Cols) */}
                        <div className="lg:col-span-5">
                          <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-white/20 relative group/img">
                            <img
                              src={service.imageUrl}
                              alt={service.title}
                              className="w-full h-full object-cover grayscale contrast-125 group-hover/img:grayscale-0 transition-all duration-700 ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-white">
                              <span className="flex items-center gap-1.5 text-ngen-lime">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Available at Nellikuzhi Studio
                              </span>
                              <ArrowUpRight className="w-4 h-4 text-white/70" />
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
    </section>
  );
};
