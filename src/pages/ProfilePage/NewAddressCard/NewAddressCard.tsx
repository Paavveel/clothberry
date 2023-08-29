import { FC, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import Select from 'react-select';

import cn from 'classnames';
import { countries } from 'config/countries';

import { Button } from '@components/Button';
import { Checkbox } from '@components/Checkbox';
import { Input } from '@components/Input';
import { validatePostCode } from '@helpers/Validators';

import { FormAddressCard } from '../AddressCard';
import styles from './NewAddressCard.module.css';

interface NewAddressCardProps {
  className?: string;
  addNewAddressHandler: (data: FormAddressCard, isDefaultAddress?: boolean) => Promise<void>;
}

export const NewAddressCard: FC<NewAddressCardProps> = ({ className, addNewAddressHandler, ...props }) => {
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
      await addNewAddressHandler(data, isDefaultChecked);
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
