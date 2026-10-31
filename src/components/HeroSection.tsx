import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { PRODUCTS, VIDEO_REELS } from '../data/catalog';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { SplitText } from './ui/SplitText';
import { AnimatedCounter } from './ui/AnimatedCounter';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CuratedItem {
  id: string;
  label: string;
  categoryTag: string;
  name: string;
  tags: string[];
  description?: string;
  metric: string;
  price: number;
  product: Product;
  reel: typeof VIDEO_REELS[0];
}

export const HeroSection: React.FC = () => {
  const { addItem, setIsOpen } = useCart();

  // Section & DOM References for Scroll FLIP
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const curationsSectionRef = useRef<HTMLDivElement>(null);
  const targetGridRef = useRef<HTMLDivElement>(null);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const targetSlotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Interactive States
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  // 4 Signature Curations matching New Engen portfolio structure
  const curations: CuratedItem[] = [
    {
      id: 'jaguar-cool-pot',
      label: 'JAGUAR COOL POT',
      categoryTag: 'TERRACOTTA & STONEWARE • KERALA CLAY',
      name: 'Jaguar Cool Pot',
      tags: ['Terracotta & Stoneware', 'Evaporative Cooling'],
      description: 'Hand-thrown porous terracotta engineered for natural evaporative root cooling in tropical climates.',
      metric: 'Kerala Tested • -44% Heat Retention',
      price: 600,
      product: PRODUCTS.find((p) => p.id === 'jaguar-cool-pot') || PRODUCTS[0],
      reel: VIDEO_REELS[0],
    },
    {
      id: 'monstera-deliciosa',
      label: 'MONSTERA EXOTIC',
      categoryTag: 'LIVING BOTANICALS • ACCLIMATIZED',
      name: 'Monstera Specimen',
      tags: ['Living Botanicals', 'Tropical Acclimatized'],
      description: 'Lush fenestrated leaves conditioned for bright filtered indoor living rooms and architectural spaces.',
      metric: '+44% Root Vigour • Tropical Hardened',
      price: 480,
      product: PRODUCTS.find((p) => p.id === 'monstera-deliciosa') || PRODUCTS[1],
      reel: VIDEO_REELS[2] || VIDEO_REELS[1],
    },
    {
      id: 'ribbed-ceramic-urn',
      label: 'RIBBED CERAMIC URN',
      categoryTag: 'SCULPTURAL CERAMICS • MATTE FINISH',
      name: 'Ribbed Ceramic Urn',
      tags: ['Sculptural Ceramics', 'Matte Eggshell Finish'],
      metric: 'Architectural Scale • Matte Off-White',
      price: 790,
      product: PRODUCTS.find((p) => p.id === 'ribbed-ceramic-urn') || PRODUCTS[2],
      reel: VIDEO_REELS[1],
    },
    {
      id: 'grand-silk-ficus',
      label: 'GRAND SILK FICUS',
      categoryTag: 'PREMIUM BOTANICAL SILK • ZERO WATER',
      name: 'Grand Silk Ficus',
      tags: ['Botanical Silk', 'Zero Water Required'],
      description: 'Botanically indistinguishable faux botanical for low-light corridors, stairwells, and corporate suites.',
      metric: 'Zero Water • Forever Verdant Silk',
      price: 690,
      product: PRODUCTS.find((p) => p.id === 'grand-terracotta-urn') || PRODUCTS[3],
      reel: VIDEO_REELS[3],
    },
  ];

  // Card Switch Handler with New Engen squash & elastic snap bounce
  const selectCard = useCallback((index: number) => {
    setActiveReelIndex(index);

    // Deck bounce animation
    if (deckRef.current) {
      gsap.timeline()
        .to(deckRef.current, { scale: 0.97, duration: 0.15, ease: 'power2.inOut' })
        .to(deckRef.current, { scale: 1.0, duration: 0.35, ease: 'elastic.out(1, 0.7)' });
    }

    // Ensure all 4 videos continue playing simultaneously without interrupting inactive cards
    videoRefs.current.forEach((vid) => {
      if (vid && vid.paused) {
        vid.play().catch(() => {});
      }
    });
  }, []);

  // Ensure all 4 video reels start and loop simultaneously from mount (matching New Engen concurrent playback)
  useEffect(() => {
    const startAllVideos = () => {
      videoRefs.current.forEach((vid) => {
        if (vid) {
          vid.muted = isMuted;
          vid.play().catch(() => {});
        }
      });
    };

    startAllVideos();

    // Re-verify playback on user visibility or focus
    const handleVisibility = () => {
      if (!document.hidden) {
        startAllVideos();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
    };
  }, [isMuted]);

  // 4.5-second cycling autoplay in hero (pauses when scrolled down)
  useEffect(() => {
    if (isScrolled) return;
    const interval = setInterval(() => {
      setActiveReelIndex((prev) => (prev + 1) % curations.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isScrolled, curations.length]);

  // Video play/pause toggle (controls all 4 simultaneous video reels together)
  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextPlaying = !isPlaying;
    videoRefs.current.forEach((vid) => {
      if (!vid) return;
      if (nextPlaying) {
        vid.play().catch(() => {});
      } else {
        vid.pause();
      }
    });
    setIsPlaying(nextPlaying);
  };

  // Video mute/unmute toggle
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMuted = !isMuted;
    videoRefs.current.forEach((vid) => {
      if (vid) vid.muted = newMuted;
    });
    setIsMuted(newMuted);
  };

  // Exact New Engen Scroll FLIP Alignment Timeline
  useEffect(() => {
    (window as any).gsap = gsap;
    (window as any).ScrollTrigger = ScrollTrigger;
    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      const heroEl = heroSectionRef.current;
      const targetGridEl = targetGridRef.current;
      if (!heroEl || !targetGridEl) return;

      // Ensure any existing inline transforms are removed before measuring pure layout
      cardRefs.current.forEach((c) => {
        if (c) gsap.set(c, { clearProps: 'all' });
      });

      // Measure clean un-transformed bounding rects
      const deltas = cardRefs.current.map((cardEl, idx) => {
        const targetEl = targetSlotRefs.current[idx];
        if (!cardEl || !targetEl) return { deltaX: 0, deltaY: 0, scale: 1 };

        const cardRect = cardEl.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();

        const deltaX = (targetRect.left + targetRect.width / 2) - (cardRect.left + cardRect.width / 2);
        const deltaY = (targetRect.top + targetRect.height / 2) - (cardRect.top + cardRect.height / 2);
        const scale = targetRect.width / cardRect.width;

        return { deltaX, deltaY, scale };
      });

      const stTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: heroEl,
          endTrigger: targetGridEl,
          start: 'top top',
          end: 'top 120px',
          scrub: 0.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setIsScrolled(self.progress > 0.08);
          },
        },
        defaults: {
          duration: 1,
          ease: 'power2.inOut',
        },
      });

      cardRefs.current.forEach((cardEl, idx) => {
        if (!cardEl) return;
        const d = deltas[idx];
        const staggerOffset = 0.015 * idx;

        stTimeline.fromTo(
          cardEl,
          { x: 0, y: 0, scale: 1, transformOrigin: '50% 50%' },
          { x: d.deltaX, y: d.deltaY, scale: d.scale, transformOrigin: '50% 50%' },
          staggerOffset
        );
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <div className="relative w-full overflow-visible">
      
      {/* ─────────────────────────────────────────────────────────────
          HERO SECTION (Dark Green Canvas #334238)
          Expansive scale & commanding card deck matching New Engen
          ───────────────────────────────────────────────────────────── */}
      <section
        ref={heroSectionRef}
        className="relative z-20 pt-28 sm:pt-36 pb-16 lg:pb-20 min-h-[860px] lg:min-h-[920px] flex items-center bg-ngen-green text-ngen-cream overflow-visible"
      >
        <div className="site-max relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Monumental Headline, Paragraph & Series List with Chevrons (6 cols) */}
            <div className="lg:col-span-6 flex flex-col items-start text-left relative z-10">
              
              {/* Bold Monumental Headline matching New Engen CREATIVE IS OUR EDGE */}
              <div className="relative mb-6">
                <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl xl:text-[6.8rem] tracking-[-0.04em] leading-[0.88] text-white uppercase max-w-3xl">
                  <SplitText delay={0.1}>BOTANICAL</SplitText>
                  <br />
                  <SplitText delay={0.25}>IS OUR</SplitText>
                  <br />
                  <SplitText delay={0.4}>CRAFT.</SplitText>
                </h1>
                {/* Floating Plus Crosshair matching New Engen Image 4 */}
                <span className="absolute -right-8 bottom-4 text-2xl text-ngen-cream/40 font-mono select-none hidden sm:inline-block">
                  +
                </span>
              </div>

              {/* Narrative Subtitle */}
              <p className="text-base sm:text-lg text-ngen-cream/80 leading-relaxed max-w-lg mb-8 font-sans">
                Flora is an architectural botanical atelier and pottery studio in Nellikuzhi, Kerala. We curate acclimatized living specimens and craft sculptural vessels designed to endure and transform modern spaces.
              </p>

              {/* Series Switcher with 4 Stacked Downward Lime Chevrons (matching New Engen Image 4) */}
              <div className="flex items-end justify-between w-full max-w-md pt-2 select-none">
                <div className="flex flex-col gap-1.5">
                  {curations.map((item, idx) => {
                    const isActive = activeReelIndex === idx;
                    return (
                      <button
                        key={item.id}
                        onClick={() => selectCard(idx)}
                        className={`text-left font-display font-black tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                          isActive
                            ? 'text-white text-base sm:text-lg translate-x-1'
                            : 'text-white/40 hover:text-white/75 text-xs sm:text-sm font-semibold'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>

                {/* 4 Stacked Downward Lime Chevrons (matching New Engen Image 4) */}
                <div className="flex flex-col items-center gap-1 mb-1 text-ngen-lime select-none">
                  <svg className="w-4 h-4 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                  <svg className="w-4 h-4 -mt-2 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                  <svg className="w-4 h-4 -mt-2 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                  <svg className="w-4 h-4 -mt-2 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>

            </div>

            {/* Right Column: Hero Video Card Deck (6 cols) - Expansive and Commanding */}
            <div className="lg:col-span-6 relative h-[620px] lg:h-[660px] flex items-center justify-center pt-4 lg:pt-0">
              
              {/* Desktop Interactive Fanned Card Deck */}
              <div
                ref={deckRef}
                className="hidden lg:block relative w-full h-full"
              >
                {curations.map((item, idx) => {
                  const isActive = activeReelIndex === idx;

                  // High-impact card dimensions matching New Engen 365px x 620px
                  const cardWidth = 360;
                  const zIndex = isActive ? 30 : 20 - idx;
                  const initialRotation = isActive ? 0 : (idx - 1.5) * 2.5;

                  return (
                    <div
                      key={item.id}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: `calc((100% - ${cardWidth}px) * ${idx} / 3)`,
                        width: `${cardWidth}px`,
                        height: '620px',
                        zIndex,
                      }}
                      className="carousel-cards-card origin-bottom"
                    >
                      {/* Inner Flip Element animated by GSAP ScrollTrigger */}
                      <div
                        ref={(el) => (cardRefs.current[idx] = el)}
                        className="js-flip absolute inset-0 cursor-pointer select-none will-change-transform"
                        onClick={() => {
                          if (!isScrolled) {
                            selectCard(idx);
                          } else {
                            addItem(item.product, 'Signature Curation');
                            setIsOpen(true);
                          }
                        }}
                      >
                        {/* Card Inner Shell (.js-t-card) */}
                        <div
                          style={{
                            transform: !isScrolled ? `rotate(${initialRotation}deg)` : 'rotate(0deg)',
                            transition: 'transform 0.4s cubic-bezier(0.19, 1, 0.22, 1)',
                          }}
                          className={`relative w-full h-full rounded-3xl overflow-hidden border transition-all duration-300 ${
                          isActive
                            ? 'border-ngen-lime shadow-2xl ring-1 ring-ngen-lime/50'
                            : 'border-white/15 hover:border-white/40'
                        }`}
                      >
                        {/* Video Element (All 4 videos play simultaneously in continuous smooth loops) */}
                        <video
                          ref={(el) => (videoRefs.current[idx] = el)}
                          src={item.reel.videoUrl}
                          poster={item.reel.posterUrl}
                          autoPlay
                          loop
                          muted={isMuted}
                          playsInline
                          preload="auto"
                          className="absolute inset-0 w-full h-full object-cover will-change-transform"
                        />

                        {/* Top Gradient for Controls Legibility */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent pointer-events-none" />

                        {/* Top Controls on Active Card */}
                        {isActive && !isScrolled && (
                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-30">
                            <span className="px-2.5 py-1 rounded-full bg-black/75 text-[9px] font-mono uppercase tracking-wider font-bold text-white border border-white/15">
                              Showroom Reel
                            </span>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={toggleMute}
                                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                                className="p-1.5 rounded-full bg-black/75 border border-white/20 text-white hover:bg-white/20 transition-all active:scale-90 cursor-pointer"
                              >
                                {isMuted ? <VolumeX className="w-3 h-3 text-ngen-cream/60" /> : <Volume2 className="w-3 h-3 text-ngen-lime" />}
                              </button>
                              <button
                                onClick={togglePlay}
                                aria-label={isPlaying ? 'Pause video' : 'Play video'}
                                className="p-1.5 rounded-full bg-black/75 border border-white/20 text-white hover:bg-white/20 transition-all active:scale-90 cursor-pointer"
                              >
                                {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-white" />}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Dimming Overlay: Dim inactive cards in hero; fade to 0 when scrolled into grid */}
                        <div
                          className="carousel-cards-card__bg absolute inset-0 pointer-events-none bg-black/60 transition-opacity duration-500"
                          style={{
                            opacity: isScrolled ? 0 : isActive ? 0 : 0.45,
                          }}
                        />

                        {/* ─────────────────────────────────────────────────────────────
                            SIGNATURE ARCHED CREAM MOUNTAIN BADGE (New Engen Cutaway)
                            Pristine typography and performance metric (no clunky buttons)
                            ───────────────────────────────────────────────────────────── */}
                        <div
                          className="absolute bottom-0 left-0 right-0 w-full h-[140px] pointer-events-auto transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] select-none z-20"
                          style={{
                            transform: (!isScrolled ? (isActive ? 'translateY(0)' : 'translateY(110%)') : (idx === 1 ? 'translateY(0)' : 'translateY(110%)')),
                          }}
                        >
                          {/* Exact SVG Arched Mountain Peak Cutaway */}
                          <svg
                            className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-md"
                            viewBox="0 0 360 140"
                            preserveAspectRatio="none"
                            fill="none"
                          >
                            <path
                              d="M 0 140 L 0 115 L 160 26 C 172 16, 188 16, 200 26 L 360 115 L 360 140 Z"
                              fill="#FAF2E8"
                            />
                          </svg>

                          {/* Badge Typography & Metrics matching New Engen Image 3 & 4 */}
                          <div className="relative z-10 flex flex-col items-center justify-end pb-5 px-4 text-center text-ngen-charcoal w-full h-full">
                            <span className="font-display font-black text-base tracking-wider uppercase text-ngen-charcoal">
                              {isScrolled && idx === 1 ? 'Monstera' : item.label}
                            </span>
                            <span className="font-sans text-xs font-semibold text-ngen-charcoal/80 mt-1 line-clamp-1">
                              {isScrolled && idx === 1 ? '+44% Root Vigour' : item.metric}
                            </span>
                          </div>
                        </div>

                      </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mobile Touch-Friendly Swipe Deck (< 1024px) */}
              <div className="lg:hidden flex overflow-x-auto gap-4 py-4 w-full px-2 scrollbar-none snap-x snap-mandatory">
                {curations.map((item, idx) => {
                  const isActive = activeReelIndex === idx;
                  return (
                    <div
                      key={item.id}
                      onClick={() => selectCard(idx)}
                      className={`snap-center flex-shrink-0 w-[270px] aspect-[9/16] rounded-3xl overflow-hidden relative border transition-all ${
                        isActive ? 'border-ngen-lime shadow-xl' : 'border-white/20'
                      }`}
                    >
                      <video
                        src={item.reel.videoUrl}
                        poster={item.reel.posterUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      <div className="absolute bottom-5 left-4 right-4 text-center">
                        <span className="text-[10px] uppercase font-mono font-bold text-ngen-lime block mb-1">
                          {item.label}
                        </span>
                        <p className="font-display font-bold text-sm text-white truncate mb-1">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-white/80 font-mono">
                          {item.metric}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

        </div>

        {/* Bottom Right Lime Badge matching New Engen Image 4 */}
        <div className="absolute bottom-6 right-6 sm:right-10 hidden sm:block z-10">
          <span className="px-4 py-1.5 rounded-full bg-ngen-lime text-ngen-charcoal font-mono text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
            For Planters & Patrons
          </span>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          TARGET SECTION: SELECTED WORK / CURATIONS (Cream Canvas #FAF2E8)
          Here is where the 4 hero video cards dock into the 4 grid slots!
          Matches New Engen Image 3 layout: Headline with embedded pill +
          clean bold titles + minimal pill tags (zero paragraphs/prices).
          ───────────────────────────────────────────────────────────── */}
      <section
        id="curations"
        ref={curationsSectionRef}
        className="relative z-10 pt-20 sm:pt-24 lg:pt-20 pb-20 sm:pb-28 bg-ngen-cream text-ngen-charcoal border-t border-black/10 overflow-hidden"
      >
        <div className="site-max">
          
          {/* Section Header with New Engen Embedded Pill Headline */}
          <div className="flex items-center justify-between gap-6 mb-12">
            <div>
              <h3 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl tracking-[-0.03em] text-ngen-charcoal leading-[1.05] flex flex-wrap items-center gap-x-3 gap-y-2">
                <span>Creating impact for</span>
                <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-ngen-lime text-ngen-charcoal font-display font-black text-2xl sm:text-3xl border border-black/10">
                  flora living
                </span>
              </h3>
            </div>

            <div className="text-3xl text-ngen-charcoal/40 font-mono select-none hidden sm:block">
              +
            </div>
          </div>

          {/* 4-Column Grid with Target Placeholder Slots */}
          <div
            ref={targetGridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 js-flip-targets"
          >
            {curations.map((item, idx) => (
              <div
                key={item.id}
                className="select-work-item flex flex-col group cursor-pointer"
                onClick={() => {
                  addItem(item.product, 'Signature Curation');
                  setIsOpen(true);
                }}
              >
                {/* Target Placeholder Slot (.js-flip-target) */}
                <div
                  ref={(el) => (targetSlotRefs.current[idx] = el)}
                  className="relative aspect-[10/16] rounded-3xl border border-black/10 bg-black/5 overflow-hidden js-flip-target"
                >
                  {/* Subtle placeholder text visible before or behind card docking */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-25 pointer-events-none">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-ngen-charcoal">
                      Flora Specimen 0{idx + 1}
                    </span>
                  </div>

                  {/* Visual Specimen Poster for Mobile (< 1024px) */}
                  <img
                    src={item.reel.posterUrl}
                    alt={item.name}
                    className="lg:hidden absolute inset-0 w-full h-full object-cover"
                  />

                  {/* Arched Cutaway Badge on 2nd Card in Grid (matching arrae in New Engen Image 3) */}
                  {idx === 1 && (
                    <div className="absolute bottom-0 left-0 right-0 w-full h-[110px] pointer-events-auto select-none z-10">
                      <svg
                        className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-md"
                        viewBox="0 0 360 140"
                        preserveAspectRatio="none"
                        fill="none"
                      >
                        <path
                          d="M 0 140 L 0 115 L 160 26 C 172 16, 188 16, 200 26 L 360 115 L 360 140 Z"
                          fill="#FAF2E8"
                        />
                      </svg>
                      <div className="relative z-10 flex flex-col items-center justify-end pb-3.5 px-3 text-center text-ngen-charcoal w-full h-full">
                        <span className="font-display font-black text-xs sm:text-sm uppercase text-ngen-charcoal">
                          Monstera
                        </span>
                        <span className="font-sans text-[11px] font-semibold text-ngen-charcoal/80 mt-0.5">
                          +44% Root Vigour
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Information Below the Docked Video Card (Pure New Engen Style: Bold Title + Pill Tags) */}
                <div className="pt-4 flex flex-col text-left">
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-ngen-charcoal group-hover:text-ngen-green transition-colors leading-tight mb-2.5">
                    {item.name}
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full border border-black/20 text-xs font-sans text-ngen-charcoal/80 bg-white/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Bottom Right Lime Badge matching New Engen Image 3 */}
          <div className="flex justify-end mt-8">
            <span className="px-4 py-1.5 rounded-full bg-ngen-lime text-ngen-charcoal font-mono text-xs font-extrabold uppercase tracking-wider shadow-sm">
              For Kerala Sanctuaries
            </span>
          </div>

          {/* Trust Highlights - Sleek Hairline Banner directly below Selected Work */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 mt-14 border-t border-black/10 font-mono text-xs">
            <div>
              <span className="font-display font-black text-2xl text-ngen-charcoal block leading-tight">
                <AnimatedCounter to={4.7} decimals={1} suffix="★" />
              </span>
              <span className="text-ngen-charcoal/80 uppercase text-[11px] tracking-wider font-semibold">Google Verified</span>
            </div>
            <div>
              <span className="font-display font-black text-2xl text-ngen-charcoal block leading-tight">
                <AnimatedCounter to={100} decimals={0} suffix="%" />
              </span>
              <span className="text-ngen-charcoal/80 uppercase text-[11px] tracking-wider font-semibold">Root Health</span>
            </div>
            <div>
              <span className="font-display font-black text-2xl text-ngen-charcoal block leading-tight">
                <AnimatedCounter to={24} decimals={0} suffix="-48h" />
              </span>
              <span className="text-ngen-charcoal/80 uppercase text-[11px] tracking-wider font-semibold">Kerala Delivery</span>
            </div>
            <div>
              <span className="font-display font-black text-2xl text-ngen-charcoal block leading-tight">
                <AnimatedCounter to={5000} decimals={0} suffix="+" />
              </span>
              <span className="text-ngen-charcoal/80 uppercase text-[11px] tracking-wider font-semibold">Installed Spaces</span>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
