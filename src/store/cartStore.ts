import type { CartItem, Product } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addToCart: (product: Product, quantity = 1) => {
        if (!product.inStock || product.stockQuantity <= 0 || quantity <= 0) {
          return;
        }

        const safeQuantity = Math.floor(quantity);
        if (!Number.isFinite(safeQuantity) || safeQuantity <= 0) {
          return;
        }

        const currentItems = get().items;
        const existingIndex = currentItems.findIndex((item) => item.product.id === product.id);

        if (existingIndex > -1) {
          const updatedItems = [...currentItems];
          const clampedQuantity = Math.min(
            product.stockQuantity,
            updatedItems[existingIndex].quantity + safeQuantity,
          );
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantity: clampedQuantity,
          };
          set({ items: updatedItems, isOpen: true });
        } else {
          const clampedQuantity = Math.min(product.stockQuantity, safeQuantity);
          set({
            items: [...currentItems, { product, quantity: clampedQuantity }],
            isOpen: true,
          });
        }
      },

      removeFromCart: (productId: string) => {
        set({
          items: get().items.filter((item) => item.product.id !== productId),
        });
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0 || !Number.isFinite(quantity)) {
          get().removeFromCart(productId);
          return;
        }

        const target = get().items.find((item) => item.product.id === productId);
        if (!target) return;

        if (!target.product.inStock || target.product.stockQuantity <= 0) {
          get().removeFromCart(productId);
          return;
        }

        const clampedQuantity = Math.min(Math.floor(quantity), target.product.stockQuantity);
        if (clampedQuantity <= 0) {
          get().removeFromCart(productId);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.product.id === productId ? { ...item, quantity: clampedQuantity } : item,
          ),
        });
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.product.price * item.quantity, 0);
      },
    }),
    {
      name: "marea-travel-cart",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
