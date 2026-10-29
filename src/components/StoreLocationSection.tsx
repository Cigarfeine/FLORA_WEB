import React from 'react';
import { MapPin, Phone, Clock, Navigation, MessageCircle, Sparkles, Building2, Car, Shield } from 'lucide-react';
import { FLORA_INFO } from '../data/catalog';

export const StoreLocationSection: React.FC = () => {
  return (
    <section id="location" className="py-24 bg-ngen-green text-ngen-cream relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-10 w-[40rem] h-[40rem] rounded-full bg-ngen-lightgreen/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[35rem] h-[35rem] rounded-full bg-botanical-950/60 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Asymmetric Split: Store Information (6 cols) & Real Showroom Visual (6 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Store Info Column (6 Cols) */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ngen-lime/20 border border-ngen-lime/30 text-ngen-lime font-mono text-xs font-bold uppercase tracking-wider mb-4">
                <Building2 className="w-3.5 h-3.5 text-ngen-peach" />
                <span>Showroom & Garden Destination</span>
              </div>
              <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tighter text-white leading-tight mb-4">
                VISIT FLORA IN NELLIKUZHI
              </h2>
              <p className="text-sand-300 text-sm sm:text-base leading-relaxed">
                Experience our curated collection of ceramic planters, fiber urns, and lush indoor tropical flora in person. Our horticulture team is always on-site to assist with pot sizing, root care, and repotting.
              </p>
            </div>

            {/* Quick Details List */}
            <div className="space-y-4 pt-2">
              
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-ngen-darkgreen/70 backdrop-blur-md border border-white/15 text-white">
                <div className="p-3 rounded-xl bg-white/10 text-ngen-peach flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-white mb-1 uppercase tracking-wide">
                    Store Address
                  </h4>
                  <p className="text-xs sm:text-sm text-sand-300 leading-normal">
                    {FLORA_INFO.address}
                  </p>
                  <span className="text-[11px] text-ngen-lime font-mono font-bold mt-1.5 block">
                    Near Kothamangalam • Ernakulam District
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-ngen-darkgreen/70 backdrop-blur-md border border-white/15 text-white">
                <div className="p-3 rounded-xl bg-white/10 text-ngen-lime flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-white mb-1 uppercase tracking-wide">
                    Operating Hours
                  </h4>
                  <p className="text-xs sm:text-sm text-sand-300">
                    {FLORA_INFO.hours}
                  </p>
                  <span className="text-[11px] text-sand-400 mt-1.5 block font-mono">
                    Open all public holidays for plant lovers
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-ngen-darkgreen/70 backdrop-blur-md border border-white/15 text-white">
                <div className="p-3 rounded-xl bg-white/10 text-sky-400 flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-white mb-1 uppercase tracking-wide">
                    Direct Contact Lines
                  </h4>
                  <p className="text-xs sm:text-sm text-sand-300">
                    {FLORA_INFO.phone} / {FLORA_INFO.phoneAlt}
                  </p>
                  <span className="text-[11px] text-sand-400 mt-1.5 block font-mono">
                    Call or WhatsApp for immediate stock availability
                  </span>
                </div>
              </div>

            </div>

            {/* Visit Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="https://share.google/tXA9Ppu1DJDbtgEzE"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-ngen-peach hover:bg-ngen-peachHover text-botanical-950 font-display font-extrabold text-xs uppercase tracking-wider transition-all shadow-xl active:scale-95"
              >
                <Navigation className="w-4 h-4" />
                <span>Google Map Directions</span>
              </a>

              <a
                href={`tel:${FLORA_INFO.phone.replace(/[^0-9+]/g, '')}`}
                className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-display font-bold text-xs uppercase tracking-wider transition-all backdrop-blur-sm active:scale-95"
              >
                <Phone className="w-4 h-4 text-ngen-lime" />
                <span>Call Store</span>
              </a>

              <a
                href={`https://wa.me/${FLORA_INFO.whatsappRaw}?text=${encodeURIComponent('Hello Flora, I am planning to visit your store in Nellikuzhi. Are you open right now?')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Us</span>
              </a>
            </div>

          </div>

          {/* Storefront Image & Perks Column (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 aspect-[4/3] bg-black">
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
              <div className="p-4 rounded-2xl bg-ngen-darkgreen/70 backdrop-blur-md border border-white/10 text-center text-white">
                <Car className="w-5 h-5 text-ngen-peach mx-auto mb-2" />
                <h5 className="font-display font-bold text-xs text-white mb-1 uppercase">Easy Parking</h5>
                <p className="text-[11px] text-sand-300">Spacious storefront vehicle parking</p>
              </div>

              <div className="p-4 rounded-2xl bg-ngen-darkgreen/70 backdrop-blur-md border border-white/10 text-center text-white">
                <Sparkles className="w-5 h-5 text-ngen-lime mx-auto mb-2" />
                <h5 className="font-display font-bold text-xs text-white mb-1 uppercase">Free Repotting</h5>
                <p className="text-[11px] text-sand-300">Complimentary soil potting for all purchases</p>
              </div>

              <div className="p-4 rounded-2xl bg-ngen-darkgreen/70 backdrop-blur-md border border-white/10 text-center text-white">
                <Shield className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                <h5 className="font-display font-bold text-xs text-white mb-1 uppercase">Plant Advice</h5>
                <p className="text-[11px] text-sand-300">Personalized advice for your home lighting</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
