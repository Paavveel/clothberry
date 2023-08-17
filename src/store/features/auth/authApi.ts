import { api } from '@api/client';
import { Customer } from '@commercetools/platform-sdk';
import { UserAuthOptions } from '@commercetools/sdk-client-v2';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const login = createAsyncThunk<Customer, UserAuthOptions, { rejectValue: string }>(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      api.changeToPasswordFlow({ username, password });
      const result = await api.request
        .login()
        .post({ body: { email: username, password } })
        .execute();

      return result.body.customer;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unknown error');
    }
  }
);
