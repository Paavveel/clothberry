import { api } from '@api/client';
import { CustomerSignInResult } from '@commercetools/platform-sdk';
import { UserAuthOptions } from '@commercetools/sdk-client-v2';
import { createAsyncThunk } from '@reduxjs/toolkit';

type CheckLoginResponseType = { active: boolean };

export const login = createAsyncThunk<CustomerSignInResult, UserAuthOptions, { rejectValue: string }>(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      api.changeToPasswordFlow({ username, password });
      const result = await api.request
        .login()
        .post({
          body: {
            email: username,
            password,
            anonymousId: api.anonymousID,
          },
        })
        .execute();

      return result.body;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unknown error');
    }
  }
);

export const checkLogin = createAsyncThunk<CheckLoginResponseType, void, { rejectValue: string }>(
  'auth/checkLogin',
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
