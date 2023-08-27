import { api } from '@api/client';
import { Customer } from '@commercetools/platform-sdk';
import { removeTokenFromStorage } from '@helpers/TokenStorage';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '@store/store';

import { login } from './authApi';
import { getCustomer, updatePersonalInfo } from './profileApi';
import { signup } from './signupApi';

export interface AuthState {
  isLoggedIn: boolean;
  customer: Customer | null;
  loading: boolean;
  errorMessage: string;
}

const initialState: AuthState = {
  isLoggedIn: Boolean(api.currentToken.tokenStore.token),
  customer: null,
  loading: false,
  errorMessage: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      removeTokenFromStorage();
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
        state.loading = false;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.errorMessage = action.payload;
        }
      });

    builder
      .addCase(getCustomer.pending, (state) => {
        state.errorMessage = '';
      })
      .addCase(getCustomer.fulfilled, (state, action) => {
        state.customer = action.payload;
      })
      .addCase(getCustomer.rejected, (state, action) => {
        if (action.payload) {
          state.errorMessage = action.payload;
        }
      });

    builder.addCase(updatePersonalInfo.fulfilled, (state, action) => {
      state.customer = action.payload;
    });
  },
});

export const { logout, clearError } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
