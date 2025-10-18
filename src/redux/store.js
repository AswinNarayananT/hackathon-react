import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import organizationReducer from './organization/organizationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    organization: organizationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});
