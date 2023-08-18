import { api } from '@api/client';
import { Customer } from '@commercetools/platform-sdk';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '@store/store';

import { login } from './authApi';
import { signup } from './signupApi';

export interface AuthState {
  isLoggedIn: boolean;
  customer: Customer | null;
  loading: boolean;
  errorMessage: string;
}

const initialState: AuthState = {
  isLoggedIn: false,
  customer: null,
  loading: false,
  errorMessage: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      api.changeToAnonymousFlow();
      state.isLoggedIn = false;
      state.customer = null;
    },
    clearError: (state) => {
      state.errorMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.errorMessage = '';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.customer = action.payload;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.errorMessage = action.payload;
        }
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.errorMessage = '';
      })
      .addCase(signup.fulfilled, (state) => {
        state.isLoggedIn = true;
        state.loading = false;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.errorMessage = action.payload;
        }
      });
  },
});

export const { logout, clearError } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;