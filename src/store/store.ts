import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';

import authReducer from './features/auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  devTools: import.meta.env.DEV,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
