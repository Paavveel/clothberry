import { memo, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import Select from 'react-select';

import cn from 'classnames';
import { countries } from 'config/countries';

import { Address } from '@commercetools/platform-sdk';
import { Button } from '@components/Button';
import { Checkbox } from '@components/Checkbox';
import { Input } from '@components/Input';
import { Loader } from '@components/Loader';
import { validatePostCode } from '@helpers/Validators';

import { AddressType } from '../AddressesList';
import styles from './AddressCard.module.css';

export interface AddressCardProps {
  address?: Address;
  className?: string;
  isDefaultAddress?: boolean;
  isNewAddress?: boolean;
  addressType?: AddressType;
  updateHandler?: (data: FormAddressCard, isFieldsValueChange?: boolean, isDefaultAddress?: boolean) => Promise<void>;
  createHandler?: (data: FormAddressCard, isDefaultAddress?: boolean) => Promise<void>;
  deleteHandler?: (id: string) => Promise<void>;
}

export interface FormAddressCard extends Record<string, unknown> {
  id: string;
  streetName: string;
  city: string;
  postalCode: string;
  country: string;
}

export const AddressCard = memo(function AddressCard({
  className,
  address,
  isDefaultAddress,
  isNewAddress,
  addressType,
  createHandler,
  updateHandler,
  deleteHandler,
  ...props
}: AddressCardProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormAddressCard>({
    mode: 'onChange',
    defaultValues: {
      id: address?.id,
      country: address?.country,
      city: address?.city,
      streetName: address?.streetName,
      postalCode: address?.postalCode,
    },
  });

  const [loading, setLoading] = useState(false);
  const [isDefaultChecked, setIsDefaultChecked] = useState(false);

  const watchShippingCountry = watch('country');

  const handleDefaultShipping = () => {
    setIsDefaultChecked((prev) => !prev);
  };

  const handleUpdateAddress: SubmitHandler<FormAddressCard> = async (data) => {
    if (!isDirty && !isDefaultChecked) {
      toast.error('Nothing to change');
      return;
    }

    try {
      setLoading(true);
      if (updateHandler) {
        await updateHandler(data, isDirty, isDefaultChecked);
      }
      toast.success('Address is updated');
      reset(data, { keepDirty: false });
    } catch (error) {
      toast.error('Error with update');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress: SubmitHandler<FormAddressCard> = async (data) => {
    try {
      setLoading(true);
      if (createHandler) {
        await createHandler(data, isDefaultChecked);
      }
      toast.success('New address added');
    } catch (error) {
      toast.error('Error with create');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async () => {
    try {
      setLoading(true);
      if (address?.id && deleteHandler) {
        await deleteHandler(address.id);
      }
      toast.success('Address is deleted');
    } catch (error) {
      toast.error('Error with delete');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className={cn(className, styles['address-card'])}
      style={{ opacity: loading ? 0.5 : 1 }}
      onSubmit={handleSubmit(isNewAddress ? handleAddAddress : handleUpdateAddress)}
      noValidate
      {...props}
    >
      {isDefaultAddress && <span className={styles['default-address-badge']}>Default</span>}
      <h4 className={styles.input_title}>Country</h4>
      <Controller
        control={control}
        name='country'
        rules={{
          required: '⚠ Country is required!',
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <Select
              className={cn(styles.country, {
                'validate-error__select': error,
              })}
              options={countries}
              placeholder='Country *'
              value={countries.find((c) => c.value === value)}
              onChange={(val) => onChange(val?.value)}
            />
            {error && <small className='validate-error__text'>{error.message || 'Error'}</small>}
          </>
        )}
      />
      <h4 className={styles.input_title}>Postal code</h4>
      <Input<FormAddressCard>
        id={address?.id ? `${address?.id}-postalCode` : `${addressType}-postalCode`}
        type='text'
        placeholder='Postal Code *'
        label='postalCode'
        register={register}
        disabled={!watchShippingCountry}
        error={errors.postalCode}
        options={{
          required: '⚠ Postal Code is required field!',
          validate: (value: string) => validatePostCode(value, watchShippingCountry),
        }}
      />
      <h4 className={styles.input_title}>City</h4>
      <Input<FormAddressCard>
        id={address?.id ? `${address?.id}-city` : `${addressType}-city`}
        type='text'
        placeholder='City *'
        label='city'
        register={register}
        error={errors.city}
        options={{
          required: '⚠ City is required field!',
          validate: (value: string) => {
            if (value.length < 1) {
              return 'Must contain at least one character';
            }
            if (/[^\p{L}\s]/u.test(value)) {
              return 'City should not contain special characters or numbers';
            }
            return undefined;
          },
        }}
      />
      <h4 className={styles.input_title}>Street</h4>
      <Input<FormAddressCard>
        id={address?.id ? `${address?.id}-streetName` : `${addressType}-streetName`}
        type='text'
        placeholder='Street *'
        label='streetName'
        register={register}
        error={errors.streetName}
        options={{
          required: '⚠ Street is required field!',
          validate: (value: string) => {
            if (value.length < 1) {
              return '⚠ Must contain at least one character';
            }
            return undefined;
          },
        }}
      />

      {!isDefaultAddress && (
        <Checkbox
          className={styles['address-default-checkbox']}
          title='Set as default address'
          htmlFor={address?.id ? `${address?.id}-checkbox-default` : `${addressType}-new-address`}
          onChange={handleDefaultShipping}
          value={isDefaultChecked}
        />
      )}

      <div className={styles['address-buttons-wrapper']}>
        <Button className={styles['address-card-button']} type='submit' secondary disabled={loading}>
          {isNewAddress ? 'Add' : 'Save'}
        </Button>
        {!isNewAddress && (
          <Button
            className={styles['address-card-button']}
            type='button'
            danger
            disabled={loading}
            onClick={handleDeleteAddress}
          >
            Delete
          </Button>
        )}
      </div>
      {loading && <Loader className={styles['address-loader']} />}
    </form>
  );
});
