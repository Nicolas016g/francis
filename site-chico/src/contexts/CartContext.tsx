'use client';
import { createContext, useContext, useReducer, ReactNode } from 'react';

export interface CartItem {
  slug: string;
  name: string;
  price: number;
  qty: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { slug: string; name: string; price: number; qty?: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QTY'; payload: { slug: string; qty: number } }
  | { type: 'CLEAR' };

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD_ITEM': {
      const addQty = action.payload.qty ?? 1;
      const existing = state.find((i) => i.slug === action.payload.slug);
      if (existing) {
        return state.map((i) =>
          i.slug === action.payload.slug ? { ...i, qty: i.qty + addQty } : i
        );
      }
      return [...state, { slug: action.payload.slug, name: action.payload.name, price: action.payload.price, qty: addQty }];
    }
    case 'REMOVE_ITEM':
      return state.filter((i) => i.slug !== action.payload);
    case 'UPDATE_QTY':
      if (action.payload.qty <= 0) {
        return state.filter((i) => i.slug !== action.payload.slug);
      }
      return state.map((i) =>
        i.slug === action.payload.slug ? { ...i, qty: action.payload.qty } : i
      );
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: { slug: string; name: string; price: number }, qty?: number) => void;
  removeFromCart: (slug: string) => void;
  updateQty: (slug: string, qty: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);

  const addToCart = (item: { slug: string; name: string; price: number }, qty = 1) =>
    dispatch({ type: 'ADD_ITEM', payload: { ...item, qty } });

  const removeFromCart = (slug: string) =>
    dispatch({ type: 'REMOVE_ITEM', payload: slug });

  const updateQty = (slug: string, qty: number) =>
    dispatch({ type: 'UPDATE_QTY', payload: { slug, qty } });

  const clearCart = () => dispatch({ type: 'CLEAR' });

  const total = items.reduce((acc, i) => acc + i.price * i.qty, 0);
  const count = items.reduce((acc, i) => acc + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
