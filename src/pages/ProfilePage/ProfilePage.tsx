import { useEffect, useState } from 'react';

import { Loader } from '@components/Loader';
import { selectAuth } from '@store/features/auth/authSlice';
import { getCustomer } from '@store/features/auth/profileApi';
import { useAppDispatch, useAppSelector } from '@store/hooks';

import { AddressesList } from './AddressesList';
import { ProfileMainInfo } from './ProfileMainInfo';
import styles from './ProfilePage.module.css';
import { ProfilePassword } from './ProfilePassword';

export const ProfilePage = () => {
  const { customer, errorMessage } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const requestForCustomer = async () => {
      try {
        setError(false);
        setLoading(true);
        await dispatch(getCustomer()).unwrap();
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (!customer && !errorMessage) {
      requestForCustomer();
    }
  }, [customer, errorMessage, dispatch]);

  if (loading) return <Loader pageLoader />;

  if (error) return <p className={styles.response__error}>Something went wrong with profile loading.</p>;

  return (
    <>
      <h2 className={styles.profile__title}>Your profile</h2>
      {!!customer && <ProfileMainInfo className={styles.profile__main} customer={customer} />}
      {!!customer && (
        <AddressesList
          customer={customer}
          addressType='Shipping'
          addressIds={customer.shippingAddressIds}
          defaultAddressId={customer.defaultShippingAddressId}
        />
      )}
      {!!customer && (
        <AddressesList
          customer={customer}
          addressType='Billing'
          addressIds={customer.billingAddressIds}
          defaultAddressId={customer.defaultBillingAddressId}
        />
      )}
      {!!customer && <ProfilePassword className={styles.profile__password} customer={customer} />}
    </>
  );
};
