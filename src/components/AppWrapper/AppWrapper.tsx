import { FC, ReactNode } from 'react';

import cn from 'classnames';

import styles from './AppWrapper.module.css';

interface AppWrapperProps {
  children: ReactNode;
  className?: string;
}

export const AppWrapper: FC<AppWrapperProps> = ({ children, className }) => {
  return <div className={cn(className, styles.wrapper, className)}>{children}</div>;
};

AppWrapper.defaultProps = {
  className: '',
};
