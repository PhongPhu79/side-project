import { create } from "zustand";
import type { Product } from "../products/types";

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  total: () => number;
  totalItems: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (product, quantity = 1) => {
    const items = get().items;
    const existing = items.find((i) => i.product.id === product.id);
    if (existing) {
      set({
        items: items.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        ),
      });
    } else {
      set({ items: [...items, { product, quantity }] });
    }
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      set({
        items: get().items.filter((i) => i.product.id !== productId),
      });
      return;
    }
    set({
      items: get().items.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i
      ),
    });
  },

  removeItem: (productId) =>
    set({
      items: get().items.filter((i) => i.product.id !== productId),
    }),

  clear: () => set({ items: [] }),

  total: () =>
    get().items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    ),

  totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
}));
