import { FC, PropsWithChildren } from 'react';

import cn from 'classnames';

import styles from './Button.module.css';

type ButtonType = 'button' | 'submit' | 'reset';

interface ButtonProps {
  type: ButtonType;
  className?: string;
  onClick?: () => void;
  loading?: boolean;
  size?: 'large' | 'default' | 'small';
  primary?: boolean;
  secondary?: boolean;
}

export const Button: FC<PropsWithChildren<ButtonProps>> = ({
  children,
  onClick,
  type,
  className,
  loading,
  size,
  primary,
  secondary,
}) => {
  const componentCls = 'button';
  console.log(loading);
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(styles.button, className, {
        [styles[`${componentCls}-large`]]: size === 'large',
        [styles[`${componentCls}-default`]]: size === 'default',
        [styles[`${componentCls}-small`]]: size === 'small',
        [styles[`${componentCls}-primary`]]: primary,
        [styles[`${componentCls}-secondary`]]: secondary,
        [styles[`${componentCls}-loading`]]: loading,
      })}
      disabled={loading}
    >
      {loading && <div className={styles.loading} />}
      {loading && size !== 'small' && children}
      {!loading && children}
    </button>
  );
};

Button.defaultProps = {
  size: 'default',
  primary: undefined,
  secondary: undefined,
  className: '',
  onClick: undefined,
  loading: false,
};
