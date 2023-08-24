const CUSTOMER = 'customer';

export const setCustomerInStorage = (id: string) => {
  localStorage.setItem(CUSTOMER, id);
};

export const removeCustomerFromStorage = () => {
  localStorage.removeItem(CUSTOMER);
};

export const getCustomerFromStorage = () => {
  return localStorage.getItem(CUSTOMER);
};
