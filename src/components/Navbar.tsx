import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { FLORA_INFO } from '../data/catalog';
import { DualTextButton } from './ui/DualTextButton';

export const Navbar: React.FC = () => {
  const { totalItems, setIsOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSectionTitle, setActiveSectionTitle] = useState('SELECTED WORK');
  const [isDarkSection, setIsDarkSection] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 50);

      // Section detection for center header label
      const sections = [
        { id: 'curations', title: 'SELECTED WORK', isDark: false },
        { id: 'services', title: 'SERVICES & CRAFT', isDark: true },
        { id: 'collection', title: 'CURATED CATALOG', isDark: false },
        { id: 'studio', title: 'POTTERY ATELIER', isDark: false },
        { id: 'reels', title: 'STUDIO REELS', isDark: true },
        { id: 'care', title: 'BOTANICAL CARE', isDark: false },
        { id: 'location', title: 'KERALA SANCTUARY', isDark: false },
      ];

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140) {
            setActiveSectionTitle(sections[i].title);
            setIsDarkSection(sections[i].isDark);
            return;
          }
        }
      }
      setActiveSectionTitle('SELECTED WORK');
      setIsDarkSection(false);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Work', href: '#curations' },
    { label: 'Services', href: '#services' },
    { label: 'Catalog', href: '#collection' },
    { label: 'Studio', href: '#studio' },
    { label: 'Reels', href: '#reels' },
    { label: 'Care', href: '#care' },
    { label: 'Visit', href: '#location' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none transition-all duration-300">
      {/* Main Navigation Header Bar (Authentic New Engen layout matching screenshots) */}
      <header className="site-max pt-4 sm:pt-6 transition-all duration-300">
        <div className="flex items-center justify-between w-full">
          
          {/* Left: Morphing Brand Identity (Text on canvas at scroll 0 -> 44px dark squircle badge when scrolled) */}
          <a
            href="#"
            aria-label="Flora Pots & Plants Home"
            className={`pointer-events-auto flex items-center transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] shrink-0 select-none ${
              scrolled
                ? 'w-11 h-11 p-2 rounded-2xl bg-ngen-charcoal border border-white/15 shadow-xl justify-center'
                : 'gap-3 p-0 bg-transparent border-transparent'
            }`}
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden shrink-0 flex items-center justify-center">
              <img
                src={FLORA_INFO.logo}
                alt="Flora Pots & Plants Emblem"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Logo text: slides and clips away smoothly when scrolled down */}
            <div
              className={`flex flex-col justify-center overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                scrolled
                  ? 'max-w-0 opacity-0 pr-0'
                  : 'max-w-[240px] opacity-100 pr-2'
              }`}
            >
              <span className="font-display font-black text-base sm:text-lg tracking-tight text-white block leading-none whitespace-nowrap">
                FLORA
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-widest uppercase font-mono font-bold text-ngen-lime block mt-0.5 leading-none whitespace-nowrap">
                POTS & PLANTS • KERALA
              </span>
            </div>
          </a>

          {/* Center: Selected Work / Current Section Title matching media_1793382277080.png */}
          <div
            className={`hidden md:flex items-center justify-center pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
              scrolled
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-2'
            }`}
          >
            <span
              className={`text-[11px] font-mono font-bold uppercase tracking-widest transition-colors duration-300 ${
                isDarkSection ? 'text-ngen-cream/90' : 'text-ngen-charcoal'
              }`}
            >
              {activeSectionTitle}
            </span>
          </div>

          {/* Right Group: Links Capsule + Coral CTA + Bag */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* New Engen Signature Links (Bare on canvas at scroll 0 -> 44px Dark Slate Pine capsule pill when scrolled) */}
            <nav
              className={`hidden lg:flex items-center gap-6 xl:gap-8 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] pointer-events-auto shrink-0 ${
                scrolled
                  ? 'h-11 px-7 rounded-full bg-ngen-green text-ngen-cream border border-white/15 shadow-xl'
                  : 'h-11 px-0 py-0 bg-transparent border-transparent text-white'
              }`}
            >
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`text-[13px] font-medium tracking-normal transition-colors duration-200 font-sans whitespace-nowrap ${
                    scrolled
                      ? 'text-ngen-cream/90 hover:text-white'
                      : 'text-white/85 hover:text-white'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Coral CTA Pill Button (Exact 44px height matching media_1793382277080.png) */}
            <DualTextButton
              href={`https://wa.me/${FLORA_INFO.whatsappRaw}?text=${encodeURIComponent('Hello Flora Pots & Plants! I would like to consult about plants and planters.')}`}
              target="_blank"
              rel="noopener noreferrer"
              variant="peach"
              size="md"
              showArrow
              className="pointer-events-auto hidden sm:inline-flex shadow-sm h-11 px-5"
            >
              Let's talk
            </DualTextButton>

            {/* Shopping Bag Button (Exact 44px height matching media_1793382277080.png) */}
            <button
              onClick={() => setIsOpen(true)}
              aria-label={totalItems > 0 ? `${totalItems} items in shopping bag` : 'Shopping bag'}
              className={`pointer-events-auto relative w-11 h-11 rounded-full border border-white/15 text-white transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center shrink-0 ${
                scrolled ? 'bg-ngen-green hover:bg-ngen-green/80 shadow-md' : 'bg-black/30 hover:bg-black/50'
              }`}
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
              className={`pointer-events-auto lg:hidden w-11 h-11 rounded-full border border-white/15 text-white transition-colors cursor-pointer shrink-0 flex items-center justify-center ${
                scrolled ? 'bg-ngen-green shadow-md' : 'bg-black/30'
              }`}
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
