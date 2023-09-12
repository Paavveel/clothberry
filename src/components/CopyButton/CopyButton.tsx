import { FC, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import cn from 'classnames';

import { ReactComponent as CopySuccess } from '@assets/img/copy-success.svg';
import { ReactComponent as Copy } from '@assets/img/copy.svg';

import styles from './CopyButton.module.css';

interface CopyButtonProps {
  value: string;
}

export const CopyButton: FC<CopyButtonProps> = ({ value }) => {
  const [isCopied, setIsCopied] = useState(false);
  return (
    <CopyToClipboard
      text={value}
      onCopy={() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      }}
    >
      <button type='button' className={cn(styles.promo__button, { [styles.promo__button__success]: isCopied })}>
        {!isCopied ? <Copy className={styles.copy__icon} /> : <CopySuccess className={styles.copy__icon__success} />}
      </button>
    </CopyToClipboard>
  );
};
