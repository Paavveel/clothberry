import { api } from '@api/client';
import { Cart, Customer } from '@commercetools/platform-sdk';
import { getTokenFromStorage, removeAnonymousTokenFromStorage, removeTokenFromStorage } from '@helpers/TokenStorage';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '@store/store';

import { login } from './authApi';
import { checkCart, createCart, deleteCart, updateCart } from './cartApi';
import { getCustomer, updateCustomer } from './profileApi';
import { signup } from './signupApi';

export interface AuthState {
  isLoggedIn: boolean;
  customer: Customer | null;
  cart: Cart | null;
  loading: boolean;
  errorMessage: string;
}

const initialState: AuthState = {
  isLoggedIn: Boolean(getTokenFromStorage()),
  customer: null,
  cart: null,
  loading: false,
  errorMessage: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      removeTokenFromStorage();
      removeAnonymousTokenFromStorage();
      api.changeToAnonymousFlow();
      state.isLoggedIn = false;
      state.customer = null;
      state.cart = null;
      state.errorMessage = '';
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
        state.customer = action.payload.customer;
        if (action.payload.cart) {
          state.cart = action.payload.cart;
        }
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
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.customer = action.payload.customer;
        if (action.payload.cart) {
          state.cart = action.payload.cart;
        }
        state.loading = false;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.errorMessage = action.payload;
        }
      })

      .addCase(getCustomer.fulfilled, (state, action) => {
        state.customer = action.payload;
      })

      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.customer = action.payload;
      })

      .addCase(checkCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })

      .addCase(createCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })

      .addCase(updateCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })

      .addCase(deleteCart.fulfilled, (state) => {
        state.cart = null;
      });
  },
});

export const { logout, clearError } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
