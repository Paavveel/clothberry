import { FC } from 'react';

import { BasketList } from '@components/BasketList/BasketList';

import styles from './Basket.module.css';

interface BasketProps {}

export const Basket: FC<BasketProps> = () => {
  return (
    <section className={styles.basket}>
      <h1>Shopping Cart</h1>
      <BasketList />
    </section>
  );
};
