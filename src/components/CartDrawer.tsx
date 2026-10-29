import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, MessageCircle, Truck, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { FLORA_INFO } from '../data/catalog';
import { DualTextButton } from './ui/DualTextButton';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    setIsOpen,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    freeDeliveryThreshold,
    deliveryFee,
    totalAmount,
    generateWhatsAppOrderUrl,
  } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const freeShippingDelta = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  const handleWhatsAppCheckout = () => {
    const url = generateWhatsAppOrderUrl(customerName, address, notes);
    window.open(url, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 z-50 transition-opacity"
          />

          {/* Slide-out Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-ngen-cream text-ngen-charcoal z-50 flex flex-col border-l border-ngen-charcoal/15 font-sans"
          >
            {/* Drawer Header */}
            <div className="p-5 sm:p-6 border-b border-ngen-charcoal/10 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-ngen-green" />
                <h3 className="font-display font-black text-lg uppercase tracking-tight text-ngen-charcoal">
                  Your Botanical Bag
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-ngen-green text-ngen-cream text-xs font-mono font-bold">
                  {totalItems}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    aria-label="Clear cart items"
                    className="text-xs font-mono uppercase text-ngen-charcoal/60 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close Shopping Bag"
                  className="p-1.5 rounded-full text-ngen-charcoal/70 hover:text-ngen-charcoal hover:bg-black/5 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Free Shipping Progress Meter */}
            {items.length > 0 && (
              <div className="px-5 py-3 sm:px-6 bg-white/70 border-b border-ngen-charcoal/10">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-1.5 text-ngen-charcoal font-semibold">
                    <Truck className="w-3.5 h-3.5 text-ngen-peach" />
                    <span>
                      {freeShippingDelta === 0
                        ? 'Unlocked FREE Kerala delivery'
                        : `Add ₹${freeShippingDelta} more for FREE delivery`}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-ngen-charcoal/70">
                    {Math.round(freeShippingProgress)}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-black/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${freeShippingProgress}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-ngen-green rounded-full"
                  />
                </div>
              </div>
            )}

            {/* Drawer Body: Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3">
              {items.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-white border border-ngen-charcoal/10 flex items-center justify-center text-ngen-charcoal/40 mb-4">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="font-display font-black text-lg uppercase text-ngen-charcoal mb-1">
                    Your bag is empty
                  </h4>
                  <p className="text-xs text-ngen-charcoal/70 max-w-xs mb-6">
                    Explore our collection of handcrafted pots, air-purifying indoor flora, and luxury faux botanicals.
                  </p>
                  <DualTextButton
                    onClick={() => setIsOpen(false)}
                    variant="green"
                    size="sm"
                    showArrow
                  >
                    Browse Collection
                  </DualTextButton>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedPotColor || ''}`}
                    className="p-3.5 rounded-2xl border border-ngen-charcoal/10 bg-white flex gap-3 items-center justify-between"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-ngen-cream flex-shrink-0 border border-black/5">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className="font-display font-black text-xs uppercase text-ngen-charcoal truncate mb-0.5">
                        {item.product.name}
                      </h4>
                      {item.selectedPotColor && (
                        <span className="text-[10px] font-mono text-ngen-charcoal/60 uppercase block">
                          Finish: {item.selectedPotColor}
                        </span>
                      )}
                      <span className="font-mono text-xs font-bold text-ngen-charcoal block mt-1">
                        ₹{item.product.price}
                      </span>
                    </div>

                    {/* Quantity Controls & Delete */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <button
                        onClick={() => removeItem(item.product.id)}
                        aria-label={`Remove ${item.product.name} from cart`}
                        className="p-1 text-ngen-charcoal/40 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center border border-ngen-charcoal/20 rounded-full bg-ngen-cream overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          aria-label="Decrease quantity"
                          className="px-2 py-0.5 text-ngen-charcoal/70 hover:bg-black/5 transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-ngen-charcoal">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          aria-label="Increase quantity"
                          className="px-2 py-0.5 text-ngen-charcoal/70 hover:bg-black/5 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Delivery Details Form */}
              {items.length > 0 && (
                <div className="pt-4 border-t border-ngen-charcoal/10 space-y-3">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-ngen-charcoal/60 block">
                    Optional Delivery Notes for WhatsApp
                  </span>
                  
                  <div>
                    <label htmlFor="cart-customer-name" className="text-[11px] font-bold text-ngen-charcoal/80 block mb-1">
                      Your Full Name
                    </label>
                    <input
                      id="cart-customer-name"
                      name="customerName"
                      type="text"
                      autoComplete="name"
                      placeholder="e.g. Anjali Menon"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-ngen-charcoal/15 text-ngen-charcoal focus:outline-none focus:border-ngen-green"
                    />
                  </div>

                  <div>
                    <label htmlFor="cart-delivery-address" className="text-[11px] font-bold text-ngen-charcoal/80 block mb-1">
                      Town / Delivery Address in Kerala
                    </label>
                    <input
                      id="cart-delivery-address"
                      name="deliveryAddress"
                      type="text"
                      autoComplete="street-address"
                      placeholder="e.g. Kothamangalam, Ernakulam"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-ngen-charcoal/15 text-ngen-charcoal focus:outline-none focus:border-ngen-green"
                    />
                  </div>

                  <div>
                    <label htmlFor="cart-delivery-notes" className="text-[11px] font-bold text-ngen-charcoal/80 block mb-1">
                      Special Requests / Notes
                    </label>
                    <textarea
                      id="cart-delivery-notes"
                      name="deliveryNotes"
                      rows={2}
                      placeholder="e.g. Gift packaging needed, deliver after 5 PM"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-ngen-charcoal/15 text-ngen-charcoal focus:outline-none focus:border-ngen-green resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer: Subtotal & WhatsApp Checkout CTA */}
            {items.length > 0 && (
              <div className="p-5 sm:p-6 bg-white border-t border-ngen-charcoal/10">
                <div className="space-y-1.5 text-xs font-mono mb-4">
                  <div className="flex justify-between text-ngen-charcoal/70">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-ngen-charcoal/70">
                    <span>Delivery (Kerala)</span>
                    <span>
                      {deliveryFee === 0 ? (
                        <strong className="text-emerald-700 font-bold uppercase">FREE</strong>
                      ) : (
                        `₹${deliveryFee}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-ngen-charcoal pt-2 border-t border-ngen-charcoal/10">
                    <span className="font-display uppercase">Total Amount</span>
                    <span className="font-mono text-base font-black">
                      ₹{totalAmount}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-4 rounded-full font-display font-black text-xs uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 cursor-pointer border border-emerald-600"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Send Order to WhatsApp ({FLORA_INFO.phone})</span>
                </button>

                <p className="text-[10px] text-center text-ngen-charcoal/50 mt-2.5 font-mono">
                  Direct WhatsApp dispatch • No hidden fees • Verified by Flora Store
                </p>
              </div>
            )}

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
