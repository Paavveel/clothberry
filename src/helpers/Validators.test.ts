import { countries } from 'config/countries';

import { emailValidator, validateName, validatePassword, validatePostCode } from './Validators';

describe('validatePassword', () => {
  it('returns an error message for passwords with less than 8 characters', () => {
    const result = validatePassword('short');
    expect(result).toBe('⚠ Password must have at least 8 characters');
  });

  it('returns an error message for passwords without uppercase letters', () => {
    const result = validatePassword('lowercase123');
    expect(result).toBe('⚠ Password must contain at least 1 uppercase letter');
  });

  it('returns an error message for passwords without lowercase letters', () => {
    const result = validatePassword('UPPERCASE123');
    expect(result).toBe('⚠ Password must contain at least 1 lowercase letter');
  });

  it('returns an error message for passwords without digits', () => {
    const result = validatePassword('NoDigits');
    expect(result).toBe('⚠ Password must contain at least 1 digit');
  });

  it('returns an error message for passwords with trailing whitespace', () => {
    const result = validatePassword('TrailingSpace1 ');
    expect(result).toBe('⚠ Password must not contain leading or trailing whitespace');
  });

  it('returns undefined for a valid password', () => {
    const result = validatePassword('ValidPa55');
    expect(result).toBeUndefined();
  });
});

describe('validatePostCode', () => {
  it('returns an error message for an invalid postal code in Germany', () => {
    const result = validatePostCode('123456', countries[0].value);
    expect(result).toBe(`⚠ Invalid postal code for ${countries[0].value}`);
  });

  it('returns an error message for a valid postal code in Germany with wrong format', () => {
    const result = validatePostCode('1234', countries[0].value);
    expect(result).toBe(`⚠ Invalid postal code for ${countries[0].value}`);
  });

  it('returns undefined for a valid postal code in Germany', () => {
    const result = validatePostCode('12345', countries[0].value);
    expect(result).toBeUndefined();
  });

  it('returns an error message for an invalid postal code in Austria', () => {
    const result = validatePostCode('12345', countries[1].value);
    expect(result).toBe(`⚠ Invalid postal code for ${countries[1].value}`);
  });

  it('returns an error message for an invalid postal code in the United States', () => {
    const result = validatePostCode('123', countries[2].value);
    expect(result).toBe(`⚠ Invalid postal code for ${countries[2].value}`);
  });

  it('returns undefined for a valid postal code in the United States', () => {
    const result = validatePostCode('12345', countries[2].value);
    expect(result).toBeUndefined();
  });

  it('returns an error message for an invalid postal code in the Netherlands', () => {
    const result = validatePostCode('123', countries[3].value);
    expect(result).toBe(`⚠ Invalid postal code for ${countries[3].value}`);
  });

  it('returns undefined for a valid postal code in the Netherlands', () => {
    const result = validatePostCode('1234 AB', countries[3].value);
    expect(result).toBeUndefined();
  });

  it('returns an error message for an invalid postal code in Germany', () => {
    const result = validatePostCode('1234567890', countries[0].value);
    expect(result).toBe(`⚠ Invalid postal code for ${countries[0].value}`);
  });

  it('returns an error message for an invalid postal code in Austria', () => {
    const result = validatePostCode('1234567', countries[1].value);
    expect(result).toBe(`⚠ Invalid postal code for ${countries[1].value}`);
  });

  it('returns an error message for an invalid postal code in the Netherlands', () => {
    const result = validatePostCode('12 AB', countries[3].value);
    expect(result).toBe(`⚠ Invalid postal code for ${countries[3].value}`);
  });
});

describe('validateName function', () => {
  it('returns undefined for valid name without numbers and special characters', () => {
    const result = validateName('JohnDoe');
    expect(result).toBeUndefined();
  });

  it('returns an error message for a name containing numbers', () => {
    const result = validateName('John123');
    expect(result).toBe('⚠ Name should not contain numbers');
  });

  it('returns an error message for a name containing special characters', () => {
    const result = validateName('John@Doe');
    expect(result).toBe('⚠ Name should not contain special characters');
  });
});

describe('emailValidator function', () => {
  it('returns undefined for a valid email', () => {
    const result = emailValidator('test@example.com', 'Error message');
    expect(result).toBeUndefined();
  });

  it('returns an error message for an invalid email format', () => {
    const result = emailValidator('invalidemail', 'Invalid email format');
    expect(result).toBe('Invalid email format');
  });

  it('returns an error message for an email without "@"', () => {
    const result = emailValidator('noatsign.com', 'No "@" in email');
    expect(result).toBe('No "@" in email');
  });

  it('returns an error message for an email without domain', () => {
    const result = emailValidator('user@', 'No domain in email');
    expect(result).toBe('No domain in email');
  });

  it('returns an error message for an email without user part', () => {
    const result = emailValidator('@example.com', 'No user in email');
    expect(result).toBe('No user in email');
  });

  it('returns an error message for an email with multiple "@"', () => {
    const result = emailValidator('user@domain@example.com', 'Multiple "@" in email');
    expect(result).toBe('Multiple "@" in email');
  });

  it('returns an error message for an email with leading whitespace', () => {
    const result = emailValidator('  user@example.com', 'Leading whitespace in email');
    expect(result).toBe('Leading whitespace in email');
  });

  it('returns an error message for an email with trailing whitespace', () => {
    const result = emailValidator('user@example.com  ', 'Trailing whitespace in email');
    expect(result).toBe('Trailing whitespace in email');
  });

  it('returns undefined for an email with a subdomain', () => {
    const result = emailValidator('user@sub.example.com', 'Error message');
    expect(result).toBeUndefined();
  });

  it('returns undefined for an email with .com TLD', () => {
    const result = emailValidator('user@example.com', 'Error message');
    expect(result).toBeUndefined();
  });

  it('returns undefined for an email with .net TLD', () => {
    const result = emailValidator('user@example.net', 'Error message');
    expect(result).toBeUndefined();
  });

  it('returns undefined for an email with .org TLD', () => {
    const result = emailValidator('user@example.org', 'Error message');
    expect(result).toBeUndefined();
  });
});
