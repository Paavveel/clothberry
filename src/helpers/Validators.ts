const emailValidator = (value: string, message: string) => {
  const pattern =
    /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return !pattern.test(value) ? message : undefined;
};

const validatePassword = (value: string) => {
  if (value.length < 8) {
    return '⚠ Password must have at least 8 characters';
  }

  if (!/[A-Z]/.test(value)) {
    return '⚠ Password must contain at least 1 uppercase letter';
  }

  if (!/[a-z]/.test(value)) {
    return '⚠ Password must contain at least 1 lowercase letter';
  }

  if (!/\d/.test(value)) {
    return '⚠ Password must contain at least 1 digit';
  }

  if (!/^\S*$/.test(value)) {
    return '⚠ Password must not contain leading or trailing whitespace';
  }

  return undefined;
};

const validateName = (value: string) => {
  if (/\d/.test(value)) {
    return '⚠ Name should not contain numbers';
  }

  if (/[^a-zA-ZА-Яа-яЁё]/.test(value)) {
    return '⚠ Name should not contain special characters';
  }

  return undefined;
};

interface IOption {
  value: string;
  label: string;
}

const validatePostCode = (newValue: string, country: IOption) => {
  const { label, value } = country;
  let postalCode: RegExp | null = null;
  switch (value) {
    case 'AT':
      postalCode = /^(?:(?:[2-8]\d|9[0-7]|0?[28]|0?9(?=09))(?:\d{2}))$/;
      if (!postalCode.test(newValue)) {
        return `⚠ Invalid postal code for ${label}`;
      }
      break;
    case 'DE':
      postalCode = /^\d{5}$/;
      if (!postalCode.test(newValue)) {
        return `⚠ Invalid postal code for ${label}`;
      }
      break;
    case 'US':
      postalCode = /^\d{5}(?:-\d{4})?$/;
      if (!postalCode.test(newValue)) {
        return `⚠ Invalid postal code for ${label}`;
      }
      break;
    case 'NL':
      postalCode = /^(?:NL-)?(?:[1-9]\d{3} ?(?:[A-EGHJ-NPRTVWXZ][A-EGHJ-NPRSTVWXZ]|S[BCEGHJ-NPRTVWXZ]))$/i;
      if (!postalCode.test(newValue)) {
        return `⚠ Invalid postal code for ${label}`;
      }
      break;

    default:
      break;
  }

  return undefined;
};

export { emailValidator, validatePassword, validateName, validatePostCode };
