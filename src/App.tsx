import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MarqueeStrip } from './components/MarqueeStrip';
import { EditorialManifesto } from './components/EditorialManifesto';
import { ServicesSection } from './components/ServicesSection';
import { CatalogSection } from './components/CatalogSection';
import { PlantPotCustomizer } from './components/PlantPotCustomizer';
import { VideoReelsSection } from './components/VideoReelsSection';
import { CareGuideSection } from './components/CareGuideSection';
import { SocialProofSection } from './components/SocialProofSection';
import { StoreLocationSection } from './components/StoreLocationSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { MessageCircle, ShoppingBag } from 'lucide-react';
import { FLORA_INFO } from './data/catalog';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const FloatingActions: React.FC = () => {
  const { totalItems, setIsOpen } = useCart();
  const [showFloatingBag, setShowFloatingBag] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingBag(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto">
      {/* Floating Bag Shortcut (Appears when items are in cart and user has scrolled down) */}
      {showFloatingBag && totalItems > 0 && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-ngen-green text-ngen-cream border border-white/15 hover:bg-ngen-darkgreen transition-all duration-200 active:scale-95 animate-fade-in cursor-pointer select-none"
        >
          <ShoppingBag className="w-4 h-4 text-ngen-peach" />
          <span className="text-xs font-bold font-mono uppercase tracking-wider">Bag ({totalItems})</span>
        </button>
      )}

      {/* Floating WhatsApp Quick Consultation Button */}
      <a
        href={`https://wa.me/${FLORA_INFO.whatsappRaw}?text=${encodeURIComponent('Hello Flora Pots & Plants! I would like to consult about plants and pots for my space.')}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct WhatsApp Consultation with Flora"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-300 hover:scale-105 active:scale-95 border border-white/20 cursor-pointer"
      >
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20"></span>
        <MessageCircle className="w-6 h-6 fill-white" />
        
        {/* Tooltip on Hover */}
        <span className="absolute right-16 px-3 py-1.5 rounded-full bg-ngen-darkgreen text-ngen-cream text-xs font-medium uppercase tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-white/10">
          Chat with Flora Expert
        </span>
      </a>
    </div>
  );
};

export function AppContent() {
  // Initialize Lenis Smooth Scroll Engine synced with GSAP Ticker (New Engen Architecture)
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.15,
      wheelMultiplier: 1.25,
      smoothWheel: true,
      syncTouch: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    const handleResize = () => {
      ScrollTrigger.refresh();
      lenis.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      gsap.ticker.remove(tickerCallback);
      window.removeEventListener('resize', handleResize);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-ngen-cream text-ngen-charcoal flex flex-col font-sans selection:bg-ngen-peach selection:text-ngen-charcoal overflow-x-hidden w-full max-w-full">
      <Navbar />
      <main className="flex-grow overflow-x-hidden w-full max-w-full">
        <HeroSection />
        <EditorialManifesto />
        <MarqueeStrip />
        <ServicesSection />
        <CatalogSection />
        <PlantPotCustomizer />
        <VideoReelsSection />
        <CareGuideSection />
        <SocialProofSection />
        <StoreLocationSection />
      </main>
      <Footer />
      <CartDrawer />
      <FloatingActions />
    </div>
  );
}

export function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;
