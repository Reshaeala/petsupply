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
  fetchCart: () => Promise<void>;
  count: () => number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  fetchCart: async () => {
    try {
      const items = await api.get("/api/cart");
      set({ items });
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      // Handle error appropriately, e.g., show a notification
    }
  },
  count: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
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
