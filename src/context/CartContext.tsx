import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { FLORA_INFO } from '../data/catalog';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (product: Product, selectedPotColor?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  freeDeliveryThreshold: number;
  deliveryFee: number;
  totalAmount: number;
  generateWhatsAppOrderUrl: (customerName?: string, address?: string, notes?: string) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'flora_cart_items_v1';
const FREE_DELIVERY_THRESHOLD = 999;
const STANDARD_DELIVERY_FEE = 80;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore storage errors
    }
  }, [items]);

  const addItem = (product: Product, selectedPotColor?: string) => {
    setItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1, selectedPotColor: selectedPotColor || item.selectedPotColor }
            : item
        );
      }
      return [...prev, { product, quantity: 1, selectedPotColor }];
    });
    setIsOpen(true);
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setItems(prev =>
      prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : STANDARD_DELIVERY_FEE;
  const totalAmount = subtotal + deliveryFee;

  const generateWhatsAppOrderUrl = (customerName = '', address = '', notes = '') => {
    const lines: string[] = [];
    lines.push(`Hello Flora Pots & Plants!`);
    lines.push(`I would like to place an order from your website:\n`);
    lines.push(`*ORDER ITEMS:*`);
    
    items.forEach((item, index) => {
      const colorText = item.selectedPotColor ? ` (${item.selectedPotColor})` : '';
      lines.push(`${index + 1}. ${item.quantity}x ${item.product.name}${colorText} - Rs.${item.product.price * item.quantity}`);
    });

    lines.push(``);
    lines.push(`*ORDER SUMMARY:*`);
    lines.push(`Subtotal: Rs.${subtotal}`);
    lines.push(`Delivery: ${deliveryFee === 0 ? 'FREE (Orders above Rs.999)' : `Rs.${deliveryFee}`}`);
    lines.push(`*Total Amount: Rs.${totalAmount}*`);

    if (customerName || address || notes) {
      lines.push(``);
      lines.push(`*CUSTOMER DETAILS:*`);
      if (customerName) lines.push(`Name: ${customerName}`);
      if (address) lines.push(`Delivery Address: ${address}`);
      if (notes) lines.push(`Special Instructions: ${notes}`);
    }

    lines.push(``);
    lines.push(`Please confirm product availability and dispatch schedule. Thank you!`);

    const fullMessage = lines.join('\n');
    return `https://wa.me/${FLORA_INFO.whatsappRaw}?text=${encodeURIComponent(fullMessage)}`;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        setIsOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
        deliveryFee,
        totalAmount,
        generateWhatsAppOrderUrl,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
