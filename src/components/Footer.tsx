import React from 'react';
import { MapPin, Phone, Mail, Clock, ArrowUpRight } from 'lucide-react';
import { InstagramIcon } from './icons/InstagramIcon';
import { FLORA_INFO } from '../data/catalog';
import { DualTextButton } from './ui/DualTextButton';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-ngen-green text-ngen-cream pt-24 pb-8 border-t border-white/10 relative overflow-hidden">
      <div className="site-max">
        
        {/* Giant New Engen Call To Action Section */}
        <div className="pb-20 border-b border-white/10 mb-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-ngen-lime block mb-4">
                Start Your Living Botanical Project
              </span>
              <h2 className="font-display font-bold text-4xl sm:text-6xl lg:text-7xl tracking-[-0.03em] text-white leading-[1.0]">
                Let's bring nature into your living space.
              </h2>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
              <DualTextButton
                href={`https://wa.me/${FLORA_INFO.whatsappRaw}?text=${encodeURIComponent('Hello Flora! I would like to design/order plants and pots for my space.')}`}
                target="_blank"
                rel="noopener noreferrer"
                variant="peach"
                size="lg"
                showArrow
              >
                Let's talk
              </DualTextButton>

              <DualTextButton
                href={`tel:${FLORA_INFO.phoneRaw}`}
                variant="outline-light"
                size="lg"
              >
                Call Atelier
              </DualTextButton>
            </div>
          </div>
        </div>

        {/* Main 3-Column Navigation Grid (New Engen Architecture) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          
          {/* Brand Info (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 bg-white p-0.5">
                <img
                  src={FLORA_INFO.logo}
                  alt="Flora Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <span className="font-display font-black text-2xl tracking-tighter text-white block leading-none">
                  FLORA
                </span>
                <span className="text-[10px] tracking-widest uppercase font-mono font-bold text-ngen-lime block mt-0.5">
                  POTS & PLANTS • KERALA
                </span>
              </div>
            </div>

            <p className="text-ngen-cream/70 text-xs sm:text-sm leading-relaxed max-w-sm font-sans">
              Kerala's dedicated horticulture & interior decor atelier. Crafting serene, green sanctuaries with hand-finished planters, acclimatized indoor flora, and lifelike botanicals.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={FLORA_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Flora Pots on Instagram"
                className="p-3 rounded-full bg-white/5 border border-white/10 text-ngen-cream/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${FLORA_INFO.whatsappRaw}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Flora Pots on WhatsApp"
                className="p-3 rounded-full bg-white/5 border border-white/10 text-ngen-cream/80 hover:text-emerald-400 hover:bg-white/10 transition-colors"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Collection Links (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <p className="font-display font-black text-xs text-white uppercase tracking-wider mb-4">
              Explore Atelier
            </p>
            <ul className="space-y-2.5 text-xs text-ngen-cream/70 font-mono">
              <li>
                <a href="#collection" className="hover:text-ngen-lime transition-colors">
                  Ceramic & Marble Vessels
                </a>
              </li>
              <li>
                <a href="#collection" className="hover:text-ngen-lime transition-colors">
                  Air-Purifying Houseplants
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-ngen-lime transition-colors">
                  Spatial Greenery Staging
                </a>
              </li>
              <li>
                <a href="#studio" className="hover:text-ngen-lime transition-colors">
                  Interactive Botanical Matcher
                </a>
              </li>
              <li>
                <a href="#reels" className="hover:text-ngen-lime transition-colors">
                  Showroom Video Reels
                </a>
              </li>
              <li>
                <a href="#care" className="hover:text-ngen-lime transition-colors">
                  Tropical Care Manual
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Hours (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <p className="font-display font-black text-xs text-white uppercase tracking-wider mb-4">
              Studio & Destination
            </p>
            
            <div className="space-y-3 text-xs text-ngen-cream/80 font-mono">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-ngen-peach mt-0.5 shrink-0" />
                <span className="font-sans leading-relaxed">{FLORA_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{FLORA_INFO.phone} / {FLORA_INFO.phoneAlt}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-ngen-cream/60 shrink-0" />
                <span>{FLORA_INFO.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-ngen-lime shrink-0" />
                <span>{FLORA_INFO.hours}</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://share.google/tXA9Ppu1DJDbtgEzE"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-ngen-peach hover:text-ngen-peachHover transition-colors"
              >
                <span>Find Us on Google Maps</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

        {/* New Engen Signature Full-Width Interactive SVG Back to Top Logotype */}
        <div className="pt-12 pb-6 border-b border-white/10">
          <button
            onClick={scrollToTop}
            title="Click to Scroll Back to Top"
            className="w-full group block cursor-pointer select-none text-left"
          >
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-ngen-cream/40 group-hover:text-ngen-lime transition-colors mb-4">
              <span>BACK TO TOP</span>
              <span className="flex items-center gap-1">
                RETURN TO SURFACE ↑
              </span>
            </div>

            {/* Massive Full-Bleed FLORA SVG Logotype */}
            <div className="w-full overflow-hidden">
              <svg
                viewBox="0 0 1440 220"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto text-ngen-fern group-hover:text-ngen-cream transition-colors duration-500 ease-out"
              >
                <text
                  x="50%"
                  y="85%"
                  dominantBaseline="auto"
                  textAnchor="middle"
                  fill="currentColor"
                  className="font-display font-black tracking-[-0.04em] uppercase"
                  style={{
                    fontSize: '210px',
                    fontWeight: 900,
                  }}
                >
                  FLORA
                </text>
              </svg>
            </div>
          </button>
        </div>

        {/* Sub-Footer Legal & Location Stamp */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-ngen-cream/50 uppercase">
          <p>© {new Date().getFullYear()} Flora Pots & Plants Atelier. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>Boutique Horticulture & Stoneware</span>
            <span>•</span>
            <span>Nellikuzhi, Ernakulam, Kerala</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
