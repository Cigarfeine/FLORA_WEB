import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { InstagramIcon } from './icons/InstagramIcon';
import { VIDEO_REELS, FLORA_INFO, PRODUCTS } from '../data/catalog';
import { useCart } from '../context/CartContext';

export const VideoReelsSection: React.FC = () => {
  const { addItem } = useCart();
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [spaceIndex, setSpaceIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const spaces = [
    'LIVING ROOMS',
    'ARCHITECTURAL BALCONIES',
    'MINIMALIST WORKSPACES',
    'SUNLIT PATIOS',
    'BOUTIQUE CAFÉS',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setSpaceIndex((prev) => (prev + 1) % spaces.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [spaces.length]);

  const activeReel = VIDEO_REELS[activeReelIndex];

  const handleSelectReel = (index: number) => {
    setActiveReelIndex(index);
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

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

  const handleQuickAddReelItem = () => {
    const matched = PRODUCTS.find(p => p.name.includes(activeReel.featuredProductName || '')) || PRODUCTS[0];
    addItem(matched);
  };

  return (
    <section id="reels" className="py-24 bg-ngen-darkgreen text-sand-50 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] rounded-full bg-ngen-lightgreen/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] rounded-full bg-ngen-green/30 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with New Engen Kinetic Badge */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ngen-lime/20 border border-ngen-lime/30 text-xs font-mono font-bold uppercase tracking-wider text-ngen-lime mb-4">
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>@flora__pots • Live Showroom Reels</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-tighter text-white leading-tight">
              CULTIVATING HARMONY FOR{' '}
              <span className="inline-block relative">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={spaceIndex}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-block bg-ngen-lime text-botanical-950 px-4 py-1 rounded-full font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl align-middle shadow-lg"
                  >
                    {spaces[spaceIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h2>
          </div>
          <a
            href={FLORA_INFO.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono font-bold uppercase tracking-wider text-white transition-all backdrop-blur-sm self-start md:self-auto group active:scale-95"
          >
            <InstagramIcon className="w-4 h-4 text-ngen-peach" />
            <span>Watch on Instagram</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-white/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* Video Reel Experience Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Active Reel Display (7 Cols) */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="relative w-full max-w-sm aspect-[9/16] rounded-3xl overflow-hidden border border-sand-800 shadow-2xl bg-black group">
              
              <AnimatePresence mode="wait">
                <motion.video
                  key={activeReel.id}
                  ref={videoRef}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={activeReel.videoUrl}
                  poster={activeReel.posterUrl}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-botanical-950/90 via-transparent to-botanical-950/30 pointer-events-none" />

              {/* Controls Overlay */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-semibold text-sand-200 border border-white/10">
                  {activeReel.duration}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleSound}
                    aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
                    className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-sand-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                  </button>
                  <button
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pause reel playback' : 'Play reel'}
                    className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 fill-white" />}
                  </button>
                </div>
              </div>

              {/* Reel Metadata & Quick Buy Tag */}
              <div className="absolute bottom-4 left-4 right-4 z-20">
                <div className="bg-botanical-950/90 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-ngen-lime block mb-0.5">
                    {activeReel.subtitle}
                  </span>
                  <h3 className="font-display font-bold text-sm text-white mb-3">
                    {activeReel.title}
                  </h3>

                  {activeReel.featuredProductName && (
                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/15">
                      <div>
                        <span className="text-[11px] text-sand-300 block line-clamp-1">
                          Featured: {activeReel.featuredProductName}
                        </span>
                        <span className="text-xs font-mono font-bold text-ngen-peach">
                          ₹{activeReel.featuredProductPrice}
                        </span>
                      </div>
                      <button
                        onClick={handleQuickAddReelItem}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-extrabold uppercase bg-ngen-peach hover:bg-ngen-peachHover text-botanical-950 transition-all active:scale-95 shadow-md"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add Item</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Playlist & Story Thumbnails (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-sand-400 block mb-4">
              Explore All 4 Studio Walkthroughs
            </span>

            {VIDEO_REELS.map((reel, index) => {
              const isSelected = activeReelIndex === index;
              return (
                <button
                  key={reel.id}
                  onClick={() => handleSelectReel(index)}
                  className={`w-full p-4 rounded-2xl text-left border transition-all duration-200 flex items-center gap-4 ${
                    isSelected
                      ? 'border-ngen-lime bg-white/10 ring-1 ring-ngen-lime/60 shadow-xl'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="relative w-16 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-sand-900 border border-sand-700">
                    <img
                      src={reel.posterUrl}
                      alt={reel.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Play className="w-4 h-4 text-white fill-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold text-ngen-lime uppercase tracking-wider">
                        Reel 0{index + 1}
                      </span>
                      <span className="text-[11px] font-mono text-sand-400">
                        {reel.duration}
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-sm text-white truncate mb-1">
                      {reel.title}
                    </h4>
                    <p className="text-xs text-sand-400 truncate">
                      {reel.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
