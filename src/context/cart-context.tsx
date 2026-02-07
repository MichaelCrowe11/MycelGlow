'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Cart } from '@/lib/shopify/types';

type CartContextType = {
  cart: Cart | null;
  isOpen: boolean;
  isLoading: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, variantId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_ID_KEY = 'mycelglow-cart-id';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = useCallback(async (cartId: string) => {
    try {
      const res = await fetch(`/api/cart?cartId=${encodeURIComponent(cartId)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.cart) {
          setCart(data.cart);
          return;
        }
      }
      localStorage.removeItem(CART_ID_KEY);
    } catch {
      localStorage.removeItem(CART_ID_KEY);
    }
  }, []);

  useEffect(() => {
    const cartId = localStorage.getItem(CART_ID_KEY);
    if (cartId) {
      fetchCart(cartId);
    }
  }, [fetchCart]);

  const createNewCart = async (): Promise<string> => {
    const res = await fetch('/api/cart', { method: 'POST' });
    const data = await res.json();
    const newCart = data.cart as Cart;
    setCart(newCart);
    localStorage.setItem(CART_ID_KEY, newCart.id);
    return newCart.id;
  };

  const addItem = async (variantId: string, quantity = 1) => {
    setIsLoading(true);
    try {
      let cartId = cart?.id || localStorage.getItem(CART_ID_KEY);
      if (!cartId) {
        cartId = await createNewCart();
      }

      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          cartId,
          lines: [{ merchandiseId: variantId, quantity }],
        }),
      });

      const data = await res.json();
      setCart(data.cart);
      setIsOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const updateItem = async (lineId: string, variantId: string, quantity: number) => {
    if (!cart?.id) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          cartId: cart.id,
          lines: [{ id: lineId, merchandiseId: variantId, quantity }],
        }),
      });

      const data = await res.json();
      setCart(data.cart);
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (lineId: string) => {
    if (!cart?.id) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'remove',
          cartId: cart.id,
          lineIds: [lineId],
        }),
      });

      const data = await res.json();
      setCart(data.cart);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        isLoading,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItem,
        updateItem,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
