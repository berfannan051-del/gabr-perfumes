"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import type { LocalizedText } from "@/types/catalog";

export type CartItem = {
  productId: string;
  variantId: string;
  slug: string;
  name: LocalizedText;
  sizeMl: number;
  price: number;
  quantity: number;
  heroColor: string;
  bottleShape: "tall" | "round" | "faceted";
};

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: "hydrate"; items: CartItem[] }
  | { type: "add"; item: Omit<CartItem, "quantity">; quantity: number }
  | { type: "remove"; productId: string; variantId: string }
  | { type: "setQuantity"; productId: string; variantId: string; quantity: number }
  | { type: "clear" };

const STORAGE_KEY = "gabr-cart";

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate":
      return { items: action.items };
    case "add": {
      const existing = state.items.find(
        (i) => i.productId === action.item.productId && i.variantId === action.item.variantId
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            i === existing ? { ...i, quantity: i.quantity + action.quantity } : i
          ),
        };
      }
      return { items: [...state.items, { ...action.item, quantity: action.quantity }] };
    }
    case "remove":
      return {
        items: state.items.filter(
          (i) => !(i.productId === action.productId && i.variantId === action.variantId)
        ),
      };
    case "setQuantity":
      return {
        items: state.items
          .map((i) =>
            i.productId === action.productId && i.variantId === action.variantId
              ? { ...i, quantity: action.quantity }
              : i
          )
          .filter((i) => i.quantity > 0),
      };
    case "clear":
      return { items: [] };
    default:
      return state;
  }
}

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  setQuantity: (productId: string, variantId: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "hydrate", items: JSON.parse(raw) });
    } catch {
      // ignore corrupt storage
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from localStorage on mount
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items, hydrated]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
    dispatch({ type: "add", item, quantity });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productId: string, variantId: string) => {
    dispatch({ type: "remove", productId, variantId });
  }, []);

  const setQuantity = useCallback((productId: string, variantId: string, quantity: number) => {
    dispatch({ type: "setQuantity", productId, variantId, quantity });
  }, []);

  const clear = useCallback(() => dispatch({ type: "clear" }), []);

  const value = useMemo<CartContextValue>(() => {
    const count = state.items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = state.items.reduce((sum, i) => sum + i.quantity * i.price, 0);
    return {
      items: state.items,
      count,
      subtotal,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      addItem,
      removeItem,
      setQuantity,
      clear,
    };
  }, [state.items, isOpen, addItem, removeItem, setQuantity, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
