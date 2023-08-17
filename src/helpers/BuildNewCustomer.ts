/* eslint-disable @typescript-eslint/no-unused-vars */
import { BaseAddress } from '@commercetools/platform-sdk';

interface FormRegister extends Record<string, unknown> {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  ShippingStreet: string;
  ShippingCity: string;
  ShippingPostalCode: string;
  ShippingCountry: string;
  BillingStreet: string;
  BillingCity: string;
  BillingPostalCode: string;
  BillingCountry: string;
}

interface IOption {
  value: string;
  label: string;
}

type TCustomer = {
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

export async function buildCustomer(
  {
    email,
    firstName,
    lastName,
    middleName,
    BillingCity,
    BillingCountry,
    BillingPostalCode,
    BillingStreet,
    ShippingCity,
    ShippingCountry,
    ShippingPostalCode,
    ShippingStreet,
    dateOfBirth,
    password,
  }: FormRegister,
  defaultBillingShipping: boolean,
  defaultShipping: boolean,
  defaultBilling: boolean
) {
  const customer: TCustomer = {
    email,
    password,
    firstName,
    lastName,
    dateOfBirth,
  };

  const addresses: BaseAddress[] = [
    {
      id: crypto.randomUUID(),
      country: (ShippingCountry as unknown as IOption).value,
      postalCode: ShippingPostalCode,
      city: ShippingCity,
      streetName: ShippingStreet,
    },
  ];

  if (middleName.length) {
    customer.middleName = middleName;
  }
  if (
    BillingCity.length &&
    (BillingCountry as unknown as IOption) &&
    BillingPostalCode.length &&
    BillingStreet.length
  ) {
    addresses.push({
      id: crypto.randomUUID(),
      country: (BillingCountry as unknown as IOption).value,
      postalCode: BillingPostalCode,
      city: BillingCity,
      streetName: BillingStreet,
    });
  }
  console.log(defaultBillingShipping);
  if (defaultBillingShipping) {
    customer.defaultBillingAddress = 0;
    // customer.defaultShippingAddress = 0;
  }
  // if (defaultShipping) {
  //   customer.defaultShippingAddress = 0;
  // }
  // if (defaultBilling) {
  //   customer.defaultShippingAddress = 1;
  // }
  // if (defaultBilling && defaultShipping) {
  //   customer.defaultBillingAddress = 1;
  //   customer.defaultShippingAddress = 0;
  // }

  customer.addresses = addresses;
  console.log(customer);
  return customer;
}
