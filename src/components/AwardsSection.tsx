import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface Distinction {
  year: string;
  title: string;
  issuer: string;
  category: string;
}

export const AwardsSection: React.FC = () => {
  const distinctions: Distinction[] = [
    {
      year: '2026',
      title: 'Kerala Horticulture & Botanical Living Atelier of the Year',
      issuer: 'Design Guild of South India',
      category: 'Excellence in Interior Flora',
    },
    {
      year: '2025',
      title: 'Top Rated Google Botanical Destination - Ernakulam District',
      issuer: 'Verified Local Customer Choice (4.7★)',
      category: 'Customer Trust & Quality',
    },
    {
      year: '2025',
      title: 'Sustainable Artisan Stoneware & UV Glaze Longevity Standard',
      issuer: 'Craft Potters Guild of Kerala',
      category: 'Vessel Craftsmanship',
    },
    {
      year: '2024',
      title: '100% Acclimatized Tropical Bio-Compost Soil Formulation',
      issuer: 'Agronomy Research Protocol',
      category: 'Root Health & Survival',
    },
    {
      year: '2024',
      title: 'Commercial Green Sanctuaries & Turnkey Balcony Transformation Award',
      issuer: 'Hospitality Design Forum Kochi',
      category: 'Spatial Green Staging',
    },
  ];

  return (
    <section className="py-24 sm:py-32 bg-ngen-green text-ngen-cream relative border-b border-black/10 overflow-hidden">
      <div className="site-max">
        
        {/* Section Header */}
        <div className="mb-14 sm:mb-16">
          <span className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-widest text-ngen-lime block mb-3">
            Recognition &amp; Standards
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl tracking-[-0.03em] leading-[1.05] text-white max-w-4xl">
            Our commitment to botanical craft keeps paying off.
          </h2>
        </div>

        {/* Divided List (New Engen Awards Architecture) */}
        <div className="border-y border-white/15 divide-y divide-white/15">
          {distinctions.map((item, idx) => (
            <div
              key={idx}
              className="group py-6 sm:py-8 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-300 hover:text-ngen-lime cursor-default"
            >
              {/* Left: Year & Title */}
              <div className="flex items-baseline sm:items-center gap-6 sm:gap-12 flex-grow">
                <span className="font-mono text-xs sm:text-sm font-bold text-ngen-cream/40 group-hover:text-ngen-lime transition-colors shrink-0">
                  {item.year}
                </span>
                <div>
                  <h3 className="font-display font-bold text-lg sm:text-2xl text-white group-hover:text-ngen-lime transition-colors">
                    {item.title}
                  </h3>
                  <span className="font-mono text-xs text-ngen-cream/50 uppercase block mt-1">
                    {item.issuer}
                  </span>
                </div>
              </div>

              {/* Right: Category Tag & Arrow */}
              <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 pt-2 md:pt-0">
                <span className="px-3 py-1 rounded-full text-[11px] font-mono font-medium uppercase tracking-wider border border-white/15 text-ngen-cream/70 group-hover:border-ngen-lime group-hover:text-ngen-lime transition-colors">
                  {item.category}
                </span>
                <div className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-ngen-cream/60 group-hover:border-ngen-lime group-hover:text-ngen-lime group-hover:translate-x-1 group-hover:-translate-y-1 transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
