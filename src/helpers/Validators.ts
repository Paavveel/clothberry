const emailValidator = (value: string, message: string) => {
  const pattern =
    /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return !pattern.test(value) ? message : undefined;
};

const validatePassword = (value: string) => {
  if (value.length < 8) {
    return 'Password must have at least 8 characters';
  }

  if (!/[A-Z]/.test(value)) {
    return 'Password must contain at least 1 uppercase letter';
  }

  if (!/[a-z]/.test(value)) {
    return 'Password must contain at least 1 lowercase letter';
  }

  if (!/\d/.test(value)) {
    return 'Password must contain at least 1 digit';
  }

  return undefined;
};

const validateName = (value: string) => {
  if (/\d/.test(value)) {
    return 'Name should not contain numbers';
  }

  if (/[^a-zA-ZА-Яа-яЁё]/.test(value)) {
    return 'Name should not contain special characters';
  }

  return undefined;
};

const validatePostCode = (value: string) => {
  // USA
  const usPostalCodeRegex = /^\d{5}$/;

  // Canada (A1B 2C3)
  const canadaPostalCodeRegex = /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/;

  if (!usPostalCodeRegex.test(value) && !canadaPostalCodeRegex.test(value)) {
    return 'Invalid postal code format';
  }

  return undefined;
};

export { emailValidator, validatePassword, validateName, validatePostCode };
