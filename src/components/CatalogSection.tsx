import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, MessageCircle, SlidersHorizontal, Check, Sparkles } from 'lucide-react';
import { PRODUCTS, FLORA_INFO } from '../data/catalog';
import { ProductCategory, Product } from '../types';
import { useCart } from '../context/CartContext';

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
        (product.features && product.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase())));
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
    <section id="collection" className="py-24 bg-ngen-cream relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ngen-green/10 text-ngen-green font-mono text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-ngen-peach" />
              <span>Curated Inventory</span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tighter text-botanical-950 leading-tight">
              SCULPTURAL POTS & LIVING FLORA
            </h2>
          </div>
          <p className="text-sand-700 text-sm sm:text-base max-w-md font-sans">
            Directly sourced and nursery-acclimatized in Kerala. Every order is inspected and secured with reinforced shock-proof transit packaging.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10 pb-6 border-b border-sand-200">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors duration-200 ${
                  activeCategory === cat.id
                    ? 'text-white'
                    : 'text-sand-700 hover:text-botanical-950 bg-sand-100 hover:bg-sand-200/80'
                }`}
              >
                {activeCategory === cat.id && (
                  <motion.div
                    layoutId="category-active-pill"
                    className="absolute inset-0 bg-ngen-green rounded-full"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Search & Sort Container */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-sand-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="catalog-search-input"
                name="catalogSearch"
                type="text"
                placeholder="Search pots, plants, size..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-full bg-white border border-sand-300 text-sand-950 placeholder-sand-500 focus:outline-none focus:border-botanical-700 transition-colors"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                id="catalog-sort-select"
                name="catalogSort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort products by price or default"
                className="appearance-none pl-8 pr-8 py-2 text-xs font-medium rounded-full bg-white border border-sand-300 text-sand-800 focus:outline-none focus:border-botanical-700 transition-colors cursor-pointer"
              >
                <option value="default">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <SlidersHorizontal className="w-3.5 h-3.5 text-sand-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-sand-100/50 rounded-3xl border border-sand-200">
            <h3 className="font-serif text-xl font-bold text-botanical-950 mb-2">No matching botanicals found</h3>
            <p className="text-sm text-sand-700 mb-6">Try adjusting your search terms or view our all-offerings category.</p>
            <button
              onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
              className="px-5 py-2.5 rounded-full bg-botanical-900 text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
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
                    transition={{ duration: 0.35 }}
                    className="group bg-white rounded-2xl overflow-hidden border border-sand-200/90 hover:border-sand-300 hover:shadow-lg transition-all duration-300 flex flex-col"
                  >
                    {/* Product Image Stage */}
                    <div className="relative aspect-square overflow-hidden bg-sand-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                        {product.badge && (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-botanical-900/90 text-sand-50 backdrop-blur-sm">
                            {product.badge}
                          </span>
                        )}
                        {product.careLevel && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/90 text-sand-900 backdrop-blur-sm border border-sand-200">
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
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-botanical-900 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    {/* Product Info Block */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {product.dimensions && (
                          <span className="text-[11px] font-mono text-sand-600 block mb-1">
                            {product.dimensions}
                          </span>
                        )}
                        <h3 className="font-display font-bold text-base text-botanical-950 mb-2 leading-snug group-hover:text-ngen-green transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-xs text-sand-700 line-clamp-2 leading-relaxed mb-4">
                          {product.description}
                        </p>
                      </div>

                      {/* Price & Add to Cart Action */}
                      <div className="pt-3 border-t border-sand-100 flex items-center justify-between gap-3">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="font-mono text-lg font-black text-botanical-950">
                              ₹{product.price}
                            </span>
                            {product.originalPrice && (
                              <span className="text-xs font-mono text-sand-500 line-through">
                                ₹{product.originalPrice}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-emerald-700 font-semibold block">
                            In Stock • Kerala Dispatch
                          </span>
                        </div>

                        <button
                          onClick={() => handleAddToCart(product)}
                          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-display font-black uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-sm ${
                            isJustAdded
                              ? 'bg-emerald-600 text-white'
                              : 'bg-ngen-peach hover:bg-ngen-peachHover text-botanical-950'
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
