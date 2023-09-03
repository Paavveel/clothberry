import { api } from '@api/client';
import { Customer, MyCustomerChangePassword, MyCustomerUpdate } from '@commercetools/platform-sdk';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { logout } from './authSlice';

export const getCustomer = createAsyncThunk<Customer, void, { rejectValue: string }>(
  'auth/getCustomer',
  async (_, { rejectWithValue }) => {
    try {
      const result = await api.request.me().get().execute();

      return result.body;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unknown error');
    }
  }
);

export const updateCustomer = createAsyncThunk<Customer, MyCustomerUpdate, { rejectValue: string }>(
  'auth/updateCustomer',
  async (body, { rejectWithValue, dispatch }) => {
    try {
      const result = await api.request
        .me()
        .post({
          body,
        })
        .execute();

      return result.body;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'invalid_token') {
          dispatch(logout);
        }
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Error with update');
    }
  }
);

export const changeCustomerPassword = createAsyncThunk<Customer, MyCustomerChangePassword, { rejectValue: string }>(
  'auth/changeCustomerPassword',
  async (body, { rejectWithValue, dispatch }) => {
    try {
      const result = await api.request
        .me()
        .password()
        .post({
          body,
        })
        .execute();

      return result.body;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'invalid_token') {
          dispatch(logout);
        }
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Error with update');
    }
  }
);
