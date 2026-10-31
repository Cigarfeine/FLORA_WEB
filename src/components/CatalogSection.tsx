import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, MessageCircle, SlidersHorizontal, Check } from 'lucide-react';
import { PRODUCTS, FLORA_INFO } from '../data/catalog';
import { ProductCategory, Product } from '../types';
import { useCart } from '../context/CartContext';
import { DualTextButton } from './ui/DualTextButton';

export const CatalogSection: React.FC = () => {
  const { addItem } = useCart();
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [addedId, setAddedId] = useState<string | null>(null);

  const categories: { id: ProductCategory; label: string }[] = [
    { id: 'all', label: 'All Offerings' },
    { id: 'pots', label: 'Ceramic & Marble Pots' },
    { id: 'plants', label: 'Living Indoor Greenery' },
    { id: 'artificial', label: 'Luxury Faux Botanicals' },
    { id: 'hampers', label: 'Curated Gift Hampers' },
  ];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.features && product.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });
  }, [activeCategory, searchQuery, sortBy]);

  const handleAddToCart = (product: Product) => {
    addItem(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  return (
    <section id="collection" className="py-24 bg-ngen-cream text-ngen-charcoal relative border-b border-ngen-charcoal/10">
      <div className="site-max">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-widest text-ngen-green block mb-3">
              Collection &amp; Curated Inventory
            </span>
            <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-[-0.03em] text-ngen-charcoal leading-[1.05]">
              Sculptural Pots &amp; Living Flora
            </h2>
          </div>
          <p className="text-ngen-charcoal/70 text-sm sm:text-base max-w-md font-sans">
            Directly sourced and nursery-acclimatized in Kerala. Every order is inspected and secured with reinforced shock-proof transit packaging.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10 pb-6 border-b border-ngen-charcoal/10">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors duration-200 border ${
                  activeCategory === cat.id
                    ? 'bg-ngen-green text-ngen-cream border-ngen-green'
                    : 'bg-transparent text-ngen-charcoal/75 border-ngen-charcoal/15 hover:border-ngen-charcoal/40 hover:text-ngen-charcoal'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Search & Sort Container */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-ngen-charcoal/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="catalog-search-input"
                name="catalogSearch"
                type="text"
                placeholder="Search pots, plants, size..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2 text-xs font-medium rounded-full bg-white border border-ngen-charcoal/15 text-ngen-charcoal placeholder-ngen-charcoal/40 focus:outline-none focus:border-ngen-green transition-colors"
              >
              </input>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                id="catalog-sort-select"
                name="catalogSort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort products by price or default"
                className="appearance-none pl-8 pr-8 py-2 text-xs font-bold uppercase tracking-wider rounded-full bg-white border border-ngen-charcoal/15 text-ngen-charcoal focus:outline-none focus:border-ngen-green transition-colors cursor-pointer"
              >
                <option value="default">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <SlidersHorizontal className="w-3.5 h-3.5 text-ngen-charcoal/50 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white/50 rounded-3xl border border-ngen-charcoal/10">
            <h3 className="font-display font-black text-xl uppercase text-ngen-charcoal mb-2">No matching botanicals found</h3>
            <p className="text-sm text-ngen-charcoal/70 mb-6">Try adjusting your search terms or view our all-offerings category.</p>
            <DualTextButton
              onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
              variant="green"
              size="sm"
            >
              Reset Filters
            </DualTextButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredProducts.map((product) => {
                const isJustAdded = addedId === product.id;
                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
                    className="group bg-white rounded-2xl overflow-hidden border border-ngen-charcoal/10 hover:border-ngen-charcoal/30 transition-colors duration-300 flex flex-col"
                  >
                    {/* Product Image Stage */}
                    <div className="relative aspect-square overflow-hidden bg-ngen-cream/50">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                        {product.badge && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono tracking-wider uppercase bg-ngen-green text-ngen-cream border border-ngen-green">
                            {product.badge}
                          </span>
                        )}
                        {product.careLevel && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-white text-ngen-charcoal border border-black/10">
                            {product.careLevel}
                          </span>
                        )}
                      </div>

                      {/* Quick WhatsApp Inquiry Action on Hover */}
                      <a
                        href={`https://wa.me/${FLORA_INFO.whatsappRaw}?text=${encodeURIComponent(`Hi Flora, I have an inquiry about ${product.name} (Rs.${product.price}). Is it currently available?`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Ask about ${product.name} on WhatsApp`}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white text-ngen-charcoal border border-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    {/* Product Info Block */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {product.dimensions && (
                          <span className="text-[11px] font-mono font-bold text-ngen-charcoal/50 block mb-1">
                            {product.dimensions}
                          </span>
                        )}
                        <h3 className="font-display font-bold text-base text-ngen-charcoal mb-1.5 leading-snug group-hover:text-ngen-green transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-xs text-ngen-charcoal/70 line-clamp-2 leading-relaxed mb-4 font-sans">
                          {product.description}
                        </p>
                      </div>

                      {/* Price & Add to Cart Action */}
                      <div className="pt-3 border-t border-ngen-charcoal/10 flex items-center justify-between gap-3">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="font-mono text-base font-black text-ngen-charcoal">
                              ₹{product.price}
                            </span>
                            {product.originalPrice && (
                              <span className="text-xs font-mono text-ngen-charcoal/40 line-through">
                                ₹{product.originalPrice}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase block mt-0.5">
                            In Stock • Kerala Dispatch
                          </span>
                        </div>

                        <button
                          onClick={() => handleAddToCart(product)}
                          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 border cursor-pointer ${
                            isJustAdded
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-ngen-peach hover:bg-ngen-peachHover text-ngen-charcoal border-ngen-peach'
                          }`}
                        >
                          {isJustAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Add</span>
                            </>
                          )}
                        </button>
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

      </div>
    </section>
  );
};
