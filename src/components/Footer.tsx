import React from 'react';
import { MapPin, Phone, Mail, Clock, ArrowUpRight } from 'lucide-react';
import { InstagramIcon } from './icons/InstagramIcon';
import { FLORA_INFO } from '../data/catalog';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-ngen-darkgreen text-white pt-24 pb-12 border-t border-white/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Giant New Engen Call To Action Section */}
        <div className="pb-20 border-b border-white/15 mb-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-ngen-lime block mb-3">
                Start Your Living Project
              </span>
              <h2 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tighter text-white leading-none">
                LET'S BRING NATURE INTO YOUR SPACE.
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href={`https://wa.me/${FLORA_INFO.whatsappRaw}?text=${encodeURIComponent('Hello Flora! I would like to design/order plants and pots for my space.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-5 rounded-full bg-ngen-peach hover:bg-ngen-peachHover text-botanical-950 font-display font-black text-sm uppercase tracking-wider transition-all duration-200 shadow-xl active:scale-95 group"
              >
                <span>Consult on WhatsApp</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href={`tel:${FLORA_INFO.phoneRaw}`}
                className="inline-flex items-center justify-center gap-2 px-8 py-5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-display font-bold text-sm uppercase tracking-wider transition-all duration-200 backdrop-blur-sm active:scale-95"
              >
                <Phone className="w-4 h-4 text-ngen-lime" />
                <span>Call Atelier</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/15">
          
          {/* Brand Info (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-sand-700">
                <img
                  src={FLORA_INFO.logo}
                  alt="Flora Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="font-display font-black text-2xl tracking-tighter text-white block leading-none">
                  FLORA
                </span>
                <span className="text-[10px] tracking-widest uppercase font-mono font-bold text-ngen-lime block mt-0.5">
                  POTS & PLANTS
                </span>
              </div>
            </div>

            <p className="text-sand-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Kerala's dedicated horticulture & interior decor atelier. Crafting serene, green sanctuaries with hand-finished planters, acclimatized indoor flora, and lifelike botanicals.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={FLORA_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Flora Pots on Instagram"
                className="p-2.5 rounded-full bg-sand-900 border border-sand-800 text-sand-300 hover:text-white hover:bg-sand-800 transition-colors"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${FLORA_INFO.whatsappRaw}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Flora Pots on WhatsApp"
                className="p-2.5 rounded-full bg-sand-900 border border-sand-800 text-sand-300 hover:text-emerald-400 hover:bg-sand-800 transition-colors"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Collection Links (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-bold text-sand-50 uppercase tracking-wider mb-4">
              Explore Offerings
            </h4>
            <ul className="space-y-2 text-xs text-sand-400">
              <li>
                <a href="#collection" className="hover:text-terracotta-400 transition-colors">
                  Ceramic & Marble Planters
                </a>
              </li>
              <li>
                <a href="#collection" className="hover:text-terracotta-400 transition-colors">
                  Air-Purifying Houseplants
                </a>
              </li>
              <li>
                <a href="#collection" className="hover:text-terracotta-400 transition-colors">
                  Luxury Faux Botanicals & Trees
                </a>
              </li>
              <li>
                <a href="#collection" className="hover:text-terracotta-400 transition-colors">
                  Green Celebration Gift Hampers
                </a>
              </li>
              <li>
                <a href="#studio" className="hover:text-terracotta-400 transition-colors">
                  Interactive Plant & Pot Matcher
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Hours (4 Cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-serif text-sm font-bold text-sand-50 uppercase tracking-wider mb-4">
              Studio & Destination
            </h4>
            
            <div className="space-y-2.5 text-xs text-sand-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-terracotta-500 mt-0.5 flex-shrink-0" />
                <span>{FLORA_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{FLORA_INFO.phone} / {FLORA_INFO.phoneAlt}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sand-400 flex-shrink-0" />
                <span>{FLORA_INFO.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>{FLORA_INFO.hours}</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://share.google/tXA9Ppu1DJDbtgEzE"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-terracotta-400 hover:text-terracotta-300 transition-colors"
              >
                <span>Find Us on Google Maps</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sand-500">
          <p>© {new Date().getFullYear()} Flora Pots & Plants. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>Boutique Horticulture & Planters</span>
            <span>•</span>
            <span>Nellikuzhi, Kerala</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
