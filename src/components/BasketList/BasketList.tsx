import { FC, useCallback, useState } from 'react';
import toast from 'react-hot-toast';

import { LineItem } from '@commercetools/platform-sdk';
import { BasketItem } from '@components/BasketItem/BasketItem';
import { Modal } from '@components/Modal/Modal';
import { PromoSection } from '@components/PromoSection/PromoSection';
import { deleteCart, updateCart } from '@store/features/auth/cartApi';
import { useAppDispatch, useAppSelector } from '@store/hooks';

import { Button } from '..';
import styles from './BasketList.module.css';

interface BasketListProps {
  lineItems: LineItem[];
}

export const BasketList: FC<BasketListProps> = ({ lineItems }) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const cart = useAppSelector((state) => state.auth.cart);
  const totalPrice = useAppSelector((state) => state.auth.cart?.totalPrice);
  const dispatch = useAppDispatch();
  const totalPriceWithoutDiscount = lineItems.reduce((acc, cur) => acc + cur.quantity * cur.price.value.centAmount, 0);
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

  const handleClearCart = async () => {
    try {
      if (cart) {
        await dispatch(deleteCart({ cartId: cart.id, version: cart.version })).unwrap();
      }
    } catch (error) {
      toast.error('Error with clear cart');
    }
  };

  const handlePromo = useCallback(
    async (code: string) => {
      if (cart) {
        await dispatch(
          updateCart({
            cartId: cart.id,
            body: {
              version: cart.version,
              actions: [{ action: 'addDiscountCode', code }],
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
          <span className={styles.total__price}>{totalPrice ? totalPrice.centAmount / 100 : 0}$</span>
          {totalPrice && totalPriceWithoutDiscount !== totalPrice.centAmount && (
            <span className={styles.total__original}>{totalPriceWithoutDiscount / 100}$</span>
          )}
        </p>

        <PromoSection className={styles.promo_wrapper} handlePromo={handlePromo} />

        <Button type='button' className={styles.buy} primary>
          Сheckout
        </Button>
        <Button className={styles.clear} type='button' danger onClick={() => setIsOpenModal(true)}>
          Clear Shopping Cart
        </Button>
      </div>

      <Modal className={styles.cart__modal} open={isOpenModal} onClose={() => setIsOpenModal(false)}>
        <h3 className={styles.modal__title}>Are you shore? All items will be deleted from the Cart.</h3>
        <div className={styles.modal__controls}>
          <Button className={styles.modal__confirm} type='button' danger onClick={handleClearCart}>
            Delete
          </Button>
          <Button className={styles.modal__close} type='button' secondary onClick={() => setIsOpenModal(false)}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
};
