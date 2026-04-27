import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import artworkService from '../../services/artworkService';

// Mock artworks for offline mode
const PICSUM = 'https://picsum.photos/seed';
const mockArtworks = [
  { _id: '1', title: 'Whispers of the Cosmos', description: 'A celestial journey through swirling galaxies.', culturalHistory: 'Inspired by ancient Mesopotamian star charts.', price: 2400, category: 'painting', medium: 'Oil on canvas', year: 2022, tags: ['abstract', 'cosmos'], thumbnail: `${PICSUM}/cosmos/600/700`, status: 'approved', isFeatured: true, avgRating: 4.8, totalReviews: 24, views: 380, artist: { _id: 'a1', name: 'Marcus Reyes', avatar: `${PICSUM}/artist/100/100` }, reviews: [] },
  { _id: '2', title: 'Urban Fragments', description: 'Deconstructed city landscapes as geometric poetry.', culturalHistory: 'Reflects post-industrial transformation of cities.', price: 1850, category: 'photography', medium: 'Digital print', year: 2023, tags: ['urban', 'geometry'], thumbnail: `${PICSUM}/urban/600/700`, status: 'approved', isFeatured: true, avgRating: 4.5, totalReviews: 18, views: 260, artist: { _id: 'a2', name: 'Elena Vasquez', avatar: `${PICSUM}/artist2/100/100` }, reviews: [] },
  { _id: '3', title: 'Silent Bloom', description: 'Hyper-realistic petals frozen in perfect stillness.', culturalHistory: 'Part of Neo-Romantic movement.', price: 3200, category: 'painting', medium: 'Acrylic on board', year: 2021, tags: ['floral', 'realism'], thumbnail: `${PICSUM}/bloom/600/700`, status: 'approved', isFeatured: true, avgRating: 4.9, totalReviews: 31, views: 520, artist: { _id: 'a1', name: 'Marcus Reyes', avatar: `${PICSUM}/artist/100/100` }, reviews: [] },
  { _id: '4', title: 'Echoes of Terra', description: 'Sculptural forms rising from the earth.', culturalHistory: 'Draws from pre-Columbian traditions.', price: 5500, category: 'sculpture', medium: 'Bronze', year: 2020, tags: ['earth', 'sculpture'], thumbnail: `${PICSUM}/terra/600/700`, status: 'approved', isFeatured: true, avgRating: 4.7, totalReviews: 15, views: 190, artist: { _id: 'a2', name: 'Elena Vasquez', avatar: `${PICSUM}/artist2/100/100` }, reviews: [] },
  { _id: '5', title: 'Digital Reverie', description: 'An AI-assisted dreamscape where code meets canvas.', culturalHistory: 'Explores algorithmic creativity.', price: 980, category: 'digital', medium: 'Generative art print', year: 2024, tags: ['digital', 'AI'], thumbnail: `${PICSUM}/digital1/600/700`, status: 'approved', isFeatured: true, avgRating: 4.3, totalReviews: 42, views: 670, artist: { _id: 'a1', name: 'Marcus Reyes', avatar: `${PICSUM}/artist/100/100` }, reviews: [] },
  { _id: '6', title: 'The Weight of Memory', description: 'Layered textures evoking collective nostalgia.', culturalHistory: 'Influenced by memory studies movement.', price: 2100, category: 'mixed-media', medium: 'Mixed media on paper', year: 2022, tags: ['memory', 'nostalgia'], thumbnail: `${PICSUM}/memory/600/700`, status: 'approved', isFeatured: true, avgRating: 4.6, totalReviews: 22, views: 310, artist: { _id: 'a2', name: 'Elena Vasquez', avatar: `${PICSUM}/artist2/100/100` }, reviews: [] },
  { _id: '7', title: 'Chromatic Storm', description: 'Explosive color fields in a symphony of chaos.', culturalHistory: 'Abstract expressionism reinterpreted.', price: 3750, category: 'painting', medium: 'Oil on linen', year: 2023, tags: ['abstract', 'color'], thumbnail: `${PICSUM}/storm/600/700`, status: 'approved', isFeatured: false, avgRating: 4.8, totalReviews: 19, views: 280, artist: { _id: 'a1', name: 'Marcus Reyes', avatar: `${PICSUM}/artist/100/100` }, reviews: [] },
  { _id: '8', title: 'Invisible Architecture', description: 'Negative space as the subject in minimalism.', culturalHistory: 'Rooted in Bauhaus principles.', price: 1600, category: 'drawing', medium: 'Graphite on paper', year: 2021, tags: ['minimal', 'architecture'], thumbnail: `${PICSUM}/architecture/600/700`, status: 'approved', isFeatured: false, avgRating: 4.4, totalReviews: 11, views: 150, artist: { _id: 'a2', name: 'Elena Vasquez', avatar: `${PICSUM}/artist2/100/100` }, reviews: [] },
  { _id: '9', title: 'Neon Mythology', description: 'Ancient gods reimagined in electric neon hues.', culturalHistory: 'Postmodern take on Greek and Norse mythology.', price: 2900, category: 'digital', medium: 'Digital painting', year: 2024, tags: ['mythology', 'neon'], thumbnail: `${PICSUM}/neon/600/700`, status: 'approved', isFeatured: false, avgRating: 4.7, totalReviews: 28, views: 410, artist: { _id: 'a1', name: 'Marcus Reyes', avatar: `${PICSUM}/artist/100/100` }, reviews: [] },
  { _id: '10', title: 'Tidal Frequencies', description: 'Ocean rhythms as visual sound waves.', culturalHistory: 'Pacific Island navigational traditions.', price: 4100, category: 'mixed-media', medium: 'Resin and pigment', year: 2022, tags: ['ocean', 'waves'], thumbnail: `${PICSUM}/tidal/600/700`, status: 'approved', isFeatured: false, avgRating: 4.5, totalReviews: 16, views: 225, artist: { _id: 'a2', name: 'Elena Vasquez', avatar: `${PICSUM}/artist2/100/100` }, reviews: [] },
  { _id: '11', title: 'Portrait in Fragments', description: 'A shattered self-portrait reconstructed.', culturalHistory: 'Fragmented identity discourse.', price: 3300, category: 'painting', medium: 'Acrylic and collage', year: 2023, tags: ['portrait', 'abstract'], thumbnail: `${PICSUM}/portrait/600/700`, status: 'approved', isFeatured: false, avgRating: 4.6, totalReviews: 20, views: 340, artist: { _id: 'a1', name: 'Marcus Reyes', avatar: `${PICSUM}/artist/100/100` }, reviews: [] },
  { _id: '12', title: 'Sacred Geometry I', description: 'Mathematical perfection in gold leaf.', culturalHistory: 'Islamic architecture and Pythagorean philosophy.', price: 6800, category: 'print', medium: 'Screenprint with gold leaf', year: 2020, tags: ['geometry', 'sacred'], thumbnail: `${PICSUM}/geometry/600/700`, status: 'approved', isFeatured: false, avgRating: 5.0, totalReviews: 8, views: 180, artist: { _id: 'a2', name: 'Elena Vasquez', avatar: `${PICSUM}/artist2/100/100` }, reviews: [] },
];

export const fetchArtworks = createAsyncThunk('artworks/fetchAll', async (params, { rejectWithValue }) => {
  try { return await artworkService.getArtworks(params); }
  catch (err) { return rejectWithValue(err.response?.data?.message || err.message); }
});

export const fetchArtwork = createAsyncThunk('artworks/fetchOne', async (id, { rejectWithValue }) => {
  try { return await artworkService.getArtwork(id); }
  catch (err) { return rejectWithValue(err.response?.data?.message || err.message); }
});

export const fetchFeatured = createAsyncThunk('artworks/featured', async (_, { rejectWithValue }) => {
  try { return await artworkService.getFeatured(); }
  catch (err) { return rejectWithValue(err.response?.data?.message || err.message); }
});

export const fetchMyArtworks = createAsyncThunk('artworks/myArtworks', async (params, { rejectWithValue }) => {
  try { return await artworkService.getMyArtworks(params); }
  catch (err) { return rejectWithValue(err.response?.data?.message || err.message); }
});

export const createArtwork = createAsyncThunk('artworks/create', async (data, { rejectWithValue }) => {
  try { return await artworkService.createArtwork(data); }
  catch (err) { return rejectWithValue(err.response?.data?.message || err.message); }
});

export const updateArtwork = createAsyncThunk('artworks/update', async ({ id, data }, { rejectWithValue }) => {
  try { return await artworkService.updateArtwork(id, data); }
  catch (err) { return rejectWithValue(err.response?.data?.message || err.message); }
});

export const deleteArtwork = createAsyncThunk('artworks/delete', async (id, { rejectWithValue }) => {
  try { await artworkService.deleteArtwork(id); return id; }
  catch (err) { return rejectWithValue(err.response?.data?.message || err.message); }
});

export const updateArtworkStatus = createAsyncThunk('artworks/updateStatus', async ({ id, status }, { rejectWithValue }) => {
  try { return await artworkService.updateStatus(id, status); }
  catch (err) { return rejectWithValue(err.response?.data?.message || err.message); }
});

export const addReview = createAsyncThunk('artworks/addReview', async ({ id, data }, { rejectWithValue }) => {
  try { return await artworkService.addReview(id, data); }
  catch (err) { return rejectWithValue(err.response?.data?.message || err.message); }
});

const artworkSlice = createSlice({
  name: 'artworks',
  initialState: {
    artworks: mockArtworks,
    featured: mockArtworks.filter(a => a.isFeatured),
    myArtworks: [],
    currentArtwork: null,
    pagination: { page: 1, limit: 12, total: mockArtworks.length, pages: 1 },
    filters: { category: '', minPrice: '', maxPrice: '', search: '', sort: '-createdAt' },
    loading: false,
    error: null,
    pendingArtworks: [
      { _id: 'p1', title: 'Morning Serenity', price: 1200, category: 'painting', status: 'pending', thumbnail: `${PICSUM}/morning/200/200`, artist: { name: 'New Artist', avatar: `${PICSUM}/newartist/50/50` } },
      { _id: 'p2', title: 'Electric Pulse', price: 880, category: 'digital', status: 'pending', thumbnail: `${PICSUM}/electric/200/200`, artist: { name: 'Digital Creator', avatar: `${PICSUM}/creator/50/50` } },
    ],
  },
  reducers: {
    setFilters: (state, action) => { state.filters = { ...state.filters, ...action.payload }; },
    clearFilters: (state) => { state.filters = { category: '', minPrice: '', maxPrice: '', search: '', sort: '-createdAt' }; },
    clearCurrentArtwork: (state) => { state.currentArtwork = null; },
  },
  extraReducers: (builder) => {
    // fetchArtworks
    builder
      .addCase(fetchArtworks.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchArtworks.fulfilled, (s, a) => {
        s.loading = false;
        s.artworks = a.payload.data;
        s.pagination = a.payload.pagination;
      })
      .addCase(fetchArtworks.rejected, (s, a) => { s.loading = false; /* use mock data */ });

    // fetchFeatured
    builder
      .addCase(fetchFeatured.fulfilled, (s, a) => { s.featured = a.payload.data; })
      .addCase(fetchFeatured.rejected, () => {});

    // fetchArtwork
    builder
      .addCase(fetchArtwork.pending, (s) => { s.loading = true; })
      .addCase(fetchArtwork.fulfilled, (s, a) => { s.loading = false; s.currentArtwork = a.payload.data; })
      .addCase(fetchArtwork.rejected, (s, a) => {
        s.loading = false;
        // fallback: find in local mock
        if (s.artworks.length) s.currentArtwork = s.artworks[0];
      });

    // fetchMyArtworks
    builder
      .addCase(fetchMyArtworks.fulfilled, (s, a) => { s.myArtworks = a.payload.data; });

    // createArtwork
    builder
      .addCase(createArtwork.fulfilled, (s, a) => {
        s.myArtworks.unshift(a.payload.data);
        s.pendingArtworks.push({ ...a.payload.data, status: 'pending' });
      });

    // updateArtwork
    builder
      .addCase(updateArtwork.fulfilled, (s, a) => {
        const idx = s.myArtworks.findIndex(x => x._id === a.payload.data._id);
        if (idx > -1) s.myArtworks[idx] = a.payload.data;
      });

    // deleteArtwork
    builder
      .addCase(deleteArtwork.fulfilled, (s, a) => {
        s.myArtworks = s.myArtworks.filter(x => x._id !== a.payload);
        s.artworks = s.artworks.filter(x => x._id !== a.payload);
      });

    // updateArtworkStatus
    builder
      .addCase(updateArtworkStatus.fulfilled, (s, a) => {
        const idx = s.artworks.findIndex(x => x._id === a.payload.data._id);
        if (idx > -1) s.artworks[idx] = a.payload.data;
        s.pendingArtworks = s.pendingArtworks.filter(x => x._id !== a.payload.data._id);
      });

    // addReview
    builder
      .addCase(addReview.fulfilled, (s, a) => { s.currentArtwork = a.payload.data; });
  },
});

export const { setFilters, clearFilters, clearCurrentArtwork } = artworkSlice.actions;
export default artworkSlice.reducer;
