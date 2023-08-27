import { FC, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import Select from 'react-select';

import cn from 'classnames';
import { countries } from 'config/countries';

import { Address, MyCustomerChangeAddressAction } from '@commercetools/platform-sdk';
import { Button } from '@components/Button';
import { Checkbox } from '@components/Checkbox';
import { Input } from '@components/Input';
import { validatePostCode } from '@helpers/Validators';

import styles from './AddressCard.module.css';

interface AddressCardProps {
  className?: string;
  address: Address;
  updateHandler: (action: MyCustomerChangeAddressAction) => Promise<void>;
}

export interface FormAddressCard extends Record<string, unknown> {
  id: string;
  streetName: string;
  city: string;
  postalCode: string;
  country: string;
}

export const AddressCard: FC<AddressCardProps> = ({ className, address, updateHandler, ...props }) => {
  const [isDefaultAddress, setIsDefaultAddress] = useState<boolean>(false);
  const { id, country, city, streetName, postalCode } = address;
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormAddressCard>({
    mode: 'onChange',
    defaultValues: { country, city, streetName, postalCode },
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState(false);

  const watchShippingCountry = watch('country');

  const handleDefaultShipping = () => {
    setIsDefaultAddress((prev) => !prev);
  };

  const handleUpdateAddress: SubmitHandler<FormAddressCard> = async (data) => {
    setSuccess('');
    setError(false);

    const action: MyCustomerChangeAddressAction = {
      action: 'changeAddress',
      addressId: id,
      address: { country: data.country, city: data.city, streetName: data.streetName, postalCode: data.postalCode },
    };

    try {
      setLoading(true);
      await updateHandler(action);
      setSuccess('Address is updated');
      reset({ ...data }, { keepDirty: false });
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className={cn(className, styles['address-card'])}
      onSubmit={handleSubmit(handleUpdateAddress)}
      noValidate
      {...props}
    >
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

      <Checkbox
        title='Set as default address'
        htmlFor={address.id ?? ''}
        onChange={handleDefaultShipping}
        value={isDefaultAddress}
      />

      <Button
        className={styles['address-card-submit-button']}
        type='submit'
        secondary
        loading={loading}
        disabled={!isDirty}
      >
        Save
      </Button>

      {!!success && <p className={styles.response__success}>{success}</p>}
      {error && <p className={styles.response__error}>Error with updating</p>}
    </form>
  );
};

AddressCard.defaultProps = {
  className: '',
};
