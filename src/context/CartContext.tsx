import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { CartResponse } from '@/types/cart.types';
import { cartApi } from '@/api/cart.api';
import { useAuth } from './AuthContext';

interface CartContextValue {
  cart: CartResponse | null;
  isLoading: boolean;
  error: string | null;
  itemCount: number;
  addItem: (bookId: number, quantity: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  refreshCart: () => Promise<void>;
  clearError: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load the cart when the user logs in; clear it when they log out
  useEffect(() => {
    if (!isAuthenticated) {
      setCart(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    cartApi
      .getCart()
      .then(setCart)
      .catch(() => setError('Failed to load your cart. Please refresh the page.'))
      .finally(() => setIsLoading(false));
  }, [isAuthenticated]);

  // Run a cart API call, then reload the latest cart from the backend
  async function runAndReloadCart(apiCall: () => Promise<void>) {
    await apiCall();
    const updatedCart = await cartApi.getCart();
    setCart(updatedCart);
  }

  // Add a book to the cart
  async function addItem(bookId: number, quantity: number) {
    return runAndReloadCart(() => cartApi.addItem({ bookId, quantity }));
  }

  // Change the quantity of a book already in the cart
  async function updateItem(itemId: number, quantity: number) {
    return runAndReloadCart(() => cartApi.updateItem(itemId, { quantity }));
  }

  // Remove a book from the cart
  async function removeItem(itemId: number) {
    return runAndReloadCart(() => cartApi.removeItem(itemId));
  }

  // Clear the error message shown to the user
  function clearError() {
    setError(null);
  }

  // Silently reload the cart without showing a loading spinner (used after checkout)
  async function refreshCart() {
    try {
      setCart(await cartApi.getCart());
    } catch {
      // Ignore errors here — the user is already navigating away after checkout
    }
  }

  // Count the total number of books across all cart lines
  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const value: CartContextValue = {
    cart,
    isLoading,
    error,
    itemCount,
    addItem,
    updateItem,
    removeItem,
    refreshCart,
    clearError,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
