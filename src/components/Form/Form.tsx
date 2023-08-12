import { FC, PropsWithChildren } from 'react';

import styles from './Form.module.css';

type DefaultProps = {
  title?: string;
  onSubmit?: (event: React.FormEvent) => void;
};

export const Form: FC<PropsWithChildren<DefaultProps>> = ({ children, onSubmit, title = '' }) => {
  return (
    <div className={styles['form-wrapper']}>
      {!!title.length && <h2 className={styles.title}>{title}</h2>}
      <form className={styles.form} onSubmit={onSubmit}>
        {children}
      </form>
    </div>
  );
};

Form.defaultProps = {
  title: '',
  onSubmit: undefined,
};
