import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post } from '@/types';

interface PostsFilters {
  search: string;
  category: string;
  tag: string;
  status: string; // 'all' | 'published' | 'draft'
  page: number;
  limit: number;
}

interface PostsState {
  items: Post[];
  filters: PostsFilters;
  loading: boolean;
  error: string | null;
  totalCount: number;
}

const defaultFilters: PostsFilters = {
  search: '',
  category: '',
  tag: '',
  status: 'all',
  page: 1,
  limit: 10,
};

const initialState: PostsState = {
  items: [],
  filters: defaultFilters,
  loading: false,
  error: null,
  totalCount: 0,
};

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<{ items: Post[]; totalCount: number }>) => {
      state.items = action.payload.items;
      state.totalCount = action.payload.totalCount;
      state.loading = false;
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<Partial<PostsFilters>>) => {
      state.filters = { ...state.filters, ...action.payload, page: action.payload.page ?? 1 };
    },
    clearFilters: (state) => {
      state.filters = defaultFilters;
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

export const { setPosts, setFilters, clearFilters, setLoading, setError } = postsSlice.actions;
export default postsSlice.reducer;
