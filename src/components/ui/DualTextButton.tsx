import React from 'react';
import { ArrowRight } from 'lucide-react';

export interface DualTextButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'peach' | 'lime' | 'green' | 'outline-dark' | 'outline-light' | 'white';
  size?: 'sm' | 'md' | 'lg';
  showArrow?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  target?: string;
  rel?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

export const DualTextButton: React.FC<DualTextButtonProps> = ({
  children,
  href,
  onClick,
  variant = 'peach',
  size = 'md',
  showArrow = false,
  className = '',
  type = 'button',
  target,
  rel,
  disabled = false,
  ariaLabel,
}) => {
  // Base variant backgrounds & borders
  const variantStyles = {
    peach: 'bg-ngen-peach text-ngen-charcoal font-black border border-ngen-peach',
    lime: 'bg-ngen-lime text-ngen-charcoal font-black border border-ngen-lime',
    green: 'bg-ngen-green text-ngen-cream font-bold border border-white/10',
    'outline-dark': 'bg-transparent text-ngen-charcoal border border-ngen-charcoal/20 hover:border-ngen-charcoal font-bold',
    'outline-light': 'bg-transparent text-ngen-cream border border-white/25 hover:border-white font-bold',
    white: 'bg-white text-ngen-charcoal border border-black/10 font-bold',
  };

  // New Engen Signature Background Curtain Fill (sweeps up from bottom on hover)
  const curtainColors = {
    peach: 'bg-ngen-lime',
    lime: 'bg-ngen-peach',
    green: 'bg-ngen-darkgreen',
    'outline-dark': 'bg-ngen-charcoal/10',
    'outline-light': 'bg-white/15',
    white: 'bg-ngen-cream',
  };

  const sizeStyles = {
    sm: 'text-[11px] h-8 px-4 tracking-wider',
    md: 'text-xs h-11 px-6 tracking-wider',
    lg: 'text-sm h-14 px-8 tracking-widest',
  };

  const content = (
    <>
      {/* Background Fill Curtain (New Engen exact hover effect) */}
      <div
        className={`absolute inset-0 rounded-full z-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] translate-y-full group-hover:translate-y-0 pointer-events-none ${curtainColors[variant]}`}
      />

      {/* Text Container with Dual-Row Vertical Roll */}
      <span className="relative z-10 overflow-hidden inline-flex flex-col h-[1.3em] leading-[1.3em] whitespace-nowrap">
        {/* Row 1: Active visible text sliding up on hover */}
        <span className="inline-block whitespace-nowrap transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-full">
          {children}
        </span>
        {/* Row 2: Secondary text sliding up from underneath on hover */}
        <span
          aria-hidden="true"
          className="absolute top-full left-0 inline-block whitespace-nowrap transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-full"
        >
          {children}
        </span>
      </span>

      {showArrow && (
        <ArrowRight className="relative z-10 w-3.5 h-3.5 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-x-1 shrink-0 ml-1.5" />
      )}
    </>
  );

  const baseClasses = `group relative inline-flex items-center justify-center rounded-full uppercase transition-all duration-500 select-none cursor-pointer whitespace-nowrap shrink-0 active:scale-95 overflow-hidden ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        className={baseClasses}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      className={baseClasses}
      onClick={onClick}
    >
      {content}
    </button>
  );
};
