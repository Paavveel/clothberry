import { FC, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import cn from 'classnames';

import { Customer } from '@commercetools/platform-sdk';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { validatePassword } from '@helpers/Validators';
import { login } from '@store/features/auth/authApi';
import { changeCustomerPassword } from '@store/features/auth/profileApi';
import { useAppDispatch } from '@store/hooks';

import styles from './ProfilePassword.module.css';

interface ProfilePasswordProps {
  className?: string;
  customer: Customer;
}

export interface FormProfilePassword extends Record<string, unknown> {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const ProfilePassword: FC<ProfilePasswordProps> = ({ className, customer, ...props }) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormProfilePassword>({
    mode: 'onChange',
  });

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const handleUpdateMainInfo: SubmitHandler<FormProfilePassword> = async (data) => {
    const { currentPassword, newPassword } = data;

    try {
      setLoading(true);
      const { email } = await dispatch(
        changeCustomerPassword({ version: customer.version, currentPassword, newPassword })
      ).unwrap();
      await dispatch(login({ username: email, password: data.newPassword }));
      toast.success('Password is updated');
      reset();
    } catch (error) {
      setError('currentPassword', { message: 'The given current password does not match' }, { shouldFocus: true });
      toast.error('Invalid current password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={cn(className)} onSubmit={handleSubmit(handleUpdateMainInfo)} noValidate {...props}>
      <h3 className={styles['profile-password-title']}>Change password</h3>
      <fieldset className={styles['profile-password-fieldset']}>
        <h4 className={styles['profile-password-subtitle']}>Current password</h4>
        <Input<FormProfilePassword>
          id='current-password'
          type='password'
          placeholder='Your current password *'
          label='currentPassword'
          register={register}
          error={errors.currentPassword}
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
        <h4 className={styles['profile-password-subtitle']}>New password</h4>
        <Input<FormProfilePassword>
          id='new-password'
          type='password'
          placeholder='New password *'
          label='newPassword'
          register={register}
          error={errors.newPassword}
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
        <h4 className={styles['profile-password-subtitle']}>Confirm password</h4>
        <Input<FormProfilePassword>
          id='confirm-password'
          type='password'
          placeholder='Confirm the password *'
          label='confirmPassword'
          register={register}
          error={errors.confirmPassword}
          showPasswordToggler
          options={{
            required: '⚠ Confirm password is required field!',
            validate: (value: string) => {
              return watch('newPassword') !== value ? '⚠ Your passwords do no match' : undefined;
            },
          }}
        />
        <Button className={styles['profile-password-submit-button']} type='submit' secondary loading={loading}>
          Save
        </Button>
      </fieldset>
    </form>
  );
};
