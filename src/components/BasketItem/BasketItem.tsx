import { FC } from 'react';

import { Button } from '..';
import styles from './BasketItem.module.css';

interface BasketItemProps {
  title: string;
  price: number;
}

export const BasketItem: FC<BasketItemProps> = ({ title, price }) => {
  return (
    <div className={styles.basket__table__item}>
      <div className={styles.item__info}>
        <img src='/nike.png' width={90} height={90} alt='nike' />
        <div className={styles.item__info__text}>
          <p className={styles.item__info__title}>{title}</p>
          <div className={styles.attributes}>
            <div className={styles.attributes__color}>
              <span>Цвет:</span>
              <div className={styles.circle} />
            </div>
            <span>Размер: 42</span>
          </div>
        </div>
      </div>
      <div className={styles.item__info__inner__wrapper}>
        <span className={styles.price}>{price}$</span>
        <div className={styles.quantity}>
          <Button type='button' className={styles.button__control} secondary>
            -
          </Button>
          <span className={styles.monitor}>1</span>
          <Button type='button' className={styles.button__control} secondary>
            +
          </Button>
        </div>
        <span className={styles.amount}>800$</span>
        <button className={styles.remove}>
          <svg width='18' height='20' viewBox='0 0 18 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M1 5H17M2 5L3 17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19H13C13.5304 19 14.0391 18.7893 14.4142 18.4142C14.7893 18.0391 15 17.5304 15 17L16 5M6 5V2C6 1.73478 6.10536 1.48043 6.29289 1.29289C6.48043 1.10536 6.73478 1 7 1H11C11.2652 1 11.5196 1.10536 11.7071 1.29289C11.8946 1.48043 12 1.73478 12 2V5M7 10L11 14M11 10L7 14'
              strokeWidth='1.7'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
