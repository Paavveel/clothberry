import { FC, useState } from 'react';

import cn from 'classnames';

import { Customer, MyCustomerUpdate, MyCustomerUpdateAction } from '@commercetools/platform-sdk';
import { updatePersonalInfo } from '@store/features/auth/profileApi';
import { useAppDispatch } from '@store/hooks';

import { AddressCard } from '../AddressCard';
import { NewAddressCard } from '../NewAddressCard';
import styles from './ShippingAddresses.module.css';

interface ProfileAddressesProps {
  className?: string;
  customer: Customer;
  addressIds: Customer['shippingAddressIds'] | Customer['billingAddressIds'];
  defaultAddressId: Customer['defaultShippingAddressId'] | Customer['defaultBillingAddressId'];
}

export const AddressesList: FC<ProfileAddressesProps> = ({
  className,
  customer,
  addressIds,
  defaultAddressId,
  ...props
}) => {
  const { addresses, version: currentVersion } = customer;
  const [isAddNew, setIsAddNew] = useState(false);
  const dispatch = useAppDispatch();
  const handleAddNew = () => {
    setIsAddNew((prev) => !prev);
  };

  const handleUpdateAddress = async (actions: MyCustomerUpdateAction[]) => {
    const data: MyCustomerUpdate = { version: currentVersion, actions };
    await dispatch(updatePersonalInfo(data));
  };

  const handleAddAddress = async (data: MyCustomerUpdate) => {
    const { version, actions } = data;
    const result = await dispatch(
      updatePersonalInfo({ version: version === 0 ? currentVersion : version, actions })
    ).unwrap();
    return result;
  };

  const shippingAddresses = addresses.filter(({ id }) => {
    if (id && addressIds && addressIds.includes(id)) {
      return true;
    }
    return false;
  });

  const defaultAddress = shippingAddresses.find(({ id }) => {
    if (id && defaultAddressId && defaultAddressId === id) {
      return true;
    }
    return false;
  });

  return (
    <div className={styles['addresses-wrapper']} {...props}>
      <h3 className={styles['addresses-title']}>Shipping address</h3>
      <button className={cn(styles['addresses-add-button'])} type='button' onClick={handleAddNew}>
        Add new
      </button>

      <div className={styles['addresses-cards']}>
        {!!isAddNew && <NewAddressCard updateHandler={handleAddAddress} />}
        {!!defaultAddress && (
          <AddressCard
            key={defaultAddress.id}
            address={defaultAddress}
            isDefaultAddress
            updateHandler={handleUpdateAddress}
          />
        )}
        {shippingAddresses
          .filter(({ id }) => {
            if (id && defaultAddressId && defaultAddressId !== id) {
              return true;
            }
            return false;
          })
          .map((address) => (
            <AddressCard key={address.id} address={address} updateHandler={handleUpdateAddress} />
          ))}
      </div>
    </div>
  );
};

AddressesList.defaultProps = {
  className: '',
};
