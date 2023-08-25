import { api } from '@api/client';
import { Customer } from '@commercetools/platform-sdk';
import { createAsyncThunk } from '@reduxjs/toolkit';

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

type UpdatePersonalInfoType = Pick<Customer, 'email' | 'firstName' | 'lastName' | 'dateOfBirth' | 'version'>;

export const updatePersonalInfo = createAsyncThunk<Customer, UpdatePersonalInfoType, { rejectValue: string }>(
  'auth/updatePersonalInfo',
  async ({ email, firstName, lastName, dateOfBirth, version }, { rejectWithValue }) => {
    try {
      const result = await api.request
        .me()
        .post({
          body: {
            version,
            actions: [
              {
                action: 'changeEmail',
                email,
              },
              {
                action: 'setFirstName',
                firstName,
              },
              {
                action: 'setLastName',
                lastName,
              },
              {
                action: 'setDateOfBirth',
                dateOfBirth,
              },
            ],
          },
        })
        .execute();

      return result.body;
    } catch (error) {
      return rejectWithValue('Error with update');
    }
  }
);
