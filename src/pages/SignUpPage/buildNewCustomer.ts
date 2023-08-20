import { BaseAddress } from '@commercetools/platform-sdk';

import { FormRegister, OptionCountry, TCustomer } from './types';

function checkDefaultAddress(
  newCustomer: TCustomer,
  defaultBillingShipping: boolean,
  defaultShipping: boolean,
  defaultBilling: boolean
): void {
  if (defaultBillingShipping) {
    newCustomer.defaultBillingAddress = 0;
    newCustomer.defaultShippingAddress = 0;
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
      country: (ShippingCountry as unknown as OptionCountry).value,
      postalCode: ShippingPostalCode,
      city: ShippingCity,
      streetName: ShippingStreet,
    },
  ];

  if (registerFormCustomer.middleName.length) {
    newCustomer.middleName = middleName;
  }
  if (
    BillingCity.length &&
    (BillingCountry as unknown as OptionCountry).value &&
    BillingPostalCode.length &&
    BillingStreet.length
  ) {
    addresses.push({
      country: (BillingCountry as unknown as OptionCountry).value,
      postalCode: BillingPostalCode,
      city: BillingCity,
      streetName: BillingStreet,
    });
  }
  newCustomer.addresses = addresses;

  checkDefaultAddress(newCustomer, defaultBillingShipping, defaultShipping, defaultBilling);
};
