import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { FLORA_INFO } from '../data/catalog';
import { DualTextButton } from './ui/DualTextButton';

export const AnnouncementBanner: React.FC<{ onDismiss?: () => void }> = ({ onDismiss }) => {
  return (
    <div className="bg-ngen-lime text-ngen-charcoal font-bold text-xs py-2 px-4 text-center tracking-wide flex items-center justify-center gap-3 border-b border-black/10 select-none w-full">
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Work & Catalog', href: '#collection' },
    { label: 'Matcher Studio', href: '#studio' },
    { label: 'Showroom Reels', href: '#reels' },
    { label: 'Botanical Care', href: '#care' },
    { label: 'Visit Store', href: '#location' },
  ];

  return (
    <div className="fixed top-0 inset-x-0 z-40 pointer-events-none flex flex-col items-center transition-all duration-300">
      {/* Top Announcement Banner (Visible when un-scrolled and not dismissed) */}
      {!scrolled && !bannerDismissed && (
        <div className="w-full pointer-events-auto">
          <AnnouncementBanner onDismiss={() => setBannerDismissed(true)} />
        </div>
      )}

      {/* Morphing Header Container */}
      <div className={`w-full transition-all duration-300 ${scrolled ? 'px-4 sm:px-6 mt-3 max-w-5xl' : 'max-w-7xl px-4 sm:px-8'}`}>
        <header
          className={`pointer-events-auto transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] ${
            scrolled
              ? 'w-full rounded-full bg-ngen-green text-ngen-cream border border-white/15 px-6 py-2.5 shadow-none'
              : 'w-full bg-ngen-green text-ngen-cream border-b border-white/10 py-3.5'
          }`}
        >
          <div className="flex items-center justify-between gap-4 sm:gap-6 w-full">
            
            {/* Left Brand Identity */}
            <a href="#" className="flex items-center gap-3 group shrink-0">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-white/20 transition-transform duration-300 group-hover:scale-105 bg-white p-0.5 shrink-0 flex items-center justify-center">
                <img
                  src={FLORA_INFO.logo}
                  alt="Flora Pots & Plants Emblem"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-display font-black text-lg sm:text-xl tracking-tighter text-white block leading-none">
                  FLORA
                </span>
                <span className="text-[9px] tracking-widest uppercase font-mono font-bold text-ngen-lime block mt-1 leading-none whitespace-nowrap">
                  POTS & PLANTS • KERALA
                </span>
              </div>
            </a>

            {/* Desktop Center Navigation Links */}
            <nav className="hidden lg:flex items-center justify-center gap-5 xl:gap-8 flex-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[11px] xl:text-xs font-bold uppercase tracking-wider text-ngen-cream/80 hover:text-ngen-lime transition-colors duration-200 py-1 font-display whitespace-nowrap shrink-0"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Right Actions: DualTextButton CTA + Shopping Bag */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              <DualTextButton
                href={`https://wa.me/${FLORA_INFO.whatsappRaw}?text=${encodeURIComponent('Hello Flora Pots & Plants! I would like to consult about plants and planters.')}`}
                target="_blank"
                rel="noopener noreferrer"
                variant="peach"
                size="sm"
                showArrow
                className="hidden sm:inline-flex"
              >
                Let's talk
              </DualTextButton>

              {/* Shopping Bag Button */}
              <button
                onClick={() => setIsOpen(true)}
                aria-label="Open Shopping Bag"
                className="relative p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center shrink-0"
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
                className="lg:hidden p-2 rounded-full text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Dropdown */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-3 pt-3 pb-3 border-t border-white/10 bg-ngen-green rounded-2xl p-4 text-ngen-cream">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 text-xs font-bold uppercase tracking-wider hover:bg-white/10 rounded-lg transition-colors font-display"
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
                    size="sm"
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
    </div>
  );
};
