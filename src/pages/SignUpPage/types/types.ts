import { BaseAddress } from '@commercetools/platform-sdk';

export type OptionCountry = {
  value: string;
  label: string;
};

export type TCustomer = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  middleName?: string;
  defaultBillingAddress?: number;
  defaultShippingAddress?: number;
  addresses?: BaseAddress[];
};
