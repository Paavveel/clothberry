import { FC, useCallback } from 'react';

import { LineItem } from '@commercetools/platform-sdk';
import { BasketItem } from '@components/BasketItem/BasketItem';
import { updateCart } from '@store/features/auth/cartApi';
import { useAppDispatch, useAppSelector } from '@store/hooks';

import { Button } from '..';
import styles from './BasketList.module.css';

interface BasketListProps {
  lineItems: LineItem[];
}

export const BasketList: FC<BasketListProps> = ({ lineItems }) => {
  const cart = useAppSelector((state) => state.auth.cart);
  const dispatch = useAppDispatch();

  const handleUpdateItem = useCallback(
    async (lineItemId: string, quantity: number) => {
      if (cart) {
        await dispatch(
          updateCart({
            cartId: cart.id,
            body: {
              version: cart.version,
              actions: [{ action: 'changeLineItemQuantity', lineItemId, quantity }],
            },
          })
        ).unwrap();
      }
    },
    [cart, dispatch]
  );
  const handleDeleteItem = useCallback(
    async (lineItemId: string) => {
      if (cart) {
        await dispatch(
          updateCart({
            cartId: cart.id,
            body: {
              version: cart.version,
              actions: [{ action: 'removeLineItem', lineItemId }],
            },
          })
        ).unwrap();
      }
    },
    [cart, dispatch]
  );
  return (
    <div className={styles.basket__wrapper}>
      <div className={styles.basket__table}>
        <div className={styles.basket__table__header}>
          <span className={styles.product__header}>Product</span>
          <span className={styles.price__header}>Price</span>
          <span className={styles.quantity__header}>Quantity</span>
          <span className={styles.amount__header}>Amount Payable</span>
        </div>
        {lineItems.map((item) => (
          <BasketItem
            key={item.id}
            item={item}
            handleUpdateItem={handleUpdateItem}
            handleDeleteItem={handleDeleteItem}
          />
        ))}
      </div>
      <div className={styles.basket__order}>
        <h2>Total Price</h2>
        <p className={styles.basket__order__price}>
          Amount
          <span className={styles.basket__order__dotted} />
          {cart ? cart.totalPrice.centAmount / 100 : 0}$
        </p>
        <div className={styles.promo_wrapper}>
          <input
            type='text'
            className={styles.basket__order__promocode__input}
            placeholder='Promocode'
            maxLength={15}
          />
          <Button type='button' className={styles.apply__promocode__button} secondary>
            Apply code
          </Button>
        </div>

        <Button type='button' className={styles.buy} primary>
          Сheckout
        </Button>
      </div>
    </div>
  );
};
