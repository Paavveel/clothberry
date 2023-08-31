import { FC } from 'react';

import cn from 'classnames';

import styles from './Loader.module.css';

interface LoaderProps {
  className?: string;
  pageLoader?: boolean;
}

export const Loader: FC<LoaderProps> = ({ className, pageLoader, ...props }) => {
  return (
    <div
      className={cn(className, styles.loader, {
        [styles['page-loader']]: pageLoader,
      })}
      {...props}
    />
  );
};

Loader.defaultProps = {
  className: '',
  pageLoader: false,
};
