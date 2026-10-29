import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, ShoppingBag, ArrowDownRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { FLORA_INFO, PRODUCTS } from '../data/catalog';
import { useCart } from '../context/CartContext';

export const HeroSection: React.FC = () => {
  const { addItem } = useCart();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

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

  const featuredHeroProduct = PRODUCTS.find(p => p.id === 'jaguar-cool-pot') || PRODUCTS[0];

  return (
    <section className="relative min-h-[100dvh] pt-28 pb-16 flex items-center bg-gradient-to-b from-sand-100/70 via-sand-50 to-sand-50 overflow-hidden">
      
      {/* Subtle Ambient Botanical Background Accents */}
      <div className="absolute top-10 -left-20 w-96 h-96 rounded-full bg-botanical-200/25 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[30rem] h-[30rem] rounded-full bg-terracotta-200/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        
        {/* Asymmetric 50/50 Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline & Actions (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Origin & Live Status Pill */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-sand-200/70 border border-sand-300 text-botanical-900 text-xs font-semibold mb-6 shadow-sm"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <span>Boutique Studio in Nellikuzhi, Kerala</span>
              <span className="text-sand-400">•</span>
              <span className="text-terracotta-700">Open Daily</span>
            </motion.div>

            {/* Display Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.08] text-botanical-950 mb-6"
            >
              Living botanicals & handcrafted sculptural planters.
            </motion.h1>

            {/* Narrative Body Text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg text-sand-800 leading-relaxed max-w-xl mb-8"
            >
              From artisanal marble & ceramic pots to lush indoor greenery and zero-maintenance silk botanicals, Flora curates statement natural decor crafted for serene, mindful Kerala homes.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-4 mb-10"
            >
              <a
                href="#collection"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-botanical-900 text-white font-medium text-sm hover:bg-botanical-800 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
              >
                <span>Explore Curated Catalog</span>
                <ArrowDownRight className="w-4 h-4 text-terracotta-300" />
              </a>

              <a
                href="#studio"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white border border-sand-300 text-botanical-950 font-medium text-sm hover:bg-sand-100 transition-all duration-200 active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-terracotta-600" />
                <span>Plant & Pot Matcher</span>
              </a>
            </motion.div>

            {/* Proof Metric Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="grid grid-cols-3 gap-4 pt-6 border-t border-sand-300/60 w-full max-w-lg"
            >
              <div>
                <span className="font-serif text-2xl font-bold text-botanical-950 block leading-tight">
                  {FLORA_INFO.googleRating}★
                </span>
                <span className="text-xs text-sand-700">Google Verified Rating</span>
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-botanical-950 block leading-tight">
                  100%
                </span>
                <span className="text-xs text-sand-700">Healthy Root Promise</span>
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-botanical-950 block leading-tight">
                  24-48h
                </span>
                <span className="text-xs text-sand-700">Kerala Fast Delivery</span>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Live Walkthrough Video Reel & Floating Hero Card (5 Cols) */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto max-w-md rounded-3xl overflow-hidden shadow-2xl border-2 border-sand-200 bg-botanical-950 aspect-[9/15] group"
            >
              {/* Store Walkthrough Real Video */}
              <video
                ref={videoRef}
                src="https://video.wixstatic.com/video/d244c7_31c90afffb2945b4ab753c8bec873d2e/720p/mp4/file.mp4"
                poster="https://static.wixstatic.com/media/d244c7_31c90afffb2945b4ab753c8bec873d2ef000.jpg"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Video Overlay Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-botanical-950/80 via-transparent to-botanical-950/20 pointer-events-none" />

              {/* Top Video Controls Bar */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-botanical-950/60 backdrop-blur-md border border-white/10 text-white text-[11px] font-medium tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Store Walkthrough</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleSound}
                    aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
                    className="p-2 rounded-full bg-botanical-950/60 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all duration-200 active:scale-90"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-sand-300" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                  </button>

                  <button
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pause video' : 'Play video'}
                    className="p-2 rounded-full bg-botanical-950/60 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all duration-200 active:scale-90"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                  </button>
                </div>
              </div>

              {/* Bottom Floating Interactive Product Card (Real Jaguar Pot Feature) */}
              <div className="absolute bottom-4 left-4 right-4 z-20">
                <div className="glass-panel-dark rounded-2xl p-4 text-white">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-terracotta-400">
                      Featured in Store
                    </span>
                    <span className="text-xs font-bold text-white font-mono">
                      ₹{featuredHeroProduct.price}
                    </span>
                  </div>

                  <h3 className="font-serif text-sm font-semibold text-sand-50 mb-1 leading-snug line-clamp-1">
                    {featuredHeroProduct.name}
                  </h3>
                  <p className="text-[11px] text-sand-300 line-clamp-1 mb-3">
                    20.32 cm marble composite with matched saucer
                  </p>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>In Stock at Nellikuzhi</span>
                    </div>

                    <button
                      onClick={() => addItem(featuredHeroProduct, 'Grey Marble')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-terracotta-500 hover:bg-terracotta-600 text-white transition-all duration-200 shadow active:scale-95"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Quick Add</span>
                    </button>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>

        </div>

      </div>

    </section>
  );
};
