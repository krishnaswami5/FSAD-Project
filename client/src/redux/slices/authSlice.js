import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

const storedUser = JSON.parse(localStorage.getItem('gallery_user'));
const storedToken = localStorage.getItem('gallery_token');

// Mock users for offline demo mode
const MOCK_USERS = {
  'admin@gallery.com':   { _id: 'u1', name: 'Alexandra Chen',  email: 'admin@gallery.com',   role: 'admin',   avatar: 'https://picsum.photos/seed/admin/100/100',   password: 'Admin@123' },
  'artist@gallery.com':  { _id: 'u2', name: 'Marcus Reyes',    email: 'artist@gallery.com',  role: 'artist',  avatar: 'https://picsum.photos/seed/artist/100/100',  password: 'Artist@123' },
  'curator@gallery.com': { _id: 'u3', name: 'Sophie Laurent',  email: 'curator@gallery.com', role: 'curator', avatar: 'https://picsum.photos/seed/curator/100/100', password: 'Curator@123' },
  'visitor@gallery.com': { _id: 'u4', name: 'James Wilson',    email: 'visitor@gallery.com', role: 'visitor', avatar: 'https://picsum.photos/seed/visitor/100/100', password: 'Visitor@123' },
};

const mockLogin = (email, password) => {
  const user = MOCK_USERS[email];
  if (!user || user.password !== password) throw new Error('Invalid credentials');
  const mockToken = 'mock_token_' + user.role + '_' + Date.now();
  return { success: true, user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }, accessToken: mockToken, refreshToken: mockToken + '_refresh' };
};

const mockRegister = (name, email, password, role) => {
  const newUser = { _id: 'u_' + Date.now(), name, email, role: role || 'visitor', avatar: `https://picsum.photos/seed/${Date.now()}/100/100` };
  const mockToken = 'mock_token_' + newUser.role + '_' + Date.now();
  return { success: true, user: newUser, accessToken: mockToken, refreshToken: mockToken + '_refresh' };
};

export const registerUser = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try { return await authService.register(data); }
  catch (err) {
    // Fallback: mock register when backend is unavailable
    if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error') || err.message?.includes('ECONNREFUSED')) {
      try { return mockRegister(data.name, data.email, data.password, data.role); }
      catch (mockErr) { return rejectWithValue(mockErr.message); }
    }
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const loginUser = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try { return await authService.login(data); }
  catch (err) {
    // Fallback: mock login when backend is unavailable
    if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error') || err.message?.includes('ECONNREFUSED') || !err.response) {
      try { return mockLogin(data.email, data.password); }
      catch (mockErr) { return rejectWithValue(mockErr.message); }
    }
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try { await authService.logout(); } catch (_) {}
});

export const fetchCurrentUser = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try { return await authService.getMe(); }
  catch (err) { return rejectWithValue(err.response?.data?.message || err.message); }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (data, { rejectWithValue }) => {
  try { return await authService.updateProfile(data); }
  catch (err) { return rejectWithValue(err.response?.data?.message || err.message); }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser || null,
    token: storedToken || null,
    isAuthenticated: !!storedToken,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
      state.isAuthenticated = true;
      localStorage.setItem('gallery_user', JSON.stringify(action.payload.user));
      localStorage.setItem('gallery_token', action.payload.accessToken);
      if (action.payload.refreshToken)
        localStorage.setItem('gallery_refresh', action.payload.refreshToken);
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerUser.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(registerUser.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload.user;
        s.token = a.payload.accessToken;
        s.isAuthenticated = true;
        localStorage.setItem('gallery_user', JSON.stringify(a.payload.user));
        localStorage.setItem('gallery_token', a.payload.accessToken);
        localStorage.setItem('gallery_refresh', a.payload.refreshToken);
      })
      .addCase(registerUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; });

    // Login
    builder
      .addCase(loginUser.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(loginUser.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload.user;
        s.token = a.payload.accessToken;
        s.isAuthenticated = true;
        localStorage.setItem('gallery_user', JSON.stringify(a.payload.user));
        localStorage.setItem('gallery_token', a.payload.accessToken);
        localStorage.setItem('gallery_refresh', a.payload.refreshToken);
      })
      .addCase(loginUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; });

    // Logout
    builder.addCase(logoutUser.fulfilled, (s) => {
      s.user = null; s.token = null; s.isAuthenticated = false;
      localStorage.removeItem('gallery_user');
      localStorage.removeItem('gallery_token');
      localStorage.removeItem('gallery_refresh');
    });

    // Fetch me
    builder
      .addCase(fetchCurrentUser.fulfilled, (s, a) => {
        s.user = a.payload.user;
        localStorage.setItem('gallery_user', JSON.stringify(a.payload.user));
      });

    // Update profile
    builder
      .addCase(updateProfile.fulfilled, (s, a) => {
        s.user = a.payload.user;
        localStorage.setItem('gallery_user', JSON.stringify(a.payload.user));
      });
  },
});

export const { clearError, setCredentials } = authSlice.actions;
export default authSlice.reducer;
