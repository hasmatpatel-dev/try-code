import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import authReducer from '@/features/authSlice';
import userReducer from '@/features/userSlice';
import postsReducer from '@/features/postsSlice';
import categoriesReducer from '@/features/categoriesSlice';
import dashboardReducer from '@/features/dashboardSlice';
import settingsReducer from '@/features/settingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    posts: postsReducer,
    categories: categoriesReducer,
    dashboard: dashboardReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
