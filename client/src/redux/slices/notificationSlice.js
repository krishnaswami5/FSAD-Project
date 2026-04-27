import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [
      { id: '1', message: 'Your artwork "Cosmos Dream" was approved!', type: 'success', read: false, createdAt: new Date().toISOString() },
      { id: '2', message: 'New order received for "Silent Bloom"', type: 'info', read: false, createdAt: new Date().toISOString() },
      { id: '3', message: 'A visitor left a 5-star review on your artwork', type: 'success', read: true, createdAt: new Date().toISOString() },
    ],
    isOpen: false,
  },
  reducers: {
    addNotification: (state, action) => {
      state.items.unshift({ ...action.payload, id: Date.now().toString(), read: false, createdAt: new Date().toISOString() });
    },
    markRead: (state, action) => {
      const n = state.items.find(i => i.id === action.payload);
      if (n) n.read = true;
    },
    markAllRead: (state) => { state.items.forEach(n => { n.read = true; }); },
    removeNotification: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    toggleNotifications: (state) => { state.isOpen = !state.isOpen; },
    closeNotifications: (state) => { state.isOpen = false; },
  },
});

export const unreadCount = (state) => state.notifications.items.filter(n => !n.read).length;

export const { addNotification, markRead, markAllRead, removeNotification, toggleNotifications, closeNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
