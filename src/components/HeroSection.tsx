import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { PRODUCTS, VIDEO_REELS } from '../data/catalog';
import { useCart } from '../context/CartContext';
import { DualTextButton } from './ui/DualTextButton';
import { SplitText } from './ui/SplitText';
import { AnimatedCounter } from './ui/AnimatedCounter';

export const HeroSection: React.FC = () => {
  const { addItem } = useCart();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [activeReelIndex, setActiveReelIndex] = useState(0);

  // Cycling kinetic words for New Engen style animated pill
  const spaces = ['LIVING ROOMS', 'BALCONIES', 'BOUTIQUE CAFÉS', 'MINIMALIST HOMES'];
  const [spaceIndex, setSpaceIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSpaceIndex((prev) => (prev + 1) % spaces.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [spaces.length]);

  // Scroll parallax for hero elements and reels
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Left text parallax: gently scrolls upward
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.4]);

  // 4 Reels Scroll Transforms: Stacked on the right at scroll 0, fanning out horizontally across the viewport and descending into the cream section as you scroll
  const card0X = useTransform(scrollYProgress, [0, 0.75], [0, -560]);
  const card0Y = useTransform(scrollYProgress, [0, 1], [0, 720]);
  const card0Rotate = useTransform(scrollYProgress, [0, 0.75], [-6, 0]);

  const card1X = useTransform(scrollYProgress, [0, 0.75], [35, -290]);
  const card1Y = useTransform(scrollYProgress, [0, 1], [0, 620]);
  const card1Rotate = useTransform(scrollYProgress, [0, 0.75], [-2, 0]);

  const card2X = useTransform(scrollYProgress, [0, 0.75], [70, -40]);
  const card2Y = useTransform(scrollYProgress, [0, 1], [0, 680]);
  const card2Rotate = useTransform(scrollYProgress, [0, 0.75], [2, 0]);

  const card3X = useTransform(scrollYProgress, [0, 0.75], [105, 230]);
  const card3Y = useTransform(scrollYProgress, [0, 1], [0, 580]);
  const card3Rotate = useTransform(scrollYProgress, [0, 0.75], [6, 0]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const heroReels = [
    {
      id: 'jaguar',
      label: 'JAGUAR COOL POT',
      product: PRODUCTS.find((p) => p.id === 'jaguar-cool-pot') || PRODUCTS[0],
      reel: VIDEO_REELS[0],
      metric: '982K Impressions',
    },
    {
      id: 'monstera',
      label: 'MONSTERA EXOTIC',
      product: PRODUCTS.find((p) => p.id === 'monstera-deliciosa') || PRODUCTS[1],
      reel: VIDEO_REELS[1],
      metric: '+44% Root Vigour',
    },
    {
      id: 'fiddle',
      label: 'FIDDLE LEAF FIG',
      product: PRODUCTS.find((p) => p.id === 'ribbed-ceramic-urn') || PRODUCTS[2],
      reel: VIDEO_REELS[2],
      metric: 'Architectural Scale',
    },
    {
      id: 'faux',
      label: 'FAUX BOTANICALS',
      product: PRODUCTS.find((p) => p.id === 'grand-terracotta-urn') || PRODUCTS[3],
      reel: VIDEO_REELS[3],
      metric: 'Zero Maintenance',
    },
  ];


  return (
    <section
      ref={containerRef}
      className="relative z-20 min-h-[95dvh] pt-36 sm:pt-40 pb-16 flex items-center bg-ngen-green text-ngen-cream overflow-visible"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        
        {/* Asymmetric 50/50 Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Left Column: Bold New Engen Headline, Item Switcher & CTAs (7 Cols) */}
          <motion.div
            style={{ y: textY, opacity: textOpacity }}
            className="lg:col-span-6 flex flex-col items-start text-left relative z-10"
          >
            
            {/* New Engen Style Dynamic Rotating Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-[11px] font-mono uppercase tracking-wider text-ngen-cream mb-6 select-none"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ngen-lime opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-ngen-lime"></span>
              </span>
              <span>SCULPTING NATURE FOR</span>
              <div className="h-5 overflow-hidden inline-flex items-center text-ngen-lime font-bold">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={spaces[spaceIndex]}
                    initial={{ y: 14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -14, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
                    className="inline-block"
                  >
                    [{spaces[spaceIndex]}]
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Massive Bold Headline with SplitText Bottom-Origin Character Unroll (New Engen style) */}
            <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl tracking-[-0.03em] leading-[0.9] text-white uppercase mb-8 max-w-5xl">
              <SplitText delay={0.1}>NATURE IS</SplitText>
              <br />
              <SplitText delay={0.3}>OUR CANVAS.</SplitText>
            </h1>

            {/* Narrative Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.19, 1, 0.22, 1] }}
              className="text-base sm:text-lg text-ngen-cream/80 leading-relaxed max-w-xl mb-8 font-sans"
            >
              Flora is Kerala's premier creative-led horticulture & planter studio. We curate sculptural marble & ceramic vessels, living tropical exotics, and zero-maintenance silk botanicals for serene, architectural spaces.
            </motion.p>

            {/* Action Buttons: DualTextButton components */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.19, 1, 0.22, 1] }}
              className="flex flex-wrap items-center gap-4 mb-8"
            >
              <DualTextButton
                href="#collection"
                variant="peach"
                size="lg"
                showArrow
              >
                Explore Collection
              </DualTextButton>

              <DualTextButton
                href="#studio"
                variant="outline-light"
                size="lg"
              >
                Plant & Pot Studio
              </DualTextButton>
            </motion.div>

            {/* Item Series Switcher (Matching New Engen ALTRA / ARRAE / OREO / COCA-COLA) */}
            <div className="flex flex-col gap-2 pt-6 border-t border-white/15 w-full max-w-md select-none">
              <div className="flex items-center gap-6">
                <div className="flex flex-col gap-1.5">
                  {heroReels.map((item, idx) => {
                    const isActive = activeReelIndex === idx;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveReelIndex(idx)}
                        className={`flex items-center gap-3 text-left font-display font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                          isActive
                            ? 'text-white'
                            : 'text-white/40 hover:text-white/70'
                        }`}
                      >
                        <span>{item.label}</span>
                        {isActive && (
                          <span className="text-ngen-lime font-mono text-xs font-bold">
                            {'>>>>'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Trust Highlights - Flat Hairline Grid with Animated Numbers */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="grid grid-cols-3 gap-6 pt-6 border-t border-white/15 w-full max-w-lg font-mono text-xs mt-6"
            >
              <div>
                <span className="font-display font-black text-2xl text-white block leading-tight">
                  <AnimatedCounter to={4.7} decimals={1} suffix="★" />
                </span>
                <span className="text-ngen-cream/60 uppercase text-[11px] tracking-wider">Google Verified</span>
              </div>
              <div>
                <span className="font-display font-black text-2xl text-white block leading-tight">
                  <AnimatedCounter to={100} decimals={0} suffix="%" />
                </span>
                <span className="text-ngen-cream/60 uppercase text-[11px] tracking-wider">Root Health</span>
              </div>
              <div>
                <span className="font-display font-black text-2xl text-white block leading-tight">
                  <AnimatedCounter to={24} decimals={0} suffix="-48h" />
                </span>
                <span className="text-ngen-cream/60 uppercase text-[11px] tracking-wider">Kerala Delivery</span>
              </div>
            </motion.div>

          </motion.div>

          {/* Right & Center Scroll-Tied Reels Grid (Matching New Engen reels that scroll with you) */}
          <div className="lg:col-span-6 relative h-[560px] sm:h-[640px] flex items-center justify-center pt-8 lg:pt-0">
            
            {/* Desktop Fan-Out Reels (Scroll with you across the boundary) */}
            <div className="hidden lg:flex relative w-full h-full items-center justify-center">
              
              {/* 4 Interactive Scroll-Tied Reels matching New Engen */}
              {heroReels.map((item, idx) => {
                const isActive = activeReelIndex === idx;
                const cardX = [card0X, card1X, card2X, card3X][idx];
                const cardY = [card0Y, card1Y, card2Y, card3Y][idx];
                const cardRotate = [card0Rotate, card1Rotate, card2Rotate, card3Rotate][idx];

                const zIndex = isActive ? 30 : 20 - Math.abs(idx - activeReelIndex);

                return (
                  <motion.div
                    key={item.id}
                    style={{ x: cardX, y: cardY, rotate: cardRotate, zIndex }}
                    onClick={() => setActiveReelIndex(idx)}
                    className={`absolute w-[240px] xl:w-[260px] aspect-[9/16] rounded-3xl overflow-hidden border cursor-pointer transition-colors duration-300 select-none shadow-2xl ${
                      isActive
                        ? 'border-ngen-lime ring-2 ring-ngen-lime'
                        : 'border-white/20 hover:border-white/50'
                    }`}
                  >
                    {isActive ? (
                      /* Active Reel: Live Video with Sound & Controls + Bottom Store Product Card */
                      <div className="relative w-full h-full bg-black">
                        <video
                          ref={videoRef}
                          src={item.reel.videoUrl}
                          poster={item.reel.posterUrl}
                          autoPlay
                          loop
                          muted={isMuted}
                          playsInline
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none" />

                        {/* Top Controls */}
                        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-30">
                          <span className="px-2.5 py-1 rounded-full bg-black/70 text-[9px] font-mono uppercase tracking-wider font-bold text-white border border-white/15">
                            Showroom Reel
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSound();
                              }}
                              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                              className="p-1.5 rounded-full bg-black/70 border border-white/20 text-white hover:bg-white/20 transition-all active:scale-90 cursor-pointer"
                            >
                              {isMuted ? <VolumeX className="w-3 h-3 text-ngen-cream/60" /> : <Volume2 className="w-3 h-3 text-ngen-lime" />}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePlay();
                              }}
                              aria-label={isPlaying ? 'Pause video' : 'Play video'}
                              className="p-1.5 rounded-full bg-black/70 border border-white/20 text-white hover:bg-white/20 transition-all active:scale-90 cursor-pointer"
                            >
                              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-white" />}
                            </button>
                          </div>
                        </div>

                        {/* Bottom Featured Store Item Card */}
                        <div className="absolute bottom-3 left-3 right-3 z-30">
                          <div className="bg-ngen-green/95 rounded-2xl p-3 border border-white/20 text-white shadow-lg">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-[9px] uppercase font-mono font-bold text-ngen-lime">
                                {item.label}
                              </span>
                              <span className="text-xs font-mono font-bold text-ngen-peach">
                                ₹{item.product.price}
                              </span>
                            </div>

                            <h4 className="font-display font-bold text-[11px] text-white truncate mb-1.5">
                              {item.product.name}
                            </h4>

                            <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-white/10">
                              <div className="flex items-center gap-1 text-[9px] text-emerald-400">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                <span>In Stock</span>
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addItem(item.product, 'Selected Vessel');
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-ngen-peach hover:bg-ngen-peachHover text-ngen-charcoal transition-all active:scale-95 cursor-pointer"
                              >
                                <ShoppingBag className="w-2.5 h-2.5" />
                                <span>Quick Add</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Inactive Card: Crisp Poster Image with New Engen Arched Label & Metric */
                      <div className="relative w-full h-full bg-black group/card">
                        <img
                          src={item.reel.posterUrl}
                          alt={item.reel.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                        {/* Arched Bottom Badge matching New Engen */}
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="bg-ngen-green/90 rounded-xl p-2.5 border border-white/15 text-white">
                            <span className="text-[9px] uppercase font-mono font-bold text-ngen-lime block mb-0.5">
                              {item.label}
                            </span>
                            <div className="flex items-center justify-between">
                              <h4 className="font-display font-bold text-[11px] text-white truncate">
                                {item.metric}
                              </h4>
                              <span className="text-[9px] font-mono font-bold text-ngen-peach">
                                ₹{item.product.price}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}

            </div>

            {/* Mobile Touch-Friendly Swipe Deck */}
            <div className="lg:hidden flex overflow-x-auto gap-4 py-4 w-full px-2 scrollbar-none snap-x snap-mandatory">
              {heroReels.map((item, idx) => {
                const isActive = activeReelIndex === idx;
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveReelIndex(idx)}
                    className={`snap-center flex-shrink-0 w-[240px] aspect-[9/16] rounded-3xl overflow-hidden relative border ${
                      isActive ? 'border-ngen-lime' : 'border-white/20'
                    }`}
                  >
                    <img
                      src={item.reel.posterUrl}
                      alt={item.reel.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-[10px] uppercase font-mono font-bold text-ngen-lime block">
                        {item.label}
                      </span>
                      <h4 className="font-display font-bold text-xs text-white truncate mb-2">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addItem(item.product);
                        }}
                        className="w-full py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-ngen-peach text-ngen-charcoal flex items-center justify-center gap-1"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Add ₹{item.product.price}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
