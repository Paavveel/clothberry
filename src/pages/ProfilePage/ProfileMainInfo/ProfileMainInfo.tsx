import { FC, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import cn from 'classnames';

import { Customer } from '@commercetools/platform-sdk';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { emailValidator, validateName } from '@helpers/Validators';
import { updatePersonalInfo } from '@store/features/auth/profileApi';
import { useAppDispatch } from '@store/hooks';

import styles from './ProfileMainInfo.module.css';

interface ProfileMainInfoProps {
  className?: string;
  customer: Customer;
}

export interface FormProfileMain extends Record<string, unknown> {
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

export const ProfileMainInfo: FC<ProfileMainInfoProps> = ({ className, customer, ...props }) => {
  const { email, firstName, lastName, dateOfBirth, version } = customer;
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<FormProfileMain>({
    mode: 'onChange',
    defaultValues: { email, firstName, lastName, dateOfBirth },
  });

  const dispatch = useAppDispatch();
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState(false);

  const submit: SubmitHandler<FormProfileMain> = async (data) => {
    setSuccess('');
    setError(false);
    if (
      data.firstName === firstName &&
      data.lastName === lastName &&
      data.dateOfBirth === dateOfBirth &&
      data.email === email
    ) {
      setSuccess('Nothing to change');
      setDisabled(true);
      return;
    }
    try {
      setLoading(true);
      await dispatch(updatePersonalInfo({ ...data, version })).unwrap();
      setSuccess('Information is updated');
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setSuccess('');
    clearErrors();
    setDisabled((prev) => !prev);
  };

  return (
    <form className={cn(className, styles['main-info'])} onSubmit={handleSubmit(submit)} noValidate {...props}>
      <h3 className={styles['main-info-title']}>Personal information</h3>
      <button
        className={cn(styles['main-info-edit-button'], {
          [styles['main-info-edit-button-active']]: !disabled,
        })}
        type='button'
        onClick={handleEdit}
      >
        edit
      </button>
      <fieldset className={styles['main-info-fieldset']} disabled={disabled}>
        <Input<FormProfileMain>
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
        <Input<FormProfileMain>
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
        <Input<FormProfileMain>
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
        <Input<FormProfileMain>
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
        <Button className={styles['main-info-submit-button']} type='submit' secondary loading={loading}>
          Save
        </Button>
      </fieldset>
      {!!success && <p className={styles.response__success}>{success}</p>}
      {error && <p className={styles.response__error}>Error with updating</p>}
    </form>
  );
};

ProfileMainInfo.defaultProps = {
  className: '',
};
