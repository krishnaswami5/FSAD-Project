import api from './api';

const userService = {
  getUsers:       async (params) => { const res = await api.get('/users', { params }); return res.data; },
  getUser:        async (id)     => { const res = await api.get(`/users/${id}`); return res.data; },
  updateUser:     async (id, data) => { const res = await api.put(`/users/${id}`, data); return res.data; },
  deleteUser:     async (id)     => { const res = await api.delete(`/users/${id}`); return res.data; },
  toggleWishlist: async (artworkId) => { const res = await api.post(`/users/wishlist/${artworkId}`); return res.data; },
  getAnalytics:   async ()       => { const res = await api.get('/users/analytics'); return res.data; },
};

export default userService;
