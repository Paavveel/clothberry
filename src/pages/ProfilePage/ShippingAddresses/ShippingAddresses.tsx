import { FC, useState } from 'react';

import cn from 'classnames';

import { Customer, MyCustomerChangeAddressAction, MyCustomerUpdate } from '@commercetools/platform-sdk';
import { updatePersonalInfo } from '@store/features/auth/profileApi';
import { useAppDispatch } from '@store/hooks';

import { AddressCard } from '../AddressCard';
import styles from './ShippingAddresses.module.css';

interface ProfileAddressesProps {
  className?: string;
  customer: Customer;
}

export type AddressOption = {
  value: string;
  label: string;
};

export const ShippingAddresses: FC<ProfileAddressesProps> = ({ className, customer, ...props }) => {
  const { addresses, shippingAddressIds, version } = customer;
  const [disabled, setDisabled] = useState(false);
  const dispatch = useAppDispatch();
  const handleAddNew = () => {
    setDisabled((prev) => !prev);
  };

  const handleUpdateAddress = async (action: MyCustomerChangeAddressAction) => {
    const data: MyCustomerUpdate = { version, actions: [action] };
    await dispatch(updatePersonalInfo(data));
  };

  return (
    <div className={styles['addresses-wrapper']} {...props}>
      <h3 className={styles['main-info-title']}>Shipping address</h3>
      <button
        className={cn(styles['main-info-edit-button'], {
          [styles['main-info-edit-button-active']]: !disabled,
        })}
        type='button'
        onClick={handleAddNew}
      >
        Add new
      </button>

      <div className={styles['addresses-cards']}>
        {addresses
          .filter((address) => {
            if (address.id && shippingAddressIds && shippingAddressIds.includes(address.id)) {
              return true;
            }
            return false;
          })
          .map((address) => (
            <AddressCard
              className={styles.profile__main}
              key={address.id}
              address={address}
              updateHandler={handleUpdateAddress}
            />
          ))}
      </div>
    </div>
  );
};

ShippingAddresses.defaultProps = {
  className: '',
};
