import { FC, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Select from 'react-select';

import classNames from 'classnames';
import { AppRoutes } from 'config/routes';

import { emailValidator, validateName, validatePassword, validatePostCode } from '@helpers/Validators';

import { Button, Checkbox, Form, Input } from '../../components';
import styles from './SignUpPage.module.css';

interface IOption {
  value: string;
  label: string;
}
const options: IOption[] = [
  { value: 'DE', label: 'Germany' },
  { value: 'AT', label: 'Austria' },
  { value: 'US', label: 'United States' },
  { value: 'NL', label: 'Netherlands' },
];

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

const getValueFromCountry = (value: string) => {
  return value ? options.find((option) => option.value === value) : '';
};

export const SignUpPage: FC = () => {
  const [defaultBillingShipping, setDefaultBillingShipping] = useState(false);
  const [defaultShipping, setDefaultShipping] = useState(false);
  const [defaultBilling, setDefaultBilling] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm<FormRegister>({
    mode: 'onChange',
  });

  const watchShippingCountry = watch('ShippingCountry') as unknown as IOption;
  const watchBillingPostalCode = watch('BillingCountry') as unknown as IOption;

  const handleDefaultBillingShipping = () => {
    if (defaultShipping) {
      setDefaultShipping(false);
    }
    setDefaultBillingShipping((prev) => !prev);
  };

  const handleDefaultShipping = () => {
    if (defaultBillingShipping) {
      setDefaultBillingShipping(false);
    }
    setDefaultShipping((prev) => !prev);
  };

  const handleDefaultBilling = () => {
    if (defaultBillingShipping) {
      setDefaultBillingShipping(false);
    }
    setDefaultBilling((prev) => !prev);
  };

  const submit: SubmitHandler<FormRegister> = () => {
    reset();
  };

  return (
    <Form title='Sign up an account' onSubmit={handleSubmit(submit)}>
      <Input<FormRegister>
        type='email'
        placeholder='Email *'
        label='email'
        register={register}
        error={errors.email}
        inputMode='email'
        options={{
          required: '⚠ Email is required field!',
          validate: (value: string) => emailValidator(value, 'Please enter valid email!'),
        }}
      />
      <Input<FormRegister>
        type='password'
        placeholder='Password *'
        label='password'
        register={register}
        error={errors.password}
        showPasswordToggler
        options={{
          required: '⚠ Password is required field!',
          minLength: {
            value: 8,
            message: '⚠ Password must have at least 8 characters',
          },
          validate: (value: string) => validatePassword(value),
        }}
      />
      <Input<FormRegister>
        type='password'
        placeholder='Confirm Password *'
        label='confirmPassword'
        register={register}
        error={errors.confirmPassword}
        showPasswordToggler
        options={{
          required: '⚠ Confirm password is required field!',
          validate: (value: string) => {
            return watch('password') !== value ? '⚠ Your passwords do no match' : undefined;
          },
        }}
      />
      <Input<FormRegister>
        type='text'
        placeholder='First Name *'
        label='firstName'
        register={register}
        error={errors.firstName}
        options={{
          required: '⚠ Name is required field!',
          validate: (value: string) => validateName(value),
        }}
      />
      <Input<FormRegister>
        type='text'
        placeholder='Last Name *'
        label='lastName'
        register={register}
        error={errors.lastName}
        options={{
          required: '⚠ Last Name is required field!',
          validate: (value: string) => validateName(value),
        }}
      />
      <Input<FormRegister>
        type='text'
        placeholder='Middle Name'
        label='middleName'
        register={register}
        error={errors.middleName}
        options={{
          validate: (value: string) => validateName(value),
        }}
      />

      <div className={styles['date-wrapper']}>
        <span>Date of Birth:</span>
        <Input<FormRegister>
          type='date'
          placeholder='Date of birth'
          label='dateOfBirth'
          register={register}
          error={errors.dateOfBirth}
          options={{
            required: '⚠ Date of birth is required field!',
            validate: (value: string) => {
              const today: Date = new Date();
              const selectedDate: Date = new Date(value);
              const minAge = 13;

              if (Number.isNaN(selectedDate.getTime())) {
                return '⚠ Invalid date format';
              }

              const ageDifference = today.getFullYear() - selectedDate.getFullYear();

              if (ageDifference < minAge) {
                return `⚠ You must be at least ${minAge} years old`;
              }

              return undefined;
            },
          }}
        />
      </div>

      <h3 className={styles.subheading}>Shipping address</h3>
      <Input<FormRegister>
        type='text'
        placeholder='Street *'
        label='ShippingStreet'
        register={register}
        error={errors.ShippingStreet}
        options={{
          required: '⚠ Street is required field!',
          validate: (value: string) => {
            if (value.length < 1) {
              return '⚠ Must contain at least one character';
            }
            return undefined;
          },
        }}
      />

      <Input<FormRegister>
        type='text'
        placeholder='City *'
        label='ShippingCity'
        register={register}
        error={errors.ShippingCity}
        options={{
          required: '⚠ City is required field!',
          validate: (value: string) => {
            if (value.length < 1) {
              return 'Must contain at least one character';
            }
            if (/[^\p{L}\s]/u.test(value)) {
              return 'City should not contain special characters or numbers';
            }
            return undefined;
          },
        }}
      />

      <Input<FormRegister>
        type='text'
        placeholder='Postal Code *'
        label='ShippingPostalCode'
        register={register}
        error={errors.ShippingPostalCode}
        options={{
          required: '⚠ Postal Code is required field!',
          validate: (value: string) => validatePostCode(value, watchShippingCountry),
        }}
      />
      <Controller
        control={control}
        name='ShippingCountry'
        rules={{
          required: '⚠ Country is required!',
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <Select
              className={classNames(styles.country, {
                'validate-error__select': error,
              })}
              options={options}
              placeholder='Country *'
              value={getValueFromCountry(value)}
              // onChange={(newValue) => onChange((newValue as IOption).value)}
              onChange={(newValue) => onChange(newValue as IOption)}
            />
            {error && <small className='validate-error__text'>{error.message || 'Error'}</small>}
          </>
        )}
      />

      <Checkbox
        title='Set as default address for billing and shipping'
        htmlFor='default_billing_shipping_address'
        onChange={handleDefaultBillingShipping}
        value={defaultBillingShipping}
      />
      {!defaultBillingShipping && (
        <Checkbox
          title='Set as default shipping address'
          htmlFor='default_shipping_address'
          onChange={handleDefaultShipping}
          value={defaultShipping}
        />
      )}

      {!defaultBillingShipping && (
        <>
          <h3 className={`${styles.subheading} ${styles.subheading_billing}`}>Billing address</h3>
          <Input<FormRegister>
            type='text'
            placeholder='Street *'
            label='BillingStreet'
            register={register}
            error={errors.BillingStreet}
            options={{
              required: '⚠ Street is required field!',
              validate: (value: string) => {
                if (value.length < 1) {
                  return '⚠ Must contain at least one character';
                }
                return undefined;
              },
            }}
          />

          <Input<FormRegister>
            type='text'
            placeholder='City *'
            label='BillingCity'
            register={register}
            error={errors.BillingCity}
            options={{
              required: '⚠ City is required field!',
              validate: (value: string) => {
                if (value.length < 1) {
                  return '⚠ Must contain at least one character';
                }
                if (/[^\p{L}\s]/u.test(value)) {
                  return '⚠ City should not contain special characters or numbers';
                }
                return undefined;
              },
            }}
          />

          <Input<FormRegister>
            type='text'
            placeholder='Postal Code *'
            label='BillingPostalCode'
            register={register}
            error={errors.BillingPostalCode}
            options={{
              required: '⚠ Postal Code is required field!',
              validate: (value: string) => validatePostCode(value, watchBillingPostalCode),
            }}
          />
          <Controller
            control={control}
            name='BillingCountry'
            rules={{
              required: '⚠ Country is required!',
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <Select
                  className={classNames(styles.country, {
                    'validate-error__select': error,
                  })}
                  options={options}
                  placeholder='Country *'
                  value={getValueFromCountry(value)}
                  onChange={(newValue) => onChange(newValue as IOption)}
                />
                {error && <small className='validate-error__text'>{error.message || 'Error'}</small>}
              </>
            )}
          />
        </>
      )}

      {!defaultBillingShipping && (
        <Checkbox
          title='Set as default billing address'
          htmlFor='default_billing_address'
          onChange={handleDefaultBilling}
          value={defaultBilling}
        />
      )}

      <Button type='submit' className={styles.button} primary>
        Sign Up
      </Button>

      <p>
        Already have an account?{' '}
        <Link to={AppRoutes.SIGNIN} className={styles.login}>
          Login
        </Link>
      </p>
    </Form>
  );
};
