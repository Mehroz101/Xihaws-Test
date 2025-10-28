import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import sitesSlice from './slices/sitesSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    sites: sitesSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
