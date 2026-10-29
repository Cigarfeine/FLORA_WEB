import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { FLORA_INFO } from '../data/catalog';
import { DualTextButton } from './ui/DualTextButton';

export const AnnouncementBanner: React.FC<{ onDismiss?: () => void }> = ({ onDismiss }) => {
  return (
    <div className="bg-ngen-lime text-ngen-charcoal font-bold text-xs py-2 px-4 text-center tracking-wide flex items-center justify-center gap-3 border-b border-black/10 select-none w-full pointer-events-auto">
      <span className="truncate">Kerala's Premier Botanical & Planter Destination • Showroom open daily in Nellikuzhi • Free Delivery over ₹999</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss banner"
          className="opacity-70 hover:opacity-100 transition-opacity ml-2 cursor-pointer shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export const Navbar: React.FC = () => {
  const { totalItems, setIsOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 40);

      // Directional auto-hide on downscroll, show on upscroll (New Engen pattern)
      if (currentY > 160) {
        if (currentY > lastY + 6) {
          setIsVisible(false); // scrolling down
        } else if (currentY < lastY - 6) {
          setIsVisible(true); // scrolling up
        }
      } else {
        setIsVisible(true);
      }
      lastY = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Work & Catalog', href: '#collection' },
    { label: 'Services', href: '#services' },
    { label: 'Matcher Studio', href: '#studio' },
    { label: 'Showroom Reels', href: '#reels' },
    { label: 'Botanical Care', href: '#care' },
    { label: 'Visit Store', href: '#location' },
  ];

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-40 pointer-events-none transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
        isVisible ? 'translate-y-0' : '-translate-y-full -translate-y-4'
      }`}
    >
      {/* Top Announcement Banner (Visible when un-scrolled and not dismissed) */}
      {!scrolled && !bannerDismissed && (
        <AnnouncementBanner onDismiss={() => setBannerDismissed(true)} />
      )}

      {/* Main Navigation Header Bar (Authentic New Engen layout) */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-8 pt-3 sm:pt-4 transition-all duration-300">
        <div className="flex items-center justify-between w-full">
          
          {/* Left: Brand Identity Logo Pill */}
          <a
            href="#"
            className="pointer-events-auto flex items-center gap-3 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-ngen-green text-ngen-cream border border-white/15 transition-transform duration-300 hover:scale-[1.02] active:scale-95 group shrink-0"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 bg-white p-0.5 shrink-0 flex items-center justify-center">
              <img
                src={FLORA_INFO.logo}
                alt="Flora Pots & Plants Emblem"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="flex flex-col justify-center pr-1">
              <span className="font-display font-black text-base sm:text-lg tracking-tighter text-white block leading-none">
                FLORA
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-widest uppercase font-mono font-bold text-ngen-lime block mt-0.5 leading-none whitespace-nowrap">
                POTS & PLANTS • KERALA
              </span>
            </div>
          </a>

          {/* Right Group: Links Capsule + Coral CTA + Bag */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* New Engen Signature Links Capsule */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 px-6 py-2.5 rounded-full bg-ngen-green text-ngen-cream border border-white/15 pointer-events-auto shrink-0">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-xs font-bold uppercase tracking-wider text-ngen-cream/80 hover:text-ngen-lime transition-colors duration-200 py-0.5 font-display whitespace-nowrap"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Coral CTA Pill Button */}
            <DualTextButton
              href={`https://wa.me/${FLORA_INFO.whatsappRaw}?text=${encodeURIComponent('Hello Flora Pots & Plants! I would like to consult about plants and planters.')}`}
              target="_blank"
              rel="noopener noreferrer"
              variant="peach"
              size="md"
              showArrow
              className="pointer-events-auto hidden sm:inline-flex"
            >
              Let's talk
            </DualTextButton>

            {/* Shopping Bag Button */}
            <button
              onClick={() => setIsOpen(true)}
              aria-label="Open Shopping Bag"
              className="pointer-events-auto relative p-3 rounded-full bg-ngen-green hover:bg-ngen-darkgreen border border-white/15 text-white transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center shrink-0"
            >
              <ShoppingBag className="w-4 h-4 text-ngen-cream" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-ngen-peach text-ngen-charcoal text-[10px] font-black flex items-center justify-center font-mono leading-none">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="pointer-events-auto lg:hidden p-3 rounded-full bg-ngen-green text-white hover:bg-ngen-darkgreen border border-white/15 transition-colors cursor-pointer shrink-0 flex items-center justify-center"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="pointer-events-auto lg:hidden mt-3 p-4 bg-ngen-green rounded-3xl border border-white/15 text-ngen-cream animate-fade-in shadow-none">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs font-bold uppercase tracking-wider hover:bg-white/10 rounded-xl transition-colors font-display"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 border-t border-white/10">
                <DualTextButton
                  href={`https://wa.me/${FLORA_INFO.whatsappRaw}?text=${encodeURIComponent('Hello Flora Pots & Plants! I would like to inquire about your collection.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="peach"
                  size="md"
                  showArrow
                  className="w-full"
                >
                  Chat on WhatsApp
                </DualTextButton>
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};
