import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  cartItems: {},

  addToCart: (item) =>
    set((state) => ({
      cartItems: {
        ...state.cartItems,
        [item.itemID]: {
          ...item,
          quantity: 1,
        },
      },
    })),

  incrementItem: (id) =>
    set((state) => ({
      cartItems: {
        ...state.cartItems,
        [id]: {
          ...state.cartItems[id],
          quantity: state.cartItems[id].quantity + 1,
        },
      },
    })),

  decrementItem: (id) => {
    const current = get().cartItems[id];
    if (current.quantity === 1) {
      const updatedCart = { ...get().cartItems };
      delete updatedCart[id];
      set({ cartItems: updatedCart });
    } else {
      set((state) => ({
        cartItems: {
          ...state.cartItems,
          [id]: {
            ...state.cartItems[id],
            quantity: state.cartItems[id].quantity - 1,
          },
        },
      }));
    }
  },

  clearCart: () => set({ cartItems: {} }),
}));
