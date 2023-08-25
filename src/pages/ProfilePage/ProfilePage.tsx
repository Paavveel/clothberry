import { useEffect, useState } from 'react';

import { Loader } from '@components/Loader';
import { clearError, selectAuth } from '@store/features/auth/authSlice';
import { getCustomer } from '@store/features/auth/profileApi';
import { useAppDispatch, useAppSelector } from '@store/hooks';

import { ProfileMainInfo } from './ProfileMainInfo';
import styles from './ProfilePage.module.css';

export const ProfilePage = () => {
  const { customer, errorMessage } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const requestForCustomer = async () => {
      try {
        setLoading(true);
        await dispatch(getCustomer());
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    if (!customer && !errorMessage) {
      requestForCustomer();
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
      {!!customer && <ProfileMainInfo className={styles.profile__main} customer={customer} />}
    </>
  );
};
