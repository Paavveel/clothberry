import { FC } from 'react';

import { BasketList } from '@components/BasketList/BasketList';
import { EmptyCart } from '@components/EmptyCart/EmptyCart';
import { useAppSelector } from '@store/hooks';

import styles from './Basket.module.css';

export const Basket: FC = () => {
  const lineItems = useAppSelector((state) => state.auth.cart?.lineItems);

  return (
    <section className={styles.basket}>
      <h1>Shopping Cart</h1>
      {!lineItems?.length ? <EmptyCart /> : <BasketList lineItems={lineItems} />}
    </section>
  );
};
