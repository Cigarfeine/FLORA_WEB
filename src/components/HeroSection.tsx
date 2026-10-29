import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';
import { FLORA_INFO, PRODUCTS, VIDEO_REELS } from '../data/catalog';
import { useCart } from '../context/CartContext';

export const HeroSection: React.FC = () => {
  const { addItem } = useCart();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [activeCardIndex, setActiveCardIndex] = useState(1); // middle card active

  // Scroll parallax for hero elements
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const deckRotate = useTransform(scrollYProgress, [0, 1], [0, 10]);

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

  const featuredProduct = PRODUCTS.find(p => p.id === 'jaguar-cool-pot') || PRODUCTS[0];

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] pt-36 sm:pt-40 pb-20 flex items-center bg-ngen-green text-ngen-cream overflow-hidden"
    >
      {/* Background Ambience & Lighting */}
      <div className="absolute top-0 right-1/4 w-[45rem] h-[45rem] rounded-full bg-ngen-lightgreen/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[35rem] h-[35rem] rounded-full bg-botanical-950/60 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        
        {/* Asymmetric 50/50 Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Bold New Engen Headline & CTAs (7 Cols) */}
          <motion.div
            style={{ y: textY }}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            
            {/* Live Studio Status Pill */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-mono font-bold uppercase tracking-wider text-sand-100 mb-6 backdrop-blur-sm"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ngen-lime opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-ngen-lime"></span>
              </span>
              <span>Boutique Studio in Nellikuzhi</span>
              <span className="text-white/40">•</span>
              <span className="text-ngen-lime font-bold">Open Today</span>
            </motion.div>

            {/* Massive Bold Headline (New Engen style) */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-black text-5xl sm:text-7xl lg:text-8xl tracking-tighter leading-[0.92] text-white uppercase mb-8"
            >
              NATURE IS<br />
              OUR CANVAS.
            </motion.h1>

            {/* Narrative Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg text-sand-200/90 leading-relaxed max-w-xl mb-10 font-sans"
            >
              Flora is Kerala's premier creative-led horticulture & planter destination. We craft sculptural marble & ceramic pots, living tropical flora, and zero-maintenance silk botanicals for serene, design-forward homes.
            </motion.p>

            {/* Action Buttons: New Engen Peach Pill + Frosted White Pill */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-4 mb-12"
            >
              <a
                href="#collection"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-ngen-peach hover:bg-ngen-peachHover text-botanical-950 font-display font-extrabold text-sm uppercase tracking-wider transition-all duration-200 shadow-xl hover:shadow-2xl active:scale-95 group"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>

              <a
                href="#studio"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-display font-bold text-sm uppercase tracking-wider transition-all duration-200 backdrop-blur-sm active:scale-95"
              >
                <span>Plant & Pot Studio</span>
              </a>
            </motion.div>

            {/* Trust Highlights */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-3 gap-6 pt-6 border-t border-white/15 w-full max-w-lg font-mono text-xs"
            >
              <div>
                <span className="font-display font-black text-2xl text-white block leading-tight">
                  {FLORA_INFO.googleRating}★
                </span>
                <span className="text-sand-400">Google Verified</span>
              </div>
              <div>
                <span className="font-display font-black text-2xl text-white block leading-tight">
                  100%
                </span>
                <span className="text-sand-400">Root Health Guarantee</span>
              </div>
              <div>
                <span className="font-display font-black text-2xl text-white block leading-tight">
                  24-48h
                </span>
                <span className="text-sand-400">Kerala Fast Delivery</span>
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
                initial={{ opacity: 0, x: -30, rotate: -12 }}
                animate={{ opacity: 0.75, x: -35, rotate: -8 }}
                whileHover={{ opacity: 1, x: -50, rotate: -12, scale: 1.02, zIndex: 30 }}
                onClick={() => setActiveCardIndex(0)}
                className="absolute w-[260px] sm:w-[280px] aspect-[9/16] rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl bg-black cursor-pointer transition-all duration-300 z-10 -translate-y-4"
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
                initial={{ opacity: 0, x: 30, rotate: 12 }}
                animate={{ opacity: 0.75, x: 35, rotate: 8 }}
                whileHover={{ opacity: 1, x: 50, rotate: 12, scale: 1.02, zIndex: 30 }}
                onClick={() => setActiveCardIndex(2)}
                className="absolute w-[260px] sm:w-[280px] aspect-[9/16] rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl bg-black cursor-pointer transition-all duration-300 z-10 translate-y-4"
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
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                className="relative w-[280px] sm:w-[310px] aspect-[9/16] rounded-3xl overflow-hidden border-2 border-white/40 shadow-2xl bg-black z-20 group"
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
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-mono font-bold text-white border border-white/20">
                    Live Showroom Reel
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleSound}
                      aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                      className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all active:scale-90"
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5 text-sand-300" /> : <Volume2 className="w-3.5 h-3.5 text-ngen-lime" />}
                    </button>
                    <button
                      onClick={togglePlay}
                      aria-label={isPlaying ? 'Pause video' : 'Play video'}
                      className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all active:scale-90"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                    </button>
                  </div>
                </div>

                {/* Bottom Featured Store Item Card */}
                <div className="absolute bottom-4 left-4 right-4 z-30">
                  <div className="bg-botanical-950/80 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 text-white shadow-lg">
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
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-ngen-peach hover:bg-ngen-peachHover text-botanical-950 transition-all active:scale-95 shadow"
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
