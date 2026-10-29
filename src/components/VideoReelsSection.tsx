import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, ShoppingBag } from 'lucide-react';
import { InstagramIcon } from './icons/InstagramIcon';
import { VIDEO_REELS, FLORA_INFO, PRODUCTS } from '../data/catalog';
import { useCart } from '../context/CartContext';
import { DualTextButton } from './ui/DualTextButton';

export const VideoReelsSection: React.FC = () => {
  const { addItem } = useCart();
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [spaceIndex, setSpaceIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const spaces = [
    'LIVING ROOMS',
    'BALCONIES',
    'MINIMALIST SPACES',
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
    const matched = PRODUCTS.find((p) => p.name.includes(activeReel.featuredProductName || '')) || PRODUCTS[0];
    addItem(matched);
  };

  return (
    <section id="reels" className="py-24 bg-ngen-darkgreen text-ngen-cream relative overflow-hidden border-b border-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with New Engen Kinetic Badge */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ngen-green border border-white/10 text-xs font-mono font-bold uppercase tracking-wider text-ngen-lime mb-4">
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>@flora__pots • Live Showroom Reels</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-[-0.03em] text-white leading-[0.95]">
              CULTIVATING HARMONY FOR{' '}
              <span className="inline-block relative">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={spaceIndex}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
                    className="inline-block bg-ngen-lime text-ngen-charcoal px-3.5 py-0.5 rounded-full font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl align-middle"
                  >
                    {spaces[spaceIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h2>
          </div>
          <DualTextButton
            href={FLORA_INFO.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline-light"
            size="md"
            showArrow
            className="self-start md:self-auto"
          >
            Instagram Reels
          </DualTextButton>
        </div>

        {/* Video Reel Experience Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Active Reel Display (7 Cols) */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="relative w-full max-w-sm aspect-[9/16] rounded-3xl overflow-hidden border border-white/20 bg-black group">
              
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none" />

              {/* Controls Overlay */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                <span className="px-3 py-1 rounded-full bg-black/70 text-[10px] font-mono uppercase tracking-wider font-bold text-white border border-white/10">
                  {activeReel.duration}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleSound}
                    aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
                    className="p-2 rounded-full bg-black/70 border border-white/15 text-white hover:bg-white/20 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-ngen-cream/60" /> : <Volume2 className="w-4 h-4 text-ngen-lime" />}
                  </button>
                  <button
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pause reel playback' : 'Play reel'}
                    className="p-2 rounded-full bg-black/70 border border-white/15 text-white hover:bg-white/20 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 fill-white" />}
                  </button>
                </div>
              </div>

              {/* Reel Metadata & Quick Buy Tag */}
              <div className="absolute bottom-4 left-4 right-4 z-20">
                <div className="bg-ngen-green/95 rounded-2xl p-4 border border-white/20">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-ngen-lime block mb-0.5">
                    {activeReel.subtitle}
                  </span>
                  <h3 className="font-display font-black text-sm uppercase text-white mb-3">
                    {activeReel.title}
                  </h3>

                  {activeReel.featuredProductName && (
                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/15">
                      <div>
                        <span className="text-[11px] text-ngen-cream/80 block line-clamp-1 font-mono">
                          Featured: {activeReel.featuredProductName}
                        </span>
                        <span className="text-xs font-mono font-bold text-ngen-peach">
                          ₹{activeReel.featuredProductPrice}
                        </span>
                      </div>
                      <button
                        onClick={handleQuickAddReelItem}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-display font-black uppercase tracking-wider bg-ngen-peach hover:bg-ngen-peachHover text-ngen-charcoal transition-all active:scale-95 border border-ngen-peach"
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
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-ngen-cream/60 block mb-4">
              Explore All 4 Studio Walkthroughs
            </span>

            {VIDEO_REELS.map((reel, index) => {
              const isSelected = activeReelIndex === index;
              return (
                <button
                  key={reel.id}
                  onClick={() => handleSelectReel(index)}
                  className={`w-full p-4 rounded-2xl text-left border transition-all duration-200 flex items-center gap-4 cursor-pointer ${
                    isSelected
                      ? 'border-ngen-lime bg-white/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="relative w-16 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-black border border-white/10">
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
                      <span className="text-[11px] font-mono text-ngen-cream/60">
                        {reel.duration}
                      </span>
                    </div>
                    <h4 className="font-display font-black text-sm uppercase text-white truncate mb-1">
                      {reel.title}
                    </h4>
                    <p className="text-xs text-ngen-cream/70 truncate font-sans">
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
