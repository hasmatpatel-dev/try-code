import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DashboardStats } from '@/types';

interface DashboardState {
  timeRange: '7d' | '30d' | '90d' | '12m';
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  timeRange: '30d',
  stats: null,
  loading: false,
  error: null,
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setTimeRange: (state, action: PayloadAction<'7d' | '30d' | '90d' | '12m'>) => {
      state.timeRange = action.payload;
    },
    setStats: (state, action: PayloadAction<DashboardStats | null>) => {
      state.stats = action.payload;
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

export const { setTimeRange, setStats, setLoading, setError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
