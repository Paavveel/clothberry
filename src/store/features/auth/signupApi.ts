import { api } from '@api/client';
import { Customer, CustomerDraft } from '@commercetools/platform-sdk';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const signup = createAsyncThunk<Customer, CustomerDraft, { rejectValue: string }>(
  'register/signup',
  async (
    {
      email,
      password,
      firstName,
      lastName,
      middleName,
      dateOfBirth,
      addresses,
      defaultBillingAddress,
      shippingAddresses,
      defaultShippingAddress,
      billingAddresses,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.request
        .customers()
        .post({
          body: {
            email,
            password,
            firstName,
            lastName,
            middleName,
            dateOfBirth,
            addresses,
            defaultBillingAddress,
            shippingAddresses,
            defaultShippingAddress,
            billingAddresses,
          },
        })
        .execute();
      return response.body.customer;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unknown error');
    }
  }
);
