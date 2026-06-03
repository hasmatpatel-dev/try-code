import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  session: any | null; // Supabase Session type or custom session
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  session: null,
  loading: true,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<{ user: User | null; session: any | null }>) => {
      state.user = action.payload.user;
      state.session = action.payload.session;
      state.loading = false;
      state.error = null;
    },
    clearSession: (state) => {
      state.user = null;
      state.session = null;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setSession, clearSession, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
