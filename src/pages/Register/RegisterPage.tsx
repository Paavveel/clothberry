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

interface IFormValues {
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
  } = useForm<IFormValues>({
    mode: 'onChange',
  });

  const submit: SubmitHandler<IFormValues> = (data) => {
    setIsLoading(true);
    console.log(data);
    setTimeout(() => {
      setIsLoading(false);
      reset();
    }, 5000);
  };

  return (
    <Form title='Регистрация' onSubmit={handleSubmit(submit)}>
      <Input
        type='text'
        placeholder='Email'
        label='email'
        register={register}
        errors={errors}
        options={{
          required: '⚠ Email is required field!',
          validate: (value: string) => emailValidator(value, 'Please enter valid email!'),
        }}
      />
      <Input
        type='password'
        placeholder='Password'
        label='password'
        register={register}
        errors={errors}
        options={{
          required: '⚠ Password is required field!',
          minLength: {
            value: 8,
            message: 'Password must have at least 8 characters',
          },
          validate: (value: string) => validatePassword(value),
        }}
      />
      <Input
        type='password'
        placeholder='Confirm Password'
        label='confirmPassword'
        register={register}
        errors={errors}
        options={{
          required: '⚠ Confirm password is required field!',
          validate: (value: string) => {
            return watch('password') !== value ? 'Your passwords do no match' : undefined;
          },
        }}
      />
      <Input
        type='text'
        placeholder='First Name'
        label='firstName'
        register={register}
        errors={errors}
        options={{
          required: '⚠ Name is required field!',
          validate: (value: string) => validateName(value),
        }}
      />
      <Input
        type='text'
        placeholder='Last Name'
        label='lastName'
        register={register}
        errors={errors}
        options={{
          required: '⚠ Last Name is required field!',
          validate: (value: string) => validateName(value),
        }}
      />
      <Input
        type='text'
        placeholder='Middle Name'
        label='middleName'
        register={register}
        errors={errors}
        options={{
          validate: (value: string) => validateName(value),
        }}
      />
      <Input
        type='date'
        placeholder='Date of birth'
        label='dateOfBirth'
        register={register}
        errors={errors}
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
      <Input
        type='text'
        placeholder='Street'
        label='street'
        register={register}
        errors={errors}
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

      <Input
        type='text'
        placeholder='City'
        label='city'
        register={register}
        errors={errors}
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

      <Input
        type='text'
        placeholder='Postal Code'
        label='postalCode'
        register={register}
        errors={errors}
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
            {/* .validate-error__select */}
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
        <Button type='submit' className={styles.button} size='large' primary loading>
          Зарегистрироваться
        </Button>
      ) : (
        <Button type='submit' className={styles.button} size='large' secondary>
          Зарегистрироваться
        </Button>
      )}
    </Form>
  );
};
