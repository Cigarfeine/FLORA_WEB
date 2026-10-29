import React, { useState, useEffect } from 'react';
import { ShoppingBag, MessageCircle, Menu, X, ArrowUpRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { FLORA_INFO } from '../data/catalog';

export const Navbar: React.FC = () => {
  const { totalItems, setIsOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Collection', href: '#collection' },
    { label: 'Plant & Pot Studio', href: '#studio' },
    { label: 'Shop Reels', href: '#reels' },
    { label: 'Botanical Care', href: '#care' },
    { label: 'Visit Store', href: '#location' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'py-3 bg-sand-50/90 backdrop-blur-md shadow-sm border-b border-sand-200/60'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Identity */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-sand-300 shadow-sm transition-transform duration-300 group-hover:scale-105">
              <img
                src={FLORA_INFO.logo}
                alt="Flora Pots & Plants Emblem"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-botanical-950 block leading-tight">
                FLORA
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-terracotta-600 block">
                Pots & Plants • Kerala
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-sand-800 hover:text-botanical-800 transition-colors duration-200 relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-terracotta-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Actions: WhatsApp Consultation + Cart Drawer Trigger */}
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${FLORA_INFO.whatsappRaw}?text=${encodeURIComponent('Hello Flora Pots & Plants! I would like to inquire about your plant and pot collection.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold bg-botanical-900 text-sand-50 hover:bg-botanical-800 transition-all duration-200 shadow-sm hover:shadow active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp Us</span>
              <ArrowUpRight className="w-3 h-3 text-sand-300" />
            </a>

            {/* Shopping Bag Button */}
            <button
              onClick={() => setIsOpen(true)}
              aria-label="Open Shopping Bag"
              className="relative p-2.5 rounded-full bg-sand-100 hover:bg-sand-200 border border-sand-300 text-botanical-950 transition-all duration-200 active:scale-95"
            >
              <ShoppingBag className="w-5 h-5 text-botanical-900" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-terracotta-600 text-white text-[11px] font-bold flex items-center justify-center animate-fade-in shadow-sm">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="md:hidden p-2 rounded-lg text-botanical-900 hover:bg-sand-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 pb-4 border-t border-sand-200 bg-sand-50/95 backdrop-blur-md rounded-2xl p-4 shadow-lg animate-fade-in">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-sand-900 hover:bg-sand-200/60 rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 border-t border-sand-200 flex flex-col gap-2">
                <a
                  href={`https://wa.me/${FLORA_INFO.whatsappRaw}?text=${encodeURIComponent('Hello Flora Pots & Plants! I would like to inquire about your collection.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold bg-botanical-900 text-white"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp: {FLORA_INFO.phone}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
