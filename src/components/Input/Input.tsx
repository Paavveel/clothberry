import { FieldError, FieldValues, Path, RegisterOptions, UseFormRegister } from 'react-hook-form';

import classNames from 'classnames';

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
}: InputProps<TFormValues>) => {
  return (
    <div className={styles.input_wrapper}>
      <label htmlFor={label} className={styles['visually-hidden']}>
        {placeholder}
      </label>
      <input
        id={label}
        type={type}
        inputMode={inputMode}
        className={classNames(styles.field, {
          'validate-error__field__input': error,
        })}
        defaultValue={type === 'date' ? placeholder : ''}
        autoComplete='off'
        placeholder={placeholder}
        {...register(label, { required, ...options })}
      />
      {error && <small className='validate-error__text'>{error.message}</small>}
    </div>
  );
};

Input.defaultProps = {
  required: false,
  inputMode: 'text',
};
