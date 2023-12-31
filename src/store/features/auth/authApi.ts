import { api } from '@api/client';
import { CustomerSignInResult } from '@commercetools/platform-sdk';
import { UserAuthOptions } from '@commercetools/sdk-client-v2';
import { removeAnonymousTokenFromStorage } from '@helpers/TokenStorage';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { logout } from './authSlice';
import { createCart } from './cartApi';

type CheckLoginResponseType = { active: boolean };

export const login = createAsyncThunk<CustomerSignInResult, UserAuthOptions, { rejectValue: string }>(
  'auth/login',
  async ({ username, password }, { rejectWithValue, dispatch }) => {
    try {
      const result = await api.request
        .me()
        .login()
        .post({
          body: {
            email: username,
            password,
          },
        })
        .execute();

      api.changeToPasswordFlow({ username, password });

      removeAnonymousTokenFromStorage();
      if (!result.body.cart) {
        await dispatch(createCart({ currency: 'USD' }));
      }

      return result.body;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'invalid_token') {
          dispatch(logout());
        }
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unknown error');
    }
  }
);

export const checkToken = createAsyncThunk<CheckLoginResponseType, void, { rejectValue: string }>(
  'auth/checkToken',
  async (_, { rejectWithValue }) => {
    try {
      const credentials = btoa(`${import.meta.env.VITE_CTP_CLIENT_ID}:${import.meta.env.VITE_CTP_CLIENT_SECRET}`);
      const auth = { Authorization: `Basic ${credentials}` };
      const response = await fetch(
        `${import.meta.env.VITE_CTP_AUTH_URL}oauth/introspect?token=${api.currentToken.tokenStore.token}`,
        { method: 'POST', headers: auth }
      );

      const data: CheckLoginResponseType = await response.json();

      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unknown error');
    }
  }
);
