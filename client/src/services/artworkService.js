import api from './api';

const artworkService = {
  getArtworks:  async (params) => { const res = await api.get('/artworks', { params }); return res.data; },
  getArtwork:   async (id)     => { const res = await api.get(`/artworks/${id}`); return res.data; },
  getFeatured:  async ()       => { const res = await api.get('/artworks/featured'); return res.data; },
  getMyArtworks: async (params)=> { const res = await api.get('/artworks/my', { params }); return res.data; },
  createArtwork: async (data)  => { const res = await api.post('/artworks', data); return res.data; },
  updateArtwork: async (id, data) => { const res = await api.put(`/artworks/${id}`, data); return res.data; },
  deleteArtwork: async (id)    => { const res = await api.delete(`/artworks/${id}`); return res.data; },
  updateStatus:  async (id, status) => { const res = await api.patch(`/artworks/${id}/status`, { status }); return res.data; },
  addReview:     async (id, data)   => { const res = await api.post(`/artworks/${id}/reviews`, data); return res.data; },
};

export default artworkService;
