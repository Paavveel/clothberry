import { FC } from 'react';

import cn from 'classnames';

import { Customer, MyCustomerUpdate, MyCustomerUpdateAction } from '@commercetools/platform-sdk';
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
  const { addresses, shippingAddressIds, version, defaultShippingAddressId } = customer;
  // const [isAddNew, setIsAddNew] = useState(false);
  const dispatch = useAppDispatch();
  // const handleAddNew = () => {
  //   setIsAddNew((prev) => !prev);
  // };

  const handleUpdateAddress = async (actions: MyCustomerUpdateAction[]) => {
    const data: MyCustomerUpdate = { version, actions };
    await dispatch(updatePersonalInfo(data));
  };

  const shippingAddresses = addresses.filter(({ id }) => {
    if (id && shippingAddressIds && shippingAddressIds.includes(id)) {
      return true;
    }
    return false;
  });

  const defaultAddress = shippingAddresses.find(({ id }) => {
    if (id && defaultShippingAddressId && defaultShippingAddressId === id) {
      return true;
    }
    return false;
  });

  return (
    <div className={styles['addresses-wrapper']} {...props}>
      <h3 className={styles['addresses-title']}>Shipping address</h3>
      <button className={cn(styles['addresses-add-button'])} type='button'>
        Add new
      </button>

      <div className={styles['addresses-cards']}>
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
            if (id && defaultShippingAddressId && defaultShippingAddressId !== id) {
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

ShippingAddresses.defaultProps = {
  className: '',
};
