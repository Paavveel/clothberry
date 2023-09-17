import { api } from '@api/client';
import { Cart, MyCartDraft, MyCartUpdate } from '@commercetools/platform-sdk';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { logout } from './authSlice';

export const checkCart = createAsyncThunk<Cart, void, { rejectValue: string }>(
  'cart/checkCart',
  async (_, { rejectWithValue }) => {
    try {
      const result = await api.request.me().activeCart().get().execute();
      return result.body;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Error with check cart');
    }
  }
);

export const createCart = createAsyncThunk<Cart, MyCartDraft, { rejectValue: string }>(
  'cart/createCart',
  async (body, { rejectWithValue, dispatch }) => {
    try {
      const result = await api.request.me().carts().post({ body }).execute();
      return result.body;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'invalid_token') {
          dispatch(logout());
        }
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Error with create cart');
    }
  }
);

export type UpdateCartData = { cartId: string; body: MyCartUpdate };

export const updateCart = createAsyncThunk<Cart, UpdateCartData, { rejectValue: string }>(
  'cart/updateCart',
  async (data, { rejectWithValue, dispatch }) => {
    const { cartId, body } = data;
    try {
      const result = await api.request.me().carts().withId({ ID: cartId }).post({ body }).execute();
      return result.body;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'invalid_token') {
          dispatch(logout());
        }
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Error with update cart');
    }
  }
);

export type DeleteCartData = { cartId: string; version: MyCartUpdate['version'] };

export const deleteCart = createAsyncThunk<Cart, DeleteCartData, { rejectValue: string }>(
  'cart/deleteCart',
  async (data, { rejectWithValue, dispatch }) => {
    const { cartId, version } = data;
    try {
      const result = await api.request.me().carts().withId({ ID: cartId }).delete({ queryArgs: { version } }).execute();
      return result.body;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'invalid_token') {
          dispatch(logout());
        }
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Error with create cart');
    }
  }
);
