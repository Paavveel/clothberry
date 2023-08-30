import { FC, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Select from 'react-select';

import classNames from 'classnames';
import { countries } from 'config/countries';
import { AppRoutes } from 'config/routes';

import { api } from '@api/client';
import { emailValidator, validateName, validatePassword, validatePostCode } from '@helpers/Validators';
import { login } from '@store/features/auth/authApi';
import { clearError } from '@store/features/auth/authSlice';
import { signup } from '@store/features/auth/signupApi';
import { useAppDispatch, useAppSelector } from '@store/hooks';

import { Button, Checkbox, Form, Input } from '../../components';
import styles from './SignUpPage.module.css';
import { buildNewCustomer } from './buildNewCustomer';
import type { TCustomer } from './types';
import { FormRegister } from './types/interface';

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

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const navigate = useNavigate();

  const watchShippingCountry = watch('ShippingCountry');
  const watchBillingCountry = watch('BillingCountry');

  const handleDefaultBillingShipping = () => {
    if (defaultShipping) {
      setDefaultShipping(false);
    }
    if (defaultBilling) {
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

  const submit: SubmitHandler<FormRegister> = async (data) => {
    const customer: TCustomer = {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
    };

    buildNewCustomer(data, customer, defaultBillingShipping, defaultShipping, defaultBilling);

    try {
      await dispatch(signup(customer)).unwrap();
      api.changeToPasswordFlow({ username: data.email, password: data.password });
      await dispatch(login({ username: data.email, password: data.password })).unwrap();
      navigate(AppRoutes.ROOT, { replace: true });
    } catch (error) {}
  };

  if (state.isLoggedIn) return <Navigate to={AppRoutes.ROOT} replace />;

  return (
    <Form title='Sign up an account' onSubmit={handleSubmit(submit)}>
      <Input<FormRegister>
        id='signup-email'
        type='text'
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
        id='signup-password'
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
        id='signup-last-confirm-password'
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
        id='signup-last-first-name'
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
        id='signup-last-name'
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
        id='signup-middle-name'
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
          id='signup-birth-date'
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

              const ageDifference = new Date(today.getTime() - selectedDate.getTime());
              const age = Math.abs(ageDifference.getUTCFullYear() - 1970);

              if (age < minAge) {
                return `⚠ You must be at least ${minAge} years old`;
              }
              if (today.getTime() < selectedDate.getTime()) {
                return `⚠ The date cannot be greater than the current one`;
              }

              return undefined;
            },
          }}
        />
      </div>

      <div className={styles['address-wrapper']}>
        <h3 className={styles.subheading}>Shipping address</h3>
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
                options={countries}
                placeholder='Country *'
                value={countries.find((c) => c.value === value)}
                onChange={(val) => onChange(val?.value)}
              />
              {error && <small className='validate-error__text'>{error.message || 'Error'}</small>}
            </>
          )}
        />

        <Input<FormRegister>
          id='signup-shipping-postal-code'
          type='text'
          placeholder='Postal Code *'
          label='ShippingPostalCode'
          register={register}
          error={errors.ShippingPostalCode}
          disabled={!watchShippingCountry}
          options={{
            required: '⚠ Postal Code is required field!',
            validate: (value: string) => validatePostCode(value, watchShippingCountry),
          }}
        />

        <Input<FormRegister>
          id='signup-shipping-city'
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
          id='signup-shipping-street'
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
      </div>

      {!defaultBillingShipping && (
        <div className={styles['address-wrapper']}>
          <h3 className={`${styles.subheading} ${styles.subheading_billing}`}>Billing address</h3>
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
                  options={countries}
                  placeholder='Country *'
                  value={countries.find((c) => c.value === value)}
                  onChange={(val) => onChange(val?.value)}
                />
                {error && <small className='validate-error__text'>{error.message || 'Error'}</small>}
              </>
            )}
          />

          <Input<FormRegister>
            id='signup-billing-postal-code'
            type='text'
            placeholder='Postal Code *'
            label='BillingPostalCode'
            register={register}
            error={errors.BillingPostalCode}
            disabled={!watchBillingCountry}
            options={{
              required: '⚠ Postal Code is required field!',
              validate: (value: string) => validatePostCode(value, watchBillingCountry),
            }}
          />

          <Input<FormRegister>
            id='signup-billing-city'
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
            id='signup-billing-street'
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
        </div>
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

      {state.errorMessage && (
        <p className={styles.response__error}>
          <span>❌</span> {state.errorMessage}
        </p>
      )}
    </Form>
  );
};
