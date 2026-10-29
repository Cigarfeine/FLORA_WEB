import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MarqueeStrip } from './components/MarqueeStrip';
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

const FloatingActions: React.FC = () => {
  const { totalItems, setIsOpen } = useCart();
  const [showFloatingBag, setShowFloatingBag] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingBag(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto">
      {/* Floating Bag Shortcut (Appears when items are in cart and user has scrolled down) */}
      {showFloatingBag && totalItems > 0 && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-botanical-900 text-white shadow-xl hover:bg-botanical-800 transition-all duration-200 active:scale-95 animate-fade-in border border-white/20"
        >
          <ShoppingBag className="w-4 h-4 text-terracotta-300" />
          <span className="text-xs font-bold">Bag ({totalItems})</span>
        </button>
      )}

      {/* Floating WhatsApp Quick Consultation Button */}
      <a
        href={`https://wa.me/${FLORA_INFO.whatsappRaw}?text=${encodeURIComponent('Hello Flora Pots & Plants! I would like to consult about plants and pots for my space.')}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct WhatsApp Consultation with Flora"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white/30"
      >
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20"></span>
        <MessageCircle className="w-7 h-7 fill-white" />
        
        {/* Tooltip on Hover */}
        <span className="absolute right-16 px-3 py-1.5 rounded-xl bg-botanical-950 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
          Chat with Flora Expert
        </span>
      </a>
    </div>
  );
};

export function AppContent() {
  return (
    <div className="min-h-screen bg-sand-50 text-sand-950 flex flex-col font-sans selection:bg-terracotta-500 selection:text-white">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <MarqueeStrip />
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
