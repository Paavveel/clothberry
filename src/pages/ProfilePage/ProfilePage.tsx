import { useEffect } from 'react';

import { Loader } from '@components/Loader';
import { clearError, selectAuth } from '@store/features/auth/authSlice';
import { getCustomer } from '@store/features/auth/profileApi';
import { useAppDispatch, useAppSelector } from '@store/hooks';

import { ProfileMainInfo } from './ProfileMainInfo';
import styles from './ProfilePage.module.css';

export const ProfilePage = () => {
  const { customer, loading, errorMessage } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!customer && !errorMessage) {
      dispatch(getCustomer());
    }
    return () => {
      dispatch(clearError());
    };
  }, [customer, errorMessage, dispatch]);

  if (loading) return <Loader pageLoader />;

  if (errorMessage) return <p className={styles.response__error}>{errorMessage}</p>;

  return (
    <>
      <h2 className={styles.profile__title}>Your profile</h2>
      <ProfileMainInfo className={styles.profile__main} />
    </>
  );
};
