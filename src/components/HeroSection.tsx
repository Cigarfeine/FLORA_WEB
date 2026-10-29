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
  const [activeCardIndex, setActiveCardIndex] = useState(1); // middle card active

  // Cycling kinetic words for New Engen style animated pill
  const spaces = ['LIVING ROOMS', 'BALCONIES', 'BOUTIQUE CAFÉS', 'MINIMALIST HOMES'];
  const [spaceIndex, setSpaceIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSpaceIndex((prev) => (prev + 1) % spaces.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [spaces.length]);

  // Scroll parallax for hero elements
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const deckRotate = useTransform(scrollYProgress, [0, 1], [0, 6]);

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

  const featuredProduct = PRODUCTS.find((p) => p.id === 'jaguar-cool-pot') || PRODUCTS[0];

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] pt-36 sm:pt-40 pb-20 flex items-center bg-ngen-green text-ngen-cream overflow-hidden border-b border-black/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        
        {/* Asymmetric 50/50 Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Bold New Engen Headline & CTAs (7 Cols) */}
          <motion.div
            style={{ y: textY }}
            className="lg:col-span-7 flex flex-col items-start text-left"
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
              className="text-base sm:text-lg text-ngen-cream/80 leading-relaxed max-w-xl mb-10 font-sans"
            >
              Flora is Kerala's premier creative-led horticulture & planter studio. We curate sculptural marble & ceramic vessels, living tropical exotics, and zero-maintenance silk botanicals for serene, architectural spaces.
            </motion.p>

            {/* Action Buttons: DualTextButton components */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.19, 1, 0.22, 1] }}
              className="flex flex-wrap items-center gap-4 mb-12"
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

            {/* Trust Highlights - Flat Hairline Grid with Animated Numbers */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="grid grid-cols-3 gap-6 pt-6 border-t border-white/15 w-full max-w-lg font-mono text-xs"
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

          {/* Right Column: 3D Overlapping Fanned Video Card Deck (5 Cols) */}
          <div className="lg:col-span-5 relative flex items-center justify-center pt-8 lg:pt-0">
            <motion.div
              style={{ rotate: deckRotate }}
              className="relative w-full max-w-sm h-[520px] sm:h-[580px] flex items-center justify-center"
            >
              {/* Card 0: Left Back Card (Reel 2) */}
              <motion.div
                initial={{ opacity: 0, x: -30, rotate: -10 }}
                animate={{ opacity: 0.8, x: -35, rotate: -7 }}
                whileHover={{ opacity: 1, x: -48, rotate: -10, scale: 1.02, zIndex: 30 }}
                onClick={() => setActiveCardIndex(0)}
                className="absolute w-[260px] sm:w-[280px] aspect-[9/16] rounded-3xl overflow-hidden border border-white/20 bg-black cursor-pointer transition-all duration-300 z-10 -translate-y-4 select-none"
              >
                <img
                  src={VIDEO_REELS[1].posterUrl}
                  alt={VIDEO_REELS[1].title}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] uppercase font-mono font-bold text-ngen-lime block">
                    Pots & Urns
                  </span>
                  <h4 className="font-display font-bold text-xs text-white truncate">
                    {VIDEO_REELS[1].title}
                  </h4>
                </div>
              </motion.div>

              {/* Card 2: Right Back Card (Reel 3) */}
              <motion.div
                initial={{ opacity: 0, x: 30, rotate: 10 }}
                animate={{ opacity: 0.8, x: 35, rotate: 7 }}
                whileHover={{ opacity: 1, x: 48, rotate: 10, scale: 1.02, zIndex: 30 }}
                onClick={() => setActiveCardIndex(2)}
                className="absolute w-[260px] sm:w-[280px] aspect-[9/16] rounded-3xl overflow-hidden border border-white/20 bg-black cursor-pointer transition-all duration-300 z-10 translate-y-4 select-none"
              >
                <img
                  src={VIDEO_REELS[2].posterUrl}
                  alt={VIDEO_REELS[2].title}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] uppercase font-mono font-bold text-ngen-peach block">
                    Tropical Flora
                  </span>
                  <h4 className="font-display font-bold text-xs text-white truncate">
                    {VIDEO_REELS[2].title}
                  </h4>
                </div>
              </motion.div>

              {/* Card 1: Center Front Active Reel Card (Playing Live Video) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                className="relative w-[280px] sm:w-[310px] aspect-[9/16] rounded-3xl overflow-hidden border border-white/30 bg-black z-20 group"
              >
                <video
                  ref={videoRef}
                  src={VIDEO_REELS[activeCardIndex === 0 ? 1 : activeCardIndex === 2 ? 2 : 0].videoUrl}
                  poster={VIDEO_REELS[activeCardIndex === 0 ? 1 : activeCardIndex === 2 ? 2 : 0].posterUrl}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* Video Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none" />

                {/* Top Overlay Controls */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-30">
                  <span className="px-3 py-1 rounded-full bg-black/70 text-[10px] font-mono uppercase tracking-wider font-bold text-white border border-white/15">
                    Showroom Reel
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleSound}
                      aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                      className="p-2 rounded-full bg-black/70 border border-white/20 text-white hover:bg-white/20 transition-all active:scale-90"
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5 text-ngen-cream/60" /> : <Volume2 className="w-3.5 h-3.5 text-ngen-lime" />}
                    </button>
                    <button
                      onClick={togglePlay}
                      aria-label={isPlaying ? 'Pause video' : 'Play video'}
                      className="p-2 rounded-full bg-black/70 border border-white/20 text-white hover:bg-white/20 transition-all active:scale-90"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                    </button>
                  </div>
                </div>

                {/* Bottom Featured Store Item Card - Flat Hairline Box */}
                <div className="absolute bottom-4 left-4 right-4 z-30">
                  <div className="bg-ngen-green/95 rounded-2xl p-3.5 border border-white/20 text-white">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] uppercase font-mono font-bold text-ngen-lime">
                        Featured in Showroom
                      </span>
                      <span className="text-xs font-mono font-bold text-ngen-peach">
                        ₹{featuredProduct.price}
                      </span>
                    </div>

                    <h4 className="font-display font-bold text-xs text-white truncate mb-1">
                      {featuredProduct.name}
                    </h4>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                      <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>In Stock Nellikuzhi</span>
                      </div>

                      <button
                        onClick={() => addItem(featuredProduct, 'Grey Marble')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-ngen-peach hover:bg-ngen-peachHover text-ngen-charcoal transition-all active:scale-95"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Quick Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
};
