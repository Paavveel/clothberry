import { FC } from 'react';

import styles from './Checkbox.module.css';

interface CheckboxProps {
  title: string;
  htmlFor: string;
  onChange: (event: React.FormEvent) => void;
  value: boolean;
}

export const Checkbox: FC<CheckboxProps> = ({ title, htmlFor, onChange, value, ...props }) => {
  return (
    <label className={styles['mcui-checkbox']} htmlFor={htmlFor} {...props}>
      <input type='checkbox' id={htmlFor} onChange={onChange} checked={value} />
      <div>
        <svg className={styles['mcui-check']} viewBox='-2 -2 35 35' aria-hidden='true'>
          <title>checkmark-circle</title>
          <polyline points='7.57 15.87 12.62 21.07 23.43 9.93' />
        </svg>
      </div>
      <p className={styles.title}>{title}</p>
    </label>
  );
};
