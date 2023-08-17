import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { AppRoutes } from 'config/routes';

import { UserAuthOptions } from '@commercetools/sdk-client-v2';
import { emailValidator, validatePassword } from '@helpers/Validators';
import { login } from '@store/features/auth/authApi';
import { clearError, selectAuth } from '@store/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@store/hooks';

import { Button, Form, Input } from '../../components';
import styles from './SignInPage.module.css';

interface FormSignIn extends Record<string, unknown> {
  username: string;
  password: string;
}

export const SignInPage: FC = () => {
  const { isLoggedIn, loading, errorMessage } = useAppSelector(selectAuth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSignIn>({
    mode: 'onChange',
  });

  const handleLogin = async ({ username, password }: UserAuthOptions) => {
    try {
      await dispatch(login({ username, password })).unwrap();
      navigate(AppRoutes.ROOT, { replace: true });
    } catch (error) {}
  };

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  if (isLoggedIn) return <Navigate to={AppRoutes.ROOT} replace />;

  return (
    <Form title='Log in to your account' onSubmit={handleSubmit(handleLogin)}>
      <Input<FormSignIn>
        type='text'
        placeholder='Email *'
        label='username'
        register={register}
        error={errors.username}
        inputMode='email'
        options={{
          required: '⚠ Email is required field!',
          validate: (value: string) => emailValidator(value, 'Please enter valid email!'),
        }}
      />
      <Input<FormSignIn>
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
      <Button type='submit' className={styles.button} primary loading={loading}>
        Log in
      </Button>

      <p>
        New to Clothberry?{' '}
        <Link to={AppRoutes.SIGNUP} className={styles.signup}>
          Sign up
        </Link>
      </p>

      {errorMessage && <p className={styles['login-error']}>{errorMessage}</p>}
    </Form>
  );
};
