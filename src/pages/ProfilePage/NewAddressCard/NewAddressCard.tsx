import { FC, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import Select from 'react-select';

import cn from 'classnames';
import { countries } from 'config/countries';

import {
  Customer,
  MyCustomerAddAddressAction,
  MyCustomerAddShippingAddressIdAction,
  MyCustomerSetDefaultShippingAddressAction,
  MyCustomerUpdate,
} from '@commercetools/platform-sdk';
import { Button } from '@components/Button';
import { Checkbox } from '@components/Checkbox';
import { Input } from '@components/Input';
import { validatePostCode } from '@helpers/Validators';

import styles from './NewAddressCard.module.css';

interface NewAddressCardProps {
  className?: string;
  updateHandler: (data: MyCustomerUpdate) => Promise<Customer>;
}

export interface FormAddressCard extends Record<string, unknown> {
  id: string;
  streetName: string;
  city: string;
  postalCode: string;
  country: string;
}

export const NewAddressCard: FC<NewAddressCardProps> = ({ className, updateHandler, ...props }) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormAddressCard>({
    mode: 'onChange',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState(false);
  const [isDefaultChecked, setIsDefaultChecked] = useState(false);

  const watchShippingCountry = watch('country');

  const handleDefaultShipping = () => {
    setIsDefaultChecked((prev) => !prev);
  };

  const handleAddAddress: SubmitHandler<FormAddressCard> = async (data) => {
    setSuccess('');
    setError(false);

    try {
      setLoading(true);
      const createAddressAction: MyCustomerAddAddressAction = {
        action: 'addAddress',
        address: { country: data.country, city: data.city, streetName: data.streetName, postalCode: data.postalCode },
      };
      const currentCustomer = await updateHandler({ version: 0, actions: [createAddressAction] });
      const addInAddressArrayAction: MyCustomerAddShippingAddressIdAction = {
        action: 'addShippingAddressId',
        addressId: currentCustomer.id,
      };
      await updateHandler({ version: currentCustomer.version, actions: [addInAddressArrayAction] });
      if (isDefaultChecked) {
        const action: MyCustomerSetDefaultShippingAddressAction = {
          action: 'setDefaultShippingAddress',
          addressId: currentCustomer.id,
        };
        await updateHandler([action]);
      }
      setSuccess('Address is updated');
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className={cn(className, styles['address-card'])}
      onSubmit={handleSubmit(handleAddAddress)}
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
        htmlFor='new-address-card'
        onChange={handleDefaultShipping}
        value={isDefaultChecked}
      />

      <div className={styles['address-buttons-wrapper']}>
        <Button className={styles['address-card-submit-button']} type='submit' secondary disabled={loading}>
          Add
        </Button>
      </div>

      {!!success && <p className={styles.response__success}>{success}</p>}
      {error && <p className={styles.response__error}>Error with updating</p>}
    </form>
  );
};

NewAddressCard.defaultProps = {
  className: '',
};
