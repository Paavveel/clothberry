import { api } from '@api/client';
import { Customer } from '@commercetools/platform-sdk';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getCustomer = createAsyncThunk<Customer, Customer['id'], { rejectValue: string }>(
  'auth/getCustomer',
  async (customerId, { rejectWithValue }) => {
    try {
      const result = await api.request.customers().withId({ ID: customerId }).get().execute();

      return result.body;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unknown error');
    }
  }
);
