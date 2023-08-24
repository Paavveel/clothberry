import React, { useState } from 'react';
import { FieldError, FieldValues, Path, RegisterOptions, UseFormRegister } from 'react-hook-form';

import classNames from 'classnames';

import closeEye from '@assets/img/close-eye.svg';
import openEye from '@assets/img/open-eye.svg';

import styles from './Input.module.css';

type InputMode = 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';

type InputProps<TFormValues extends FieldValues> = {
  placeholder: string;
  type: string;
  required?: boolean;
  label: Path<TFormValues>;
  register: UseFormRegister<TFormValues>;
  options: RegisterOptions;
  error: FieldError | undefined;
  inputMode?: InputMode;
  showPasswordToggler?: boolean;
};

export const Input = <TFormValues extends Record<string, unknown>>({
  placeholder,
  type,
  label,
  required,
  register,
  error,
  options,
  inputMode,
  showPasswordToggler,
}: InputProps<TFormValues>) => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isHiddenIcon, setIsHiddenIcon] = useState(true);

  const handleShowPassword = () => {
    setIsShowPassword((show) => !show);
  };
  return (
    <div className={styles.input_wrapper}>
      <label htmlFor={label} className={styles['visually-hidden']}>
        {placeholder}
      </label>
      {type === 'password' && showPasswordToggler ? (
        <div className={styles.password_wrapper}>
          {isShowPassword && !isHiddenIcon && (
            <button aria-label='show password' className={styles.password} onClick={handleShowPassword} type='button'>
              <img src={openEye} width='24px' height='24px' alt='show password' />
            </button>
          )}
          {!isShowPassword && !isHiddenIcon && (
            <button aria-label='hide password' className={styles.password} onClick={handleShowPassword} type='button'>
              <img src={closeEye} width='24px' height='24px' alt='show password' />
            </button>
          )}

          <input
            id={label}
            type={isShowPassword ? 'text' : type}
            inputMode={inputMode}
            className={classNames(styles.field, {
              'validate-error__field__input': error,
            })}
            autoComplete='off'
            placeholder={placeholder}
            {...register(label, {
              required,
              ...options,
              onChange(event: React.ChangeEvent<HTMLInputElement>) {
                if (type === 'password' && showPasswordToggler && event.target.value.trim().length > 0) {
                  setIsHiddenIcon(false);
                } else {
                  setIsHiddenIcon(true);
                }
              },
            })}
          />
        </div>
      ) : (
        <input
          id={label}
          type={type}
          inputMode={inputMode}
          className={classNames(styles.field, {
            'validate-error__field__input': error,
          })}
          autoComplete='off'
          placeholder={placeholder}
          {...register(label, { required, ...options })}
        />
      )}

      {error && <small className='validate-error__text'>{error.message}</small>}
    </div>
  );
};

Input.defaultProps = {
  required: false,
  inputMode: 'text',
  showPasswordToggler: false,
};
