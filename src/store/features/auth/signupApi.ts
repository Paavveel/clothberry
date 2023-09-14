import { api } from '@api/client';
import { CustomerSignInResult, MyCustomerDraft } from '@commercetools/platform-sdk';
import { removeAnonymousTokenFromStorage } from '@helpers/TokenStorage';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { createCart } from './cartApi';

export const signup = createAsyncThunk<CustomerSignInResult, MyCustomerDraft, { rejectValue: string }>(
  'auth/signup',
  async (currentCustomerDraft, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.request
        .me()
        .signup()
        .post({
          body: currentCustomerDraft,
        })
        .execute();

      api.changeToPasswordFlow({ username: currentCustomerDraft.email, password: currentCustomerDraft.password });

      removeAnonymousTokenFromStorage();

      if (!response.body.cart) {
        await dispatch(createCart({ currency: 'USD' }));
      }

      return response.body;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unknown error');
    }
  }
);
