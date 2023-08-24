import { useEffect } from 'react';

import { Loader } from '@components/Loader';
import { getCustomerFromStorage } from '@helpers/CustomerStorage';
import { selectAuth } from '@store/features/auth/authSlice';
import { getCustomer } from '@store/features/auth/profileApi';
import { useAppDispatch, useAppSelector } from '@store/hooks';

import styles from './ProfilePage.module.css';

export const ProfilePage = () => {
  const { customer, loading, errorMessage } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const id = getCustomerFromStorage();
    if (!customer && !errorMessage && id) {
      dispatch(getCustomer(id));
    }
  }, [customer, errorMessage, dispatch]);

  if (loading) return <Loader pageLoader />;

  if (errorMessage) return <p className={styles.response__error}>{errorMessage}</p>;

  return <div className={styles.profile}>{JSON.stringify(customer)}</div>;
};
