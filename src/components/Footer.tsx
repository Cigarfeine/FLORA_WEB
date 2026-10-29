import React from 'react';
import { MapPin, Phone, Mail, Clock, ArrowUpRight } from 'lucide-react';
import { InstagramIcon } from './icons/InstagramIcon';
import { FLORA_INFO } from '../data/catalog';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-botanical-950 text-sand-100 pt-20 pb-12 border-t border-sand-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-sand-800/80">
          
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
              <span className="font-serif text-2xl font-bold tracking-tight text-sand-50">
                FLORA
              </span>
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
