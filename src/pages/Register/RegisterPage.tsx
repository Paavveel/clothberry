import { FC, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import Select from 'react-select';

import classNames from 'classnames';

import { Button } from '@components/Button/Button';
import { Form } from '@components/Form/Form';
import { Input } from '@components/Input/Input';
import { emailValidator, validateName, validatePassword, validatePostCode } from '@helpers/Validators';

import styles from './RegisterPage.module.css';

const options = [
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
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

const getValue = (value: string) => {
  return value ? options.find((option) => option.value === value) : '';
};

export const RegisterPage: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    control,
  } = useForm<FormRegister>({
    mode: 'onChange',
  });

  const submit: SubmitHandler<FormRegister> = (data) => {
    setIsLoading(true);
    // eslint-disable-next-line no-console
    console.log(data);
    setTimeout(() => {
      setIsLoading(false);
      reset();
    }, 5000);
  };

  return (
    <Form title='Регистрация' onSubmit={handleSubmit(submit)}>
      <Input<FormRegister>
        type='email'
        placeholder='Email'
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
        placeholder='Password'
        label='password'
        register={register}
        error={errors.password}
        options={{
          required: '⚠ Password is required field!',
          minLength: {
            value: 8,
            message: 'Password must have at least 8 characters',
          },
          validate: (value: string) => validatePassword(value),
        }}
      />
      <Input<FormRegister>
        type='password'
        placeholder='Confirm Password'
        label='confirmPassword'
        register={register}
        error={errors.confirmPassword}
        options={{
          required: '⚠ Confirm password is required field!',
          validate: (value: string) => {
            return watch('password') !== value ? 'Your passwords do no match' : undefined;
          },
        }}
      />
      <Input<FormRegister>
        type='text'
        placeholder='First Name'
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
        placeholder='Last Name'
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
      <Input<FormRegister>
        type='date'
        placeholder='Date of birth'
        label='dateOfBirth'
        register={register}
        error={errors.dateOfBirth}
        options={{
          required: '⚠ Date of birth is required field!',
          validate: (value: string) => {
            const today = new Date();
            const selectedDate: Date = new Date(value);
            const minAge = 13; // Минимальный допустимый возраст (в годах)

            if (Number.isNaN(selectedDate.getTime())) {
              return 'Invalid date format';
            }

            const ageDifference = today.getFullYear() - selectedDate.getFullYear();

            if (ageDifference < minAge) {
              return `You must be at least ${minAge} years old`;
            }

            return undefined;
          },
        }}
      />
      <Input<FormRegister>
        type='text'
        placeholder='Street'
        label='street'
        register={register}
        error={errors.street}
        options={{
          required: '⚠ Street is required field!',
          validate: (value: string) => {
            if (value.length < 1) {
              return 'Must contain at least one character';
            }
            return undefined;
          },
        }}
      />

      <Input<FormRegister>
        type='text'
        placeholder='City'
        label='city'
        register={register}
        error={errors.city}
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
        placeholder='Postal Code'
        label='postalCode'
        register={register}
        error={errors.postalCode}
        options={{
          required: '⚠ Postal Code is required field!',
          validate: (value: string) => validatePostCode(value),
        }}
      />
      <Controller
        control={control}
        name='country'
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
              placeholder='Country'
              value={getValue(value)}
              onChange={(newValue) => onChange(newValue)}
            />
            {error && <small className='validate-error__text'>{error.message || 'Error'}</small>}
          </>
        )}
      />

      {isLoading ? (
        <Button type='submit' className={styles.button} primary loading>
          Sign Up
        </Button>
      ) : (
        <Button type='submit' className={styles.button} primary>
          Sign Up
        </Button>
      )}
    </Form>
  );
};
