import { BaseAddress } from '@commercetools/platform-sdk';

import { CustomersAddressArrayIndex, FormRegister, OptionCountry, TCustomer } from './types';

function checkDefaultAddress(
  newCustomer: TCustomer,
  defaultBillingShipping: boolean,
  defaultShipping: boolean,
  defaultBilling: boolean
): void {
  if (defaultBillingShipping) {
    newCustomer.defaultBillingAddress = Number(CustomersAddressArrayIndex.FIRST);
    newCustomer.defaultShippingAddress = Number(CustomersAddressArrayIndex.FIRST);
  }
  if (defaultShipping) {
    newCustomer.defaultShippingAddress = Number(CustomersAddressArrayIndex.FIRST);
  }
  if (defaultBilling) {
    newCustomer.defaultBillingAddress = Number(CustomersAddressArrayIndex.SECOND);
  }
  if (defaultBilling && defaultShipping) {
    newCustomer.defaultBillingAddress = Number(CustomersAddressArrayIndex.SECOND);
    newCustomer.defaultShippingAddress = Number(CustomersAddressArrayIndex.FIRST);
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
