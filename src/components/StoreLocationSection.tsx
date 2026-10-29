import React from 'react';
import { MapPin, Phone, Clock, Navigation, MessageCircle, Sparkles, Building2, Car, Shield } from 'lucide-react';
import { FLORA_INFO } from '../data/catalog';

export const StoreLocationSection: React.FC = () => {
  return (
    <section id="location" className="py-24 bg-sand-100/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Asymmetric Split: Store Information (6 cols) & Real Showroom Visual (6 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Store Info Column (6 Cols) */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-botanical-900/10 text-botanical-900 text-xs font-semibold mb-3">
                <Building2 className="w-3.5 h-3.5 text-terracotta-600" />
                <span>Showroom & Garden Destination</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-botanical-950 tracking-tight mb-4">
                Visit Flora in Nellikuzhi
              </h2>
              <p className="text-sand-700 text-sm sm:text-base leading-relaxed">
                Experience our extensive collection of ceramic pots, fiber urns, and lush indoor plants in person. Our horticulture team is always ready to assist you with pot sizing, plant selection, and repotting.
              </p>
            </div>

            {/* Quick Details List */}
            <div className="space-y-4 pt-2">
              
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-sand-200">
                <div className="p-2.5 rounded-xl bg-sand-100 text-terracotta-600 flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-botanical-950 mb-1">
                    Store Address
                  </h4>
                  <p className="text-xs sm:text-sm text-sand-700 leading-normal">
                    {FLORA_INFO.address}
                  </p>
                  <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
                    Near Kothamangalam • Ernakulam District
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-sand-200">
                <div className="p-2.5 rounded-xl bg-sand-100 text-botanical-700 flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-botanical-950 mb-1">
                    Operating Hours
                  </h4>
                  <p className="text-xs sm:text-sm text-sand-700">
                    {FLORA_INFO.hours}
                  </p>
                  <span className="text-[11px] text-sand-500 mt-1 block">
                    Open all public holidays for plant lovers
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-sand-200">
                <div className="p-2.5 rounded-xl bg-sand-100 text-sky-700 flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-botanical-950 mb-1">
                    Direct Contact Lines
                  </h4>
                  <p className="text-xs sm:text-sm text-sand-700">
                    {FLORA_INFO.phone} / {FLORA_INFO.phoneAlt}
                  </p>
                  <span className="text-[11px] text-sand-500 mt-1 block">
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
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-botanical-900 text-white font-medium text-xs sm:text-sm hover:bg-botanical-800 transition-all shadow-md active:scale-95"
              >
                <Navigation className="w-4 h-4 text-terracotta-300" />
                <span>Open Google Map Directions</span>
              </a>

              <a
                href={`tel:${FLORA_INFO.phone.replace(/[^0-9+]/g, '')}`}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white border border-sand-300 text-botanical-950 font-medium text-xs sm:text-sm hover:bg-sand-100 transition-all active:scale-95"
              >
                <Phone className="w-4 h-4 text-emerald-700" />
                <span>Call Store</span>
              </a>

              <a
                href={`https://wa.me/${FLORA_INFO.whatsappRaw}?text=${encodeURIComponent('Hello Flora, I am planning to visit your store in Nellikuzhi. Are you open right now?')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-emerald-700 text-white font-medium text-xs sm:text-sm hover:bg-emerald-800 transition-all active:scale-95 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Us</span>
              </a>
            </div>

          </div>

          {/* Storefront Image & Perks Column (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-2 border-sand-200 aspect-[4/3] bg-sand-200">
              <img
                src="https://static.wixstatic.com/media/d244c7_82d9c4237e9a446caa91b5aa6984075c~mv2.jpg"
                alt="Flora Pots and Plants Showroom Entrance Nellikuzhi"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-botanical-950/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-[10px] uppercase font-bold tracking-widest text-terracotta-300 block mb-1">
                  On-Site Destination
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold">
                  Appadath Building, Nellikuzhi Storefront
                </h3>
              </div>
            </div>

            {/* In-Store Perks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-white border border-sand-200 text-center">
                <Car className="w-5 h-5 text-sand-700 mx-auto mb-1.5" />
                <h5 className="font-serif text-xs font-bold text-botanical-950 mb-0.5">Easy Parking</h5>
                <p className="text-[10px] text-sand-600">Spacious storefront car & two-wheeler parking</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-sand-200 text-center">
                <Sparkles className="w-5 h-5 text-terracotta-600 mx-auto mb-1.5" />
                <h5 className="font-serif text-xs font-bold text-botanical-950 mb-0.5">Free Repotting</h5>
                <p className="text-[10px] text-sand-600">Complimentary soil potting for all store purchases</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-sand-200 text-center">
                <Shield className="w-5 h-5 text-emerald-700 mx-auto mb-1.5" />
                <h5 className="font-serif text-xs font-bold text-botanical-950 mb-0.5">Plant Advice</h5>
                <p className="text-[10px] text-sand-600">Personalized advice based on your home lighting</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
