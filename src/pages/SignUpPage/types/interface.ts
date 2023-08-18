export interface FormRegister extends Record<string, unknown> {
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
