import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { cloneDeep, set } from 'lodash';

export interface User {
  id: string | null; // Typically the 'sub' from the JWT
  email: string | null; // Email from token or DB
  role: 'freemium' | 'premium' | 'premiumPlus' | 'admin' | null;
  features: string[]; // Optional custom claims (like "ai_export")
  token: string | null; // Raw JWT
  isAuthenticated: boolean; // Easy flag for gating UI
  loading: boolean; // Helpful for login/logout flows
  error: string | null; // Optional error for login/logout issues
}

const initialState: User = {
  id: null,
  email: null,
  role: null,
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
      const { id, email, role, features, token } = action.payload;
      state.id = id;
      state.email = email;
      state.role = role;
      state.features = features || [];
      state.token = token || null;
      state.isAuthenticated = !!id; // Set authenticated if id exists
      state.loading = false; // Reset loading state on successful login
      state.error = null; // Clear any previous errors
    },
    clearUser: (state) => {
      state.id = null;
      state.email = null;
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
