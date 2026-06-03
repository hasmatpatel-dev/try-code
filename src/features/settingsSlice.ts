import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  siteName: string;
  siteDescription: string;
  allowRegistration: boolean;
  allowComments: boolean;
  requireCommentApproval: boolean;
  logoUrl: string | null;
}

const initialState: SettingsState = {
  siteName: 'TryCode',
  siteDescription: 'Full-Stack Blog CMS and LMS Foundation',
  allowRegistration: true,
  allowComments: true,
  requireCommentApproval: true,
  logoUrl: null,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSettings: (state, action: PayloadAction<Partial<SettingsState>>) => {
      return { ...state, ...action.payload };
    },
    resetSettings: () => {
      return initialState;
    },
  },
});

export const { updateSettings, resetSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
