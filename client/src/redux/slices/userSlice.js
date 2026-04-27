import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../../services/userService';

const PICSUM = 'https://picsum.photos/seed';

const mockUsers = [
  { _id: 'u1', name: 'Alexandra Chen', email: 'admin@gallery.com', role: 'admin', isActive: true, avatar: `${PICSUM}/admin/60/60`, createdAt: '2024-01-01' },
  { _id: 'u2', name: 'Marcus Reyes', email: 'artist@gallery.com', role: 'artist', isActive: true, avatar: `${PICSUM}/artist/60/60`, createdAt: '2024-01-15' },
  { _id: 'u3', name: 'Sophie Laurent', email: 'curator@gallery.com', role: 'curator', isActive: true, avatar: `${PICSUM}/curator/60/60`, createdAt: '2024-02-01' },
  { _id: 'u4', name: 'James Wilson', email: 'visitor@gallery.com', role: 'visitor', isActive: true, avatar: `${PICSUM}/visitor/60/60`, createdAt: '2024-02-15' },
  { _id: 'u5', name: 'Elena Vasquez', email: 'artist2@gallery.com', role: 'artist', isActive: true, avatar: `${PICSUM}/artist2/60/60`, createdAt: '2024-03-01' },
];

export const fetchUsers = createAsyncThunk('users/fetchAll', async (params, { rejectWithValue }) => {
  try { return await userService.getUsers(params); }
  catch (err) { return rejectWithValue(err.response?.data?.message || err.message); }
});

export const updateUser = createAsyncThunk('users/update', async ({ id, data }, { rejectWithValue }) => {
  try { return await userService.updateUser(id, data); }
  catch (err) { return rejectWithValue(err.response?.data?.message || err.message); }
});

export const deleteUser = createAsyncThunk('users/delete', async (id, { rejectWithValue }) => {
  try { await userService.deleteUser(id); return id; }
  catch (err) { return rejectWithValue(err.response?.data?.message || err.message); }
});

export const toggleWishlist = createAsyncThunk('users/toggleWishlist', async (artworkId, { rejectWithValue }) => {
  try { return await userService.toggleWishlist(artworkId); }
  catch (err) { return rejectWithValue(err.response?.data?.message || err.message); }
});

export const fetchAnalytics = createAsyncThunk('users/analytics', async (_, { rejectWithValue }) => {
  try { return await userService.getAnalytics(); }
  catch (err) { return rejectWithValue(err.response?.data?.message || err.message); }
});

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: mockUsers,
    analytics: {
      totalUsers: 5,
      totalArtworks: 20,
      totalOrders: 12,
      totalRevenue: 47800,
      usersByRole: [
        { _id: 'admin', count: 1 },
        { _id: 'artist', count: 2 },
        { _id: 'curator', count: 1 },
        { _id: 'visitor', count: 1 },
      ],
      artworksByCategory: [
        { _id: 'painting', count: 6 },
        { _id: 'photography', count: 3 },
        { _id: 'digital', count: 4 },
        { _id: 'sculpture', count: 2 },
        { _id: 'mixed-media', count: 3 },
        { _id: 'drawing', count: 1 },
        { _id: 'print', count: 1 },
      ],
      recentOrders: [],
      monthlySales: [
        { month: 'Jan', revenue: 4200 },
        { month: 'Feb', revenue: 5800 },
        { month: 'Mar', revenue: 3900 },
        { month: 'Apr', revenue: 7200 },
        { month: 'May', revenue: 6100 },
        { month: 'Jun', revenue: 8400 },
        { month: 'Jul', revenue: 9200 },
        { month: 'Aug', revenue: 7800 },
        { month: 'Sep', revenue: 11200 },
        { month: 'Oct', revenue: 9800 },
        { month: 'Nov', revenue: 12400 },
        { month: 'Dec', revenue: 15200 },
      ],
    },
    wishlist: [],
    pagination: { page: 1, limit: 20, total: 5 },
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (s) => { s.loading = true; })
      .addCase(fetchUsers.fulfilled, (s, a) => {
        s.loading = false;
        s.users = a.payload.data;
        s.pagination = a.payload.pagination;
      })
      .addCase(fetchUsers.rejected, (s) => { s.loading = false; });

    builder
      .addCase(updateUser.fulfilled, (s, a) => {
        const idx = s.users.findIndex(u => u._id === a.payload.data._id);
        if (idx > -1) s.users[idx] = a.payload.data;
      });

    builder
      .addCase(deleteUser.fulfilled, (s, a) => {
        s.users = s.users.filter(u => u._id !== a.payload);
      });

    builder
      .addCase(fetchAnalytics.fulfilled, (s, a) => { s.analytics = { ...s.analytics, ...a.payload.data }; });

    builder
      .addCase(toggleWishlist.fulfilled, (s, a) => { s.wishlist = a.payload.wishlist; });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
