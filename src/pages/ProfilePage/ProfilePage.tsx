import { useAppSelector } from '@store/hooks';

import { AddressesList } from './AddressesList';
import { ProfileMainInfo } from './ProfileMainInfo';
import styles from './ProfilePage.module.css';
import { ProfilePassword } from './ProfilePassword';

export const ProfilePage = () => {
  const customer = useAppSelector((state) => state.auth.customer);

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
