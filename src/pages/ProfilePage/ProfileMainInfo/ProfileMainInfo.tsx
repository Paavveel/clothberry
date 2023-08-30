import { FC, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import cn from 'classnames';

import { Customer, MyCustomerUpdate } from '@commercetools/platform-sdk';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { emailValidator, validateName } from '@helpers/Validators';
import { updateCustomer } from '@store/features/auth/profileApi';
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
    reset,
    formState: { errors, isDirty },
  } = useForm<FormProfileMain>({
    mode: 'onChange',
    defaultValues: { email, firstName, lastName, dateOfBirth },
  });

  const dispatch = useAppDispatch();
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleUpdateMainInfo: SubmitHandler<FormProfileMain> = async (data) => {
    const body: MyCustomerUpdate = { version, actions: [] };

    if (data.firstName !== firstName) {
      body.actions.push({
        action: 'setFirstName',
        firstName: data.firstName,
      });
    }
    if (data.lastName !== lastName) {
      body.actions.push({
        action: 'setLastName',
        lastName: data.lastName,
      });
    }
    if (data.dateOfBirth !== dateOfBirth) {
      body.actions.push({
        action: 'setDateOfBirth',
        dateOfBirth: data.dateOfBirth,
      });
    }
    if (data.email !== email) {
      body.actions.push({
        action: 'changeEmail',
        email: data.email,
      });
    }

    try {
      setLoading(true);
      await dispatch(updateCustomer(body)).unwrap();
      reset({ ...data }, { keepDirty: false });
      setDisabled(true);
      toast.success('Information is updated');
    } catch (error) {
      toast.error('Error with updating');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    clearErrors();
    setDisabled((prev) => !prev);
  };

  return (
    <form
      className={cn(className, styles['main-info'])}
      onSubmit={handleSubmit(handleUpdateMainInfo)}
      noValidate
      {...props}
    >
      <h3 className={styles['main-info-title']}>Personal information</h3>
      <button
        className={cn(styles['main-info-edit-button'], {
          [styles['main-info-edit-button-active']]: !disabled,
        })}
        type='button'
        onClick={handleEdit}
      >
        Edit
      </button>
      <fieldset className={styles['main-info-fieldset']} disabled={disabled}>
        <h4 className={styles['main-info-subtitle']}>First name</h4>
        <Input<FormProfileMain>
          id='firstName'
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
        <h4 className={styles['main-info-subtitle']}>Last name</h4>
        <Input<FormProfileMain>
          id='main-info-last-name'
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
        <h4 className={styles['main-info-subtitle']}>Date of birth</h4>
        <Input<FormProfileMain>
          id='main-info-birth-date'
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
        <h4 className={styles['main-info-subtitle']}>Email </h4>
        <Input<FormProfileMain>
          id='main-info-email'
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
        <Button
          className={styles['main-info-submit-button']}
          type='submit'
          secondary
          loading={loading}
          disabled={!isDirty}
        >
          Save
        </Button>
      </fieldset>
    </form>
  );
};

ProfileMainInfo.defaultProps = {
  className: '',
};
