import React from 'react';
import { Star, ShieldCheck, MapPin } from 'lucide-react';
import { InstagramIcon } from './icons/InstagramIcon';
import { TESTIMONIALS, FLORA_INFO } from '../data/catalog';
import { DualTextButton } from './ui/DualTextButton';
import { AnimatedCounter } from './ui/AnimatedCounter';

export const SocialProofSection: React.FC = () => {
  return (
    <section className="py-24 bg-ngen-cream text-ngen-charcoal relative border-b border-ngen-charcoal/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Metric Badges Banner - Flat Architectural Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 p-6 sm:p-8 rounded-3xl bg-white border border-ngen-charcoal/10">
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 flex-shrink-0">
              <Star className="w-6 h-6 fill-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-2xl text-ngen-charcoal">
                  <AnimatedCounter to={FLORA_INFO.googleRating} decimals={1} />
                </span>
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                  ))}
                </div>
              </div>
              <span className="text-xs text-ngen-charcoal/60 font-mono uppercase tracking-wider block mt-0.5">
                Google Verified • 140+ Ratings
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-ngen-charcoal/10 pt-4 md:pt-0 md:pl-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="font-display font-black text-2xl text-ngen-charcoal block">
                <AnimatedCounter to={100} suffix="%" /> Safe
              </span>
              <span className="text-xs text-ngen-charcoal/60 font-mono uppercase tracking-wider block mt-0.5">
                Shock-Proof Transit Packing
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-ngen-charcoal/10 pt-4 md:pt-0 md:pl-6">
            <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-600 flex-shrink-0">
              <InstagramIcon className="w-6 h-6" />
            </div>
            <div>
              <span className="font-display font-black text-2xl text-ngen-charcoal block">
                @flora__pots
              </span>
              <span className="text-xs text-ngen-charcoal/60 font-mono uppercase tracking-wider block mt-0.5">
                Active Kerala Plant Community
              </span>
            </div>
          </div>

        </div>

        {/* Testimonials Grid */}
        <div className="mb-12">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-ngen-green text-ngen-cream font-mono text-[11px] font-bold uppercase tracking-wider mb-3 border border-ngen-green">
              04 / VERIFIED PATRON STORIES
            </span>
            <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-[-0.03em] text-ngen-charcoal leading-[0.95]">
              LOVED ACROSS<br />KERALA HOMES
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl p-6 border border-ngen-charcoal/10 flex flex-col justify-between hover:border-ngen-charcoal/30 transition-colors duration-200 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex text-amber-500">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono font-bold text-ngen-charcoal/50 uppercase tracking-wider">
                      {t.source}
                    </span>
                  </div>

                  <p className="text-sm text-ngen-charcoal/80 leading-relaxed mb-6 font-sans">
                    "{t.comment}"
                  </p>
                </div>

                <div className="pt-4 border-t border-ngen-charcoal/10 flex items-center justify-between">
                  <div>
                    <h4 className="font-display font-black text-sm uppercase text-ngen-charcoal group-hover:text-ngen-green transition-colors">
                      {t.author}
                    </h4>
                    <div className="flex items-center gap-1 text-[11px] text-ngen-charcoal/60 font-mono">
                      <MapPin className="w-3 h-3 text-ngen-peach" />
                      <span>{t.location}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-ngen-charcoal/40">
                    {t.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Google Reviews CTA */}
        <div className="text-center">
          <DualTextButton
            href="https://share.google/tXA9Ppu1DJDbtgEzE"
            target="_blank"
            rel="noopener noreferrer"
            variant="outline-dark"
            size="sm"
            showArrow
          >
            Read All Reviews on Google
          </DualTextButton>
        </div>

      </div>
    </section>
  );
};
