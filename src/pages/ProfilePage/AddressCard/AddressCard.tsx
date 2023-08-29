import { FC, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import Select from 'react-select';

import cn from 'classnames';
import { countries } from 'config/countries';

import { Address } from '@commercetools/platform-sdk';
import { Button } from '@components/Button';
import { Checkbox } from '@components/Checkbox';
import { Input } from '@components/Input';
import { validatePostCode } from '@helpers/Validators';

import styles from './AddressCard.module.css';

export interface AddressCardProps {
  className?: string;
  address: Address;
  isDefaultAddress?: boolean;
  updateHandler: (data: FormAddressCard, isFieldsValueChange?: boolean, isDefaultAddress?: boolean) => Promise<void>;
  deleteHandler?: (id: string) => Promise<void>;
}

export interface FormAddressCard extends Record<string, unknown> {
  id: string;
  streetName: string;
  city: string;
  postalCode: string;
  country: string;
}

export const AddressCard: FC<AddressCardProps> = ({
  className,
  address,
  isDefaultAddress,
  updateHandler,
  deleteHandler,
  ...props
}) => {
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
  const [isDefaultChecked, setIsDefaultChecked] = useState(false);

  const watchShippingCountry = watch('country');

  const handleDefaultShipping = () => {
    setIsDefaultChecked((prev) => !prev);
  };

  const handleUpdateAddress: SubmitHandler<FormAddressCard> = async (data) => {
    setSuccess('');
    setError(false);

    if (!isDirty && !isDefaultChecked) {
      setSuccess('Nothing to change');
      return;
    }

    try {
      setLoading(true);
      if (id) {
        await updateHandler({ ...data, id }, isDirty, isDefaultChecked);
      }
      setSuccess('Address is updated');
      reset({ ...data }, { keepDirty: false });
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async () => {
    setSuccess('');
    setError(false);

    try {
      setLoading(true);
      if (id && deleteHandler) {
        await deleteHandler(id);
      }
      setSuccess('Address is deleted');
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className={cn(className, styles['address-card'], {
        [styles['default-address']]: isDefaultAddress,
      })}
      onSubmit={handleSubmit(handleUpdateAddress)}
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

      {!isDefaultAddress && (
        <Checkbox
          title='Set as default address'
          htmlFor={address.id ?? ''}
          onChange={handleDefaultShipping}
          value={isDefaultChecked}
        />
      )}

      <div className={styles['address-buttons-wrapper']}>
        <Button className={styles['address-card-submit-button']} type='submit' secondary disabled={loading}>
          Save
        </Button>
        <Button
          className={styles['address-card-submit-button']}
          type='button'
          danger
          disabled={loading}
          onClick={handleDeleteAddress}
        >
          Delete
        </Button>
      </div>

      {!!success && <p className={styles.response__success}>{success}</p>}
      {error && <p className={styles.response__error}>Error with updating</p>}
    </form>
  );
};

AddressCard.defaultProps = {
  className: '',
  isDefaultAddress: false,
  deleteHandler: undefined,
};
