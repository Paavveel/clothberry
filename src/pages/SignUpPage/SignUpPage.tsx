/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Select from 'react-select';

import classNames from 'classnames';
import { AppRoutes } from 'config/routes';

import { api } from '@api/client';
import { BaseAddress } from '@commercetools/platform-sdk';
import { emailValidator, validateName, validatePassword, validatePostCode } from '@helpers/Validators';
import { login } from '@store/features/auth/authApi';
import { signup } from '@store/features/signup/signupApi';
import { useAppDispatch, useAppSelector } from '@store/hooks';

import { Button, Checkbox, Form, Input } from '../../components';
import styles from './SignUpPage.module.css';

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
    watch,
    control,
  } = useForm<FormRegister>({
    mode: 'onChange',
  });
  const state = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const watchShippingCountry = watch('ShippingCountry') as unknown as IOption;
  const watchBillingPostalCode = watch('BillingCountry') as unknown as IOption;

  const handleDefaultBillingShipping = () => {
    if (defaultShipping) {
      setDefaultShipping(false);
    }
    if (defaultBilling) {
      setDefaultShipping(false);
    }
    setDefaultBillingShipping(!defaultBillingShipping);
  };

  const handleDefaultShipping = () => {
    if (defaultBillingShipping) {
      setDefaultBillingShipping(false);
    }
    setDefaultShipping(!defaultShipping);
  };

  const handleDefaultBilling = () => {
    if (defaultBillingShipping) {
      setDefaultBillingShipping(false);
    }
    setDefaultBilling(!defaultBilling);
  };

  const submit: SubmitHandler<FormRegister> = async ({
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
  }) => {
    const customer: TCustomer = {
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
    };

    const addresses: BaseAddress[] = [
      {
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
      (BillingCountry as unknown as IOption).value &&
      BillingPostalCode.length &&
      BillingStreet.length
    ) {
      addresses.push({
        country: (BillingCountry as unknown as IOption).value,
        postalCode: BillingPostalCode,
        city: BillingCity,
        streetName: BillingStreet,
      });
    }
    console.log(defaultBillingShipping);
    if (defaultBillingShipping) {
      customer.defaultBillingAddress = 0;
      customer.defaultShippingAddress = 0;
    }
    if (defaultShipping) {
      customer.defaultShippingAddress = 0;
    }
    if (defaultBilling) {
      customer.defaultBillingAddress = 1;
    }
    if (defaultBilling && defaultShipping) {
      customer.defaultBillingAddress = 1;
      customer.defaultShippingAddress = 0;
    }

    customer.addresses = addresses;

    try {
      await dispatch(signup(customer)).unwrap();
      api.changeToPasswordFlow({ username: email, password });
      await dispatch(login({ username: email, password })).unwrap();
      navigate(AppRoutes.ROOT, { replace: true });
    } catch (error) {}
  };

  if (!state.isLoggedIn) <Navigate to={AppRoutes.ROOT} replace />;
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

      <Button type='submit' className={styles.button} primary loading={state.loading}>
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
