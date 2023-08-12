import { FC } from 'react';
import { FieldErrors, Path, RegisterOptions, UseFormRegister } from 'react-hook-form';

import classNames from 'classnames';

import styles from './Input.module.css';

interface IFormValues {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

interface InputProps {
  placeholder: string;
  type: string;
  register: UseFormRegister<IFormValues>;
  required?: boolean;
  label: Path<IFormValues>;
  errors: FieldErrors<IFormValues>;
  options?: RegisterOptions;
}

export const Input: FC<InputProps> = ({ placeholder, type, label, required, register, errors, options }) => {
  return (
    <div className={styles.input_wrapper}>
      <label htmlFor={label} className={styles['visually-hidden']}>
        {placeholder}
      </label>
      <input
        id={label}
        type={type}
        className={classNames(styles.field, {
          'validate-error__field__input': errors[label],
        })}
        placeholder={placeholder}
        {...register(label, { required, ...options })}
      />
      {errors[label] && <small className='validate-error__text'>{errors[label]!.message || 'Error'}</small>}
    </div>
  );
};

Input.defaultProps = {
  required: false,
  options: undefined,
};
