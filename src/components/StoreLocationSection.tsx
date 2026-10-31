import React from 'react';
import { MapPin, Phone, Clock, Car, Sparkles, Shield } from 'lucide-react';
import { FLORA_INFO } from '../data/catalog';
import { DualTextButton } from './ui/DualTextButton';

export const StoreLocationSection: React.FC = () => {
  return (
    <section id="location" className="py-24 bg-ngen-green text-ngen-cream relative overflow-hidden border-b border-black/10">
      <div className="site-max relative z-10">
        
        {/* Asymmetric Split: Store Information (6 cols) & Real Showroom Visual (6 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Store Info Column (6 Cols) */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <span className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-widest text-ngen-lime block mb-3">
                Showroom &amp; Garden Destination
              </span>
              <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-[-0.03em] text-white leading-[1.05] mb-4">
                Visit Flora in Nellikuzhi
              </h2>
              <p className="text-ngen-cream/70 text-sm sm:text-base leading-relaxed font-sans">
                Experience our curated collection of ceramic planters, fiber urns, and lush indoor tropical flora in person. Our horticulture team is always on-site to assist with pot sizing, root care, and repotting.
              </p>
            </div>

            {/* Quick Details List - Flat Hairline Cards */}
            <div className="space-y-3 pt-2">
              
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-ngen-darkgreen border border-white/10 text-white">
                <div className="p-2.5 rounded-xl bg-white/5 text-ngen-peach flex-shrink-0 border border-white/10">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-display font-black text-xs text-white mb-1 uppercase tracking-wider">
                    Store Address
                  </p>
                  <p className="text-xs sm:text-sm text-ngen-cream/80 leading-normal font-sans">
                    {FLORA_INFO.address}
                  </p>
                  <span className="text-[11px] text-ngen-lime font-mono font-bold mt-1.5 block">
                    Near Kothamangalam • Ernakulam District
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-ngen-darkgreen border border-white/10 text-white">
                <div className="p-2.5 rounded-xl bg-white/5 text-ngen-lime flex-shrink-0 border border-white/10">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-display font-black text-xs text-white mb-1 uppercase tracking-wider">
                    Operating Hours
                  </p>
                  <p className="text-xs sm:text-sm text-ngen-cream/80 font-sans">
                    {FLORA_INFO.hours}
                  </p>
                  <span className="text-[11px] text-ngen-cream/80 mt-1.5 block font-mono">
                    Open all public holidays for plant lovers
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-ngen-darkgreen border border-white/10 text-white">
                <div className="p-2.5 rounded-xl bg-white/5 text-sky-400 flex-shrink-0 border border-white/10">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-display font-black text-xs text-white mb-1 uppercase tracking-wider">
                    Direct Contact Lines
                  </p>
                  <p className="text-xs sm:text-sm text-ngen-cream/80 font-mono">
                    {FLORA_INFO.phone} / {FLORA_INFO.phoneAlt}
                  </p>
                  <span className="text-[11px] text-ngen-cream/60 mt-1.5 block font-mono">
                    Call or WhatsApp for immediate stock availability
                  </span>
                </div>
              </div>

            </div>

            {/* Visit Action Buttons: DualTextButton components */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <DualTextButton
                href="https://share.google/tXA9Ppu1DJDbtgEzE"
                target="_blank"
                rel="noopener noreferrer"
                variant="peach"
                size="md"
                showArrow
              >
                Google Map Directions
              </DualTextButton>

              <DualTextButton
                href={`tel:${FLORA_INFO.phone.replace(/[^0-9+]/g, '')}`}
                variant="outline-light"
                size="md"
              >
                Call Store
              </DualTextButton>

              <DualTextButton
                href={`https://wa.me/${FLORA_INFO.whatsappRaw}?text=${encodeURIComponent('Hello Flora, I am planning to visit your store in Nellikuzhi. Are you open right now?')}`}
                target="_blank"
                rel="noopener noreferrer"
                variant="lime"
                size="md"
              >
                WhatsApp Us
              </DualTextButton>
            </div>

          </div>

          {/* Storefront Image & Perks Column (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            
            <div className="relative rounded-3xl overflow-hidden border border-white/20 aspect-[4/3] bg-black">
              <img
                src="https://static.wixstatic.com/media/d244c7_82d9c4237e9a446caa91b5aa6984075c~mv2.jpg"
                alt="Flora Pots and Plants Showroom Entrance Nellikuzhi"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-ngen-lime block mb-1">
                  On-Site Destination
                </span>
                <h3 className="font-display font-bold text-lg sm:text-xl text-white">
                  Appadath Building, Nellikuzhi Storefront
                </h3>
              </div>
            </div>

            {/* In-Store Perks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-ngen-darkgreen border border-white/10 text-center text-white">
                <Car className="w-4 h-4 text-ngen-peach mx-auto mb-2" />
                <p className="font-display font-black text-xs text-white mb-1 uppercase tracking-wider">Easy Parking</p>
                <p className="text-[11px] text-ngen-cream/80 font-sans">Spacious storefront vehicle parking</p>
              </div>

              <div className="p-4 rounded-2xl bg-ngen-darkgreen border border-white/10 text-center text-white">
                <Sparkles className="w-4 h-4 text-ngen-lime mx-auto mb-2" />
                <p className="font-display font-black text-xs text-white mb-1 uppercase tracking-wider">Free Repotting</p>
                <p className="text-[11px] text-ngen-cream/80 font-sans">Complimentary potting with soil</p>
              </div>

              <div className="p-4 rounded-2xl bg-ngen-darkgreen border border-white/10 text-center text-white">
                <Shield className="w-4 h-4 text-emerald-400 mx-auto mb-2" />
                <p className="font-display font-black text-xs text-white mb-1 uppercase tracking-wider">Plant Advice</p>
                <p className="text-[11px] text-ngen-cream/80 font-sans">Personalized advice for your light</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
