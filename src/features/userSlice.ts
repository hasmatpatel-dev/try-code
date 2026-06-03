import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types';

interface UserPreferences {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
}

interface UserState {
  profile: User | null;
  preferences: UserPreferences;
  loading: boolean;
}

const initialState: UserState = {
  profile: null,
  preferences: {
    theme: 'dark',
    sidebarOpen: true,
  },
  loading: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<User | null>) => {
      state.profile = action.payload;
    },
    updatePreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    toggleSidebar: (state) => {
      state.preferences.sidebarOpen = !state.preferences.sidebarOpen;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setProfile, updatePreferences, toggleSidebar, setLoading } = userSlice.actions;
export default userSlice.reducer;
