import { Cart } from '@commercetools/platform-sdk';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '@store/store';

import { checkCart, createCart, updateCart } from './cartApi';

export interface CartState {
  cart: Cart | null;
  loading: boolean;
  errorMessage: string;
}

const initialState: CartState = {
  cart: null,
  loading: false,
  errorMessage: '',
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.errorMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkCart.pending, (state) => {
        state.loading = true;
        state.errorMessage = '';
      })
      .addCase(checkCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.loading = false;
      })
      .addCase(checkCart.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.errorMessage = action.payload;
        }
      });

    builder
      .addCase(createCart.pending, (state) => {
        state.loading = true;
        state.errorMessage = '';
      })
      .addCase(createCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.loading = false;
      })
      .addCase(createCart.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.errorMessage = action.payload;
        }
      });

    builder
      .addCase(updateCart.pending, (state) => {
        state.loading = true;
        state.errorMessage = '';
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.loading = false;
      })
      .addCase(updateCart.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.errorMessage = action.payload;
        }
      });
  },
});

export const { clearError } = cartSlice.actions;

export const selectCart = (state: RootState) => state.cart;

export default cartSlice.reducer;
