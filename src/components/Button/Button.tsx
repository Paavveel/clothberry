import { FC, PropsWithChildren } from 'react';

import cn from 'classnames';

import styles from './Button.module.css';

type ButtonType = 'button' | 'submit' | 'reset';

interface ButtonProps {
  type: ButtonType;
  className?: string;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  primary?: boolean;
  secondary?: boolean;
}

export const Button: FC<PropsWithChildren<ButtonProps>> = ({
  children,
  onClick,
  type,
  className,
  loading,
  disabled,
  primary,
  secondary,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(styles.button, className, {
        [styles['button-primary']]: primary,
        [styles['button-secondary']]: secondary,
      })}
      disabled={disabled || loading}
    >
      {loading && <div className={styles.loading} />}
      {children}
    </button>
  );
};

Button.defaultProps = {
  primary: undefined,
  secondary: undefined,
  className: '',
  onClick: undefined,
  loading: false,
  disabled: false,
};
