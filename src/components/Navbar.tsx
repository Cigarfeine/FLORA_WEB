import React, { useState, useEffect } from 'react';
import { ShoppingBag, ArrowRight, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { FLORA_INFO } from '../data/catalog';

export const AnnouncementBanner: React.FC = () => {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="bg-ngen-lime text-botanical-950 font-bold text-xs py-2 px-4 relative z-50 text-center tracking-wide flex items-center justify-center gap-3">
      <span>Kerala's Premier Botanical & Planter Destination • Showroom open daily in Nellikuzhi • Free Delivery on orders over ₹999</span>
      <button
        onClick={() => setVisible(false)}
        aria-label="Dismiss banner"
        className="opacity-70 hover:opacity-100 transition-opacity ml-2"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export const Navbar: React.FC = () => {
  const { totalItems, setIsOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'py-3 bg-ngen-darkgreen/95 backdrop-blur-md shadow-lg border-b border-white/10 text-white'
          : 'bg-ngen-darkgreen/80 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none text-white'
      }`}
    >
      {!scrolled && <AnnouncementBanner />}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${!scrolled ? 'py-4' : ''}`}>
        <div className="flex items-center justify-between">
          
          {/* Brand Identity: New Engen inspired bold mark */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/20 shadow-sm transition-transform duration-300 group-hover:scale-105 bg-white p-0.5">
              <img
                src={FLORA_INFO.logo}
                alt="Flora Pots & Plants Emblem"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <span className="font-display font-black text-xl sm:text-2xl tracking-tighter text-white block leading-none">
                FLORA
              </span>
              <span className="text-[10px] tracking-widest uppercase font-mono font-bold text-ngen-lime block mt-0.5">
                POTS & PLANTS • KERALA
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs font-bold uppercase tracking-wider text-sand-200 hover:text-white transition-colors duration-200 relative py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Actions: New Engen styled Peach CTA pill + Bag Trigger */}
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${FLORA_INFO.whatsappRaw}?text=${encodeURIComponent('Hello Flora Pots & Plants! I would like to consult about plants and planters.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-ngen-peach hover:bg-ngen-peachHover text-botanical-950 transition-all duration-200 shadow-md active:scale-95 group"
            >
              <span>Let's talk</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>

            {/* Shopping Bag Button */}
            <button
              onClick={() => setIsOpen(true)}
              aria-label="Open Shopping Bag"
              className="relative p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all duration-200 active:scale-95"
            >
              <ShoppingBag className="w-5 h-5 text-sand-50" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-ngen-peach text-botanical-950 text-[11px] font-black flex items-center justify-center animate-fade-in shadow-sm">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 pb-4 border-t border-white/10 bg-ngen-darkgreen/95 backdrop-blur-md rounded-2xl p-4 shadow-xl text-white animate-fade-in">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-bold uppercase tracking-wider hover:bg-white/10 rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
                <a
                  href={`https://wa.me/${FLORA_INFO.whatsappRaw}?text=${encodeURIComponent('Hello Flora Pots & Plants! I would like to inquire about your collection.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider bg-ngen-peach text-botanical-950"
                >
                  <span>Chat on WhatsApp: {FLORA_INFO.phone}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
