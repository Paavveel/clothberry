import { api } from '@api/client';
import { Cart, MyCartDraft, MyCartUpdate } from '@commercetools/platform-sdk';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const checkCart = createAsyncThunk<Cart, void, { rejectValue: string }>(
  'cart/checkCart',
  async (_, { rejectWithValue }) => {
    try {
      const result = await api.request.me().carts().get().execute();
      return result.body.results[0];
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Error with update');
    }
  }
);

export const createCart = createAsyncThunk<Cart, MyCartDraft, { rejectValue: string }>(
  'cart/createCart',
  async (body, { rejectWithValue }) => {
    try {
      const result = await api.request.me().carts().post({ body }).execute();
      return result.body;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Error with update');
    }
  }
);

export type UpdateCartData = { cardId: string; body: MyCartUpdate };

export const updateCart = createAsyncThunk<Cart, UpdateCartData, { rejectValue: string }>(
  'cart/updateCart',
  async (data, { rejectWithValue }) => {
    const { cardId, body } = data;
    console.log(data);
    try {
      const result = await api.request.me().carts().withId({ ID: cardId }).post({ body }).execute();
      return result.body;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Error with update');
    }
  }
);
