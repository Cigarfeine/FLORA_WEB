import React from 'react';
import { Star, ShieldCheck, MapPin, ExternalLink } from 'lucide-react';
import { InstagramIcon } from './icons/InstagramIcon';
import { TESTIMONIALS, FLORA_INFO } from '../data/catalog';

export const SocialProofSection: React.FC = () => {
  return (
    <section className="py-24 bg-sand-50 relative border-t border-sand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Metric Badges Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 p-6 sm:p-8 rounded-3xl bg-white border border-sand-200 shadow-sm">
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 flex-shrink-0">
              <Star className="w-6 h-6 fill-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-2xl font-bold text-botanical-950">
                  {FLORA_INFO.googleRating}
                </span>
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                  ))}
                </div>
              </div>
              <span className="text-xs text-sand-600">
                Google Verified • 140+ Customer Ratings
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-sand-200 pt-4 md:pt-0 md:pl-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold text-botanical-950 block">
                100% Safe
              </span>
              <span className="text-xs text-sand-600">
                Reinforced Shock-Proof Transit Packing
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-sand-200 pt-4 md:pt-0 md:pl-6">
            <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-600 flex-shrink-0">
              <InstagramIcon className="w-6 h-6" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold text-botanical-950 block">
                @flora__pots
              </span>
              <span className="text-xs text-sand-600">
                Active Kerala Plant-Loving Community
              </span>
            </div>
          </div>

        </div>

        {/* Testimonials Grid */}
        <div className="mb-12">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600 block mb-2">
              Verified Patron Stories
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-botanical-950">
              Loved by Plant Parents Across Kerala
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl p-6 border border-sand-200 flex flex-col justify-between hover:shadow-md transition-shadow duration-200"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex text-amber-500">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                      ))}
                    </div>
                    <span className="text-[10px] font-semibold text-sand-500 uppercase tracking-wider">
                      {t.source}
                    </span>
                  </div>

                  <p className="text-sm text-sand-800 leading-relaxed mb-6 italic">
                    "{t.comment}"
                  </p>
                </div>

                <div className="pt-4 border-t border-sand-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-sm font-bold text-botanical-950">
                      {t.author}
                    </h4>
                    <div className="flex items-center gap-1 text-[11px] text-sand-600">
                      <MapPin className="w-3 h-3 text-terracotta-500" />
                      <span>{t.location}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-sand-400">
                    {t.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Google Reviews CTA */}
        <div className="text-center">
          <a
            href="https://share.google/tXA9Ppu1DJDbtgEzE"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold text-botanical-900 hover:text-terracotta-700 transition-colors"
          >
            <span>Read all reviews on Google Business Profile</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </section>
  );
};
