import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { cloneDeep, set } from 'lodash';
import { ulid as newId } from 'ulid';

export interface User {
  id: string | null; // Typically the 'sub' from the JWT
  username: string | null; // Username from token or DB
  device: string; // device id for non-subbed users
  email: string | null; // Email from token or DB
  tier: 'free' | 'basic' | 'premium' | 'admin';
  role: 'user' | 'moderator' | 'admin' | null; // User role for permission
  features: string[]; // Optional custom claims (like "ai_export")
  token: string | null; // Raw JWT
  isAuthenticated: boolean; // Easy flag for gating UI
  loading: boolean; // Helpful for login/logout flows
  error: string | null; // Optional error for login/logout issues
}

const initialState: User = {
  id: null,
  username: null,
  device: newId(),
  email: null,
  tier: 'free',
  role: 'user',
  features: [],
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      const { id, username, email, tier, role, features, token, device } =
        action.payload;
      state.id = id;
      state.username = username;
      state.email = email;
      state.tier = tier;
      state.role = role;
      state.features = features || [];
      state.token = token || null;
      state.isAuthenticated = !!id; // Set authenticated if id exists
      state.loading = false; // Reset loading state on successful login
      state.error = null; // Clear any previous errors
      state.device = device || newId();
    },
    clearUser: (state) => {
      state.id = null;
      state.username = null;
      state.email = null;
      state.tier = 'free';
      state.role = null;
      state.features = [];
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setUser, clearUser, setLoading, setError } = userSlice.actions;

export default userSlice.reducer;
