import { create } from "zustand";
import { api } from "@/utils/api";

// ...top of file
export type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  vendor?: string;
  sku?: string;
  species?: string; // ← add this
};

export type CartItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  sku?: string;
};

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (item) => {
    const items = get().items.slice();
    const idx = items.findIndex((i) => i.productId === item.productId);
    if (idx >= 0) {
      items[idx] = {
        ...items[idx],
        quantity: items[idx].quantity + item.quantity,
      };
    } else {
      items.push(item);
    }
    set({ items });
  },
  removeItem: (productId) =>
    set({ items: get().items.filter((i) => i.productId !== productId) }),
  clear: () => set({ items: [] }),
}));
