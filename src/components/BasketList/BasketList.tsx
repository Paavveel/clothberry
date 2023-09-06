import { FC } from 'react';

import { BasketItem } from '@components/BasketItem/BasketItem';

import { Button } from '..';
import styles from './BasketList.module.css';

export const BasketList: FC = () => {
  return (
    <div className={styles.basket__wrapper}>
      <div className={styles.basket__table}>
        <div className={styles.basket__table__header}>
          <span className={styles.product__header}>Product</span>
          <span className={styles.price__header}>Price</span>
          <span className={styles.quantity__header}>Quantity</span>
          <span className={styles.amount__header}>Amount Payable</span>
        </div>
        <BasketItem title='Nike Air VaporMax 2023 Flyknit' price={801} />
        <BasketItem title='Nike Air VaporMax 2023 Flyknit' price={801} />
        <BasketItem title='Nike Air VaporMax 2023 Flyknit' price={801} />
        <BasketItem title='Nike Air VaporMax 2023 Flyknit' price={801} />
      </div>
      <div className={styles.basket__order}>
        <h2>Итого</h2>
        <p className={styles.basket__order__price}>
          Сумма
          <div className={styles.basket__order__dotted} />
          36829р
        </p>
        <Button type='button' className={styles.buy} primary>
          Оформить заказ
        </Button>
      </div>
    </div>
  );
};
