import { BaseAddress } from '@commercetools/platform-sdk';

import { FormRegister, TCustomer } from './types';

function checkDefaultAddress(
  newCustomer: TCustomer,
  defaultBillingShipping: boolean,
  defaultShipping: boolean,
  defaultBilling: boolean
): void {
  if (defaultBillingShipping) {
    newCustomer.defaultBillingAddress = 0;
    newCustomer.defaultShippingAddress = 0;
    newCustomer.shippingAddresses = [0];
    newCustomer.billingAddresses = [0];
  }
  if (!defaultBillingShipping) {
    newCustomer.shippingAddresses = [0];
    newCustomer.billingAddresses = [1];
  }
  if (defaultShipping) {
    newCustomer.defaultShippingAddress = 0;
  }
  if (defaultBilling) {
    newCustomer.defaultBillingAddress = 1;
  }
  if (defaultBilling && defaultShipping) {
    newCustomer.defaultBillingAddress = 1;
    newCustomer.defaultShippingAddress = 0;
  }
}

export const buildNewCustomer = (
  registerFormCustomer: FormRegister,
  newCustomer: TCustomer,
  defaultBillingShipping: boolean,
  defaultShipping: boolean,
  defaultBilling: boolean
) => {
  const {
    ShippingCountry,
    ShippingPostalCode,
    ShippingCity,
    ShippingStreet,
    middleName,
    BillingCity,
    BillingCountry,
    BillingPostalCode,
    BillingStreet,
  } = registerFormCustomer;

  const addresses: BaseAddress[] = [
    {
      country: ShippingCountry,
      postalCode: ShippingPostalCode,
      city: ShippingCity,
      streetName: ShippingStreet,
    },
  ];

  if (registerFormCustomer.middleName.length) {
    newCustomer.middleName = middleName;
  }
  if (BillingCity.length && BillingCountry && BillingPostalCode.length && BillingStreet.length) {
    addresses.push({
      country: BillingCountry,
      postalCode: BillingPostalCode,
      city: BillingCity,
      streetName: BillingStreet,
    });
  }
  newCustomer.addresses = addresses;

  checkDefaultAddress(newCustomer, defaultBillingShipping, defaultShipping, defaultBilling);
};
