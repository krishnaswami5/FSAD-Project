import { createSlice } from '@reduxjs/toolkit';

const savedCart = JSON.parse(localStorage.getItem('gallery_cart') || '[]');

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: savedCart,
    isOpen: false,
  },
  reducers: {
    addToCart: (state, action) => {
      const exists = state.items.find(i => i._id === action.payload._id);
      if (!exists) {
        state.items.push(action.payload);
        localStorage.setItem('gallery_cart', JSON.stringify(state.items));
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i._id !== action.payload);
      localStorage.setItem('gallery_cart', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('gallery_cart');
    },
    toggleCart: (state) => { state.isOpen = !state.isOpen; },
    openCart: (state) => { state.isOpen = true; },
    closeCart: (state) => { state.isOpen = false; },
  },
});

export const cartSubtotal = (state) => state.cart.items.reduce((sum, i) => sum + i.price, 0);
export const cartCount = (state) => state.cart.items.length;

export const { addToCart, removeFromCart, clearCart, toggleCart, openCart, closeCart } = cartSlice.actions;
export default cartSlice.reducer;
