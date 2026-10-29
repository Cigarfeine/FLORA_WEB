import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, MessageCircle, Truck, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { FLORA_INFO } from '../data/catalog';

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
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-botanical-950/60 backdrop-blur-sm z-50 transition-opacity"
          />

          {/* Slide-out Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-sand-200"
          >
            {/* Drawer Header */}
            <div className="p-5 sm:p-6 border-b border-sand-200 flex items-center justify-between bg-sand-50/80">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-botanical-900" />
                <h3 className="font-serif text-lg font-bold text-botanical-950">
                  Your Botanical Bag
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-botanical-100 text-botanical-800 text-xs font-bold">
                  {totalItems}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    aria-label="Clear cart items"
                    className="text-xs text-sand-500 hover:text-terracotta-700 transition-colors"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close Shopping Bag"
                  className="p-1.5 rounded-full text-sand-600 hover:text-sand-950 hover:bg-sand-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Free Shipping Progress Meter */}
            {items.length > 0 && (
              <div className="px-5 py-3 sm:px-6 bg-sand-100/60 border-b border-sand-200">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-1.5 text-botanical-900 font-medium">
                    <Truck className="w-3.5 h-3.5 text-terracotta-600" />
                    <span>
                      {freeShippingDelta === 0
                        ? 'Congratulations! You unlocked FREE Kerala delivery'
                        : `Add ₹${freeShippingDelta} more for FREE delivery`}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-sand-600">
                    {Math.round(freeShippingProgress)}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-sand-200 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${freeShippingProgress}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-botanical-700 rounded-full"
                  />
                </div>
              </div>
            )}

            {/* Drawer Body: Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              {items.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-sand-100 flex items-center justify-center text-sand-400 mb-4">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-botanical-950 mb-1">
                    Your bag is empty
                  </h4>
                  <p className="text-xs text-sand-600 max-w-xs mb-6">
                    Explore our collection of handcrafted pots, air-purifying indoor flora, and luxury faux botanicals.
                  </p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-botanical-900 text-white text-xs font-semibold hover:bg-botanical-800 transition-colors"
                  >
                    <span>Browse Collection</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedPotColor || ''}`}
                    className="p-3.5 rounded-2xl border border-sand-200 bg-sand-50/50 flex gap-3 items-center justify-between"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-sand-200 flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className="font-serif text-xs font-bold text-botanical-950 truncate mb-0.5">
                        {item.product.name}
                      </h4>
                      {item.selectedPotColor && (
                        <span className="text-[10px] text-terracotta-700 font-medium block">
                          Finish: {item.selectedPotColor}
                        </span>
                      )}
                      <span className="font-mono text-xs font-bold text-sand-900 block mt-1">
                        ₹{item.product.price}
                      </span>
                    </div>

                    {/* Quantity Controls & Delete */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <button
                        onClick={() => removeItem(item.product.id)}
                        aria-label={`Remove ${item.product.name} from cart`}
                        className="p-1 text-sand-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center border border-sand-300 rounded-lg bg-white overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          aria-label="Decrease quantity"
                          className="px-2 py-0.5 text-sand-700 hover:bg-sand-100 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-botanical-950">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          aria-label="Increase quantity"
                          className="px-2 py-0.5 text-sand-700 hover:bg-sand-100 transition-colors"
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
                <div className="pt-4 border-t border-sand-200 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-sand-600 block">
                    Optional Delivery Notes for WhatsApp
                  </span>
                  
                  <div>
                    <label htmlFor="cart-customer-name" className="text-[11px] font-medium text-sand-700 block mb-1">
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
                      className="w-full px-3 py-2 text-xs rounded-xl bg-sand-50 border border-sand-300 text-sand-900 focus:outline-none focus:border-botanical-700"
                    />
                  </div>

                  <div>
                    <label htmlFor="cart-delivery-address" className="text-[11px] font-medium text-sand-700 block mb-1">
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
                      className="w-full px-3 py-2 text-xs rounded-xl bg-sand-50 border border-sand-300 text-sand-900 focus:outline-none focus:border-botanical-700"
                    />
                  </div>

                  <div>
                    <label htmlFor="cart-delivery-notes" className="text-[11px] font-medium text-sand-700 block mb-1">
                      Special Requests / Notes
                    </label>
                    <textarea
                      id="cart-delivery-notes"
                      name="deliveryNotes"
                      rows={2}
                      placeholder="e.g. Gift packaging needed, deliver after 5 PM"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-sand-50 border border-sand-300 text-sand-900 focus:outline-none focus:border-botanical-700 resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer: Subtotal & WhatsApp Checkout CTA */}
            {items.length > 0 && (
              <div className="p-5 sm:p-6 bg-sand-50 border-t border-sand-200">
                <div className="space-y-1.5 text-xs mb-4">
                  <div className="flex justify-between text-sand-600">
                    <span>Subtotal</span>
                    <span className="font-mono">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sand-600">
                    <span>Delivery (Kerala)</span>
                    <span className="font-mono">
                      {deliveryFee === 0 ? (
                        <strong className="text-emerald-700 font-bold">FREE</strong>
                      ) : (
                        `₹${deliveryFee}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-botanical-950 pt-2 border-t border-sand-200">
                    <span>Total Amount</span>
                    <span className="font-serif text-lg font-bold">
                      ₹{totalAmount}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-3.5 rounded-full font-bold text-sm bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center gap-2 transition-all duration-200 shadow-md active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Send Order to WhatsApp ({FLORA_INFO.phone})</span>
                </button>

                <p className="text-[10px] text-center text-sand-500 mt-2.5">
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
