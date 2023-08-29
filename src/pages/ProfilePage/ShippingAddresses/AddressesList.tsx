import { FC, useState } from 'react';

import cn from 'classnames';

import { Customer, MyCustomerUpdateAction } from '@commercetools/platform-sdk';
import { updateCustomer } from '@store/features/auth/profileApi';
import { useAppDispatch } from '@store/hooks';

import { AddressCard, FormAddressCard } from '../AddressCard';
import styles from './AddressesList.module.css';

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
  const { addresses, version } = customer;
  const [isAddNew, setIsAddNew] = useState(false);
  const dispatch = useAppDispatch();

  const handleAddNew = () => {
    setIsAddNew((prev) => !prev);
  };

  const handleUpdateAddress = async (
    data: FormAddressCard,
    isFieldsValueChange?: boolean,
    isDefaultAddress?: boolean
  ) => {
    const { id, country, city, streetName, postalCode } = data;
    const actions: MyCustomerUpdateAction[] = [];

    if (isFieldsValueChange) {
      actions.push({ action: 'changeAddress', addressId: id, address: { country, city, streetName, postalCode } });
    }
    if (isDefaultAddress) {
      actions.push({
        action: 'setDefaultShippingAddress',
        addressId: id,
      });
    }
    await dispatch(updateCustomer({ version, actions }));
  };

  const handleAddAddress = async (data: FormAddressCard, isDefaultAddress?: boolean) => {
    const { country, city, streetName, postalCode } = data;

    const customer = await dispatch(
      updateCustomer({
        version,
        actions: [
          {
            action: 'addAddress',
            address: { country, city, streetName, postalCode },
          },
        ],
      })
    ).unwrap();

    const newAddress = customer.addresses.at(-1);

    const customerWithAddedAddress = await dispatch(
      updateCustomer({
        version: customer.version,
        actions: [
          {
            action: 'addShippingAddressId',
            addressId: newAddress?.id,
          },
        ],
      })
    ).unwrap();

    if (isDefaultAddress) {
      await dispatch(
        updateCustomer({
          version: customerWithAddedAddress.version,
          actions: [
            {
              action: 'setDefaultShippingAddress',
              addressId: newAddress?.id,
            },
          ],
        })
      );
    }
    setIsAddNew(false);
  };

  const handleDeleteAddress = async (id: string) => {
    await dispatch(
      updateCustomer({
        version,
        actions: [
          {
            action: 'removeAddress',
            addressId: id,
          },
        ],
      })
    ).unwrap();
  };

  const addressesArray = addresses.filter(({ id }) => {
    if (id && addressIds && addressIds.includes(id)) {
      return true;
    }
    return false;
  });

  const defaultAddress = addressesArray.find(({ id }) => {
    if (id && defaultAddressId && defaultAddressId === id) {
      return true;
    }
    return false;
  });

  return (
    <div className={styles['addresses-wrapper']} {...props}>
      <h3 className={styles['addresses-title']}>Shipping address</h3>
      <button
        className={cn(styles['addresses-add-button'], { [styles['addresses-add-button-active']]: isAddNew })}
        type='button'
        onClick={handleAddNew}
      >
        Add new
      </button>

      <div className={styles['addresses-cards']}>
        {isAddNew && <AddressCard isNewAddress createHandler={handleAddAddress} />}
        {!!defaultAddress && (
          <AddressCard
            key={defaultAddress.id}
            address={defaultAddress}
            isDefaultAddress
            updateHandler={handleUpdateAddress}
            deleteHandler={handleDeleteAddress}
          />
        )}
        {(defaultAddress ? addressesArray.filter((address) => address.id !== defaultAddress.id) : addressesArray).map(
          (address) => (
            <AddressCard
              key={address.id}
              address={address}
              updateHandler={handleUpdateAddress}
              deleteHandler={handleDeleteAddress}
            />
          )
        )}
      </div>
    </div>
  );
};

AddressesList.defaultProps = {
  className: '',
};
